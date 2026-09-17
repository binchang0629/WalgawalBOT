import panMungyeeJudge from '../../assets/submit/panmung-judge-hq.png'
import CaseFolderCard from './CaseFolderCard'
import './CompletionScene.css'

type CompletionSceneProps = {
  title: string
  folderTitle: string
  detailLabel: string
  detailValue: string
  reminder: string
}

function CompletionScene({ title, folderTitle, detailLabel, detailValue, reminder }: CompletionSceneProps) {
  return (
    <div className="completion-scene">
      <div className="completion-scene__hero">
        <div className="completion-scene__art-stage">
          <span className="completion-scene__check" aria-hidden="true">✓</span>
          <img src={panMungyeeJudge} alt="판사 옷을 입은 판멍이 캐릭터" width={150} height={122} />
        </div>
        <h1 className="completion-scene__title">{title}</h1>
      </div>

      <CaseFolderCard className="completion-scene__folder" paperClassName="completion-scene__paper">
        <h2 className="completion-scene__folder-title">{folderTitle}</h2>
        <p className="completion-scene__detail">
          <span>{detailLabel}</span>
          <strong>{detailValue}</strong>
        </p>
      </CaseFolderCard>

      <p className="completion-scene__reminder">{reminder}</p>
    </div>
  )
}

export default CompletionScene
