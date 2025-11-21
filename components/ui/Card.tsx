import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)' } : {}}
      className={`
        bg-white border border-primary-border
        rounded-card p-6 md:p-8
        shadow-card
        ${hover ? 'hover:border-primary-accent/30' : ''}
        transition-all duration-200 ease-out
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

