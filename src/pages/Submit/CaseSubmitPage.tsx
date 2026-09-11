import { useId, useRef } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { BACK_FALLBACK, PATHS } from '../../routes/paths'
import CaseSubmitHeader from './components/CaseSubmitHeader'
import CaseSubmitProgress from './components/CaseSubmitProgress'
import CaseSubmitFooter from './components/CaseSubmitFooter'
import useCaseSubmitDraft from './useCaseSubmitDraft'
import useWizardBack from '../../hooks/useWizardBack'
import { RELATIONSHIPS } from './types'
import { DUMMY_CASE_CONTENT, SUBMIT_SCENARIOS } from './caseSubmitContent'
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
  const hasFocusedContent = useRef(false)

  const photoInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const contentFieldId = useId()

  const navigate = useNavigate()
  const handleBack = useWizardBack(BACK_FALLBACK.cases)

  const canProceed = content.trim().length > 0
  const hasAttachments = photoNames.length > 0 || fileNames.length > 0

  const handleFillDummyContent = () => {
    if (!hasFocusedContent.current && !content) setContent(DUMMY_CASE_CONTENT[personaId])
    hasFocusedContent.current = true
  }

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canProceed) return
    navigate(isSeoa ? PATHS.caseSubmitSummary : PATHS.caseSubmitQuestions)
  }

  return (
    <form className={`case-submit${isSeoa ? ' case-submit--seoa case-submit--writing' : ''}`} onSubmit={handleSubmit}>
      <CaseSubmitHeader onBack={handleBack} />
      <CaseSubmitProgress step={1} totalSteps={SUBMIT_SCENARIOS[personaId].totalSteps} label="사건 작성" />

      <div className="case-submit__body">
        <div className="case-submit__intro">
          <h2 className="case-submit__heading">무슨 일이 있었나요?</h2>
          <p className="case-submit__description">편하게 적어주세요. 정리는 판멍이가 도와줄게요.</p>
        </div>

        <fieldset className="case-submit__field">
          <legend className="case-submit__label">
            상대와의 관계 <span className="case-submit__required">*</span>
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
          <p className="case-submit__attachment-label">사진·파일 첨부(선택)</p>
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
          <div className="case-submit__content-header">
            <label className="case-submit__label" htmlFor={contentFieldId}>
              사건 내용 <span className="case-submit__required">*</span>
            </label>
            <button type="button" className="case-submit__dummy-fill" onClick={handleFillDummyContent}>
              더미 텍스트 입력
            </button>
          </div>
          <div className={`case-submit__textarea-box${content ? ' has-content' : ''}`}>
            <textarea
              id={contentFieldId}
              className="case-submit__textarea"
              placeholder={isSeoa ? '언제, 누구와 어떤 일이 있었나요?' : CONTENT_PLACEHOLDER}
              maxLength={CONTENT_MAX_LENGTH}
              value={content}
              onFocus={handleFillDummyContent}
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
