"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
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
                    <div className={styles.imagePlaceholder}>
                        <Image
                            src="/about-cindy.png"
                            alt="Dra. Cindy Artiga"
                            fill
                            style={{ objectFit: 'cover' }}
                            quality={100}
                        />
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
                        La <strong>Dra. Cindy Artiga</strong> se distingue por su enfoque profesional, cercano y humano,
                        enfocado en transformar sonrisas de manera natural y armoniosa. Cuenta con <strong>diplomado en endodoncia</strong> y
                        una sólida formación a través de <strong>cursos en estética dental y restaurativa moderna</strong>,
                        lo que le permite ofrecer tratamientos funcionales y estéticos de alta calidad.
                    </p>
                    <p className={styles.text}>
                        Su filosofía se basa en combinar la ciencia odontológica con el arte del detalle,
                        priorizando resultados duraderos, naturales y personalizados. Además, se mantiene en <strong>constante actualización profesional</strong>,
                        incorporando nuevas técnicas y herramientas innovadoras para brindar a sus pacientes los
                        mejores resultados en cada tratamiento.
                    </p>
                    <p className={styles.text}>
                        En <strong>Artiga Dental Care</strong>, creemos que cada paciente merece una atención individualizada.
                        Por eso utilizamos <strong>herramientas y equipos modernos</strong> para garantizar diagnósticos
                        precisos y tratamientos seguros, cómodos e indoloros, siempre enfocados en el bienestar y
                        la confianza de cada sonrisa.
                    </p>

                    {/* <div className={styles.stats}>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>10+</span>
                            <span className={styles.statLabel}>Años Exp.</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>1k+</span>
                            <span className={styles.statLabel}>Pacientes</span>
                        </div>
                    </div> */}
                </motion.div>
            </div>
        </section>
    );
};
