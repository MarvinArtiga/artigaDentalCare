"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Post } from '@/types/blog';
import Link from 'next/link';
import Image from 'next/image';
import {
    LayoutDashboard,
    FileText,
    BarChart,
    LogOut,
    Search,
    Plus,
    Edit3,
    Trash2,
    Menu,
    CheckCircle,
    Clock
} from 'lucide-react';
import styles from './dashboard.module.css';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

export default function AdminDashboardActual() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
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

        setDeleting(true);
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (!error) {
            setPosts(posts.filter(p => p.id !== id));
        } else {
            alert('Error al eliminar');
        }
        setDeleting(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin');
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const publishedCount = posts.filter(p => p.is_published).length;
    const draftCount = posts.filter(p => !p.is_published).length;
    const totalCount = posts.length;
    const publishedPercentage = totalCount > 0 ? Math.round((publishedCount / totalCount) * 100) : 0;

    // Loading State
    // We keep the overlay always present if loading is true to cover the initial fetch
    // And also render the main content behind it (or just return the overlay if we prefer to hide everything)
    // For smoother transition, we render the overlay on top.


    return (
        <div className={styles.container}>
            <LoadingOverlay isOpen={loading || deleting} text={deleting ? "Eliminando artículo..." : "Cargando panel..."} />
            {/* Mobile Overlay */}
            {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
                <div className={styles.profile}>
                    {/* Placeholder Avatar */}
                    <div className={styles.avatar} style={{ background: '#0984e3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        A
                    </div>
                    <div className={styles.adminInfo}>
                        <h3>ADMINISTRADOR</h3>
                        <p>Artiga Dental</p>
                    </div>
                </div>

                <nav className={styles.nav}>
                    <a href="#" className={`${styles.navLink} ${styles.active}`}>
                        <LayoutDashboard size={20} /> Dashboard
                    </a>
                    <Link href="/admin/dashboard" className={styles.navLink}>
                        <FileText size={20} /> Artículos
                    </Link>
                    <a href="#" className={styles.navLink}>
                        <BarChart size={20} /> Estadísticas
                    </a>

                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <LogOut size={20} /> Cerrar Sesión
                    </button>
                </nav>

                {/* Circular Chart Placeholder */}
                <div className={styles.chartContainer}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        border: '8px solid #2d3436',
                        background: `conic-gradient(#00b894 ${publishedPercentage}%, #636e72 0)`,
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>{publishedPercentage}%</span>
                    </div>
                    <p className={styles.chartLabel}>Artículos Publicados</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Topbar */}
                <header className={styles.topbar}>
                    <div className="flex items-center">
                        <button className={styles.menuToggle} onClick={toggleSidebar}>
                            <Menu size={24} />
                        </button>
                        <h1 className={styles.pageTitle}>Panel de Control del Blog</h1>
                    </div>

                    <div className={styles.topbarActions}>
                        <div className={styles.searchContainer}>
                            <Search className={styles.searchIcon} strokeWidth={2.5} />
                            <input type="text" placeholder="Buscar..." className={styles.searchInput} />
                        </div>
                        <Link href="/admin/editor">
                            <button className={styles.newPostBtn}>
                                <Plus size={18} strokeWidth={3} /> Nuevo Artículo
                            </button>
                        </Link>
                    </div>
                </header>

                {/* KPI Cards */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <h3 className={styles.cardTitle}>Estadísticas de Artículos</h3>

                        <div className={styles.statRow}>
                            <span className="text-gray-500 text-sm">Total Artículos</span>
                            <span className={styles.statValue}>{totalCount}</span>
                        </div>
                        <div className={styles.statRow}>
                            <span className="text-emerald-500 text-sm flex items-center gap-1"><CheckCircle size={14} /> Publicados</span>
                            <span className={styles.statBadge}>{publishedCount}</span>
                        </div>
                        <div className={styles.statRow}>
                            <span className="text-amber-500 text-sm flex items-center gap-1"><Clock size={14} /> Borradores</span>
                            <span className={styles.statBadge}>{draftCount}</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <h3 className={styles.cardTitle}>Actividad Reciente</h3>
                        {/* Placeholder generic activity data for now */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Plus size={16} /></div>
                                <div>
                                    <p className="text-sm font-bold text-gray-700">Nuevo artículo creado</p>
                                    <p className="text-xs text-gray-400">Hace 2 horas</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500"><CheckCircle size={16} /></div>
                                <div>
                                    <p className="text-sm font-bold text-gray-700">Artículo publicado</p>
                                    <p className="text-xs text-gray-400">Hace 5 horas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Articles Table */}
                <div className={styles.tableContainer}>
                    <h2 className={styles.tableTitle}>Artículos Recientes</h2>
                    <div className="overflow-x-auto">
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Título del Artículo</th>
                                    <th>Estado</th>
                                    <th>Fecha</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map((post) => (
                                    <tr key={post.id}>
                                        <td className={styles.articleTitle}>{post.title}</td>
                                        <td>
                                            {post.is_published ? (
                                                <span className={styles.statusPublished}>
                                                    <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                                    Publicado
                                                </span>
                                            ) : (
                                                <span className={styles.statusDraft}>
                                                    <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
                                                    Borrador
                                                </span>
                                            )}
                                        </td>
                                        <td className={styles.date}>{new Date(post.created_at).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                        <td className={styles.actions}>
                                            <Link href={`/admin/editor/${post.id}`}>
                                                <button className={styles.actionBtn} title="Editar">
                                                    <Edit3 size={18} />
                                                </button>
                                            </Link>
                                            <button
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                title="Eliminar"
                                                onClick={() => handleDelete(post.id)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {posts.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-gray-400">
                                            No hay artículos aún.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
