"use client";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const AnimatedBackground = () => {
  const { currentTheme, customBackground } = useTheme();
  const [mobile, setMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMobile(/Mobi|Android|iPhone/i.test(navigator.userAgent));
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  if (reducedMotion) {
    return (
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}10 0%, transparent 50%, ${currentTheme.colors.secondary}10 100%)`
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main background gradient of custom background */}
      <div 
        className="absolute inset-0"
        style={{ background: customBackground || currentTheme.gradients.background }}
      />
      
      {/* Blob 1 - Top Left */}
      <motion.div
        className="absolute top-20 left-10 w-80 h-80 opacity-20"
        style={{
          background: `linear-gradient(45deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          filter: 'blur(40px)'
        }}
        animate={{
          x: [0, 60, -40, 30, 0],
          y: [0, -30, 20, -15, 0],
          scale: [1, 1.1, 0.9, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Blob 2 - Top Right */}
      <motion.div
        className="absolute top-1/2 right-20 w-96 h-96 opacity-15"
        style={{
          background: `linear-gradient(45deg, ${currentTheme.colors.secondary}, ${currentTheme.colors.accent}80)`,
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          filter: 'blur(40px)'
        }}
        animate={{
          x: [0, -50, 40, -20, 0],
          y: [0, 40, -30, 25, 0],
          scale: [1, 0.9, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Blob 3 - Bottom Left */}
      <motion.div
        className="absolute bottom-20 left-1/3 w-72 h-72 opacity-25"
        style={{
          background: `linear-gradient(45deg, ${currentTheme.colors.background}, ${currentTheme.colors.primary})`,
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          filter: 'blur(40px)'
        }}
        animate={{
          x: [0, 30, -60, 45, 0],
          y: [0, -25, 35, -10, 0],
          scale: [1, 1.05, 0.85, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {!mobile && (
        <>
          {/* Blob 4 - Center */}
          <motion.div
            className="absolute top-1/4 left-1/2 w-64 h-64 opacity-10"
            style={{
              background: `linear-gradient(45deg, ${currentTheme.colors.primary}80, ${currentTheme.colors.secondary})`,
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              filter: 'blur(40px)'
            }}
            animate={{
              x: [0, -40, 50, -30, 0],
              y: [0, 50, -40, 20, 0],
              scale: [1, 0.8, 1.2, 0.9, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Blob 5 - Bottom Right */}
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-88 h-88 opacity-12"
            style={{
              background: `linear-gradient(45deg, ${currentTheme.colors.secondary}60, ${currentTheme.colors.accent}40)`,
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              filter: 'blur(40px)'
            }}
            animate={{
              x: [0, 35, -55, 25, 0],
              y: [0, -45, 30, -15, 0],
              scale: [1, 1.15, 0.75, 1.05, 1],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Additional accent blob */}
          <motion.div
            className="absolute top-3/4 left-1/4 w-56 h-56 opacity-8"
            style={{
              background: `radial-gradient(circle, ${currentTheme.colors.primary}30, ${currentTheme.colors.background}20)`,
              borderRadius: '40% 60% 60% 40% / 40% 40% 60% 60%',
              filter: 'blur(50px)'
            }}
            animate={{
              x: [0, -25, 35, -15, 0],
              y: [0, 20, -40, 30, 0],
              scale: [1, 1.2, 0.7, 1.1, 1],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      )}
    </div>
  );
};

export default AnimatedBackground;