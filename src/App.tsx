import AppRoutes from './routes/AppRoutes'
import SessionProvider from './state/SessionProvider'
import LoginGateProvider from './state/LoginGateProvider'
import LoginRewardHost from './state/LoginRewardHost'
import { ToastProvider } from './components/common/Toast'

/**
 * 전역 Provider와 라우트만 연결한다.
 * 개별 화면 UI나 더미데이터를 이 파일에 넣지 않는다. (PROJECT_SPEC.md §7-2)
 */
function App() {
  return (
    <SessionProvider>
      {/* 로그인 유도 팝업은 세션 상태를 읽으므로 SessionProvider 안에 둔다. */}
      <LoginGateProvider>
        <ToastProvider>
          <AppRoutes />
          {/* 로그인·가입을 마치면 보던 화면 위에 출석 포인트 팝업을 띄운다. */}
          <LoginRewardHost />
        </ToastProvider>
      </LoginGateProvider>
    </SessionProvider>
  )
}

export default App
