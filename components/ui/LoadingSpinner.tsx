import React from 'react'
import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeMap[size]} border-2 border-primary-border border-t-primary-accent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}

