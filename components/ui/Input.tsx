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
          className="block text-small font-semibold text-primary-text mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-text-tertiary group-focus-within:text-primary-accent transition-colors duration-200">
            {icon}
          </div>
        )}
        <input
          type="text"
          className={`
            w-full h-12 px-4 rounded-input
            border-2 border-primary-border
            bg-white
            text-primary-text text-body
            placeholder:text-primary-text-tertiary
            transition-all duration-200 ease-out
            focus:outline-none focus:border-primary-accent focus:shadow-input-focus
            hover:border-primary-border-light
            ${error ? 'border-primary-error focus:border-primary-error focus:shadow-none' : ''}
            ${icon ? 'pl-11' : ''}
            ${className}
          `}
          {...validProps}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-small text-primary-error"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

