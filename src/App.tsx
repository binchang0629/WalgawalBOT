import AppRoutes from './routes/AppRoutes'
import SessionProvider from './state/SessionProvider'

/**
 * 전역 Provider와 라우트만 연결한다.
 * 개별 화면 UI나 더미데이터를 이 파일에 넣지 않는다. (PROJECT_SPEC.md §7-2)
 */
function App() {
  return (
    <SessionProvider>
      <AppRoutes />
    </SessionProvider>
  )
}

export default App
