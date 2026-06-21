import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListPageLayout, ActionBarDivider } from '@/shared/components';
import { usePagination } from '@/shared/hooks';
import FeedbackTrackingTable from '../components/FeedbackTrackingTable';
import { useFeedbackTrackings } from '../hooks/useFeedbackTrackings';

export const FeedbackTrackingListPage = () => {

  // ====== STATE MANAGEMENT ======
  
  // Pagination
  const { page, pageSize, setPage, setPageSize } = 
    usePagination(1000);
  
  // Status filter dropdown
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'in_progress' | 'waiting_for_approval' | 'completed' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  
  // ====== DATA FETCHING ======
  const selectedStatusCode = statusFilter === 'all' ? undefined : statusFilter;
  const isNumericSearch = /^\d{3,}$/.test(searchTerm.trim());
  const { data, isLoading } = useFeedbackTrackings({
    current: page,
    pageSize,
    currentStatusCode: selectedStatusCode,
    title: searchTerm.trim() || undefined,
    phoneNumber: isNumericSearch ? searchTerm.trim() : undefined,
  });

  // ====== EVENT HANDLERS ======

  const handleStatusChange = (value: 'all' | 'submitted' | 'in_progress' | 'waiting_for_approval' | 'completed' | 'rejected') => {
    setStatusFilter(value);
    setPage(1);
  };
  const handleSearch = () => {
    setSearchTerm(tempSearchTerm);
    setPage(1);
  };
  const handleClearSearch = () => {
    setTempSearchTerm('');
    setSearchTerm('');
    setPage(1);
  };

  // ====== RENDER ======
  return (
    <>
      {/* Main List Page */}
      <ListPageLayout
        title="Theo dõi xử lý"
        description="Theo dõi và quản lý tất cả phản ánh từ người dùng"
        breadcrumbItems={[
          { label: 'Quản lý phản ánh', current: true }
        ]}
        actionBarContent={
          <>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Trạng thái</span>
              <Select value={statusFilter} onValueChange={(v) => handleStatusChange(v as 'all' | 'submitted' | 'in_progress' | 'waiting_for_approval' | 'completed' | 'rejected')}>
                <SelectTrigger aria-label="Chọn trạng thái" size="sm" className="min-w-[180px]" >
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-400" />
                      Tất cả
                    </span>
                  </SelectItem>
                  <SelectItem value="submitted">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" />
                      Đã gửi
                    </span>
                  </SelectItem>
                  <SelectItem value="in_progress">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      Đang xử lý
                    </span>
                  </SelectItem>
                  <SelectItem value="waiting_for_approval">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-600" />
                      Chờ duyệt
                    </span>
                  </SelectItem>
                  <SelectItem value="completed">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-600" />
                      Hoàn thành
                    </span>
                  </SelectItem>
                  <SelectItem value="rejected">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-600" />
                      Từ chối
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Input
                aria-label="Tìm kiếm phản ánh"
                placeholder="Tìm kiếm phản ánh..."
                value={tempSearchTerm}
                onChange={(e) => setTempSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                className="w-64"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Tìm kiếm
              </button>
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-3 py-2 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300"
              >
                Xóa
              </button>
            </div>
            <ActionBarDivider />
          </>
        }
      >
        {/* Table Component */}
        <FeedbackTrackingTable
          items={(data?.data || []).map(item => ({
            publicId: item.publicId || '',
            title: item.title,
            phoneNumber: item.phoneNumber || '',
            status: item.currentStatusName || '',
            statusCode: item.currentStatusCode || '',
            createdDate: item.createdAt || '',
            assigneeName: item.assignedDepartmentName || '',
            assigneePhone: item.assignedDepartmentCode || '',
          }))}
          isLoading={isLoading}
          pagination={{
            current: page,
            total: data?.total || 0,
            pageSize: pageSize,
            onChange: setPage,
            onPageSizeChange: setPageSize,
          }}
        />
      </ListPageLayout>
    </>
  );
};

export default FeedbackTrackingListPage;
