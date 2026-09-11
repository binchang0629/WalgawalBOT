import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useSession from '../../hooks/useSession'
import useWizardBack from '../../hooks/useWizardBack'
import { BACK_FALLBACK, PATHS } from '../../routes/paths'
import { requestChatbotReply } from '../../services/chatbotService'
import type { ChatOption } from './chatbotScript'
import { CASE_ROUTED_OPTION_IDS, INITIAL_OPTIONS } from './chatbotScript'
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

function ChatbotPage() {
  const navigate = useNavigate()
  const handleBack = useWizardBack(BACK_FALLBACK.chatbot)
  const { personaId } = useSession()

  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [activeStepId, setActiveStepId] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [retryRequest, setRetryRequest] = useState<
    { kind: 'option'; option: ChatOption } | { kind: 'text'; text: string } | null
  >(null)

  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [turns, isPending])

  /**
   * 지금은 곽지훈(B)만 최근에 접수한 사건이 있는 데모 상태다. (PROJECT_SPEC.md §9-1)
   * 실제 서비스에서는 로그인한 사용자의 최근 사건 목록에서 판단해야 한다.
   */
  const hasRecentCase = personaId === 'B'

  const resolveNextStepId = (option: ChatOption) =>
    CASE_ROUTED_OPTION_IDS.has(option.id) && !hasRecentCase ? 'caseIntroEmpty' : option.next

  const runRequest = async (
    request: { kind: 'option'; option: ChatOption } | { kind: 'text'; text: string },
  ) => {
    setIsPending(true)
    setRetryRequest(null)

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
      setTurns((prev) => [...prev, { id: nextTurnId(), role: 'bot-error', at: Date.now() }])
      setRetryRequest(request)
    } finally {
      setIsPending(false)
    }
  }

  const handleSelectOption = (option: ChatOption) => {
    if (isPending) return

    if (option.id === 'toSubmit') {
      navigate(PATHS.caseSubmit)
      return
    }
    if (option.id === 'toPlaza' || option.id === 'toPlaza2') {
      navigate(PATHS.plaza)
      return
    }

    setTurns((prev) => [
      // 이 선택지를 보여준 마지막 챗봇 턴에 "고른 것"을 표시해 active 색으로 남긴다.
      ...prev.map((turn, index) =>
        index === prev.length - 1 && turn.role === 'bot' ? { ...turn, selectedOptionId: option.id } : turn,
      ),
      { id: nextTurnId(), role: 'user', text: option.label, at: Date.now() },
    ])
    void runRequest({ kind: 'option', option })
  }

  const handleSend = (text: string) => {
    if (isPending) return
    setTurns((prev) => [...prev, { id: nextTurnId(), role: 'user', text, at: Date.now() }])
    void runRequest({ kind: 'text', text })
  }

  const handleRetry = () => {
    if (!retryRequest) return
    setTurns((prev) => prev.filter((turn) => turn.role !== 'bot-error'))
    void runRequest(retryRequest)
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

                if (turn.role === 'bot-error') {
                  return (
                    <div key={turn.id} className="chatbot-msg chatbot-msg--bot">
                      <div className="chatbot-bot-row">
                        <span className="chatbot-bot-avatar">
                          <img src={botLogo} alt="" width={40} height={40} />
                        </span>
                        <div className="chatbot-error">
                          <p>답변을 가져오지 못했어요.</p>
                          <p className="chatbot-error__hint">(데모: 네트워크 오류를 임의로 재현했어요)</p>
                          <button type="button" className="chatbot-error__retry" onClick={handleRetry}>
                            다시 시도
                          </button>
                        </div>
                      </div>
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
                        {step.options && step.options.length > 0 && (
                          <ChatOptionButtons
                            options={step.options}
                            layout={step.optionsLayout}
                            interactive={isLatest && !isPending}
                            selectedOptionId={turn.selectedOptionId}
                            onSelect={handleSelectOption}
                          />
                        )}
                      </div>
                    </div>
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
