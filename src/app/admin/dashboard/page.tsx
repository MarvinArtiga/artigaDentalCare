"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Post } from '@/types/blog';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Plus, Edit, Trash2, LogOut, FileText, CheckCircle, Clock, Search } from 'lucide-react';

export default function AdminDashboard() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        checkUser();
        fetchPosts();
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push('/admin');
        }
    };

    const fetchPosts = async () => {
        const { data } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setPosts(data);
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este artículo?')) return;

        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (!error) {
            setPosts(posts.filter(p => p.id !== id));
        } else {
            alert('Error al eliminar');
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin');
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Cargando panel...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-800 pb-20">
            {/* Hero Section */}
            <div className="bg-[#1e293b] text-white pt-10 pb-24 px-6 md:px-12 rounded-b-[3rem] shadow-xl">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Panel de Control</h1>
                            <p className="text-blue-200 text-lg">Administra los artículos de tu blog</p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl backdrop-blur-sm transition-all flex items-center gap-2 font-medium">
                                <LogOut size={18} /> Cerrar Sesión
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex items-center gap-5">
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <FileText size={32} className="text-blue-300" />
                            </div>
                            <div>
                                <p className="text-blue-200 text-sm font-medium uppercase tracking-wider">Total Artículos</p>
                                <p className="text-4xl font-extrabold text-white">{posts.length}</p>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex items-center gap-5">
                            <div className="p-3 bg-emerald-500/20 rounded-xl">
                                <CheckCircle size={32} className="text-emerald-300" />
                            </div>
                            <div>
                                <p className="text-emerald-200 text-sm font-medium uppercase tracking-wider">Publicados</p>
                                <p className="text-4xl font-extrabold text-white">{posts.filter(p => p.is_published).length}</p>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex items-center gap-5">
                            <div className="p-3 bg-amber-500/20 rounded-xl">
                                <Clock size={32} className="text-amber-300" />
                            </div>
                            <div>
                                <p className="text-amber-200 text-sm font-medium uppercase tracking-wider">Borradores</p>
                                <p className="text-4xl font-extrabold text-white">{posts.filter(p => !p.is_published).length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section - Overlapping Hero */}
            <div className="max-w-7xl mx-auto px-6 -mt-12">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">

                    {/* Toolbar */}
                    <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar artículo..."
                                className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all"
                            />
                        </div>
                        <Link href="/admin/editor">
                            <Button variant="primary" className="flex items-center gap-2 px-8 py-3 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all bg-blue-600 hover:bg-blue-700 text-white font-bold h-full">
                                <Plus size={20} /> Crear Nuevo Post
                            </Button>
                        </Link>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/80 text-slate-500">
                                <tr>
                                    <th className="p-6 pl-8 font-bold uppercase text-xs tracking-wider">Artículo</th>
                                    <th className="p-6 font-bold uppercase text-xs tracking-wider">Estado</th>
                                    <th className="p-6 font-bold uppercase text-xs tracking-wider">Fecha</th>
                                    <th className="p-6 pr-8 font-bold uppercase text-xs tracking-wider text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-blue-50/40 transition-colors group">
                                        <td className="p-5 pl-8">
                                            <p className="font-bold text-slate-800 text-lg">{post.title}</p>
                                            <p className="text-xs text-slate-400 mt-1 font-mono bg-slate-100 inline-block px-1.5 py-0.5 rounded">/{post.slug}</p>
                                        </td>
                                        <td className="p-5">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${post.is_published
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : 'bg-amber-50 text-amber-700 border-amber-100'
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full ${post.is_published ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                {post.is_published ? 'Publicado' : 'Borrador'}
                                            </span>
                                        </td>
                                        <td className="p-5 text-slate-500 text-sm">
                                            {new Date(post.created_at).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="p-5 pr-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/editor/${post.id}`}>
                                                    <button className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg transition-all" title="Editar">
                                                        <Edit size={18} />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-all"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {posts.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-24 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                    <FileText size={40} className="text-slate-300" />
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-700 mb-2">No tienes artículos publicados</h3>
                                                <p className="text-slate-400 mb-6">Comienza a escribir y comparte tus ideas.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
