const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('--- Iniciando prueba de credenciales ---');

    // 1. Manually parse .env.local to avoid dependency on dotenv
    let envConfig = {};
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            envContent.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^['"](.*)['"]$/, '$1'); // Remove quotes if present
                    envConfig[key] = value;
                }
            });
        } else {
            console.error('❌ No se encontró el archivo .env.local');
            return;
        }
    } catch (e) {
        console.error('❌ Error leyendo .env.local:', e.message);
        return;
    }

    const { EMAIL_USER, EMAIL_PASS } = envConfig;

    if (!EMAIL_USER || !EMAIL_PASS) {
        console.error('❌ Faltan credenciales en .env.local');
        console.log('EMAIL_USER:', EMAIL_USER ? 'Definido' : 'Falta');
        console.log('EMAIL_PASS:', EMAIL_PASS ? 'Definido' : 'Falta');
        return;
    }

    console.log(`📧 Probando usuario: ${EMAIL_USER}`);
    console.log(`🔑 Contraseña (longitud): ${EMAIL_PASS.length} caracteres`);

    // 2. Setup Transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });

    // 3. Verify Connection
    try {
        console.log('🔄 Intentando verificar conexión con Gmail...');
        await transporter.verify();
        console.log('✅ ¡ÉXITO! Las credenciales funcionan correctamente.');
        console.log('   El sistema de correos está listo para usar.');
    } catch (error) {
        console.error('❌ FALLÓ la autenticación:');
        console.error(error.message);
        console.log('\n--- Diagnóstico ---');
        if (error.responseCode === 535) {
            console.log('1. La contraseña o el correo son incorrectos.');
            console.log('2. Asegúrate de estar usando la Contraseña de Aplicación de 16 caracteres.');
            console.log('3. Asegúrate de que la Contraseña de Aplicación fue generada para el usuario: ' + EMAIL_USER);
            console.log('4. Intenta generar una nueva contraseña de aplicación.');
        } else {
            console.log('Error de red o configuración desconocido.');
        }
    }
}

testEmail();
