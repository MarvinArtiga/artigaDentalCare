"use client";

import confetti from 'canvas-confetti';

import { Button } from './ui/Button';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import styles from './Contact.module.css';

export const Contact = () => {
    return (
        <section id="contact" className={styles.section}>
            <div className={`container ${styles.container}`}>
                <div className={styles.infoCol}>
                    <h2 className={styles.heading}>Agenda tu Cita</h2>
                    <p className={styles.text}>Estamos listos para atenderte y mejorar tu sonrisa.</p>

                    <div className={styles.contactDetails}>
                        <div className={styles.detailItem}>
                            <MapPin className="text-gold" size={24} />
                            <div>
                                <h4 className={styles.detailTitle}>Ubicación</h4>
                                <p className={styles.detailText}>Avenida Jose Matias Delgado 365, San Salvador</p>
                            </div>
                        </div>

                        <div className={styles.detailItem}>
                            <Phone className="text-gold" size={24} />
                            <div>
                                <h4 className={styles.detailTitle}>Teléfono</h4>
                                <p className={styles.detailText}>+503 2222-0000</p>
                            </div>
                        </div>

                        <div className={styles.detailItem}>
                            <Mail className="text-gold" size={24} />
                            <div>
                                <h4 className={styles.detailTitle}>Email</h4>
                                <p className={styles.detailText}>citas@artigadental.com</p>
                            </div>
                        </div>

                        <div className={styles.detailItem}>
                            <Clock className="text-gold" size={24} />
                            <div>
                                <h4 className={styles.detailTitle}>Horarios</h4>
                                <p className={styles.detailText}>Lun - Vie: 8:00 AM - 6:00 PM <br /> Sáb: 8:00 AM - 1:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.formCol}>
                    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="name">Nombre Completo</label>
                            <input type="text" id="name" placeholder="Tu nombre" className={styles.input} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Correo Electrónico</label>
                            <input type="email" id="email" placeholder="tucorreo@ejemplo.com" className={styles.input} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="phone">Teléfono</label>
                            <input type="tel" id="phone" placeholder="#### ####" className={styles.input} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="message">Mensaje</label>
                            <textarea id="message" rows={4} placeholder="¿En qué podemos ayudarte?" className={styles.textarea}></textarea>
                        </div>
                        <Button
                            type="submit"
                            variant="primary"
                            className={styles.submitBtn}
                            onClick={() => {
                                confetti({
                                    particleCount: 100,
                                    spread: 70,
                                    origin: { y: 0.6 }
                                });
                            }}
                        >
                            Enviar Mensaje
                        </Button>
                    </form>
                </div>
            </div>

            {/* Map Section */}
            <div id="location">
                <div className={styles.locationHeader}>
                    <h1 className={styles.locationTitle}>Estamos ubicados en San Salvador</h1>
                    <p className={styles.locationSubtitle}>Será un gusto atenderte y mejorar tu sonrisa</p>
                </div>
                <div className={styles.mapWrapper}>
                    <div className={styles.mapPlaceholder}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1938.834641619478!2d-89.2396209!3d13.7063844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f633100410643b9%3A0x71875cc4081bfe08!2sArtiga%20Dental%20Care!5e0!3m2!1sen!2svi!4v1700000000000!5m2!1sen!2svi"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};
