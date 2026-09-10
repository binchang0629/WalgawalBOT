import { Navigate, Route, Routes } from 'react-router-dom'
import ShowcaseLayout from '../layouts/ShowcaseLayout'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import DetailLayout from '../layouts/DetailLayout'
import HomePage from '../pages/Home/HomePage'
import PlazaPage from '../pages/Plaza/PlazaPage'
import CaseDetailPage from '../pages/Case/CaseDetailPage'
import CaseResultPage from '../pages/Case/CaseResultPage'
import SignupPage from '../pages/Auth/SignupPage'
import LoginPage from '../pages/Auth/LoginPage'
import MyPage from '../pages/My/MyPage'
import MyCasesPage from '../pages/My/MyCasesPage'
import MyCaseResultPage from '../pages/My/MyCaseResultPage'
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
 *   /demo · /afterstory
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
          <Route path={PATHS.plaza} element={<PlazaPage />} />
          <Route path={PATHS.caseDetail} element={<CaseDetailPage />} />
          <Route path={PATHS.caseResult} element={<CaseResultPage />} />
          <Route path={PATHS.my} element={<MyPage />} />
        </Route>

        {/* MY 하위 상세 화면은 Figma 시안대로 하단 내비게이션 없이 표시한다. */}
        <Route path={PATHS.myCases} element={<MyCasesPage />} />
        <Route path={PATHS.myCaseResult} element={<MyCaseResultPage />} />

        {/* 가입·로그인 계열. 하단 내비게이션을 표시하지 않는다. */}
        <Route element={<AuthLayout />}>
          <Route path={PATHS.login} element={<LoginPage />} />
          <Route path={PATHS.signup} element={<SignupPage />} />
        </Route>

        {/* 사건 접수는 진행 상태를 공유하는 5단계 흐름이며 하단 내비게이션을 표시하지 않는다. */}
        <Route element={<DetailLayout />}>
          <Route path={PATHS.caseSubmit} element={<CaseSubmitFlow />}>
            <Route index element={<CaseSubmitPage />} />
            <Route path="questions" element={<CaseSubmitQuestionsPage />} />
            <Route path="summary" element={<CaseSubmitSummaryPage />} />
            <Route path="opinion" element={<CaseSubmitOpinionPage />} />
            <Route path="complete" element={<CaseSubmitCompletePage />} />
          </Route>
        </Route>

        {/* 잘못된 URL. 없는 사건 ID와는 구분해서 처리한다. (PROJECT_SPEC.md §7-3) */}
        <Route path={PATHS.notFound} element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
