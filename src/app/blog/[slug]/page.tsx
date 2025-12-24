"use client";

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Post } from '@/types/blog';
import Link from 'next/link';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

// Helper to unwrap params
// In Next.js 15+ params is a Promise, but in 14 it's an object. 
// Assuming Next.js 14 based on common usage, but if 15 we need to await params.
// Let's use `use` from react to unwrap it if it's a promise, or just treat as props.
// To be safe and standard for client components, we can get params from props.
// Updated for Next 15+ handling if needed:
// type Props = { params: Promise<{ slug: string }> }; 
// Since older versions pass params directly, and newer pass promise.
// Let's simplify: client component doesn't receive params as prop in the same way in all versions?
// Actually in App Router, page components receive params.

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    // Unwrap params using React.use() if available or await it.
    // However, to avoid complexity with versions, let's assume params is a Promise (Next 15) per latest trends or just create a wrapper.
    // Let's us `use` hook.

    // WORKAROUND for Next.js version ambiguity:
    // We will just use `use(params)` assuming React 19/Next 15 or similar.
    // The user's package.json showed "next": "16.1.0" and "react": "19.2.3".
    // So `params` IS a Promise.

    const { slug } = use(params);

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) fetchPost(slug);
    }, [slug]);

    const fetchPost = async (slug: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error('Error fetching post:', error);
        } else {
            setPost(data);
        }
        setLoading(false);
    };

    if (loading) {
        return <LoadingOverlay isOpen={true} text="Cargando historia..." />;
    }

    if (!post) {
        return (
            <div className="container min-h-screen py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Artículo no encontrado</h1>
                <Link href="/blog" className="text-blue hover:underline">Volver al Blog</Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-24 pb-12 bg-white">
            <article className="container mx-auto px-4 max-w-4xl">
                <Link href="/blog" className="inline-flex items-center text-gray-500 hover:text-blue mb-8 transition-colors">
                    ← Volver al Blog
                </Link>

                {post.image_url && (
                    <div className="rounded-3xl overflow-hidden mb-10 shadow-lg aspect-video">
                        <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {post.title}
                </h1>

                <div className="flex items-center text-gray-500 mb-10 border-b pb-8">
                    <span className="mr-4">
                        📅 {new Date(post.created_at).toLocaleDateString('es-ES', { dateStyle: 'long' })}
                    </span>
                    {/* Add Author or Category here if needed */}
                </div>

                <div className="prose prose-lg max-w-none prose-headings:text-blue prose-a:text-gold">
                    {/* Ideally use a markdown renderer here. For now, simple text or HTML if stored as HTML */}
                    {/* Assuming content might be plain text or simple HTML for MVP */}
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
            </article>
        </main>
    );
}
