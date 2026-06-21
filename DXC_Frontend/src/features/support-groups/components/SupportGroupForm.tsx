import React, { forwardRef, useImperativeHandle } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCreateSupportGroup, useUpdateSupportGroup, useSupportGroupCategoryOptions } from "../hooks/useSupportGroups"
import type { SupportGroupDto } from "@/api/models"

const supportGroupFormSchema = z.object({
  categoryPublicId: z.string().min(1, "Vui lòng chọn danh mục"),
  groupName: z
    .string()
    .min(2, "Tên nhóm phải có ít nhất 2 ký tự")
    .max(200, "Tên nhóm không được vượt quá 200 ký tự"),
  groupLink: z
    .string()
    .url("Liên kết phải là URL hợp lệ")
    .optional()
    .or(z.literal("")),
  groupType: z.string().max(100, "Loại nhóm không được vượt quá 100 ký tự").optional(),
  description: z.string().optional(),
})

type SupportGroupFormSchema = z.infer<typeof supportGroupFormSchema>

interface SupportGroupFormProps {
  initialData?: SupportGroupDto
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export interface SupportGroupFormHandle {
  submit: () => void
}

export const SupportGroupForm = forwardRef<SupportGroupFormHandle, SupportGroupFormProps>(
  ({ initialData, onSuccess, onSave }, ref) => {
    const isEditing = !!initialData?.publicId
    const createMutation = useCreateSupportGroup()
    const updateMutation = useUpdateSupportGroup()
    const { data: categoryOptions } = useSupportGroupCategoryOptions()

    const form = useForm<SupportGroupFormSchema>({
      resolver: zodResolver(supportGroupFormSchema),
      defaultValues: {
        categoryPublicId: initialData?.categoryPublicId || "",
        groupName: initialData?.groupName || "",
        groupLink: initialData?.groupLink || "",
        groupType: initialData?.groupType || "",
        description: initialData?.description || "",
      },
    })

    const onSubmit = React.useCallback((data: SupportGroupFormSchema) => {
      const payload = {
        categoryPublicId: data.categoryPublicId,
        groupName: data.groupName.trim() || null,
        groupLink: data.groupLink ? data.groupLink.trim() : null,
        groupType: data.groupType ? data.groupType.trim() : null,
        description: data.description ? data.description.trim() : null,
      }

      if (isEditing && initialData?.publicId) {
        updateMutation.mutate(
          {
            publicId: initialData.publicId,
            ...payload,
          },
          {
            onSuccess: () => {
              onSuccess?.()
            },
          },
        )
      } else {
        createMutation.mutate(payload, {
          onSuccess: () => {
            onSuccess?.()
          },
        })
      }
    }, [createMutation, updateMutation, isEditing, initialData?.publicId, onSuccess])

    useImperativeHandle(ref, () => ({
      submit: () => {
        form.handleSubmit(onSubmit)()
      },
    }))

    React.useEffect(() => {
      onSave?.(() => {
        form.handleSubmit(onSubmit)()
      })
    }, [form, onSave, onSubmit])

    const isSubmitting = createMutation.isPending || updateMutation.isPending

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="categoryPublicId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Danh mục <span className="text-red-600">*</span>
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoryOptions?.data?.map((category) => (
                      <SelectItem key={category.publicId} value={category.publicId || ""}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="groupName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên nhóm <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập tên nhóm hỗ trợ"
                    disabled={isSubmitting}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="groupLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Liên kết nhóm</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập liên kết nhóm (ví dụ: https://zalo.me/...)"
                    disabled={isSubmitting}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="groupType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại nhóm</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập loại nhóm (ví dụ: Zalo, Facebook...)"
                    disabled={isSubmitting}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập mô tả cho nhóm hỗ trợ"
                    disabled={isSubmitting}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    )
  },
)

SupportGroupForm.displayName = "SupportGroupForm"

export default SupportGroupForm
