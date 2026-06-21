import type { OrganizationWithDepartmentsDto } from '@/api/models'

interface OrganizationProfileProps {
  organization: OrganizationWithDepartmentsDto
}

export const OrganizationProfile: React.FC<OrganizationProfileProps> = ({ organization }) => {
  return (
    <div className="space-y-6">
      {/* Code Field - Form-aligned */}
      <div>
        <label className="text-sm font-medium text-muted-foreground">Mã tổ chức</label>
        <p className="mt-1 text-sm">
          {organization.code ? (
            <span className="font-mono bg-muted px-2 py-1 rounded">
              {organization.code}
            </span>
          ) : (
            <span className="text-muted-foreground">Chưa có mã</span>
          )}
        </p>
      </div>

      {/* Description Field - Form-aligned */}
      <div>
        <label className="text-sm font-medium text-muted-foreground">Mô tả</label>
        <p className="mt-1 text-sm text-foreground">
          {organization.description ? (
            <span>{organization.description}</span>
          ) : (
            <span className="text-muted-foreground italic">Chưa có mô tả</span>
          )}
        </p>
      </div>
    </div>
  )
}
