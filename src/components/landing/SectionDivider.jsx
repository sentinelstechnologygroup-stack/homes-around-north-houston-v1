import { motion } from "framer-motion";

export default function SectionDivider() {
  return (
    <div className="w-full flex justify-center py-2">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="latitude-line w-full max-w-5xl"
      />
    </div>
  );
}