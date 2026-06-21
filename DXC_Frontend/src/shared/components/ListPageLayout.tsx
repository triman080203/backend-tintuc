import React from 'react'
import { Breadcrumb } from './Breadcrumb'
import { ActionBar } from './ActionBar'

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface ListPageLayoutProps {
  title?: string
  description?: string
  breadcrumbItems?: BreadcrumbItem[]
  actionBarContent?: React.ReactNode
  children: React.ReactNode
}

export const ListPageLayout: React.FC<ListPageLayoutProps> = ({
  title,
  description,
  breadcrumbItems = [],
  actionBarContent,
  children,
}) => {
  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      {breadcrumbItems.length > 0 && <Breadcrumb items={breadcrumbItems} />}

      {/* Title & Description */}
      {(title || description) && (
        <div className="space-y-1">
          {title && <h1 className="text-2xl font-bold">{title}</h1>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}

      {/* Action Bar - Feature defines content */}
      {actionBarContent && (
        <ActionBar>
          {actionBarContent}
        </ActionBar>
      )}

      {/* Content */}
      {children}
    </div>
  )
}
