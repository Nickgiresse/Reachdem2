"use client";
import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

type ScrollAnimationProps = {
	children: ReactNode;
	variants?: Variants;
	triggerOnce?: boolean;
	rootMargin?: string;
	className?: string;
};

/**
 * Composant utilitaire pour animer une section à l'entrée dans le viewport.
 * Utilise Framer Motion + Intersection Observer.
 *
 * @param variants - Les variants Framer Motion à appliquer (fade, slide, etc.)
 * @param triggerOnce - Si true, l'animation ne se joue qu'une fois
 * @param rootMargin - Pour ajuster le seuil de déclenchement
 */
export default function ScrollAnimation({
	children,
	variants = {
		hidden: { opacity: 0, y: 40 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
	},
	triggerOnce = true,
	rootMargin = "-10% 0px",
	className = "",
}: ScrollAnimationProps) {
	const { ref, inView } = useInView({ triggerOnce, rootMargin });

	return (
		<motion.div
			ref={ref}
			className={className}
			initial="hidden"
			animate={inView ? "visible" : "hidden"}
			variants={variants}
		>
			{children}
		</motion.div>
	);
}
