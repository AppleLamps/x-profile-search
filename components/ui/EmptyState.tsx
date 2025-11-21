'use client'

import React from 'react'
import { Search, FileText } from 'lucide-react'

interface EmptyStateProps {
  type?: 'initial' | 'no-results'
  message?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'initial',
  message,
}) => {
  if (type === 'initial') {
    return (
      <div className="text-center py-12 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-background-secondary mb-4">
          <Search className="w-8 h-8 text-primary-text-secondary" />
        </div>
        <h3 className="text-heading-sm font-semibold text-primary-text mb-2">
          Ready to Analyze
        </h3>
        <p className="text-body text-primary-text-secondary max-w-md mx-auto">
          {message ||
            'Enter an X (Twitter) username above to generate a comprehensive research report'}
        </p>
      </div>
    )
  }

  return (
    <div className="text-center py-12 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-background-secondary mb-4">
        <FileText className="w-8 h-8 text-primary-text-secondary" />
      </div>
      <h3 className="text-heading-sm font-semibold text-primary-text mb-2">
        No Results Found
      </h3>
      <p className="text-body text-primary-text-secondary max-w-md mx-auto">
        {message || 'Unable to generate a report. Please try again with a different username.'}
      </p>
    </div>
  )
}

