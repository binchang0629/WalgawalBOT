import type { BotStep } from './chatbotScript'

/** 대화창에 실제로 쌓이는 한 줄. STEP_MAP의 원본 스텝과는 분리해서 관리한다. */
export type ChatTurn =
  | { id: string; role: 'user'; text: string; at: number }
  | { id: string; role: 'bot'; step: BotStep; at: number; selectedOptionId?: string }
  | { id: string; role: 'bot-error'; at: number }
