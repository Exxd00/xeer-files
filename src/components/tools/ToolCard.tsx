import Link from 'next/link'
import type { Tool } from '@/lib/tools'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon

  return (
    <Link href={`/tools/${tool.id}`}>
      <Card className="tool-card h-full border-0 shadow-sm hover:shadow-md bg-card">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`category-${tool.category} p-3 rounded-xl`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base mb-1 truncate">
                {tool.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {tool.description}
              </p>
              {tool.processingTime === 'slow' && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  قد يستغرق وقتاً
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
