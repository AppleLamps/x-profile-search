'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, FileText, TrendingUp, MessageSquare, Star, BarChart3, Clock } from 'lucide-react'

interface ReportSectionProps {
  title: string
  children: React.ReactNode
  icon?: React.ReactNode
  defaultCollapsed?: boolean
  collapsible?: boolean
  className?: string
}

const iconMap: Record<string, React.ReactNode> = {
  'Executive Summary': <FileText className="w-5 h-5" />,
  'Summary': <FileText className="w-5 h-5" />,
  'Time Period': <Clock className="w-5 h-5" />,
  'Recent': <Clock className="w-5 h-5" />,
  'Themes': <TrendingUp className="w-5 h-5" />,
  'Topics': <TrendingUp className="w-5 h-5" />,
  'Key Themes': <TrendingUp className="w-5 h-5" />,
  'Engagement': <BarChart3 className="w-5 h-5" />,
  'Patterns': <BarChart3 className="w-5 h-5" />,
  'Notable': <Star className="w-5 h-5" />,
  'Posts': <MessageSquare className="w-5 h-5" />,
  'Threads': <MessageSquare className="w-5 h-5" />,
  'Assessment': <FileText className="w-5 h-5" />,
}

export const ReportSection: React.FC<ReportSectionProps> = ({
  title,
  children,
  icon,
  defaultCollapsed = false,
  collapsible = true,
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  const getIcon = () => {
    if (icon) return icon

    // Try to find icon by title keywords
    for (const [key, iconComponent] of Object.entries(iconMap)) {
      if (title.toLowerCase().includes(key.toLowerCase())) {
        return iconComponent
      }
    }

    return <FileText className="w-5 h-5" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`mb-6 last:mb-0 ${className}`}
    >
      <div className="bg-primary-background-off/50 border border-primary-border-light rounded-card p-5 hover:border-primary-accent/20 transition-all duration-200">
        {/* Section Header */}
        <motion.button
          onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
          disabled={!collapsible}
          className={`
            w-full flex items-center justify-between gap-4 mb-3
            ${collapsible ? 'cursor-pointer group' : 'cursor-default'}
          `}
          whileHover={collapsible ? { x: 2 } : {}}
          transition={{ duration: 0.15 }}
        >
          <div className="flex items-center gap-3">
            <div className="text-primary-accent bg-primary-accent-light p-2 rounded-lg">
              {getIcon()}
            </div>
            <h3 className="text-heading-sm font-bold text-primary-text text-left group-hover:text-primary-accent transition-colors">
              {title}
            </h3>
          </div>

          {collapsible && (
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.2 }}
              className="text-primary-text-tertiary group-hover:text-primary-accent transition-colors"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          )}
        </motion.button>

        {/* Section Content */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pt-2">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

