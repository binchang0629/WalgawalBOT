import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { resetDemoComments } from './utils/demoReset'
import './styles/fonts.css'
import './styles/tokens.css'
import './index.css'

/*
 * 시연을 처음 상태로 되돌린다.
 *
 * 이 파일은 앱이 뜰 때 한 번만 실행되므로, 새로고침하거나 링크를 새로 열 때만 비워진다.
 * 화면을 오가는 동안에는 돌지 않아서 방금 단 댓글은 그대로 남는다.
 */
resetDemoComments()

// Router는 여기서 한 번만 연결한다. App 안에서 다시 감싸지 않는다. (PROJECT_SPEC.md §7-1)
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('#root 엘리먼트를 찾을 수 없습니다.')
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
