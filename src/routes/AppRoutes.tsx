import { Navigate, Route, Routes } from 'react-router-dom'
import ShowcaseLayout from '../layouts/ShowcaseLayout'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import DetailLayout from '../layouts/DetailLayout'
import HomePage from '../pages/Home/HomePage'
import SignupPage from '../pages/Auth/SignupPage'
import CaseSubmitFlow from '../pages/Submit/CaseSubmitFlow'
import CaseSubmitPage from '../pages/Submit/CaseSubmitPage'
import CaseSubmitQuestionsPage from '../pages/Submit/CaseSubmitQuestionsPage'
import CaseSubmitSummaryPage from '../pages/Submit/CaseSubmitSummaryPage'
import CaseSubmitOpinionPage from '../pages/Submit/CaseSubmitOpinionPage'
import CaseSubmitCompletePage from '../pages/Submit/CaseSubmitCompletePage'
import NotFoundPage from '../pages/Error/NotFoundPage'
import { PATHS } from './paths'

/**
 * 화면·URL 대응표는 PROJECT_SPEC.md §7-3에 있다.
 * 디자인이 확정되지 않은 화면은 아직 라우트를 만들지 않는다.
 *
 * 아직 연결하지 않은 경로 (디자인 확정 후 추가):
 *   /demo · /plaza · /cases/:caseId · /afterstory · /my
 *
 * /cases/new(사건 접수)는 지훈01~05(사건 작성 → 추가 질문 → 요약 확인 → AI 참고 의견·접수 → 접수 완료)
 * 5단계를 모두 구현했다. 각 단계가 공유하는 입력 상태는 CaseSubmitFlow가 들고 있다.
 *
 * /signup은 컨펌 시안이 없지만 발표 시연을 위해 팀 결정으로 추가했다. (PROJECT_SPEC.md §9-2)
 */
function AppRoutes() {
  return (
    <Routes>
      {/*
        기기 목업은 페이지마다 복사하지 않고 이 레이아웃에서 한 번만 구성한다.
        PC에서는 목업, 모바일에서는 목업 없이 같은 컴포넌트 트리를 쓴다. (PROJECT_SPEC.md §7-4)
      */}
      <Route element={<ShowcaseLayout />}>
        {/*
          최초 진입 분기. 퍼소나 선택이 붙기 전까지는 홈으로 보낸다.
          replace를 써서 뒤로가기에 분기 처리가 남지 않게 한다. (PROJECT_SPEC.md §7-6)
        */}
        <Route path={PATHS.root} element={<Navigate to={PATHS.home} replace />} />

        {/* 앱 헤더와 하단 내비게이션을 쓰는 주요 메뉴 화면 */}
        <Route element={<MainLayout />}>
          <Route path={PATHS.home} element={<HomePage />} />
        </Route>

        {/* 가입·로그인 계열. 하단 내비게이션을 표시하지 않는다. */}
        <Route element={<AuthLayout />}>
          <Route path={PATHS.signup} element={<SignupPage />} />
        </Route>

        {/*
          사건 상세·접수 등 단일 화면 흐름. 하단 내비게이션을 두지 않는다.
          로그인 필요 여부가 미정이라 아직 접근 가드를 걸지 않았다. (PROJECT_SPEC.md §9-9)
        */}
        <Route element={<DetailLayout />}>
          {/* 5단계가 공유하는 입력 상태는 CaseSubmitFlow의 Context가 들고 있다. */}
          <Route element={<CaseSubmitFlow />}>
            <Route path={PATHS.caseSubmit} element={<CaseSubmitPage />} />
            <Route path={PATHS.caseSubmitQuestions} element={<CaseSubmitQuestionsPage />} />
            <Route path={PATHS.caseSubmitSummary} element={<CaseSubmitSummaryPage />} />
            <Route path={PATHS.caseSubmitOpinion} element={<CaseSubmitOpinionPage />} />
            <Route path={PATHS.caseSubmitComplete} element={<CaseSubmitCompletePage />} />
          </Route>
        </Route>

        {/* 잘못된 URL. 없는 사건 ID와는 구분해서 처리한다. (PROJECT_SPEC.md §7-3) */}
        <Route path={PATHS.notFound} element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
