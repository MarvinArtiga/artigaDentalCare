"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, LogOut, Settings, BarChart2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const menuItems = [
        {
            title: 'Dashboard',
            path: '/admin/dashboard',
            icon: LayoutDashboard
        },
        {
            title: 'Artículos',
            path: '/admin/posts', // Assuming this path or it could be just part of dashboard for now, but instructions mentioned "Tabla de Artículos" which is usually on dashboard. User asked for specific structure.
            // Wait, user instructions: "Layout de 2 Columnas: Crea un sidebar fijo a la izquierda (donde irá el menú y el botón de Cerrar Sesión)"
            // The dashboard itself HAS the table. So maybe just Dashboard link is enough or "Artículos" links to dashboard?
            // Let's stick to Dashboard as the main view.
            // Actually, usually "Artículos" view is the table. The user instructions "Tabla de Artículos: La lista de posts debe ser una Tabla profesional" implies it's on the dashboard page.
            // I'll keep it simple for now and maybe point 'Artículos' to dashboard as well or just have Dashboard.
            // Let's check the user request again. "sidebar fijo a la izquierda (donde irá el menú y el botón de Cerrar Sesión)".
            // It doesn't strictly list menu items other than LogOut. I'll add Dashboard and maybe a placeholder for "Configuración".
            icon: FileText
        }
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin');
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white hidden md:flex flex-col z-50">
            {/* Logo Area */}
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
                        <span className="font-bold text-xl">A</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Admin</h1>
                        <p className="text-xs text-slate-400">Panel de Control</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'} />
                            <span className="font-medium">{item.title}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
                >
                    <LogOut size={20} className="group-hover:text-red-400 transition-colors" />
                    <span className="font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
}
