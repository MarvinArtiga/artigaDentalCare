import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram } from 'lucide-react';
import { TikTokIcon } from './ui/TikTokIcon';
import styles from './Footer.module.css';

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.container}`}>


                {/* Brand Left */}
                <div className={styles.brandWrapper}>
                    <Link href="/" className={styles.logo}>
                        <span>ARTIGA <span className="text-gold">DENTAL</span> CARE</span>
                    </Link>
                </div>

                {/* Center Content: Socials & Icon */}
                <div className={styles.centerContent}>
                    <div className={styles.socialsWrapper}>
                        <div className={styles.socialLine}></div>
                        <div className={styles.socialIcons}>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                                <Facebook size={24} />
                            </a>
                            <a href="https://www.instagram.com/artigadental.sv/" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                                <Instagram size={24} />
                            </a>
                            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                                <TikTokIcon size={24} />
                            </a>
                        </div>
                        <div className={styles.socialLine}></div>
                    </div>

                    <div className={styles.iconImageWrapper}>
                        <Image
                            src="/footer-logo-final-v4.png"
                            alt="Artiga Dental Care Logo"
                            width={160}
                            height={120}
                            className={styles.footerIcon}
                        />
                    </div>
                </div>

                {/* Right Spacer for Grid Balance */}
                <div className={styles.rightSpacer}></div>

            </div>
        </footer>
    );
};
