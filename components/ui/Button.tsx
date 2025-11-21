import React from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = `
    h-14 px-8 rounded-button
    font-medium text-body tracking-wide
    transition-all duration-300 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-primary-background
    relative overflow-hidden
  `

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-brand-start to-brand-end
      text-white shadow-lg shadow-brand-start/25
      hover:shadow-brand-start/40 hover:scale-[1.02]
      border border-transparent
    `,
    secondary: `
      bg-primary-background-off/50 backdrop-blur-md
      text-primary-text border border-primary-border/50
      hover:bg-primary-background-off/80 hover:border-primary-accent/50
      hover:shadow-lg hover:shadow-primary-accent/10
    `,
  }

  // Filter out props that conflict with framer-motion types
  const {
    onAnimationStart,
    onDrag,
    onDragStart,
    onDragEnd,
    ...validProps
  } = props

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...validProps}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </motion.button>
  )
}

