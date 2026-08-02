import { motion, useScroll, useTransform } from "framer-motion";
export function GradientShift() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div className="fixed inset-0 -z-20 pointer-events-none" style={{
      background: useTransform(scrollYProgress, (v) =>
        `radial-gradient(ellipse at 30% 20%, hsla(${185 + v * 30}, 80%, 50%, 0.04), transparent 55%),
         radial-gradient(ellipse at 70% 80%, hsla(${35 + v * 15}, 80%, 50%, 0.03), transparent 50%)`
      ),
    }} aria-hidden />
  );
}
