'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { User, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import styles from './AdminLoginForm.module.css';

export default function AdminLoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError(authError.message);
            } else {
                router.push('/admin/dashboard');
                router.refresh();
            }
        } catch (err) {
            setError('Ocurrió un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.card}>
                {/* Floating Badge with Logo */}
                <div className={styles.floatingBadge}>
                    <div className={styles.logoContainer}>
                        <Image
                            src="/admin-login-logo.png"
                            alt="Artiga Dental Care Logo"
                            width={120}
                            height={120}
                            className={styles.logoImage}
                            priority
                        />
                    </div>
                </div>

                <h2 className={styles.title}>Iniciar sesión para administrar blog</h2>
                <div className={styles.titleSeparator}></div>

                {error && (
                    <div className={styles.errorMessage}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* Email */}
                    <div className={styles.inputGroup}>
                        <User className={styles.inputIcon} />
                        <input
                            type="email"
                            name="email"
                            placeholder="CORREO ELECTRÓNICO"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            required
                            autoComplete="email"
                        />
                    </div>

                    {/* Password with Visibility Toggle */}
                    <div className={styles.inputGroup}>
                        <Lock className={styles.inputIcon} />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="CONTRASEÑA"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Loader2 className="animate-spin" size={20} />
                                INGRESANDO...
                            </span>
                        ) : (
                            'INGRESAR'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
