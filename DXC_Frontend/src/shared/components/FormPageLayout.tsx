import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Breadcrumb } from './Breadcrumb'
import { ActionBar } from './ActionBar'

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface FormPageLayoutProps {
  title?: string
  description?: string
  formTitle: string
  breadcrumbItems?: BreadcrumbItem[]
  actionBarContent?: React.ReactNode
  children: React.ReactNode
}

export const FormPageLayout: React.FC<FormPageLayoutProps> = ({
  title,
  description,
  formTitle,
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
      {actionBarContent && <ActionBar>{actionBarContent}</ActionBar>}

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{formTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">{children}</CardContent>
      </Card>
    </div>
  )
}
