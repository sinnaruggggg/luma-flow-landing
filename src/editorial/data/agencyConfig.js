const inquiryFlag = String(import.meta.env.VITE_INQUIRY_ENABLED ?? '').trim().toLowerCase();

export const AGENCY_CONFIG = Object.freeze({
  brandName: import.meta.env.VITE_AGENCY_NAME?.trim() || '나나웹',
  companyName: import.meta.env.VITE_COMPANY_NAME?.trim() || '나나정원',
  inquiryEnabled: inquiryFlag === 'true' || inquiryFlag === '1',
  inquiryEndpoint: '/api/inquiries',
  inquirySampleId: 'agency-homepage',
  responseTime: import.meta.env.VITE_INQUIRY_RESPONSE_TIME?.trim() || '접수 연결 후 담당자가 확인해 안내합니다.',
  // 연락처·사업자 정보. 전화·메신저는 비워 두면 화면에 표시되지 않습니다.
  contact: Object.freeze({
    email: import.meta.env.VITE_CONTACT_EMAIL?.trim() || 'sinnaru@naver.com',
    phone: import.meta.env.VITE_CONTACT_PHONE?.trim() || '',
    kakao: import.meta.env.VITE_CONTACT_KAKAO?.trim() || '',
    hours: '평일 10:00 – 18:00',
  }),
  business: Object.freeze({
    registration: '278-66-00889',
  }),
});
