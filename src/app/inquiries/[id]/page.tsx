import InquiryDetail from '@/components/inquiries/inquiry-detail';

export default function InquiryDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="h-full">
      <InquiryDetail inquiryId={params.id} />
    </div>
  );
}
