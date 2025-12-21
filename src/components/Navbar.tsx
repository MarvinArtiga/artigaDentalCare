"use client";

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/Button';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';
import { clsx } from 'clsx';

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const isLightPage = pathname === '/blog' || pathname.startsWith('/blog/');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Servicios', href: '#services' },
        { name: 'Sobre Mí', href: '#about' },
        { name: 'Ubicación', href: '#location' },
        { name: 'Blog', href: '#blog' },
        { name: 'Contacto', href: '#contact' },
    ];

    return (
        <nav className={clsx(styles.navbar, isScrolled && styles.scrolled, isLightPage && styles.lightPage)}>
            <div className={clsx("container", styles.navContainer)}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src={isLightPage && !isScrolled ? "/footer-logo-final-v4.png" : "/logo-white.png"}
                        alt="Logo Artiga Dental Care"
                        width={60} // Adjust size as needed
                        height={60}
                        style={{ objectFit: 'contain' }}
                    />
                    <span>ARTIGA <span className="text-gold">DENTAL</span> CARE</span> <span className={styles.doctorName}>Dra. Cindy Artiga</span>
                </Link>

                {/* Desktop Menu */}
                <div className={styles.desktopMenu}>
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className={styles.navLink}>
                            {link.name}
                        </Link>
                    ))}
                    <Button variant="primary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                        Agendar Cita
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button className={styles.mobileToggle} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={28} color="white" /> : <Menu size={28} color="white" />}
                </button>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className={styles.mobileMenu}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={styles.mobileNavLink}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Button variant="primary" onClick={() => {
                            setIsMobileMenuOpen(false);
                            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                        }}>
                            Agendar Cita
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    );
};
