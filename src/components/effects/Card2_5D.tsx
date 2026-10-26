import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";

export function Card2_5D({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const pointerX = useMotionValue(0.5); const pointerY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [5, -5]), { stiffness: 220, damping: 26 });
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-5, 5]), { stiffness: 220, damping: 26 });
  const lift = useSpring(useTransform(pointerY, [0, 1], [0, 3]), { stiffness: 220, damping: 26 });
  const shadowX = useTransform(pointerX, [0, 1], [-18, 18]);
  const shadowY = useTransform(pointerY, [0, 1], [18, 8]);
  const shadow = useTransform([shadowX, shadowY], ([x, y]) => `${x}px ${y}px 42px rgba(0,0,0,.34)`);
  function move(event: PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)));
    pointerY.set(Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)));
  }
  function reset() { pointerX.set(0.5); pointerY.set(0.5); }
  return <motion.div className={`card-2-5d ${className}`} initial={reduced ? false : { opacity: 0, y: 16 }} animate={reduced ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset} style={reduced ? undefined : { rotateX, rotateY, translateZ: lift, boxShadow: shadow, transformPerspective: 1000 }}>
    {children}
  </motion.div>;
}
