import type { ReactNode, Ref } from 'react'
import panMungyeeJudge from '../../assets/submit/panmung-judge-hq.png'
import clickTapIcon from '../../assets/afterstory/figma/icon-park-click-tap.svg'
import CaseFolderCard from './CaseFolderCard'
import './CompletionScene.css'

type CompletionSceneProps = {
  title: string
  folderTitle: string
  detailLabel: string
  detailValue: string
  reminder: string
  /**
   * 파일을 눌러 방금 쓴 글을 미리 볼 수 있게 한다.
   * 주지 않으면 파일은 그냥 보여주기만 하는 그림이다.
   */
  onFolderOpen?: () => void
  folderAriaLabel?: string
  /** 파일 아래에 붙는 안내 문구. `onFolderOpen`이 있을 때만 보인다. */
  folderHint?: ReactNode
  isPreviewOpen?: boolean
  folderRef?: Ref<HTMLDivElement>
}

function CompletionScene({
  title,
  folderTitle,
  detailLabel,
  detailValue,
  reminder,
  onFolderOpen,
  folderAriaLabel = '작성한 내용 미리보기',
  folderHint,
  isPreviewOpen = false,
  folderRef,
}: CompletionSceneProps) {
  const folder = (
    <CaseFolderCard className="completion-scene__folder" paperClassName="completion-scene__paper">
      <h2 className="completion-scene__folder-title">{folderTitle}</h2>
      <p className="completion-scene__detail">
        <span>{detailLabel}</span>
        <strong>{detailValue}</strong>
      </p>
    </CaseFolderCard>
  )

  return (
    <div className="completion-scene">
      <div className="completion-scene__hero">
        <div className="completion-scene__art-stage">
          <span className="completion-scene__check" aria-hidden="true">✓</span>
          <img src={panMungyeeJudge} alt="판사 옷을 입은 판멍이 캐릭터" width={150} height={122} />
        </div>
        <h1 className="completion-scene__title">{title}</h1>
      </div>

      {onFolderOpen ? (
        <>
          {/* 후일담 게시 확인 화면과 같은 방식으로, 파일을 누르면 글 전문이 열린다. */}
          <div
            ref={folderRef}
            className="completion-scene__folder-trigger"
            role="button"
            tabIndex={0}
            aria-label={folderAriaLabel}
            aria-haspopup="dialog"
            aria-expanded={isPreviewOpen}
            onClick={onFolderOpen}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onFolderOpen()
              }
            }}
          >
            {folder}
          </div>

          {folderHint && (
            <button
              type="button"
              className="completion-scene__hint"
              onClick={onFolderOpen}
              aria-haspopup="dialog"
              aria-expanded={isPreviewOpen}
            >
              <span className="completion-scene__hint-gesture" aria-hidden="true">
                <img src={clickTapIcon} alt="" />
              </span>
              {folderHint}
            </button>
          )}
        </>
      ) : folder}

      <p className="completion-scene__reminder">{reminder}</p>
    </div>
  )
}

export default CompletionScene
