import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DetailPageLayout, ActionBarDivider } from '@/shared/components';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { useFeedbackTrackingDetail } from '../hooks/useFeedbackTrackings';

export const FeedbackTrackingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ====== DATA FETCHING ======
  const { data, isLoading, error } = useFeedbackTrackingDetail(id!);

 // ====== ERROR STATE ======
  if (error || !data?.data) {
    return (
      <DetailPageLayout
        title="Theo dõi xử lý"
        description="Theo dõi và quản lý tất cả phản ánh từ người dùng"
        objectName="Không tìm thấy"
        breadcrumbItems={[
          { label: 'Quản lý phản ánh', href: '/feedback-tracking' }
        ]}
        actionBarContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/feedback-tracking')}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
        }
      >
        <div className="text-center py-12 space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy phản ánh
            </h3>
            <p className="text-gray-600 mb-6">
              Phản ánh bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/feedback-tracking')}
            >
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </DetailPageLayout>
    );
  }

 const feedback = data.data;

  // ====== RENDER ======
  return (
    <DetailPageLayout
      title="Theo dõi xử lý"
      description="Theo dõi và quản lý tất cả phản ánh từ người dùng"
      objectName={feedback.title || 'Phản ánh chi tiết'}
      breadcrumbItems={[
        { label: 'Quản lý phản ánh', href: '/feedback-tracking' },
        { label: feedback.title || 'Chi tiết', current: true }
      ]}
      actionBarContent={
        <>
          {/* Navigation: Back */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/feedback-tracking')}
            disabled={isLoading}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>

          {/* Divider between groups */}
          <ActionBarDivider />
        </>
      }
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Tiêu đề</h3>
            <p className="text-lg text-gray-900">{feedback.title}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Số điện thoại</h3>
            <p className="text-lg text-gray-900">{feedback.phoneNumber || '-'}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Họ tên người gửi</h3>
            <p className="text-lg text-gray-900">{feedback.fullName}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Địa điểm</h3>
            <p className="text-lg text-gray-900">{feedback.location || '-'}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Trạng thái hiện tại</h3>
            <span className={`px-3 py-1 rounded-full text-sm ${
              feedback.currentStatusName?.toLowerCase().includes('mới') || feedback.currentStatusName?.toLowerCase().includes('pending') || feedback.currentStatusId === 1
                ? 'bg-yellow-100 text-yellow-800' 
                : feedback.currentStatusName?.toLowerCase().includes('đang') || feedback.currentStatusName?.toLowerCase().includes('processing') || feedback.currentStatusId === 2
                ? 'bg-blue-100 text-blue-800'
                : feedback.currentStatusName?.toLowerCase().includes('hoàn') || feedback.currentStatusName?.toLowerCase().includes('completed') || feedback.currentStatusId === 3
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {feedback.currentStatusName || 'Không xác định'}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Đơn vị xử lý</h3>
            <p className="text-lg text-gray-900">{feedback.assignedDepartmentName || '-'}</p>
          </div>
        </div>

        {/* Content Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Nội dung phản ánh</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{feedback.content}</p>
        </div>

        {/* Processing History */}
        {feedback.processings && feedback.processings.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-4">Lịch sử xử lý</h3>
            <div className="space-y-4">
              {feedback.processings.map((processing, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{processing.processingNote || 'Không có ghi chú xử lý'}</p>
                      <p className="text-sm text-gray-600">
                        {processing.assignedDepartmentName || 'Đơn vị xử lý không xác định'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Từ: {processing.fromStatusName || processing.fromStatusCode || 'N/A'} →
                        Đến: {processing.toStatusName || processing.toStatusCode || 'N/A'}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {processing.assignedAt ? new Date(processing.assignedAt).toLocaleString('vi-VN') : '-'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata Section */}
        <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold text-gray-600 mb-1">Ngày tạo</h3>
            <p className="text-gray-600">{feedback.createdAt ? new Date(feedback.createdAt).toLocaleString('vi-VN') : '-'}</p>
          </div>

          {feedback.updatedAt && (
            <div>
              <h3 className="font-semibold text-gray-600 mb-1">Cập nhật lần cuối</h3>
              <p className="text-gray-600">{new Date(feedback.updatedAt).toLocaleString('vi-VN')}</p>
            </div>
          )}
        </div>
      </div>
    </DetailPageLayout>
  );
};

export default FeedbackTrackingDetailPage;
