import { Fragment } from 'react'
import type { BotStep } from '../chatbotScript'
import fileTextIcon from '../../../assets/chatbot/figma/imgFileText.svg'
import '../Chatbot.css'

type PostedCase = NonNullable<BotStep['postedCase']>

/** Figma `Posted / 후일담 요약`(node 1951:4066) 기준. 문서 아이콘 + 라벨 + 두 줄 요약. */
function PostedCaseCard({ postedCase }: { postedCase: PostedCase }) {
  return (
    <div className="chatbot-case-card">
      <span className="chatbot-case-card__icon">
        <img src={fileTextIcon} alt="" width={24} height={24} />
      </span>
      <div className="chatbot-case-card__text">
        <p className="chatbot-case-card__label">{postedCase.label}</p>
        <p className="chatbot-case-card__lines">
          {postedCase.lines.map((line, index) => (
            <span key={index}>
              {line}
              {index < postedCase.lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}

/**
 * `**강조**` 표시를 파랑 SemiBold 글자로 바꾼다.
 * Figma 답변 문구에서 파란 글자로 강조된 구간(예: "잔금 220만 원이 지급되지 않았고")을
 * 데이터 파일(chatbotScript.ts)에서는 마크다운처럼 `**`로 감싸 표현했다.
 */
function renderInlineText(text: string) {
  const parts = text.split('**')
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="chatbot-bot-text__strong">
        {part}
      </strong>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  )
}

interface BotMessageContentProps {
  step: BotStep
}

/**
 * 챗봇 답변 본문 — 문단·목록·최근 사건 카드를 순서대로 그린다.
 *
 * 최근 사건 카드는 문단과 같은 `.chatbot-bot-text` 안에 넣지 않고 형제로 뺀다.
 * Figma `TextBox`(node 1951:4062)는 문단·카드·버튼을 20px 간격으로 쌓는데,
 * 문단 자체는 줄 간격(1.5)만 있고 서로 붙어 있어야 하기 때문이다.
 * 20px 간격은 부모 `.chatbot-bot-content`의 gap이 담당한다.
 */
function BotMessageContent({ step }: BotMessageContentProps) {
  return (
    <>
      <div className="chatbot-bot-text">
        {step.blocks.map((block, index) => {
          if (block.kind === 'list') {
            return (
              <ul key={index}>
                {block.items.map((item) => (
                  <li key={item}>{renderInlineText(item)}</li>
                ))}
              </ul>
            )
          }

          if (block.text === '') {
            return <p key={index} className="chatbot-bot-text__spacer" aria-hidden="true" />
          }

          return <p key={index}>{renderInlineText(block.text)}</p>
        })}
      </div>

      {step.postedCase && <PostedCaseCard postedCase={step.postedCase} />}
    </>
  )
}

export default BotMessageContent
