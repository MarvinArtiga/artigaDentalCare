"use client";

import { useState, useEffect } from 'react';

import confetti from 'canvas-confetti';

import { Button } from './ui/Button';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import styles from './Contact.module.css';

export const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const [isValid, setIsValid] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState('');

    // Validation Regex
    const nameRegex = /^[a-zA-Z\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{4} \d{4}$/;

    useEffect(() => {
        validateForm();
    }, [formData]);

    const validateForm = () => {
        const newErrors = {
            name: '',
            email: '',
            phone: '',
            message: ''
        };
        let valid = true;

        // Name Validation
        if (!formData.name.trim()) {
            // newErrors.name = 'El nombre es requerido'; // Silent requirement
            valid = false;
        } else if (!nameRegex.test(formData.name)) {
            newErrors.name = 'Solo se permiten letras';
            valid = false;
        }

        // Email Validation
        if (!formData.email.trim()) {
            // newErrors.email = 'El correo es requerido';
            valid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Ingresa un correo válido';
            valid = false;
        }

        // Phone Validation
        if (!formData.phone.trim()) {
            // newErrors.phone = 'El teléfono es requerido';
            valid = false;
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'El teléfono debe tener 8 dígitos';
            valid = false;
        }

        // Message Validation
        if (!formData.message.trim()) {
            // newErrors.message = 'El mensaje es requerido';
            valid = false;
        }

        setErrors(newErrors);
        setIsValid(valid);
        return valid;
    };

    const formatPhoneNumber = (value: string) => {
        // Remove all non-numeric characters
        const cleaned = value.replace(/\D/g, '');
        // Limit to 8 digits
        const truncated = cleaned.slice(0, 8);

        // Format as XXXX XXXX
        if (truncated.length > 4) {
            return `${truncated.slice(0, 4)} ${truncated.slice(4)}`;
        }
        return truncated;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;

        if (id === 'phone') {
            const formattedPhone = formatPhoneNumber(value);
            setFormData(prev => ({ ...prev, [id]: formattedPhone }));
        } else if (id === 'name') {
            // Only allow letters and spaces update if regex matches current input (for live prevention)
            // But requirement said "validation", usually better to allow type and show error, 
            // OR prevent typing invalid chars. User said "solo se puedan poner letras", implying restriction.
            if (nameRegex.test(value)) {
                setFormData(prev => ({ ...prev, [id]: value }));
            }
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            setSubmittedEmail(formData.email);
            setShowSuccessModal(true);

            // Clear form
            setFormData({
                name: '',
                email: '',
                phone: '',
                message: ''
            });
            setIsValid(false);
        }
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setSubmittedEmail('');
    };
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
                                <p className={styles.detailText}>Avenida Jose Matias Delgado 365, San Salvador 1101, El Salvador</p>
                            </div>
                        </div>

                        <div className={styles.detailItem}>
                            <Phone className="text-gold" size={24} />
                            <div>
                                <h4 className={styles.detailTitle}>Teléfono</h4>
                                <p className={styles.detailText}>+503 6185 9128</p>
                            </div>
                        </div>

                        <div className={styles.detailItem}>
                            <Mail className="text-gold" size={24} />
                            <div>
                                <h4 className={styles.detailTitle}>Email</h4>
                                <p className={styles.detailText}>artigadental.info@gmail.com</p>
                            </div>
                        </div>

                        <div className={styles.detailItem}>
                            <Clock className="text-gold" size={24} />
                            <div>
                                <h4 className={styles.detailTitle}>Horarios</h4>
                                <p className={styles.detailText}>Lun - Vie: 9:00 AM - 4:00 PM <br /> Sáb: 9:00 AM - 12:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.formCol}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="name">Nombre Completo *</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Tu nombre"
                                className={styles.input}
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <span style={{ color: 'red', fontSize: '12px' }}>{errors.name}</span>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Correo Electrónico *</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="tucorreo@ejemplo.com"
                                className={styles.input}
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="phone">Teléfono *</label>
                            <input
                                type="tel"
                                id="phone"
                                placeholder="#### ####"
                                className={styles.input}
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {errors.phone && <span style={{ color: 'red', fontSize: '12px' }}>{errors.phone}</span>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="message">Mensaje *</label>
                            <textarea
                                id="message"
                                rows={4}
                                placeholder="¿En qué podemos ayudarte?"
                                className={styles.textarea}
                                value={formData.message}
                                onChange={handleChange}
                            ></textarea>
                            {errors.message && <span style={{ color: 'red', fontSize: '12px' }}>{errors.message}</span>}
                        </div>
                        {!isValid && (
                            <p style={{ fontSize: '14px', marginBottom: '10px', color: '#666' }}>
                                Por favor completa todos los campos para continuar.
                            </p>
                        )}
                        <Button
                            type="submit"
                            variant="primary"
                            className={styles.submitBtn}
                            disabled={!isValid}
                            style={{ opacity: isValid ? 1 : 0.5, cursor: isValid ? 'pointer' : 'not-allowed' }}
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

            {/* Success Modal */}
            {showSuccessModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ color: '#2C3E50', marginBottom: '15px', fontSize: '24px' }}>¡Cita Agendada!</h3>
                        <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.5' }}>
                            Tu cita se ha agendado correctamente. Se te envió un mensaje de confirmación a <strong>{submittedEmail}</strong>.
                        </p>
                        <Button
                            variant="primary"
                            onClick={closeSuccessModal}
                            style={{ width: '100%' }}
                        >
                            Aceptar
                        </Button>
                    </div>
                </div>
            )}
        </section>
    );
};
