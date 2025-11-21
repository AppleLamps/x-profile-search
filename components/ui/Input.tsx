import React from 'react'
import { motion } from 'framer-motion'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  const {
    onAnimationStart,
    onDrag,
    onDragStart,
    onDragEnd,
    ...validProps
  } = props

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={props.id}
          className="block text-small font-medium text-primary-text-secondary mb-2 ml-1"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-text-secondary group-focus-within:text-primary-accent transition-colors duration-200">
            {icon}
          </div>
        )}
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="text"
          className={`
            w-full h-14 px-5 rounded-input
            border border-primary-border/50
            bg-primary-background-off/50 backdrop-blur-sm
            text-primary-text text-body
            placeholder:text-primary-text-secondary/70
            transition-all duration-300 ease-out
            focus:outline-none focus:border-primary-accent focus:shadow-glow focus:bg-primary-background-off
            ${error ? 'border-red-500/50 focus:border-red-500 focus:shadow-none' : ''}
            ${icon ? 'pl-12' : ''}
            ${className}
          `}
          {...validProps}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-small text-red-400 ml-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

