'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, X } from 'lucide-react'
import { Button } from './Button'

interface ErrorDisplayProps {
  error: string
  onDismiss?: () => void
  onRetry?: () => void
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onDismiss,
  onRetry,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="bg-red-50/80 border-2 border-red-200 rounded-card p-4"
    >
      <div className="flex items-start gap-3">
        <div className="bg-red-100 p-2 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-body font-bold text-red-900 mb-1">
            Error
          </h3>
          <p className="text-small text-red-700 leading-relaxed">{error}</p>
          {onRetry && (
            <div className="mt-3">
              <Button
                variant="secondary"
                onClick={onRetry}
                className="text-small h-9 px-4 border-red-300 text-red-700 hover:bg-red-100"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-100"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

