import { useEffect } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import ShowcaseLayout from '../layouts/ShowcaseLayout'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import DetailLayout from '../layouts/DetailLayout'
import HomePage from '../pages/Home/HomePage'
import PlazaPage from '../pages/Plaza/PlazaPage'
import CaseDetailPage from '../pages/Case/CaseDetailPage'
import CaseResultPage from '../pages/Case/CaseResultPage'
import ClosedCaseDetailPage from '../pages/Case/ClosedCaseDetailPage'
import ClosedCaseResultPage from '../pages/Case/ClosedCaseResultPage'
import SignupPage from '../pages/Auth/SignupPage'
import SignUpCompletePage from '../pages/Auth/SignUpCompletePage'
import LoginPage from '../pages/Auth/LoginPage'
import MyPage from '../pages/My/MyPage'
import WalbotPlanPage from '../pages/My/WalbotPlanPage'
import MyCasesPage from '../pages/My/MyCasesPage'
import MyCommentsPage from '../pages/My/MyCommentsPage'
import MyCaseResultPage from '../pages/My/MyCaseResultPage'
import CaseSubmitFlow from '../pages/Submit/CaseSubmitFlow'
import CaseSubmitPage from '../pages/Submit/CaseSubmitPage'
import CaseSubmitQuestionsPage from '../pages/Submit/CaseSubmitQuestionsPage'
import CaseSubmitSummaryPage from '../pages/Submit/CaseSubmitSummaryPage'
import CaseSubmitOpinionPage from '../pages/Submit/CaseSubmitOpinionPage'
import CaseSubmitCompletePage from '../pages/Submit/CaseSubmitCompletePage'
import ChatbotPage from '../pages/Chatbot/ChatbotPage'
import OnboardingPage from '../pages/Onboarding/OnboardingPage'
import NotFoundPage from '../pages/Error/NotFoundPage'
import { AfterStoryDetailPage, AfterStoryHomePage, CompleteAfterStoryPage, MyAfterStoryPage, MyPublishedAfterStoryPage, PreviewAfterStoryPage, WriteAfterStoryPage } from '../pages/AfterStory/AfterStoryPage'
import { PATHS } from './paths'
import useSession from '../hooks/useSession'
import { getPlazaCaseStory } from '../data/common/plazaCaseStories'

/**
 * 화면·URL 대응표는 PROJECT_SPEC.md §7-3에 있다.
 * 디자인이 확정되지 않은 화면은 아직 라우트를 만들지 않는다.
 *
 * 아직 연결하지 않은 경로 (디자인 확정 후 추가):
 *   /demo · /afterstory
 *
 * /signup은 컨펌 시안이 없지만 발표 시연을 위해 팀 결정으로 추가했다. (PROJECT_SPEC.md §9-2)
 */
/**
 * 링크로 처음 들어왔을 때의 시작 지점.
 *
 * 발표용으로 공유하는 링크라, 누가 언제 열어도 같은 화면에서 시작해야 한다.
 * 그래서 서아(신규 사용자, 비로그인) 상태로 되돌린 뒤 온보딩 스플래시 영상으로 보낸다.
 * 같은 브라우저 세션에서 앞서 로그인해 둔 기록이 남아 있어도 여기서 초기화된다.
 *
 * switchPersona를 렌더 중에 부르지 않고 effect에 두는 이유는,
 * 렌더 도중 다른 컴포넌트의 상태를 바꾸면 React가 경고를 내기 때문이다.
 */
function DemoEntry() {
  const { switchPersona } = useSession()

  useEffect(() => {
    switchPersona('A')
  }, [switchPersona])

  return <Navigate to={PATHS.onboarding} replace />
}

function CaseDetailRoute() {
  const { caseId } = useParams()
  return getPlazaCaseStory(caseId)?.status === 'closed'
    ? <ClosedCaseDetailPage />
    : <CaseDetailPage />
}

function CaseResultRoute() {
  const { caseId } = useParams()
  return getPlazaCaseStory(caseId)?.status === 'closed'
    ? <ClosedCaseResultPage />
    : <CaseResultPage />
}

function AppRoutes() {
  const { sessionStatus } = useSession()
  return (
    <Routes>
      {/*
        기기 목업은 페이지마다 복사하지 않고 이 레이아웃에서 한 번만 구성한다.
        PC에서는 목업, 모바일에서는 목업 없이 같은 컴포넌트 트리를 쓴다. (PROJECT_SPEC.md §7-4)
      */}
      <Route element={<ShowcaseLayout />}>
        {/*
          최초 진입 분기. 비로그인 상태로 되돌리고 온보딩 스플래시부터 보여준다.
          replace를 써서 뒤로가기에 분기 처리가 남지 않게 한다. (PROJECT_SPEC.md §7-6)
        */}
        <Route path={PATHS.root} element={<DemoEntry />} />
        <Route path={PATHS.onboarding} element={<OnboardingPage />} />

        {/* 앱 헤더와 하단 내비게이션을 쓰는 주요 메뉴 화면 */}
        <Route element={<MainLayout />}>
          <Route path={PATHS.home} element={<HomePage key={sessionStatus} />} />
          <Route path={PATHS.plaza} element={<PlazaPage />} />
          <Route path={PATHS.jihoonCaseDetail} element={<ClosedCaseDetailPage />} />
          <Route path={PATHS.jihoonCaseResult} element={<ClosedCaseResultPage />} />
          <Route path={PATHS.caseDetail} element={<CaseDetailRoute />} />
          <Route path={PATHS.caseResult} element={<CaseResultRoute />} />
          <Route path={PATHS.my} element={<MyPage />} />
          <Route path={PATHS.afterStory} element={<AfterStoryHomePage />} />
          {/* 내 이야기 남기기. 시안에 하단 내비게이션이 있어 MainLayout 아래에 둔다. */}
          <Route path={PATHS.afterStoryMine} element={<MyAfterStoryPage />} />
          <Route path={PATHS.afterStoryMineStories} element={<MyPublishedAfterStoryPage />} />
          {/* 내가 쓴 후일담 상세도 왈가왈후 메뉴 흐름이므로 하단 내비게이션을 유지한다. */}
          <Route path={PATHS.afterStoryDetail} element={<AfterStoryDetailPage />} />

        </Route>

        {/* MY 하위 상세 화면은 Figma 시안대로 하단 내비게이션 없이 표시한다. */}
        <Route path={PATHS.myCases} element={<MyCasesPage />} />
        <Route path={PATHS.myComments} element={<MyCommentsPage />} />
        <Route path={PATHS.myCaseResult} element={<MyCaseResultPage />} />

        {/* 가입·로그인 계열. 하단 내비게이션을 표시하지 않는다. */}
        <Route element={<AuthLayout />}>
          <Route path={PATHS.login} element={<LoginPage />} />
          <Route path={PATHS.signup} element={<SignupPage />} />
        </Route>

        {/* 가입 완료 환영 화면은 시안에 헤더가 없어 AuthLayout 밖에 둔다. */}
        <Route path={PATHS.signupComplete} element={<SignUpCompletePage />} />

        {/* 사건 접수는 진행 상태를 공유하는 5단계 흐름이며 하단 내비게이션을 표시하지 않는다. */}
        <Route element={<DetailLayout />}>
          <Route path={PATHS.myPlan} element={<WalbotPlanPage />} />
          <Route path={PATHS.afterStoryCommunity} element={<Navigate to={PATHS.afterStory} replace />} />
          <Route path={PATHS.afterStoryWrite} element={<WriteAfterStoryPage />} />
          <Route path={PATHS.afterStoryPreview} element={<PreviewAfterStoryPage />} />
          <Route path={PATHS.afterStoryComplete} element={<CompleteAfterStoryPage />} />
          <Route path={PATHS.caseSubmit} element={<CaseSubmitFlow />}>
            <Route index element={<CaseSubmitPage />} />
            <Route path="questions" element={<CaseSubmitQuestionsPage />} />
            <Route path="summary" element={<CaseSubmitSummaryPage />} />
            <Route path="opinion" element={<CaseSubmitOpinionPage />} />
            <Route path="complete" element={<CaseSubmitCompletePage />} />
          </Route>
          <Route path={PATHS.chatbot} element={<ChatbotPage />} />
        </Route>

        {/* 잘못된 URL. 없는 사건 ID와는 구분해서 처리한다. (PROJECT_SPEC.md §7-3) */}
        <Route path={PATHS.notFound} element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
