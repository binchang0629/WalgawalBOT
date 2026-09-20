import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useSession from '../../hooks/useSession'
import useWizardBack from '../../hooks/useWizardBack'
import { BACK_FALLBACK, PATHS } from '../../routes/paths'
import { requestChatbotReply } from '../../services/chatbotService'
import type { ChatOption } from './chatbotScript'
import { CASE_ROUTED_OPTION_IDS, GUEST_MENU_STEP_ID, INITIAL_OPTIONS, RESTART_STEP_ID, STEP_MAP } from './chatbotScript'
import type { ChatTurn } from './types'
import ChatbotHeader from './components/ChatbotHeader'
import ChatEmptyState from './components/ChatEmptyState'
import ChatOptionButtons from './components/ChatOptionButtons'
import BotMessageContent from './components/BotMessageContent'
import ChatbotComposer from './components/ChatbotComposer'
import botLogo from '../../assets/chatbot/figma/imgBotLogo.png'
import './Chatbot.css'

/**
 * 챗봇(판멍이) 대화 화면.
 * Figma `Chatbot / Initial`(1951:4252) · `Chatbot / Conversation`(1951:4539) ·
 * `Chatbot / Conversation02`(1951:4051) 세 프레임은 같은 화면의 상태 3개다.
 * 대화가 없으면 첫 화면, 있으면 대화창을 보여주는 방식으로 한 페이지에서 표현한다.
 *
 * 대화 내용은 백엔드가 없어 mock 스크립트(`chatbotScript.ts`)를 따라간다. (PROJECT_SPEC.md §6)
 */

function formatChatTime(date: Date) {
  const hours24 = date.getHours()
  const period = hours24 < 12 ? '오전' : '오후'
  const hour12 = hours24 % 12 === 0 ? 12 : hours24 % 12
  const minute = date.getMinutes().toString().padStart(2, '0')
  return `${period} ${hour12}:${minute}`
}

let turnSeq = 0
function nextTurnId() {
  turnSeq += 1
  return `turn-${turnSeq}`
}

/** 선택한 버튼이 오렌지색으로 보이는 시간. 이후 선택지 그룹이 사라지고 사용자 메시지가 이어 붙는다. */
const SELECT_FEEDBACK_MS = 320

function ChatbotPage() {
  const navigate = useNavigate()
  const handleBack = useWizardBack(BACK_FALLBACK.chatbot)
  const { personaId, sessionStatus } = useSession()

  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [activeStepId, setActiveStepId] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  /** 선택지를 고른 직후, 오렌지색이 보이는 동안 같은 그룹의 다른 버튼을 막기 위한 표시. */
  const [pendingSelection, setPendingSelection] = useState<{ turnId: string; optionId: string } | null>(null)

  const bodyRef = useRef<HTMLDivElement>(null)
  const selectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [turns, isPending])

  useEffect(() => {
    return () => {
      if (selectTimeoutRef.current) clearTimeout(selectTimeoutRef.current)
    }
  }, [])

  /**
   * 지금은 곽지훈(B)만 최근에 접수한 사건이 있는 데모 상태다. (PROJECT_SPEC.md §9-1)
   * 실제 서비스에서는 로그인한 사용자의 최근 사건 목록에서 판단해야 한다.
   *
   * 로그인 여부를 먼저 보고, 로그인된 경우에만 계정(personaId)으로 나눈다.
   * 비로그인이면 어떤 계정을 선택해 뒀든 사건 데이터에 접근할 수 없다 — 계정 선택은
   * 로그인 후에만 의미가 있는 시연 상태이지, 그 자체로 로그인을 대신하지 않는다. (PROJECT_SPEC.md §7-5)
   */
  const hasRecentCase = sessionStatus === 'authenticated' && personaId === 'B'

  /**
   * "다른 질문 할게요"(id: 'more')는 여러 스텝에서 공유하는 버튼이라 기본은 그대로 `option.next`
   * (= restart, 5개 메뉴)를 따른다. 다만 로그인 전 상태에서 `caseIntroEmpty`(사건 없음 안내)
   * 바로 다음에 눌렀을 때만 "내 사건에 대해 물어볼게요"를 뺀 `guestMenu`로 보낸다 —
   * 로그인 후 시나리오나 다른 스텝의 "다른 질문 할게요"는 건드리지 않는다.
   */
  const resolveNextStepId = (option: ChatOption) => {
    if (CASE_ROUTED_OPTION_IDS.has(option.id) && !hasRecentCase) return 'caseIntroEmpty'
    if (option.id === 'more' && activeStepId === 'caseIntroEmpty' && sessionStatus !== 'authenticated') {
      return GUEST_MENU_STEP_ID
    }
    return option.next
  }

  const runRequest = async (
    request: { kind: 'option'; option: ChatOption } | { kind: 'text'; text: string },
  ) => {
    setIsPending(true)

    try {
      const reply = await requestChatbotReply(
        request.kind === 'option'
          ? { kind: 'option', option: { ...request.option, next: resolveNextStepId(request.option) } }
          : { kind: 'text', currentStepId: activeStepId },
      )

      setTurns((prev) => [...prev, { id: nextTurnId(), role: 'bot', step: reply.step, at: Date.now() }])
      if (reply.kind === 'step') {
        setActiveStepId(reply.step.id)
      }
    } catch {
      // 스크립트 연결이 잘못된 경우에도 데모 오류 화면 대신 선택 메뉴로 돌아간다.
      const restartStep = STEP_MAP[RESTART_STEP_ID]
      setTurns((prev) => [...prev, { id: nextTurnId(), role: 'bot', step: restartStep, at: Date.now() }])
      setActiveStepId(restartStep.id)
    } finally {
      setIsPending(false)
    }
  }

  /**
   * 선택지를 골랐을 때의 동작.
   *
   * `turnId`가 있으면(대화 중 챗봇 메시지에 이어지는 선택 영역) 고른 버튼을 잠깐
   * 오렌지색으로 표시한 뒤, 그 선택지 그룹을 통째로 지우고 고른 문구를 사용자
   * 메시지로 남긴다. `turnId`가 없으면 대화 시작 전 첫 화면(`ChatEmptyState`)의
   * 선택이라 보여줄 이전 턴이 없으므로 바로 사용자 메시지를 추가한다.
   */
  const handleSelectOption = (option: ChatOption, turnId?: string) => {
    if (isPending || pendingSelection) return

    if (option.id === 'toSubmit') {
      navigate(PATHS.caseSubmit)
      return
    }
    if (option.id === 'toPlaza' || option.id === 'toPlaza2') {
      navigate(PATHS.plaza)
      return
    }

    if (!turnId) {
      setTurns((prev) => [...prev, { id: nextTurnId(), role: 'user', text: option.label, at: Date.now() }])
      void runRequest({ kind: 'option', option })
      return
    }

    setPendingSelection({ turnId, optionId: option.id })
    setTurns((prev) =>
      prev.map((turn) => (turn.id === turnId && turn.role === 'bot' ? { ...turn, selectedOptionId: option.id } : turn)),
    )

    selectTimeoutRef.current = setTimeout(() => {
      setTurns((prev) => [
        ...prev.map((turn) => (turn.id === turnId && turn.role === 'bot' ? { ...turn, optionsHidden: true } : turn)),
        { id: nextTurnId(), role: 'user', text: option.label, at: Date.now() },
      ])
      setPendingSelection(null)
      void runRequest({ kind: 'option', option })
    }, SELECT_FEEDBACK_MS)
  }

  const handleSend = (text: string) => {
    if (isPending) return
    setTurns((prev) => [...prev, { id: nextTurnId(), role: 'user', text, at: Date.now() }])
    void runRequest({ kind: 'text', text })
  }

  const hasStarted = turns.length > 0

  return (
    <div className="chatbot-page">
      <ChatbotHeader onBack={handleBack} />

      <div className="chatbot-viewport">
        <div className="chatbot-body" ref={bodyRef} aria-live="polite">
          {!hasStarted && (
            <ChatEmptyState options={INITIAL_OPTIONS} onSelect={handleSelectOption} disabled={isPending} />
          )}

          {hasStarted && (
            <div className="chatbot-thread">
              {turns.map((turn, index) => {
                const isLatest = index === turns.length - 1

                if (turn.role === 'user') {
                  return (
                    <div key={turn.id} className="chatbot-msg chatbot-msg--user">
                      <p className="chatbot-bubble--user">{turn.text}</p>
                      <span className="chatbot-msg__time">{formatChatTime(new Date(turn.at))}</span>
                    </div>
                  )
                }

                const { step } = turn
                return (
                  <div
                    key={turn.id}
                    className={
                      step.compact ? 'chatbot-msg chatbot-msg--bot chatbot-msg--compact' : 'chatbot-msg chatbot-msg--bot'
                    }
                  >
                    <div className="chatbot-bot-row">
                      <span className="chatbot-bot-avatar">
                        <img src={botLogo} alt="" width={step.compact ? 30 : 40} height={step.compact ? 30 : 40} />
                      </span>
                      <div className="chatbot-bot-content">
                        <BotMessageContent step={step} />
                      </div>
                    </div>

                    {step.options && step.options.length > 0 && !turn.optionsHidden && (
                      <ChatOptionButtons
                        options={step.options}
                        interactive={isLatest && !isPending && !pendingSelection}
                        selectedOptionId={turn.selectedOptionId}
                        onSelect={(option) => handleSelectOption(option, turn.id)}
                      />
                    )}
                  </div>
                )
              })}

              {isPending && (
                <div className="chatbot-msg chatbot-msg--bot">
                  <div className="chatbot-bot-row">
                    <span className="chatbot-bot-avatar">
                      <img src={botLogo} alt="" width={40} height={40} />
                    </span>
                    <div className="chatbot-typing" role="status" aria-label="판멍이가 답변을 준비하고 있어요">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <ChatbotComposer disabled={isPending} onSend={handleSend} />
      </div>
    </div>
  )
}

export default ChatbotPage
