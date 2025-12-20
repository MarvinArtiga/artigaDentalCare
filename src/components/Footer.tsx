import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Mail } from 'lucide-react';
import styles from './Footer.module.css';

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.waves}>
                <svg className={styles.wavesSvg} xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                    <defs>
                        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                    </defs>
                    <g className={styles.parallax}>
                        <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(88, 144, 255, 0.7)" />
                        <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(88, 144, 255, 0.5)" />
                        <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(88, 144, 255, 0.3)" />
                        <use xlinkHref="#gentle-wave" x="48" y="7" fill="#0F172A" />
                    </g>
                </svg>
            </div>
            <div className={`container ${styles.container}`}>


                {/* Brand Left */}
                <div className={styles.brandWrapper}>
                    <Link href="/" className={styles.logo}>
                        <span>ARTIGA <span className="text-gold">DENTAL</span> CARE</span>
                    </Link>
                </div>

                {/* Center Content: Socials & Icon */}
                <div className={styles.centerContent}>
                    <div className={styles.iconImageWrapper}>
                        <Image
                            src="/footer-logo-final-v4.png"
                            alt="Artiga Dental Care Logo"
                            width={160}
                            height={120}
                            className={styles.footerIcon}
                        />
                    </div>

                    <div className={styles.socialsWrapper}>
                        <div className={styles.socialLine}></div>
                        <div className={styles.socialIcons}>
                            <a href="https://www.facebook.com/share/19e5C3FWDg/" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                                <Facebook size={24} />
                            </a>
                            <a href="https://www.instagram.com/artigadental.sv/" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                                <Instagram size={24} />
                            </a>
                            <a href="mailto:artigadental.info@gmail.com" className={styles.iconLink}>
                                <Mail size={24} />
                            </a>
                        </div>
                        <div className={styles.socialLine}></div>
                    </div>
                </div>

                {/* Right Content: Copyright */}
                <div className={styles.rightContent}>
                    <p className={styles.copyrightText}>
                        © {new Date().getFullYear()} Artiga Dental Care. <br />
                        Todos los derechos reservados.
                    </p>
                </div>

            </div>
        </footer>
    );
};
