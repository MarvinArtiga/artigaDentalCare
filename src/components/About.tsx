"use client";

import { motion } from 'framer-motion';
import styles from './About.module.css';

export const About = () => {
    return (
        <section id="about" className={styles.section}>
            <div className={`container ${styles.container}`}>
                <motion.div
                    className={styles.imageCol}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Placeholder for Doctor's Image - replace with real image later */}
                    <div className={styles.imagePlaceholder}>
                        <div className={styles.imageOverlay}>
                            <span className={styles.imageLabel}>Dra. Cindy Artiga</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className={styles.textCol}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className={styles.heading}>Conoce a la experta</h2>
                    <h3 className={styles.subheading}>Dra. Cindy Artiga</h3>
                    <p className={styles.text}>
                        Con más de 10 años de experiencia transformando sonrisas, la Dra. Cindy Artiga se destaca por su enfoque amable y profesional. Graduada con honores y especialista en estética dental, su misión es combinar la ciencia médica con el arte para ofrecer resultados naturales y duraderos.
                    </p>
                    <p className={styles.text}>
                        En Artiga Dental Care, creemos que cada paciente merece una atención personalizada. Utilizamos tecnología de punta para asegurar diagnósticos precisos y tratamientos indoloros.
                    </p>

                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>10+</span>
                            <span className={styles.statLabel}>Años Exp.</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>1k+</span>
                            <span className={styles.statLabel}>Pacientes</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
