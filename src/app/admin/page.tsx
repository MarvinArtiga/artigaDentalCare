'use client';

import AdminLoginForm from '@/components/admin/AdminLoginForm';

export default function AdminPage() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fefefe', /* White BG as base */
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'var(--font-montserrat), sans-serif'
        }}>
            {/* Dynamic Background Pattern */}
            <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                opacity: 0.15
            }}>
                {/* Striped Background Effect */}
                <div style={{
                    position: 'absolute',
                    transform: 'rotate(-45deg)',
                    width: '200%',
                    height: '200%',
                    top: '-50%',
                    left: '-50%',
                    backgroundImage: 'repeating-linear-gradient(45deg, #4e6587, #4e6587 2px, transparent 2px, transparent 40px)'
                }}></div>
            </div>

            {/* Soft Gradient Overlay for depth */}
            <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(134, 231, 214, 0.15), transparent 70%)'
            }}></div>

            {/* The new Form Component */}
            <div style={{ position: 'relative', zIndex: 10, width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center' }}>
                <AdminLoginForm />
            </div>
        </div>
    );
}
