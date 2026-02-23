/**
 * 테스트 견적서 20개 + 견적항목 생성 스크립트
 *
 * 실행 방법:
 *   node -r dotenv/config scripts/create-test-invoices.cjs dotenv_config_path=.env.local
 */

'use strict'

const { Client } = require('@notionhq/client')

const NOTION_API_KEY = process.env.NOTION_API_KEY
const NOTION_QUOTE_DB_ID = process.env.NOTION_QUOTE_DB_ID
const NOTION_QUOTE_ITEM_DB_ID = process.env.NOTION_QUOTE_ITEM_DB_ID

if (!NOTION_API_KEY || !NOTION_QUOTE_DB_ID || !NOTION_QUOTE_ITEM_DB_ID) {
  console.error('❌ 환경 변수 누락: NOTION_API_KEY, NOTION_QUOTE_DB_ID, NOTION_QUOTE_ITEM_DB_ID 확인')
  process.exit(1)
}

const notion = new Client({ auth: NOTION_API_KEY })

// ─── 테스트 견적서 데이터 (20개) ─────────────────────────────────────
const INVOICES = [
  {
    number: 'Q-2026-001',
    client_name: '한국테크',
    client_company: '(주)한국테크',
    client_contact_name: '김철수 부장',
    client_email: 'cskim@koreatech.co.kr',
    client_phone: '02-1234-5678',
    project_name: '기업 홈페이지 리뉴얼',
    issue_date: '2026-01-05',
    valid_until: '2026-02-05',
    delivery_date: '2026-04-30',
    payment_terms: '계약 시 30%, 중도 30%, 납품 시 40%',
    notes: '디자인 시안 2회 수정 포함. 유지보수 3개월 무상 제공.',
    tax_invoice_required: true,
    status: 'approved',
    items: [
      { name: '기획 및 와이어프레임', qty: 1, price: 1500000, unit: '식', category: '기획', note: '사이트맵 및 화면 기획서 작성' },
      { name: 'UI/UX 디자인', qty: 1, price: 2500000, unit: '식', category: '디자인', note: 'PC/모바일 디자인 시안 포함' },
      { name: '프론트엔드 개발', qty: 1, price: 4000000, unit: '식', category: '개발', note: 'Next.js 기반 반응형 구현' },
      { name: 'CMS 연동', qty: 1, price: 1000000, unit: '식', category: '개발', note: '콘텐츠 관리 시스템 연동' },
    ],
  },
  {
    number: 'Q-2026-002',
    client_name: '스타트업랩',
    client_company: '(주)스타트업랩',
    client_contact_name: '이민준 대표',
    client_email: 'minjun@startuplab.io',
    client_phone: '010-9876-5432',
    project_name: '모바일 앱 MVP 개발',
    issue_date: '2026-01-10',
    valid_until: '2026-02-10',
    delivery_date: '2026-05-31',
    payment_terms: '계약 시 50%, 납품 시 50%',
    notes: '백엔드 API 서버 포함. AWS 초기 세팅 1회 무상.',
    tax_invoice_required: true,
    status: 'pending',
    items: [
      { name: '요구사항 분석 및 설계', qty: 1, price: 2000000, unit: '식', category: '기획', note: '' },
      { name: 'iOS/Android 앱 개발', qty: 1, price: 8000000, unit: '식', category: '개발', note: 'React Native 크로스플랫폼' },
      { name: 'REST API 개발', qty: 1, price: 3000000, unit: '식', category: '개발', note: 'Node.js + PostgreSQL' },
      { name: 'UI 디자인 (앱)', qty: 1, price: 2000000, unit: '식', category: '디자인', note: '' },
    ],
  },
  {
    number: 'Q-2026-003',
    client_name: '패션코리아',
    client_company: '(주)패션코리아',
    client_contact_name: '박지영 팀장',
    client_email: 'jypark@fashionkorea.com',
    client_phone: '02-3344-5566',
    project_name: '브랜드 아이덴티티 리뉴얼',
    issue_date: '2026-01-15',
    valid_until: '2026-02-15',
    delivery_date: '2026-03-31',
    payment_terms: '납품 완료 후 30일 이내',
    notes: '',
    tax_invoice_required: false,
    status: 'rejected',
    items: [
      { name: '브랜드 전략 수립', qty: 1, price: 1500000, unit: '식', category: '기획', note: '브랜드 포지셔닝 및 톤앤매너 정의' },
      { name: '로고 디자인', qty: 1, price: 2000000, unit: '식', category: '디자인', note: '3가지 시안 제공, 2회 수정' },
      { name: '브랜드 가이드라인', qty: 1, price: 1500000, unit: '식', category: '디자인', note: 'PDF 가이드북 제작' },
    ],
  },
  {
    number: 'Q-2026-004',
    client_name: '제조파트너',
    client_company: '(주)제조파트너',
    client_contact_name: '최동원 이사',
    client_email: 'dwchoi@mfgpartner.co.kr',
    client_phone: '032-7788-9900',
    project_name: 'ERP 시스템 구축',
    issue_date: '2026-01-20',
    valid_until: '2026-02-20',
    delivery_date: '2026-08-31',
    payment_terms: '계약 시 20%, 1차 산출물 30%, 2차 산출물 30%, 완료 20%',
    notes: '3개월 무상 하자보수 포함.',
    tax_invoice_required: true,
    status: 'pending',
    items: [
      { name: '현업 인터뷰 및 요구사항 정의', qty: 1, price: 3000000, unit: '식', category: '기획', note: '' },
      { name: 'ERP 시스템 설계', qty: 1, price: 4000000, unit: '식', category: '기획', note: 'ERD 및 시스템 아키텍처' },
      { name: 'ERP 개발 (백엔드)', qty: 3, price: 5000000, unit: '월', category: '개발', note: 'Java Spring Boot' },
      { name: 'ERP 개발 (프론트엔드)', qty: 2, price: 4000000, unit: '월', category: '개발', note: 'React + TypeScript' },
      { name: '데이터 마이그레이션', qty: 1, price: 2000000, unit: '식', category: '개발', note: '기존 엑셀 데이터 이관' },
    ],
  },
  {
    number: 'Q-2026-005',
    client_name: '이커머스몰',
    client_company: '(주)이커머스몰',
    client_contact_name: '정수현 대표',
    client_email: 'sh.jung@ecommercemall.kr',
    client_phone: '010-2233-4455',
    project_name: '온라인 쇼핑몰 구축',
    issue_date: '2026-01-25',
    valid_until: '2026-02-25',
    delivery_date: '2026-06-30',
    payment_terms: '계약 시 40%, 납품 시 60%',
    notes: 'PG 연동 포함. 상품 50개 등록 지원.',
    tax_invoice_required: true,
    status: 'approved',
    items: [
      { name: '쇼핑몰 기획 및 IA', qty: 1, price: 1500000, unit: '식', category: '기획', note: '' },
      { name: '쇼핑몰 UI 디자인', qty: 1, price: 3000000, unit: '식', category: '디자인', note: 'PC/모바일 전 페이지' },
      { name: '쇼핑몰 개발', qty: 1, price: 6000000, unit: '식', category: '개발', note: 'Next.js + Supabase' },
      { name: 'PG 결제 연동', qty: 1, price: 1000000, unit: '식', category: '개발', note: '토스페이먼츠 연동' },
      { name: '초기 콘텐츠 세팅', qty: 50, price: 10000, unit: '개', category: '기타', note: '상품 등록 및 카테고리 세팅' },
    ],
  },
  {
    number: 'Q-2026-006',
    client_name: '에듀테크',
    client_company: '(주)에듀테크',
    client_contact_name: '한지수 팀장',
    client_email: 'js.han@edutech.co.kr',
    client_phone: '02-5566-7788',
    project_name: '온라인 강의 플랫폼 개발',
    issue_date: '2026-02-01',
    valid_until: '2026-03-01',
    delivery_date: '2026-07-31',
    payment_terms: '계약 시 30%, 중도 40%, 납품 시 30%',
    notes: '동영상 스트리밍 서버 비용 별도.',
    tax_invoice_required: true,
    status: 'pending',
    items: [
      { name: '서비스 기획', qty: 1, price: 2000000, unit: '식', category: '기획', note: '강의 플랫폼 UX 플로우' },
      { name: 'UI/UX 디자인', qty: 1, price: 2500000, unit: '식', category: '디자인', note: '' },
      { name: '플랫폼 개발', qty: 1, price: 7000000, unit: '식', category: '개발', note: '수강 관리, 결제, 강의 재생' },
      { name: '관리자 대시보드', qty: 1, price: 2000000, unit: '식', category: '개발', note: '강의 등록 및 수강생 관리' },
    ],
  },
  {
    number: 'Q-2026-007',
    client_name: '헬스케어솔루션',
    client_company: '(주)헬스케어솔루션',
    client_contact_name: '강현우 부장',
    client_email: 'hw.kang@healthsol.co.kr',
    client_phone: '031-8899-0011',
    project_name: '건강 관리 앱 UX 컨설팅',
    issue_date: '2026-02-03',
    valid_until: '2026-03-03',
    delivery_date: '2026-04-15',
    payment_terms: '월 말일 지급',
    notes: '월 2회 대면 미팅 포함.',
    tax_invoice_required: false,
    status: 'approved',
    items: [
      { name: 'UX 리서치 및 분석', qty: 1, price: 1500000, unit: '식', category: '기획', note: '사용자 인터뷰 10명' },
      { name: 'UX 컨설팅', qty: 2, price: 800000, unit: '월', category: '컨설팅', note: '월 2회 미팅' },
      { name: '개선 방안 리포트', qty: 1, price: 700000, unit: '식', category: '기획', note: '' },
    ],
  },
  {
    number: 'Q-2026-008',
    client_name: '카페24',
    client_company: '(주)카페24인테리어',
    client_contact_name: '오세진 대표',
    client_email: 'sj.oh@cafe24interior.com',
    client_phone: '010-4455-6677',
    project_name: '인테리어 브랜드 홈페이지',
    issue_date: '2026-02-05',
    valid_until: '2026-03-05',
    delivery_date: '2026-04-30',
    payment_terms: '납품 후 14일 이내',
    notes: '',
    tax_invoice_required: false,
    status: 'pending',
    items: [
      { name: '홈페이지 기획', qty: 1, price: 800000, unit: '식', category: '기획', note: '' },
      { name: '홈페이지 디자인', qty: 1, price: 1800000, unit: '식', category: '디자인', note: 'PC 전용 디자인' },
      { name: '홈페이지 개발', qty: 1, price: 2200000, unit: '식', category: '개발', note: 'WordPress 기반' },
    ],
  },
  {
    number: 'Q-2026-009',
    client_name: '핀테크코리아',
    client_company: '(주)핀테크코리아',
    client_contact_name: '윤서연 이사',
    client_email: 'sy.yoon@fintechkorea.com',
    client_phone: '02-2233-4400',
    project_name: '금융 대시보드 UI 개발',
    issue_date: '2026-02-07',
    valid_until: '2026-03-07',
    delivery_date: '2026-05-15',
    payment_terms: '계약 시 50%, 납품 시 50%',
    notes: '금융 보안 요건 준수 필요.',
    tax_invoice_required: true,
    status: 'approved',
    items: [
      { name: 'UI 시스템 설계', qty: 1, price: 2000000, unit: '식', category: '기획', note: '컴포넌트 설계 포함' },
      { name: '대시보드 UI 개발', qty: 1, price: 5000000, unit: '식', category: '개발', note: 'React + Chart.js' },
      { name: '단위 테스트 작성', qty: 80, price: 10000, unit: '시간', category: '개발', note: 'Jest 기반' },
    ],
  },
  {
    number: 'Q-2026-010',
    client_name: '글로벌트레이드',
    client_company: '(주)글로벌트레이드',
    client_contact_name: '신민철 과장',
    client_email: 'mc.shin@globaltrade.kr',
    client_phone: '032-1122-3344',
    project_name: '수출입 관리 시스템',
    issue_date: '2026-02-10',
    valid_until: '2026-03-10',
    delivery_date: '2026-09-30',
    payment_terms: '계약 시 25%, 설계 완료 25%, 개발 완료 25%, 검수 완료 25%',
    notes: '다국어(한/영) 지원 포함.',
    tax_invoice_required: true,
    status: 'pending',
    items: [
      { name: '시스템 분석 및 설계', qty: 1, price: 4000000, unit: '식', category: '기획', note: '' },
      { name: '백엔드 개발', qty: 4, price: 5000000, unit: '월', category: '개발', note: 'Java 17 + Spring Boot 3' },
      { name: '프론트엔드 개발', qty: 3, price: 4000000, unit: '월', category: '개발', note: 'Vue 3 + TypeScript' },
      { name: '다국어 적용', qty: 1, price: 1500000, unit: '식', category: '개발', note: 'i18n 한/영 처리' },
    ],
  },
  {
    number: 'Q-2026-011',
    client_name: '마케팅에이전시',
    client_company: '(주)마케팅에이전시',
    client_contact_name: '임지훈 대표',
    client_email: 'jh.lim@magency.co.kr',
    client_phone: '010-6677-8899',
    project_name: '퍼포먼스 마케팅 대시보드',
    issue_date: '2026-02-12',
    valid_until: '2026-03-12',
    delivery_date: '2026-04-30',
    payment_terms: '납품 완료 후 30일',
    notes: '',
    tax_invoice_required: false,
    status: 'approved',
    items: [
      { name: '대시보드 기획', qty: 1, price: 1000000, unit: '식', category: '기획', note: '광고 플랫폼 API 연동 설계' },
      { name: '대시보드 개발', qty: 1, price: 3500000, unit: '식', category: '개발', note: 'Google/Meta Ads API 연동' },
      { name: 'Google Data Studio 연결', qty: 1, price: 500000, unit: '식', category: '개발', note: '' },
    ],
  },
  {
    number: 'Q-2026-012',
    client_name: '스마트팜',
    client_company: '(주)스마트팜테크',
    client_contact_name: '류성호 팀장',
    client_email: 'sh.ryu@smartfarmtech.co.kr',
    client_phone: '054-3344-5566',
    project_name: 'IoT 모니터링 웹 대시보드',
    issue_date: '2026-02-13',
    valid_until: '2026-03-13',
    delivery_date: '2026-06-15',
    payment_terms: '계약 시 40%, 납품 60%',
    notes: 'MQTT 프로토콜 연동 포함.',
    tax_invoice_required: true,
    status: 'pending',
    items: [
      { name: 'IoT 대시보드 기획', qty: 1, price: 1500000, unit: '식', category: '기획', note: 'MQTT 데이터 플로우 설계' },
      { name: '실시간 모니터링 개발', qty: 1, price: 4000000, unit: '식', category: '개발', note: 'WebSocket + Chart.js' },
      { name: '알림 시스템 개발', qty: 1, price: 1500000, unit: '식', category: '개발', note: '임계값 초과 시 SMS/Email 발송' },
      { name: '모바일 앱 개발', qty: 1, price: 3000000, unit: '식', category: '개발', note: 'React Native' },
    ],
  },
  {
    number: 'Q-2026-013',
    client_name: '법률사무소',
    client_company: '법무법인 한결',
    client_contact_name: '조현석 변호사',
    client_email: 'hs.cho@hangyul.law',
    client_phone: '02-7788-9900',
    project_name: '법무 사이트 리뉴얼',
    issue_date: '2026-02-14',
    valid_until: '2026-03-14',
    delivery_date: '2026-05-31',
    payment_terms: '계약 시 50%, 납품 50%',
    notes: '법률 정보 콘텐츠 입력 지원 포함.',
    tax_invoice_required: true,
    status: 'pending',
    items: [
      { name: '사이트 기획 및 설계', qty: 1, price: 1000000, unit: '식', category: '기획', note: '' },
      { name: '웹 디자인', qty: 1, price: 2000000, unit: '식', category: '디자인', note: '신뢰감 있는 전문가 스타일' },
      { name: '웹 개발', qty: 1, price: 2500000, unit: '식', category: '개발', note: 'CMS 포함' },
      { name: '콘텐츠 마이그레이션', qty: 1, price: 500000, unit: '식', category: '기타', note: '기존 콘텐츠 이관' },
    ],
  },
  {
    number: 'Q-2026-014',
    client_name: '헬스짐',
    client_company: '헬스짐코리아',
    client_contact_name: '김상현 대표',
    client_email: 'sh.kim@healthgym.kr',
    client_phone: '010-1122-3344',
    project_name: '헬스장 예약 시스템 앱',
    issue_date: '2026-02-15',
    valid_until: '2026-03-15',
    delivery_date: '2026-05-15',
    payment_terms: '계약 시 50%, 납품 50%',
    notes: '',
    tax_invoice_required: false,
    status: 'rejected',
    items: [
      { name: '앱 기획 및 UI 설계', qty: 1, price: 1000000, unit: '식', category: '기획', note: '' },
      { name: '앱 개발 (iOS/Android)', qty: 1, price: 5000000, unit: '식', category: '개발', note: 'React Native' },
      { name: '예약 백엔드 API', qty: 1, price: 2000000, unit: '식', category: '개발', note: 'Node.js + Firebase' },
    ],
  },
  {
    number: 'Q-2026-015',
    client_name: '물류센터',
    client_company: '(주)빠른물류',
    client_contact_name: '박태준 이사',
    client_email: 'tj.park@quicklogis.co.kr',
    client_phone: '031-5566-7788',
    project_name: '물류 관리 시스템 (WMS)',
    issue_date: '2026-02-17',
    valid_until: '2026-03-17',
    delivery_date: '2026-10-31',
    payment_terms: '계약 시 20%, 1차 40%, 완료 40%',
    notes: '바코드 스캐너 연동 포함.',
    tax_invoice_required: true,
    status: 'pending',
    items: [
      { name: 'WMS 요구사항 분석', qty: 1, price: 3000000, unit: '식', category: '기획', note: '현장 인터뷰 포함' },
      { name: 'WMS 백엔드 개발', qty: 5, price: 6000000, unit: '월', category: '개발', note: 'Java Spring Boot' },
      { name: 'WMS 프론트엔드', qty: 3, price: 5000000, unit: '월', category: '개발', note: 'React + Ant Design' },
      { name: '바코드 스캐너 연동', qty: 1, price: 1500000, unit: '식', category: '개발', note: '웨어하우스 기기 호환' },
    ],
  },
  {
    number: 'Q-2026-016',
    client_name: '미디어컴퍼니',
    client_company: '(주)미디어컴퍼니',
    client_contact_name: '안유진 팀장',
    client_email: 'yj.ahn@mediacompany.kr',
    client_phone: '02-3344-5577',
    project_name: '뉴스 포털 사이트 개편',
    issue_date: '2026-02-18',
    valid_until: '2026-03-18',
    delivery_date: '2026-06-30',
    payment_terms: '계약 시 30%, 디자인 완료 30%, 개발 완료 40%',
    notes: '광고 플랫폼 연동 포함.',
    tax_invoice_required: true,
    status: 'approved',
    items: [
      { name: '포털 기획 및 IA', qty: 1, price: 2000000, unit: '식', category: '기획', note: '콘텐츠 구조 설계' },
      { name: 'UI/UX 디자인', qty: 1, price: 3000000, unit: '식', category: '디자인', note: 'PC/모바일 전 페이지' },
      { name: '프론트엔드 개발', qty: 1, price: 5000000, unit: '식', category: '개발', note: 'Next.js SSR 구현' },
      { name: 'CMS 개발', qty: 1, price: 3000000, unit: '식', category: '개발', note: '기사 작성 및 관리 시스템' },
      { name: '광고 플랫폼 연동', qty: 1, price: 1000000, unit: '식', category: '개발', note: 'Google AdSense' },
    ],
  },
  {
    number: 'Q-2026-017',
    client_name: '커피체인',
    client_company: '(주)커피랩',
    client_contact_name: '유혜린 마케터',
    client_email: 'hr.yoo@coffeelab.co.kr',
    client_phone: '010-9900-8877',
    project_name: '브랜드 리뉴얼 및 패키지 디자인',
    issue_date: '2026-02-19',
    valid_until: '2026-03-19',
    delivery_date: '2026-05-31',
    payment_terms: '납품 완료 후 30일',
    notes: '원본 AI 파일 납품 포함.',
    tax_invoice_required: false,
    status: 'pending',
    items: [
      { name: '브랜드 전략 컨설팅', qty: 1, price: 1500000, unit: '식', category: '컨설팅', note: '' },
      { name: '로고 리뉴얼', qty: 1, price: 2000000, unit: '식', category: '디자인', note: '3가지 시안 제공' },
      { name: '포장재 디자인', qty: 5, price: 500000, unit: '건', category: '디자인', note: '컵, 봉투, 박스, 카드, 스티커' },
    ],
  },
  {
    number: 'Q-2026-018',
    client_name: '건설부동산',
    client_company: '(주)한우리건설',
    client_contact_name: '장동철 부장',
    client_email: 'dc.jang@hanwoori.co.kr',
    client_phone: '02-6677-8800',
    project_name: '분양 홈페이지 및 인터랙티브 지도',
    issue_date: '2026-02-20',
    valid_until: '2026-03-20',
    delivery_date: '2026-04-30',
    payment_terms: '계약 시 50%, 납품 50%',
    notes: '카카오맵 API 연동 포함.',
    tax_invoice_required: true,
    status: 'approved',
    items: [
      { name: '분양 홈페이지 기획', qty: 1, price: 1000000, unit: '식', category: '기획', note: '' },
      { name: '홈페이지 디자인', qty: 1, price: 2500000, unit: '식', category: '디자인', note: '분양 콘셉트 프리미엄 스타일' },
      { name: '홈페이지 개발', qty: 1, price: 3000000, unit: '식', category: '개발', note: 'Next.js + 애니메이션' },
      { name: '인터랙티브 단지 지도', qty: 1, price: 1500000, unit: '식', category: '개발', note: 'SVG + 카카오맵 연동' },
    ],
  },
  {
    number: 'Q-2026-019',
    client_name: '스타트업알파',
    client_company: 'Alpha Startup',
    client_contact_name: 'David Kim',
    client_email: 'david@alphastartup.io',
    client_phone: '010-5544-3322',
    project_name: 'SaaS 제품 MVP 개발',
    issue_date: '2026-02-21',
    valid_until: '2026-03-21',
    delivery_date: '2026-07-31',
    payment_terms: 'Monthly (3 months)',
    notes: 'Stripe 결제 연동 포함.',
    tax_invoice_required: false,
    status: 'pending',
    items: [
      { name: 'Product Design (UI/UX)', qty: 1, price: 3000000, unit: '식', category: '디자인', note: 'Figma 파일 납품' },
      { name: 'Frontend Development', qty: 1, price: 4000000, unit: '식', category: '개발', note: 'Next.js + Tailwind CSS' },
      { name: 'Backend & API', qty: 1, price: 4000000, unit: '식', category: '개발', note: 'Node.js + Supabase' },
      { name: 'Stripe Integration', qty: 1, price: 1000000, unit: '식', category: '개발', note: '구독 결제 플로우' },
    ],
  },
  {
    number: 'Q-2026-020',
    client_name: '공공기관',
    client_company: '한국디지털혁신원',
    client_contact_name: '이재원 주임',
    client_email: 'jw.lee@kdi.or.kr',
    client_phone: '02-1111-2222',
    project_name: '디지털 전환 컨설팅',
    issue_date: '2026-02-22',
    valid_until: '2026-03-22',
    delivery_date: '2026-05-31',
    payment_terms: '정부 지급 기준(계약 후 60일)',
    notes: '보안 준수 확약서 제출 필요.',
    tax_invoice_required: true,
    status: 'pending',
    items: [
      { name: '현황 분석 및 진단', qty: 1, price: 3000000, unit: '식', category: '컨설팅', note: 'AS-IS 분석' },
      { name: 'DX 로드맵 수립', qty: 1, price: 4000000, unit: '식', category: '컨설팅', note: 'TO-BE 전략 및 단계별 계획' },
      { name: '보고서 작성', qty: 1, price: 1000000, unit: '식', category: '기획', note: '최종 보고서 + PPT' },
      { name: '임원 보고 지원', qty: 2, price: 500000, unit: '건', category: '컨설팅', note: '중간/최종 보고' },
    ],
  },
]

// ─── 견적서 생성 ─────────────────────────────────────────────────────
async function createInvoice(inv) {
  const supplyAmount = inv.items.reduce((sum, item) => sum + item.qty * item.price, 0)
  const vat = Math.round(supplyAmount * 0.1)
  const totalAmount = supplyAmount + vat

  const properties = {
    '이름': { title: [{ text: { content: inv.number } }] },
    '고객명': { rich_text: [{ text: { content: inv.client_name } }] },
    '발행일': { date: { start: inv.issue_date } },
    '유효기간': { date: { start: inv.valid_until } },
    '합계금액': { number: totalAmount },
    '상태': { select: { name: inv.status } },
    '고객 회사명': { rich_text: [{ text: { content: inv.client_company } }] },
    '고객 담당자명': { rich_text: [{ text: { content: inv.client_contact_name } }] },
    '클라이언트 이메일': { email: inv.client_email },
    '클라이언트 연락처': { phone_number: inv.client_phone },
    '프로젝트명': { rich_text: [{ text: { content: inv.project_name } }] },
    '납기일': inv.delivery_date ? { date: { start: inv.delivery_date } } : { date: null },
    '공급가액': { number: supplyAmount },
    '결제 조건': { rich_text: inv.payment_terms ? [{ text: { content: inv.payment_terms } }] : [] },
    '비고': { rich_text: inv.notes ? [{ text: { content: inv.notes } }] : [] },
    '세금계산서 발행 여부': { checkbox: inv.tax_invoice_required },
  }

  const page = await notion.pages.create({
    parent: { database_id: NOTION_QUOTE_DB_ID },
    properties,
  })

  return { pageId: page.id, supplyAmount, totalAmount }
}

// ─── 견적항목 생성 ───────────────────────────────────────────────────
async function createInvoiceItem(item, invoicePageId) {
  await notion.pages.create({
    parent: { database_id: NOTION_QUOTE_ITEM_DB_ID },
    properties: {
      '이름': { title: [{ text: { content: item.name } }] },
      '수량': { number: item.qty },
      '단가': { number: item.price },
      '단위': { select: { name: item.unit } },
      '카테고리': { select: { name: item.category } },
      '비고': { rich_text: item.note ? [{ text: { content: item.note } }] : [] },
      '견적서': { relation: [{ id: invoicePageId }] },
    },
  })
}

// ─── 메인 ────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 테스트 견적서 20개 생성 시작\n')
  console.log('─'.repeat(55))

  const results = []

  for (const inv of INVOICES) {
    process.stdout.write(`\n📄 ${inv.number} — ${inv.project_name} (${inv.status})\n`)

    try {
      // 견적서 생성
      const { pageId, supplyAmount, totalAmount } = await createInvoice(inv)
      console.log(`   ✅ 견적서 생성 완료 (공급가액: ${supplyAmount.toLocaleString()}원 / 합계: ${totalAmount.toLocaleString()}원)`)

      // 견적 항목 생성
      for (const item of inv.items) {
        await createInvoiceItem(item, pageId)
        console.log(`   📌 항목: ${item.name} (${item.qty}${item.unit} × ${item.price.toLocaleString()}원)`)
      }

      results.push({ number: inv.number, pageId, status: 'ok' })
    } catch (err) {
      console.error(`   ❌ 오류: ${err.message}`)
      if (err.body) console.error(`      상세: ${JSON.stringify(err.body).slice(0, 200)}`)
      results.push({ number: inv.number, status: 'error', error: err.message })
    }

    // Notion API Rate Limit 방지 (3 req/s)
    await new Promise(r => setTimeout(r, 400))
  }

  console.log('\n' + '─'.repeat(55))
  const ok = results.filter(r => r.status === 'ok').length
  const fail = results.filter(r => r.status === 'error').length
  console.log(`\n🎉 완료! 성공: ${ok}개 / 실패: ${fail}개`)

  if (fail > 0) {
    console.log('\n❌ 실패 목록:')
    results.filter(r => r.status === 'error').forEach(r =>
      console.log(`   • ${r.number}: ${r.error}`)
    )
  }

  console.log('\n📊 생성된 견적서 ID:')
  results.filter(r => r.status === 'ok').forEach(r =>
    console.log(`   • /invoice/${r.pageId}  →  ${r.number}`)
  )
}

main().catch(err => {
  console.error('\n❌ 치명적 오류:', err.message ?? err)
  process.exit(1)
})
