"use client";

import { motion } from "framer-motion";
import React from "react";

interface SectionWrapperProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function SectionWrapper({
  children,
  delay = 0,
  className = "",
}: SectionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}