import { useId, useLayoutEffect, useRef } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { BACK_FALLBACK, PATHS } from '../../routes/paths'
import CaseSubmitHeader from './components/CaseSubmitHeader'
import CaseSubmitProgress from './components/CaseSubmitProgress'
import CaseSubmitFooter from './components/CaseSubmitFooter'
import useCaseSubmitDraft from './useCaseSubmitDraft'
import useWizardBack from '../../hooks/useWizardBack'
import { RELATIONSHIPS } from './types'
import { JIHUN_CONTENT, SEOA_CONTENT, SUBMIT_SCENARIOS } from './caseSubmitContent'
import walangJoy from '../../assets/submit/figma/imgCharacterWalangJoy.svg'
import './CaseSubmit.css'
import './CaseSubmitPage.css'

/**
 * 사건 접수 1단계 — 서아01(1446:10093) / 지훈01의 공유 폼.
 * Figma `1차 디자인 시안 > 컨펌 > 사건접수(박건영) > 지훈01` 기준 (node 1446:9899).
 *
 * 로그인 필요 여부는 아직 미정이라 접근 가드를 걸지 않았다. (PROJECT_SPEC.md §9-9)
 */

const CONTENT_MAX_LENGTH = 1000

const CONTENT_PLACEHOLDER = `언제, 누구와 어떤 일이 있었나요?

예) 의뢰인에게 작업물을 전달했는데
약속한 날짜가 지나도 잔금을 받지 못했어요.`

const SEOA_CONTENT_PLACEHOLDER = `언제, 누구와 어떤 일이 있었나요?

예) 동아리 축제 준비 중 팀원이 약속한 시간까지
홍보물을 올리지 않아 제가 대신 작업했어요.`

function CaseSubmitPage() {
  const {
    personaId,
    relationship,
    setRelationship,
    photoNames,
    setPhotoNames,
    fileNames,
    setFileNames,
    content,
    setContent,
  } = useCaseSubmitDraft()
  const isSeoa = personaId === 'A'

  const photoInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const contentInputRef = useRef<HTMLTextAreaElement>(null)
  const contentFieldId = useId()

  const navigate = useNavigate()
  const handleBack = useWizardBack(BACK_FALLBACK.cases)

  const canProceed = relationship !== null && content.trim().length > 0
  const hasAttachments = photoNames.length > 0 || fileNames.length > 0

  // 긴 시연 문구도 textarea 안에서 따로 스크롤하지 않고 내용 높이만큼 펼쳐 보인다.
  useLayoutEffect(() => {
    const field = contentInputRef.current
    if (!field) return

    field.style.height = 'auto'
    field.style.height = `${field.scrollHeight}px`
  }, [content])

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length > 0) {
      setPhotoNames((prev) => [...prev, ...files.map((file) => file.name)])
    }
    event.target.value = ''
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length > 0) {
      setFileNames((prev) => [...prev, ...files.map((file) => file.name)])
    }
    event.target.value = ''
  }

  /*
   * 발표 시연용 예시 채우기.
   * 예전에는 본문 칸을 누르면 저절로 채워졌는데, 직접 써 보려고 눌렀을 때도 글이 들어차
   * 손댈 수가 없었다. 그래서 버튼으로 떼어내 누를 때만 채운다.
   *
   * focus()는 기본적으로 포커스된 요소가 보이도록 가장 가까운 스크롤 조상
   * (.case-submit__body)을 브라우저가 알아서 스크롤한다. 지훈 예시 글이 서아보다 훨씬 길어
   * textarea가 뷰포트 밖으로 크게 자라는데, 그 상태에서 이 기본 동작이 발생하면 화면이 맨
   * 아래까지 밀린다. `preventScroll: true`로 그 자동 스크롤 자체를 끈다.
   */
  const handleDemoFill = () => {
    setContent(isSeoa ? SEOA_CONTENT : JIHUN_CONTENT)
    window.requestAnimationFrame(() => {
      const field = contentInputRef.current
      if (field) {
        field.focus({ preventScroll: true })
        field.setSelectionRange(field.value.length, field.value.length)
        field.scrollTop = 0
      }
    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canProceed) return
    navigate(isSeoa ? PATHS.caseSubmitSummary : PATHS.caseSubmitQuestions)
  }

  return (
    <form className="case-submit" onSubmit={handleSubmit}>
      <CaseSubmitHeader onBack={handleBack} />

      <div className="case-submit__body case-submit__body--with-progress">
        <CaseSubmitProgress step={1} totalSteps={SUBMIT_SCENARIOS[personaId].totalSteps} label="사건 작성" />

        <div className="case-submit__intro">
          <h2 className="case-submit__heading">무슨 일이 있었나요?</h2>
          <p className="case-submit__description">편하게 적어주세요. 정리는 판멍이가 도와줄게요.</p>
        </div>

        <fieldset className="case-submit__field" aria-required="true">
          <legend className="case-submit__label">
            상대와의 관계 <span className="case-submit__required" aria-hidden="true">*</span>
          </legend>
          <div className="case-submit__chip-grid">
            {RELATIONSHIPS.map((option) => {
              const isSelected = relationship === option
              return (
                <button
                  key={option}
                  type="button"
                  className={`case-submit__choice${isSelected ? ' case-submit__choice--selected' : ''}`}
                  aria-pressed={isSelected}
                  onClick={() => setRelationship(option)}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </fieldset>

        <div className="case-submit__field">
          <div className="case-submit__attachment-heading">
            <span className="case-submit__label">사진·파일 첨부(선택)</span>
          </div>
          <div className="case-submit__attachment-actions">
            <button
              type="button"
              className="case-submit__attachment-btn"
              onClick={() => photoInputRef.current?.click()}
            >
              ＋ 사진 추가
            </button>
            <button
              type="button"
              className="case-submit__attachment-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              ＋ 파일 첨부
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handlePhotoChange}
            />
            <input ref={fileInputRef} type="file" multiple hidden onChange={handleFileChange} />
          </div>
          {hasAttachments && (
            <ul className="case-submit__attachment-list">
              {photoNames.map((name, index) => (
                <li key={`photo-${index}-${name}`}>사진 · {name}</li>
              ))}
              {fileNames.map((name, index) => (
                <li key={`file-${index}-${name}`}>파일 · {name}</li>
              ))}
            </ul>
          )}
          <p className="case-submit__helper">사진·문서 속 개인정보는 가려주세요.</p>
        </div>

        <div className="case-submit__field">
          <div className="case-submit__content-head">
            <label className="case-submit__label" htmlFor={contentFieldId}>
              사건 내용 <span className="case-submit__required">*</span>
            </label>
            {/* 발표 시연용. 누르면 예시 사건이 본문 칸에 바로 들어간다. Figma(1446:9899)의 `더미 텍스트 입력` 문구를 그대로 쓴다. */}
            <button type="button" className="case-submit__demo" onClick={handleDemoFill}>더미 텍스트 입력</button>
          </div>
          <div className={`case-submit__textarea-box${content ? ' has-content' : ''}`}>
            <textarea
              ref={contentInputRef}
              id={contentFieldId}
              className="case-submit__textarea"
              placeholder={isSeoa ? SEOA_CONTENT_PLACEHOLDER : CONTENT_PLACEHOLDER}
              maxLength={CONTENT_MAX_LENGTH}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
            />
            <span className="case-submit__counter">
              {content.length.toLocaleString()} / {CONTENT_MAX_LENGTH.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="case-submit__panmung">
          <img src={walangJoy} alt="" className="case-submit__panmung-art" width={40} height={40} />
          <p>이름·연락처 같은 개인정보는 빼주세요.</p>
        </div>
      </div>

      <CaseSubmitFooter
        primaryLabel="다음"
        helperText="다음 단계에서 필요한 내용을 더 확인해요."
        disabled={!canProceed}
      />
    </form>
  )
}

export default CaseSubmitPage
