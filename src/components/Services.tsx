"use client";

import { motion } from 'framer-motion';
import { Sparkles, Smile, ShieldCheck, Gem, Hammer, Stethoscope, Sun, Zap } from 'lucide-react';
import styles from './Services.module.css';

const services = [
    {
        icon: <Sparkles size={40} className="text-blue" />,
        title: "Limpieza dental",
        description: "Eliminación profunda de sarro y placa para una salud gingival óptima."
    },
    {
        icon: <Hammer size={40} className="text-gold" />,
        title: "Restauraciones",
        description: "Reparación de dientes dañados o con caries devolviendo su función y estética."
    },
    {
        icon: <ShieldCheck size={40} className="text-blue" />,
        title: "Extracciones",
        description: "Procedimientos seguros para retirar dientes comprometidos cuando es necesario."
    },
    {
        icon: <Smile size={40} className="text-gold" />,
        title: "Prótesis dentales",
        description: "Soluciones fijas y removibles para reemplazar dientes perdidos y recuperar tu sonrisa."
    },
    {
        icon: <Sun size={40} className="text-blue" />,
        title: "Blanqueamiento",
        description: "Aclara el tono de tus dientes de manera segura para una sonrisa radiante."
    },
    {
        icon: <Zap size={40} className="text-gold" />,
        title: "Endodoncia",
        description: "Tratamiento de conductos para salvar dientes con daño en el nervio."
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
