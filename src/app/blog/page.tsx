"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Post } from '@/types/blog';
import { Button } from '@/components/ui/Button';


import styles from './blog.module.css';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

export default function BlogPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 12;

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching posts:', error);
        } else {
            setPosts(data || []);
        }
        setLoading(false);
    };

    if (loading) {
        return <LoadingOverlay isOpen={true} text="Cargando artículos..." />;
    }

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100%' }}>
            {/* Hero Section */}
            <div className={styles.hero}>
                <div className={styles.heroBackend}>
                    <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '300px', height: '300px', background: '#dbeafe', borderRadius: '50%', filter: 'blur(80px)' }}></div>
                    <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '300px', height: '300px', background: '#ccfbf1', borderRadius: '50%', filter: 'blur(80px)' }}></div>
                </div>

                <div className={styles.heroContainer}>
                    <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: '#eff6ff', color: '#2563eb', fontSize: '0.875rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '1rem' }}>
                        Nuestro Blog
                    </span>
                    <h1 className={styles.heroTitle}>
                        Consejos para tu <span className={styles.highlight}>Sonrisa Perfecta</span>
                    </h1>
                    <p className={styles.heroText}>
                        Explora nuestros artículos sobre salud dental, tratamientos modernos y tips para mantener tu higiene bucal al día.
                    </p>
                </div>
            </div>

            <div className={styles.container}>
                {posts.length === 0 ? (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>✍️</span>
                        <h3 className={styles.emptyTitle}>No hay artículos publicados</h3>
                        <p className={styles.emptyText}>
                            Actualmente estamos trabajando en nuevo contenido para ti. Vuelve pronto para leer nuestros consejos.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <Link href="/" className={styles.homeBtn}>
                                Volver al Inicio
                            </Link>

                        </div>
                    </div>
                ) : (
                    <>
                        <div className={styles.grid}>
                            {posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage).map((post) => (
                                <Link href={`/blog/${post.slug}`} key={post.id} className={styles.card}>
                                    {/* Image Section */}
                                    <div className={styles.imageWrapper}>
                                        {post.image_url ? (
                                            <img
                                                src={post.image_url}
                                                alt={post.title}
                                                className={styles.image}
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0f2fe, #ccfbf1)' }}>
                                                <span style={{ fontSize: '3rem', opacity: '0.5' }}>🦷</span>
                                            </div>
                                        )}
                                        <div className={styles.tag}>
                                            Dental
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className={styles.content}>
                                        <h2 className={styles.title}>
                                            {post.title}
                                        </h2>
                                        {post.excerpt && (
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        <div className={styles.footer}>
                                            <div className={styles.date}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                                {new Date(post.created_at).toLocaleDateString('es-ES', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                                            </div>

                                            <div className={styles.arrowBtn}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {posts.length > postsPerPage && (
                            <div className={styles.pagination}>
                                {Array.from({ length: Math.ceil(posts.length / postsPerPage) }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setCurrentPage(i + 1);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.activePage : ''}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
