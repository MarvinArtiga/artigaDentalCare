"use client";

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import PostEditor from './PostEditor';

export default function CreatePostPage() {
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push('/admin');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <PostEditor />
        </div>
    );
}
