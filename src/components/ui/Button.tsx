import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'sidebar';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  isActive = false,
  className,
  ...props
}) => {
  const { currentTheme } = useTheme();
  const isLiquidGlass = currentTheme.id === 'liquid-glass';

  const baseClasses = "flex items-center gap-3 rounded-xl transition-all duration-300 font-light";
  
  const variants = {
    primary: isLiquidGlass ? "liquid-glass-button primary" : "gradient-button",
    secondary: isLiquidGlass ? "liquid-glass-button secondary" : "secondary-button",
    ghost: isLiquidGlass ? "liquid-glass-button ghost" : "hover:bg-cream/10",
    sidebar: cn(
      "w-full px-4 py-3",
      isLiquidGlass ? "liquid-glass-sidebar-item" : "sidebar-item",
      isActive && "active"
    )
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3",
    lg: "px-6 py-4 text-lg"
  };

  return (
    <motion.button
      className={cn(
        baseClasses,
        variants[variant],
        variant !== 'sidebar' && sizes[size],
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="flex-1 text-left">{children}</span>
    </motion.button>
  );
};