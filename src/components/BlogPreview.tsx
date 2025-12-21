"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import styles from './BlogPreview.module.css';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Post } from '@/types/blog';

export const BlogPreview = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        fetchLatestPosts();
    }, []);

    const fetchLatestPosts = async () => {
        const { data } = await supabase
            .from('posts')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(3);

        if (data) setPosts(data);
    };
    return (
        <section id="blog" className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.heading}>Últimas Novedades</h2>
                    <Link href="/blog" className={styles.viewAll}>
                        Ver todo el blog <ArrowRight size={18} />
                    </Link>
                </div>

                <div className={styles.grid}>
                    {posts.length > 0 ? (
                        posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                className={styles.card}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className={styles.cardImage} style={{
                                    backgroundImage: post.image_url ? `url(${post.image_url})` : 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}></div>
                                <div className={styles.cardContent}>
                                    <div className={styles.meta}>
                                        <Calendar size={14} /> {new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                    <h3 className={styles.cardTitle}>{post.title}</h3>
                                    <p className={styles.cardExcerpt}>{post.excerpt}</p>
                                    <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                                        Leer más
                                    </Link>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p className="col-span-3 text-center text-gray-400">Pronto publicaremos novedades...</p>
                    )}
                </div>
            </div>
        </section>
    );
};
