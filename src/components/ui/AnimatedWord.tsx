"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedWordProps {
    text: string;
    className?: string; // Should provide the base color
    highlightColorClass: string; // Tailwindi-sh class or just ignoring it for inline styles
    baseColor: string;
    highlightColor: string;
}

export const AnimatedWord = ({ text, className, baseColor, highlightColor }: AnimatedWordProps) => {
    const letters = Array.from(text);
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTrigger(prev => prev + 1);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const container = {
        hidden: { opacity: 1 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.0 }
        }),
    };

    const child = {
        visible: {
            color: [baseColor, highlightColor, baseColor],
            transition: {
                duration: 2, // Cycle duration
                ease: "easeInOut",
            },
        } as any,
        hidden: { color: baseColor }
    };

    return (
        <motion.span
            style={{ display: "inline-block" }}
            variants={container}
            initial="hidden"
            animate={trigger > 0 ? "visible" : "hidden"}
            key={trigger} // Re-trigger animation by re-mounting or key change if variants depend on state, but here animate prop change should be enough if logic was complex. Actually key is simplest way to restart 'animate' sequence cleanly.
            className={className}
        >
            {letters.map((letter, index) => (
                <motion.span variants={child} key={index} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
                    {letter}
                </motion.span>
            ))}
        </motion.span>
    );
};
