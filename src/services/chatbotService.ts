import {
  OTHER_HELP_STEP_ID,
  RESTART_STEP_ID,
  STEP_MAP,
  type BotStep,
  type ChatOption,
} from '../pages/Chatbot/chatbotScript'

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

/**
 * 자유 입력이 스크립트에 없을 때(현재 스텝에 `freeTextNext`가 없을 때) 보여주는 안내.
 * 정해진 답변만 다시 보여주는 대신, 하던 대화를 이어갈지·다른 도움을 받을지 고르게 한다.
 * `resumeStepId`가 원래 스텝과 같은 STEP_MAP 키라서 "이어서 진행하기"를 누르면
 * `pickStep`이 그 스텝을 그대로 다시 돌려준다 — 원래 있던 선택지로 복귀하는 셈이다.
 */
function buildClarifyStep(currentStepId: string | null): BotStep {
  const currentStep = currentStepId ? STEP_MAP[currentStepId] : null
  const resumeStepId = currentStep?.id ?? RESTART_STEP_ID

  return {
    id: resumeStepId,
    blocks: [
      { kind: 'p', text: '혹시 다른 도움이 필요하신가요?' },
      { kind: 'p', text: '지금 하던 내용을 이어가거나, 다른 도움을 받을 수 있어요.' },
    ],
    options: [
      { id: 'continue-flow', label: '이어서 진행하기', next: resumeStepId },
      { id: 'other-help', label: '다른 도움 받기', next: OTHER_HELP_STEP_ID },
    ],
  }
}

/**
 * mock 챗봇에 한 턴을 요청한다.
 * 시연 중 임의 네트워크 오류를 발생시키지 않는다.
 */
export async function requestChatbotReply(request: ChatbotRequest): Promise<ChatbotReply> {
  const [min, max] = MOCK_DELAY_RANGE_MS
  await wait(min + Math.random() * (max - min))

  if (request.kind === 'option') {
    return { kind: 'step', step: pickStep(request.option.next) }
  }

  const currentStep = request.currentStepId ? STEP_MAP[request.currentStepId] : null
  if (currentStep?.freeTextNext) {
    return { kind: 'step', step: pickStep(currentStep.freeTextNext) }
  }

  return { kind: 'clarify', step: buildClarifyStep(request.currentStepId) }
}
