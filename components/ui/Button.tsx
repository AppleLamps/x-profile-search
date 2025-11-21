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
    h-12 px-6 rounded-button
    font-semibold text-body
    transition-all duration-200 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-primary-background
    relative overflow-hidden
    inline-flex items-center justify-center gap-2
  `

  const variantStyles = {
    primary: `
      bg-primary-accent
      text-white shadow-button
      hover:bg-primary-accent-hover hover:shadow-button-hover
      active:scale-[0.98]
      border border-transparent
    `,
    secondary: `
      bg-white
      text-primary-text border border-primary-border
      hover:bg-primary-background-off hover:border-primary-accent/40
      hover:shadow-sm
      active:scale-[0.98]
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
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...validProps}
    >
      {isLoading && (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      <span>{children}</span>
    </motion.button>
  )
}

