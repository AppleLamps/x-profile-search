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
      whileHover={hover ? { y: -4 } : {}}
      className={`
        glass
        rounded-card p-8 md:p-12
        shadow-card
        ${hover ? 'hover:shadow-card-hover hover:border-primary-accent/20' : ''}
        transition-all duration-300 ease-out
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

