"use client";

import { motion } from 'framer-motion';
import { Sparkles, Smile, ShieldCheck, Gem } from 'lucide-react';
import styles from './Services.module.css';

const services = [
    {
        icon: <Sparkles size={40} className="text-blue" />,
        title: "Limpieza Dental",
        description: "Profilaxis profunda para mantener tus dientes y encías libres de sarro y bacterias."
    },
    {
        icon: <Smile size={40} className="text-gold" />,
        title: "Ortodoncia",
        description: "Alineación dental estética y funcional con brackets tradicionales o invisibles."
    },
    {
        icon: <Gem size={40} className="text-blue" />,
        title: "Estética Dental",
        description: "Carillas, diseño de sonrisa y reconstrucción para la sonrisa perfecta."
    },
    {
        icon: <ShieldCheck size={40} className="text-gold" />,
        title: "Blanqueamiento",
        description: "Tratamiento seguro para aclarar el tono de tus dientes y devolverles su brillo."
    }
];

export const Services = () => {
    return (
        <section id="services" className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.heading}>Nuestros Servicios</h2>
                    <div className={styles.underline}></div>
                    <p className={styles.subheading}>Soluciones integrales para tu salud bucal.</p>
                </div>

                <div className={styles.grid}>
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ delay: index * 0.1 }}
                            className={styles.card}
                        >
                            <div className={styles.iconWrapper}>{service.icon}</div>
                            <h3 className={styles.cardTitle}>{service.title}</h3>
                            <p className={styles.cardDesc}>{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
