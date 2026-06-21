import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { ChevronDown, ChevronUp, X } from 'lucide-react'

interface AdvancedFiltersProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  activeFiltersCount?: number
  children: React.ReactNode
  onClearAll?: () => void
  showClearButton?: boolean
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  isOpen,
  onOpenChange,
  activeFiltersCount = 0,
  children,
  onClearAll,
  showClearButton = true,
}) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => onOpenChange(!isOpen)} className="gap-2">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          Bộ lọc nâng cao
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {showClearButton && activeFiltersCount > 0 && onClearAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Xóa tất cả
          </Button>
        )}
      </div>

      <CollapsibleContent className="pt-4">
        <Card>
          <CardContent className="pt-4">{children}</CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}
