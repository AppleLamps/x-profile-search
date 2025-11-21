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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-red-50 border border-red-200 rounded-card p-4 mb-6"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="text-body font-semibold text-red-900 mb-1">
            Error
          </h3>
          <p className="text-small text-red-700">{error}</p>
          {onRetry && (
            <div className="mt-3">
              <Button
                variant="secondary"
                onClick={onRetry}
                className="text-small h-auto py-2 px-4"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-600 hover:text-red-800 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

