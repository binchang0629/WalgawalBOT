/**
 * 정적 시연 데이터가 공유하는 앱 내부 기준 시각.
 * 실제 기기 날짜가 아니라, 축의금 사건의 작성 시각과 `7시간 전` 표기를 기준으로 한다.
 */
export const demoTimeline = {
  now: '2026-09-08T07:08:34+09:00',
  weddingGift: {
    createdAt: '26/09/08 · 00:08:34',
    age: '7시간 전',
  },
  company: {
    createdAt: '26/09/05 · 21:13',
    age: '2일 전',
  },
} as const
