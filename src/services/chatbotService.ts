import { RESTART_STEP_ID, STEP_MAP, type BotStep, type ChatOption } from '../pages/Chatbot/chatbotScript'

/**
 * 챗봇 응답 처리 경계.
 *
 * 지금은 백엔드가 없어 정해진 스크립트(`chatbotScript.ts`)를 mock으로 따라간다.
 * 나중에 실제 AI API를 붙일 때는 이 함수의 내부만 바꾸면 되고,
 * 화면(ChatbotPage)은 `ChatbotReply` 모양만 그대로 받으면 된다. (PROJECT_SPEC.md §6)
 *
 * 실제 키를 여기 두지 않는다 — 지금은 mock이라 필요 없지만,
 * 나중에 실제 API로 바꿔도 비밀 키는 서버 쪽에 두고 브라우저 코드에는 넣지 않는다.
 */

export type ChatbotRequest =
  | { kind: 'option'; option: ChatOption }
  | { kind: 'text'; currentStepId: string | null }

export type ChatbotReply =
  /** 스크립트를 따라 다음 스텝으로 이동 */
  | { kind: 'step'; step: BotStep }
  /** 자유 입력이 스크립트에 없어 같은 선택지를 다시 보여주는 경우 */
  | { kind: 'clarify'; step: BotStep }

const MOCK_DELAY_RANGE_MS: [number, number] = [500, 900]
/** 재시도 동작이 실제로 검증되도록 낮은 확률로 실패를 재현한다. (PROJECT_SPEC.md §6) */
const MOCK_FAILURE_RATE = 0.12

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function pickStep(stepId: string): BotStep {
  const step = STEP_MAP[stepId]
  if (!step) {
    throw new Error(`알 수 없는 챗봇 스텝입니다: ${stepId}`)
  }
  return step
}

function buildClarifyStep(currentStepId: string | null): BotStep {
  const currentStep = currentStepId ? STEP_MAP[currentStepId] : null
  const fallbackOptions = currentStep?.options ?? STEP_MAP[RESTART_STEP_ID].options

  return {
    id: currentStep?.id ?? RESTART_STEP_ID,
    blocks: [{ kind: 'p', text: '음, 지금은 정해진 답변만 드릴 수 있어요. 아래에서 골라볼래요?' }],
    optionsLayout: currentStep?.optionsLayout,
    options: fallbackOptions,
  }
}

/**
 * mock 챗봇에 한 턴을 요청한다.
 * 호출부는 이 함수가 실패(reject)할 수 있다는 것을 전제로 재시도 UI를 둔다.
 */
export async function requestChatbotReply(request: ChatbotRequest): Promise<ChatbotReply> {
  const [min, max] = MOCK_DELAY_RANGE_MS
  await wait(min + Math.random() * (max - min))

  if (Math.random() < MOCK_FAILURE_RATE) {
    throw new Error('mock-network-error')
  }

  if (request.kind === 'option') {
    return { kind: 'step', step: pickStep(request.option.next) }
  }

  const currentStep = request.currentStepId ? STEP_MAP[request.currentStepId] : null
  if (currentStep?.freeTextNext) {
    return { kind: 'step', step: pickStep(currentStep.freeTextNext) }
  }

  return { kind: 'clarify', step: buildClarifyStep(request.currentStepId) }
}
