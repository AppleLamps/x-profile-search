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
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.1,
          }}
          className="h-3 bg-gradient-to-r from-primary-background-secondary via-primary-background-tertiary to-primary-background-secondary rounded-lg mb-3 last:mb-0"
          style={{
            width: index === lines - 1 ? '70%' : '100%',
          }}
        />
      ))}
    </div>
  )
}

export const ReportSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-10 h-10 bg-primary-background-secondary rounded-lg"
        />
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
          className="h-6 w-48 bg-primary-background-secondary rounded-lg"
        />
      </div>

      {/* Content sections */}
      <div className="space-y-6">
        <div>
          <Skeleton className="mb-3" lines={1} />
          <Skeleton lines={3} />
        </div>
        <div>
          <Skeleton className="mb-3" lines={1} />
          <Skeleton lines={4} />
        </div>
        <div>
          <Skeleton className="mb-3" lines={1} />
          <Skeleton lines={2} />
        </div>
      </div>
    </div>
  )
}

