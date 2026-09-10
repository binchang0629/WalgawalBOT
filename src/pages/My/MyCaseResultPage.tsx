import { useNavigate, useParams } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import { MY_CASES } from '../../data/personas/myCases'
import backIcon from '../../assets/my/back.svg'
import detectiveImage from '../../assets/my-case/panmung-curiosity.png'
import verdictDifferenceImage from '../../assets/my-case/verdict-difference.png'
import './MyCases.css'

const verdicts = [
  { label: '글쓴이 입장이 더 타당함', value: 46, highlight: true },
  { label: '상대방 입장이 더 타당함', value: 19 },
  { label: '양쪽 모두 일리 있음', value: 32 },
  { label: '양쪽 모두 타당하지 않음', value: 3 },
]

const actionGuides = [
  '친구에게 개인적으로 대화를 요청해보세요.',
  '여러 사람 앞에서 말한 방식은 사과해보세요.',
  '자료 지연으로 느낀 부담과 서운함은 분명하게 전달하세요.',
  '다음 과제부터 중간 확인일과 역할 기준을 친구와 함께 정해보세요.',
]

function MyCaseResultPage() {
  const navigate = useNavigate()
  const { caseId } = useParams()

  // 이전 공유 URL도 유지하되, 표시하는 사건번호는 최신 목록 시안과 통일한다.
  if (caseId !== MY_CASES.A.id && caseId !== 'CASE-SEOA-01') {
    return (
      <main className="my-case-result-page my-case-result-page--empty">
        <p>해당 사건 결과를 찾을 수 없습니다.</p>
        <button type="button" onClick={() => navigate(PATHS.myCases)}>내 사건으로 돌아가기</button>
      </main>
    )
  }

  return (
    <main className="my-case-result-page">
      <header className="my-sub-header">
        <button type="button" onClick={() => navigate(PATHS.myCases)} aria-label="내 사건 목록으로 돌아가기">
          <img src={backIcon} alt="" />
        </button>
        <h1>결과 확인하기</h1>
        <span aria-hidden="true" />
      </header>

      <div className="my-case-result-page__content" role="region" aria-label="사건 결과 상세 내용" tabIndex={0}>
        <section className="my-result-summary">
          <span>투표 완료</span>
          <h2>조별 과제에서 친구를 공개적으로<br />지적한 제가 너무 예민했던 걸까요?</h2>
          <p>{MY_CASES.A.id} · {MY_CASES.A.participation} 참여</p>
        </section>

        <section className="ai-verdict-card">
          <img src={detectiveImage} alt="" />
          <h3>판멍이의 1심 판결</h3>
          <strong>판멍이는<br />친구의 손을 들어줬어요</strong>
          <p>기한을 지켜달라는 요구는 타당했지만, 사정을 확인하기 전에 단체방에서 공개적으로 지적한 방식은 관계에 부담을 줄 수 있다고 판단했어요.</p>
          <div><span>AI 판단 확신도</span><b>66%</b></div>
        </section>

        <section className="jury-verdict-card">
          <h3>배심원 2심 결과</h3>
          <strong>글쓴이 입장이 더 타당함 <span>46%</span></strong>
          <ul>
            {verdicts.map((item) => (
              <li key={item.label} className={item.highlight ? 'is-highlight' : ''}>
                <div><span>{item.label}</span><b>{item.value}%</b></div>
                <span className="jury-verdict-card__track"><i style={{ width: `${item.value}%` }} /></span>
              </li>
            ))}
          </ul>
          <button type="button" disabled>배심원 의견 전체 보기</button>
        </section>

        <section className="verdict-difference">
          <span className="verdict-difference__character"><img src={verdictDifferenceImage} alt="" width={60} height={52} /></span>
          <div><strong>AI와 배심원의 판단이 엇갈렸어요</strong><p>AI는 친구의 입장을, 배심원은 내 입장을 더 타당하다고 판단했어요.</p></div>
        </section>

        <section className="action-guide">
          <h3>다음 행동 가이드</h3>
          <ol>{actionGuides.map((guide, index) => <li key={guide}><span>{index + 1}</span><p>{guide}</p></li>)}</ol>
        </section>

        <section className="followup-card">
          <h3>사건을 해결했나요?</h3>
          <p>AI 판결과 배심원 의견을 참고해 실제로 어떻게 행동했는지 기록해보세요.</p>
          <button type="button" disabled>후일담 작성하기</button>
        </section>

        <p className="my-result-footer">배심원 댓글과 공감 반응은 별도 화면에서 확인</p>
      </div>
    </main>
  )
}

export default MyCaseResultPage
