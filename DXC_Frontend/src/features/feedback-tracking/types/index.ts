export interface FeedbackTrackingTableRow {
  publicId: string;
 title: string;
  phoneNumber: string;
  status: string;
  statusCode?: string;
  createdDate: string;
  assigneeName?: string;
  assigneePhone?: string;
  processingDate?: string;
  processingContent?: string;
}

export interface FeedbackTrackingFormData {
  title: string;
  phoneNumber: string;
  status: string;
  assigneeName?: string;
  assigneePhone?: string;
  processingContent?: string;
}

// Re-export generated types if needed
// Note: These types will be created after API generation
