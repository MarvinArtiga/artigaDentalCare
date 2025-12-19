import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import styles from './Button.module.css';
import { clsx } from 'clsx';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'outline' | 'ghost';
    children: React.ReactNode;
}

export const Button = ({ variant = 'primary', className, children, ...props }: ButtonProps) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={clsx(styles.button, styles[variant], className)}
            {...props}
        >
            {children}
        </motion.button>
    );
};
