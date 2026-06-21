import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/shared/components';
import type { Column } from '@/shared/components';
import type { FeedbackTrackingTableRow } from '../types';

interface FeedbackTrackingTableProps {
  items: FeedbackTrackingTableRow[];
  isLoading?: boolean;
  pagination: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  onDelete?: (id: string) => void;
}

export const FeedbackTrackingTable = ({
  items,
  isLoading,
  pagination,
}: FeedbackTrackingTableProps) => {
  const navigate = useNavigate();

  // Define columns to display
  const columns: Column<FeedbackTrackingTableRow>[] = [
    {
      key: 'title',
      label: 'Tiêu đề phản ánh',
      width: '200px',
      sortable: true,
    },
    {
      key: 'phoneNumber',
      label: 'Số điện thoại',
      width: '150px',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      width: '120px',
      render: (value, row) => {
        const code = row.statusCode || '';
        const className =
          code === 'submitted'
            ? 'bg-yellow-100 text-yellow-800'
            : code === 'in_progress'
            ? 'bg-blue-100 text-blue-800'
            : code === 'waiting_for_approval'
            ? 'bg-purple-100 text-purple-800'
            : code === 'completed'
            ? 'bg-green-100 text-green-800'
            : code === 'rejected'
            ? 'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-800';
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${className}`}>
            {value}
          </span>
        );
      },
    },
    {
      key: 'createdDate',
      label: 'Ngày tạo',
      width: '150px',
      render: (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '-',
    },
    {
      key: 'assigneeName',
      label: 'Người xử lý',
      width: '150px',
      render: (value, row) => value || row.assigneePhone || '-',
    },
  ];

  // Actions are handled by row click navigation

  return (
    <DataTable
      columns={columns}
      data={items}
      isLoading={isLoading}
      pagination={pagination}
      rowKey="publicId"
      onRowClick={(row) => navigate(`/feedback-tracking/${row.publicId}`)}
      emptyState={{
        icon: null,
        title: 'Không có dữ liệu',
        description: 'Không tìm thấy phản ánh nào',
      }}
    />
  );
};

export default FeedbackTrackingTable;
