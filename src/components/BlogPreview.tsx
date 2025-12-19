"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import styles from './BlogPreview.module.css';
import Link from 'next/link';

const posts = [
    {
        title: "¿Por qué sangran mis encías?",
        date: "12 Oct, 2024",
        excerpt: "Descubre las causas comunes y cómo prevenirlas para mantener una salud bucal óptima.",
        image: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)"
    },
    {
        title: "Mitos sobre el blanqueamiento",
        date: "05 Nov, 2024",
        excerpt: "Desmentimos las creencias populares sobre el blanqueamiento dental y su seguridad.",
        image: "linear-gradient(to right, #43e97b 0%, #38f9d7 100%)"
    },
    {
        title: "Ortodoncia Invisible vs. Brackets",
        date: "20 Nov, 2024",
        excerpt: "Una comparativa detallada para ayudarte a elegir la mejor opción para tu sonrisa.",
        image: "linear-gradient(120deg, #f6d365 0%, #fda085 100%)"
    }
];

export const BlogPreview = () => {
    return (
        <section id="blog" className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.heading}>Últimas Novedades</h2>
                    <Link href="#" className={styles.viewAll}>
                        Ver todo el blog <ArrowRight size={18} />
                    </Link>
                </div>

                <div className={styles.grid}>
                    {posts.map((post, index) => (
                        <motion.div
                            key={index}
                            className={styles.card}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className={styles.cardImage} style={{ background: post.image }}></div>
                            <div className={styles.cardContent}>
                                <div className={styles.meta}>
                                    <Calendar size={14} /> {post.date}
                                </div>
                                <h3 className={styles.cardTitle}>{post.title}</h3>
                                <p className={styles.cardExcerpt}>{post.excerpt}</p>
                                <div className={styles.readMore}>Leer más</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
