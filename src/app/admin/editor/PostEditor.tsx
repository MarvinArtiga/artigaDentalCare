"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Post } from '@/types/blog';
import { ArrowLeft, Save, Upload, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

interface PostEditorProps {
    post?: Post;
}

export default function PostEditor({ post }: PostEditorProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: post?.title || '',
        slug: post?.slug || '',
        excerpt: post?.excerpt || '',
        content: post?.content || '',
        image_url: post?.image_url || '',
        is_published: post?.is_published || false
    });

    // Auto-generate slug from title if creating new
    useEffect(() => {
        if (!post && formData.title) {
            const slug = formData.title
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.title, post]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
        } catch (error) {
            alert('Error uploading image');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const postData = {
            ...formData,
        };

        if (post) {
            // Update
            const { error } = await supabase
                .from('posts')
                .update(postData)
                .eq('id', post.id);

            if (error) alert('Error updating post');
            else router.push('/admin/dashboard');
        } else {
            // Create
            const { error } = await supabase
                .from('posts')
                .insert([postData]);

            if (error) alert('Error creating post: ' + error.message);
            else router.push('/admin/dashboard');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center">
                <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
                    <ArrowLeft size={20} /> Cancelar
                </Link>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.is_published}
                            onChange={e => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                            className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Publicar inmediatamente</span>
                    </label>
                    <Button type="submit" disabled={loading} variant="primary" className="flex items-center gap-2">
                        <Save size={18} /> {loading ? 'Guardando...' : 'Guardar Artículo'}
                    </Button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent text-lg font-semibold"
                        placeholder="Título del artículo"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                        <input
                            type="text"
                            required
                            value={formData.slug}
                            onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                            className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-600 font-mono text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Imagen Principal</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                        {formData.image_url ? (
                            <div className="relative">
                                <img src={formData.image_url} alt="Preview" className="max-h-64 mx-auto rounded shadow" />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="mx-auto w-12 h-12 text-gray-400">
                                    <ImageIcon size={48} />
                                </div>
                                <div className="text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue hover:text-blue-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue">
                                        <span>Sube un archivo</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                    </label>
                                    <p className="pl-1 inline">o arrastra y suelta</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        )}
                        {uploading && <p className="text-sm text-blue mt-2">Subiendo...</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Extracto (Resumen)</label>
                    <textarea
                        rows={3}
                        value={formData.excerpt}
                        onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                        placeholder="Breve descripción que aparecerá en la lista..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contenido (HTML simple)</label>
                    <textarea
                        rows={15}
                        value={formData.content}
                        onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent font-mono text-sm"
                        placeholder="<p>Escribe tu contenido aquí...</p>"
                    />
                    <p className="text-xs text-gray-500 mt-1">Por ahora compatible con HTML básico.</p>
                </div>
            </div>
        </form>
    );
}

// Helper icon
function Trash2({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
    )
}
