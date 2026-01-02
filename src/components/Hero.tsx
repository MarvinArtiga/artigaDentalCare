"use client";

import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import styles from './Hero.module.css';


import { AnimatedWord } from './ui/AnimatedWord';

export const Hero = () => {
    return (
        <section className={styles.hero}>

            <div className={styles.overlay}></div>
            <div className={`container ${styles.content}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className={styles.textContent}
                >
                    <h1 className={styles.title}>
                        Sonrisas que <AnimatedWord text="Iluminan" baseColor="#89ecd9" highlightColor="#ffff" className="text-gold" highlightColorClass="" />, <br />
                        Salud que <AnimatedWord text="Perdura" baseColor="#a09dff" highlightColor="#ffff" className="text-blue" highlightColorClass="" />.
                    </h1>
                    <p className={styles.subtitle}>
                        Experiencia dental premium con la Dra. Cindy Artiga. Tecnología de vanguardia y trato humano para tu bienestar integral.
                    </p>
                    <div className={styles.actions}>
                        <Button variant="primary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                            Agendar Cita
                        </Button>
                        <Button variant="outline" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
                            Nuestros Servicios
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
