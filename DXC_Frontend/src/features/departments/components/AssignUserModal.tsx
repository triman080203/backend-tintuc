import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { useAssignUserToDepartment } from '../hooks/useDepartments'
import { useUsers } from '@/features/users/hooks/useUsers'

const assignUserSchema = z.object({
  userPublicId: z.string().min(1, 'Vui lòng chọn người dùng'),
})

type AssignUserFormData = z.infer<typeof assignUserSchema>

interface AssignUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  departmentPublicId: string
  onSuccess?: () => void
}

export default function AssignUserModal({
  open,
  onOpenChange,
  departmentPublicId,
  onSuccess,
}: AssignUserModalProps) {
  const [selectedUser, setSelectedUser] = useState<string>('')
  const { data: usersData, isLoading: usersLoading } = useUsers({ PageSize: 100 })
  const assignMutation = useAssignUserToDepartment()

  const form = useForm<AssignUserFormData>({
    resolver: zodResolver(assignUserSchema),
    defaultValues: {
      userPublicId: '',
    },
  })

  useEffect(() => {
    if (!open) {
      form.reset()
      setSelectedUser('')
    }
  }, [open, form])

  const users = usersData?.data || []

  const onSubmit = (data: AssignUserFormData) => {
    assignMutation.mutate(
      {
        userPublicId: data.userPublicId,
        departmentPublicId,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          onSuccess?.()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm người dùng vào phòng ban</DialogTitle>
          <DialogDescription>
            Chọn người dùng từ danh sách để thêm vào phòng ban này
          </DialogDescription>
        </DialogHeader>

        {usersLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Đang tải danh sách người dùng...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userPublicId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Người dùng <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedUser(value)
                      }}
                      value={selectedUser}
                    >
                      <FormControl>
                        <SelectTrigger disabled={users.length === 0}>
                          <SelectValue placeholder="Chọn người dùng..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            Không có người dùng nào
                          </div>
                        ) : (
                          users.map((user) => (
                            <SelectItem key={user.publicId} value={user.publicId || ''}>
                              <div className="flex flex-col">
                                <span className="font-medium">{user.fullName}</span>
                                <span className="text-xs text-muted-foreground">{user.email}</span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={assignMutation.isPending}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={assignMutation.isPending}>
                  {assignMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Thêm người dùng
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
