import { supabase } from '@/lib/supabaseClient';

export const seedPosts = async () => {
    const dummyPosts = [
        {
            title: "10 Consejos para una Sonrisa Radiante",
            slug: "consejos-sonrisa-radiante",
            excerpt: "Descubre los secretos para mantener tus dientes blancos y saludables con estos simples hábitos diarios.",
            content: "Contenido del post...",
            image_url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800",
            created_at: new Date().toISOString(),
            is_published: true
        },
        {
            title: "¿Por qué sangran mis encías?",
            slug: "por-que-sangran-encias",
            excerpt: "El sangrado de encías puede ser señal de problemas más serios. Aprende las causas y cómo prevenirlo.",
            content: "Contenido del post...",
            image_url: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            is_published: true
        },
        {
            title: "La importancia del hilo dental",
            slug: "importancia-hilo-dental",
            excerpt: "El cepillado no es suficiente. Descubre por qué el hilo dental es crucial para tu salud bucal.",
            content: "Contenido del post...",
            image_url: "https://images.unsplash.com/photo-1609840114035-1c29046a8028?auto=format&fit=crop&q=80&w=800",
            created_at: new Date(Date.now() - 172800000).toISOString(),
            is_published: true
        },
        {
            title: "Mitos sobre el blanqueamiento dental",
            slug: "mitos-blanqueamiento-dental",
            excerpt: "¿El bicarbonato funciona? ¿Daña el esmalte? Desmentimos los mitos más comunes.",
            content: "Contenido del post...",
            image_url: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&q=80&w=800",
            created_at: new Date(Date.now() - 259200000).toISOString(),
            is_published: true
        },
        {
            title: "Cómo elegir el cepillo de dientes adecuado",
            slug: "elegir-cepillo-dientes",
            excerpt: "Suave, medio, duro, eléctrico... Te ayudamos a escoger la mejor opción para ti.",
            content: "Contenido del post...",
            image_url: "https://images.unsplash.com/photo-1559599189-fe84dea63c95?auto=format&fit=crop&q=80&w=800",
            created_at: new Date(Date.now() - 345600000).toISOString(),
            is_published: true
        },
        {
            title: "Alimentos que manchan tus dientes",
            slug: "alimentos-manchan-dientes",
            excerpt: "Café, vino, salsas... Conoce los alimentos que debes consumir con moderación para cuidar el color de tu sonrisa.",
            content: "Contenido del post...",
            image_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800",
            created_at: new Date(Date.now() - 432000000).toISOString(),
            is_published: true
        },
        {
            title: "Ortodoncia invisible vs Brackets tradicionales",
            slug: "ortodoncia-invisible-vs-brackets",
            excerpt: "Analizamos las ventajas y desventajas de cada tratamiento para que tomes la mejor decisión.",
            content: "Contenido del post...",
            image_url: "https://images.unsplash.com/photo-1599423300746-b62507ac9705?auto=format&fit=crop&q=80&w=800",
            created_at: new Date(Date.now() - 518400000).toISOString(),
            is_published: true
        },
        {
            title: "El miedo al dentista: Cómo superarlo",
            slug: "superar-miedo-dentista",
            excerpt: "La odontofobia es común. Te damos tips para que tu visita sea libre de estrés.",
            content: "Contenido del post...",
            image_url: null,
            created_at: new Date(Date.now() - 604800000).toISOString(),
            is_published: true
        },
        {
            title: "Beneficios de la limpieza dental profesional",
            slug: "beneficios-limpieza-dental",
            excerpt: "Más allá de la estética, la limpieza profesional previene enfermedades graves.",
            content: "Contenido del post...",
            image_url: "https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?auto=format&fit=crop&q=80&w=800",
            created_at: new Date(Date.now() - 691200000).toISOString(),
            is_published: true
        },
        {
            title: "Sensibilidad dental: Causas y soluciones",
            slug: "sensibilidad-dental-causas",
            excerpt: "¿Sientes dolor con el frío o el calor? Podrías sufrir de sensibilidad dental.",
            content: "Contenido del post...",
            image_url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800",
            created_at: new Date(Date.now() - 777600000).toISOString(),
            is_published: true
        },
        {
            title: "Cuidados después de una extracción",
            slug: "cuidados-extraccion-dental",
            excerpt: "Sigue estas recomendaciones para una recuperación rápida y sin complicaciones.",
            content: "Contenido del post...",
            image_url: null,
            created_at: new Date(Date.now() - 864000000).toISOString(),
            is_published: true
        },
        {
            title: "La relación entre salud oral y salud general",
            slug: "salud-oral-salud-general",
            excerpt: "Tu boca dice mucho de tu salud. Descubre cómo se conecta con el resto de tu cuerpo.",
            content: "Contenido del post...",
            image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
            created_at: new Date(Date.now() - 950400000).toISOString(),
            is_published: true
        },
        {
            title: "¿Cuándo llevar a los niños al dentista?",
            slug: "cuando-llevar-ninos-dentista",
            excerpt: "La primera visita es crucial. Te contamos cuál es la edad ideal para empezar.",
            content: "Contenido del post...",
            image_url: "https://images.unsplash.com/photo-1519456264917-42d0aa2e0625?auto=format&fit=crop&q=80&w=800",
            created_at: new Date(Date.now() - 1036800000).toISOString(),
            is_published: true
        },
        {
            title: "Tecnología en la odontología moderna",
            slug: "tecnologia-odontologia-moderna",
            excerpt: "Desde escáneres 3D hasta láseres, así ha evolucionado la visita al dentista.",
            content: "Contenido del post...",
            image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
            created_at: new Date(Date.now() - 1123200000).toISOString(),
            is_published: true
        }
    ];

    const { error } = await supabase
        .from('posts')
        .insert(dummyPosts);

    if (error) {
        console.error("Error seeding posts:", error);
        return false;
    }
    return true;
};
