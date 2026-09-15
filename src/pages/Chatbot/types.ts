import type { BotStep } from './chatbotScript'

/** 대화창에 실제로 쌓이는 한 줄. STEP_MAP의 원본 스텝과는 분리해서 관리한다. */
export type ChatTurn =
  | { id: string; role: 'user'; text: string; at: number }
  | {
      id: string
      role: 'bot'
      step: BotStep
      at: number
      selectedOptionId?: string
      /** 선택 완료 뒤 짧은 오렌지색 표시가 끝나면 true — 이 턴의 선택지 버튼을 더 이상 그리지 않는다. */
      optionsHidden?: boolean
    }
