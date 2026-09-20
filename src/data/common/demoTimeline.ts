import { demoEventAt, formatDemoDateTime, formatElapsedMinutes } from './demoClock'

/** 정적 시연 사건들의 순서와 간격을 첫 방문 시각에 맞춰 옮긴다. */
export const demoTimeline = {
  weddingGift: {
    createdAt: formatDemoDateTime(demoEventAt(420), true),
    ageMinutes: 420,
    age: formatElapsedMinutes(420),
  },
  company: {
    createdAt: formatDemoDateTime(demoEventAt(3475)),
    ageMinutes: 3475,
    age: formatElapsedMinutes(3475),
  },
} as const
