import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function Card2_5D({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`card-2-5d ${className}`}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={reduced ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduced ? undefined : { rotateX: 0, rotateY: 0, scale: 1.02, boxShadow: "0 24px 70px -28px rgba(255,77,122,.85)" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}
