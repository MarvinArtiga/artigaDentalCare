"use client";

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
                                <p className={styles.detailText}>Av. Principal 123, Colonia Médica, San Salvador</p>
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
                        <Button type="submit" variant="primary" className={styles.submitBtn}>Enviar Mensaje</Button>
                    </form>
                </div>
            </div>

            {/* Map Placeholder */}
            <div className={styles.mapWrapper}>
                <div className={styles.mapPlaceholder}>
                    <p>Google Maps Integration Placeholder</p>
                    {/* In a real scenario, use an iframe here */}
                    {/* <iframe src="..." width="100%" height="400" ... ></iframe> */}
                </div>
            </div>
        </section>
    );
};
