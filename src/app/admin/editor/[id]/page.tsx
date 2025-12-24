"use client";

import { useEffect, useState, use } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import PostEditor from '../PostEditor';
import { Post } from '@/types/blog';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

// Using the same pattern for params as in the blog post page
export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const supabase = createClient();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
        if (id) fetchPost(id);
    }, [id]);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push('/admin');
        }
    };

    const fetchPost = async (postId: string) => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single();

        if (error) {
            alert('Error loading post');
            router.push('/admin/dashboard');
        } else {
            setPost(data);
        }
        setLoading(false);
    };

    // if (loading) return <div className="p-10 text-center">Cargando editor...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <LoadingOverlay isOpen={loading} text="Cargando editor..." />
            {post && <PostEditor post={post} />}
        </div>
    );
}
