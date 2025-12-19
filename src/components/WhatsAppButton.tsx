"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './WhatsAppButton.module.css';

export const WhatsAppButton = () => {
    return (
        <motion.a
            href="https://wa.me/50379116693?text=Hola,%20quisiera%20agendar%20una%20cita"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.button}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: 1,
                opacity: 1,
                y: [0, -20, 0, -10, 0]
            }}
            transition={{
                delay: 1,
                type: "spring",
                y: {
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 5,
                    ease: "easeInOut"
                }
            }}
            whileHover={{ scale: 1.1 }}
        >
            <div className={styles.iconWrapper}>
                <Image
                    src="/whatsapp-icon.png"
                    alt="Chat on WhatsApp"
                    width={40}
                    height={40}
                    className={styles.icon}
                />
            </div>
        </motion.a>
    );
};
