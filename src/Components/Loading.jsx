import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-primary dark:bg-gray-900 dark:text-[#FFDADA]">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <motion.div
          className="w-12 h-12 border-4 border-[#FFDADA] border-t-transparent rounded-full animate-spin"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Loading Text */}
        <motion.p
          className="text-lg font-semibold tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
}
