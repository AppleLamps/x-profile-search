'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  lines?: number
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  lines = 1,
}) => {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="h-4 bg-primary-background-secondary rounded mb-2 last:mb-0"
          style={{
            width: index === lines - 1 ? '75%' : '100%',
          }}
        />
      ))}
    </div>
  )
}

export const ReportSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="mb-4" lines={1} />
        <Skeleton lines={3} />
      </div>
      <div>
        <Skeleton className="mb-4" lines={1} />
        <Skeleton lines={4} />
      </div>
      <div>
        <Skeleton className="mb-4" lines={1} />
        <Skeleton lines={2} />
      </div>
    </div>
  )
}

