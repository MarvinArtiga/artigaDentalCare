"use client"

import type React from "react"
import { Suspense } from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import type { Post } from "@/types/blog"
import Link from "next/link"
import { FileText, LogOut, Search, Plus, Edit2, Trash } from "lucide-react"

function AdminDashboardContent() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const router = useRouter()
    const supabase = createClient()
    const [userEmail, setUserEmail] = useState<string>("")

    useEffect(() => {
        checkUser()
        fetchPosts()
    }, [])

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push("/admin")
        } else {
            setUserEmail(session.user.email || "Admin")
        }
    }

    const fetchPosts = async () => {
        const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false })
        if (data) setPosts(data)
        setLoading(false)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este artículo?")) return
        const { error } = await supabase.from("posts").delete().eq("id", id)
        if (!error) {
            setPosts(posts.filter((p) => p.id !== id))
        } else {
            alert("Error al eliminar")
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/admin")
    }

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const publishedCount = posts.filter((p) => p.is_published).length
    const draftCount = posts.filter((p) => !p.is_published).length
    const totalCount = posts.length
    const publishedPercentage = totalCount > 0 ? Math.round((publishedCount / totalCount) * 100) : 0

    if (loading)
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fe]">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Cargando dashboard...</p>
            </div>
        )

    return (
        <div className="flex h-screen bg-[#F5F6FA] font-sans text-slate-800 overflow-hidden">


            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#F5F6FA]">
                {/* Header */}
                {/* Header */}
                <header className="h-auto md:h-20 bg-white flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-4 md:py-0 shrink-0 z-10 border-b border-slate-100 gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Panel de Control</h1>
                        <button
                            onClick={handleLogout}
                            className="md:hidden text-slate-500 hover:text-slate-700"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="relative group w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Buscar Artículo"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 pl-10 pr-6 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 bg-slate-50 transition-all text-slate-600 font-medium placeholder:text-slate-400"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Link href="/admin/editor" className="w-full md:w-auto">
                                <button className="w-full md:w-auto bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all uppercase shadow-lg shadow-slate-200 hover:shadow-xl">
                                    <Plus size={16} />
                                    <span>Nuevo Post</span>
                                </button>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="hidden md:flex p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
                                title="Cerrar Sesión"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-10 space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-500 text-sm font-medium">Total Artículos</p>
                                        <p className="text-3xl font-bold text-slate-800 mt-1">{totalCount}</p>
                                    </div>
                                    <FileText size={32} className="text-indigo-400" />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-500 text-sm font-medium">Publicados</p>
                                        <p className="text-3xl font-bold text-slate-800 mt-1">{publishedCount}</p>
                                    </div>
                                    <div className="text-center">
                                        <span className="inline-block bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-full">
                                            LIVE
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-500 text-sm font-medium">Borradores</p>
                                        <p className="text-3xl font-bold text-slate-800 mt-1">{draftCount}</p>
                                    </div>
                                    <div className="text-center">
                                        <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
                                            WIP
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Artículos Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-800">Todos los Artículos</h2>
                                <span className="text-sm font-semibold text-slate-500">{totalCount} artículos</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50">
                                            <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                Título del Artículo
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                Fecha
                                            </th>
                                            <th className="px-8 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredPosts.map((post) => (
                                            <tr key={post.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">
                                                            {post.title}
                                                        </p>
                                                        <p className="text-xs text-slate-400 mt-1">/{post.slug}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {post.is_published ? (
                                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span> Publicado
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Borrador
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-sm text-slate-600 font-medium">
                                                    {new Date(post.created_at).toLocaleDateString("es-ES", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <Link href={`/admin/editor/${post.id}`}>
                                                            <button
                                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                                title="Editar"
                                                            >
                                                                <Edit2 size={18} />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(post.id)}
                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Eliminar"
                                                        >
                                                            <Trash size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredPosts.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <FileText size={40} className="text-slate-300 mb-4" />
                                                        <h3 className="text-slate-800 font-bold mb-2">No hay artículos</h3>
                                                        <p className="text-slate-400 text-sm">Comienza a escribir y comparte tus ideas hoy.</p>
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
            </main>
        </div>
    )
}



export default function AdminDashboard() {
    return (
        <Suspense fallback={<div />}>
            <AdminDashboardContent />
        </Suspense>
    )
}
