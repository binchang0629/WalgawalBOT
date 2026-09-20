import { useState, useSyncExternalStore } from 'react'
import { useNavigate } from 'react-router-dom'
import useSession from '../../hooks/useSession'
import { PATHS } from '../../routes/paths'
import { requestLoginReward } from '../../state/loginRewardSignal'
import mascot from '../../assets/auth/signUpCompleteMascot.webp'
import mascotVideo from '../../assets/auth/signUpCompleteMascot.mp4'
import './SignUpCompletePage.css'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
// 가입 완료 영상 배속. 1은 원래 속도, 1.4는 1.4배속이다.
const SIGNUP_VIDEO_PLAYBACK_RATE = 1.4

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function SignUpCompleteFallback() {
  return (
    <>
      <span className="signUpCompleteCircle" aria-hidden="true" />
      <img className="signUpCompleteMascot" src={mascot} alt="" aria-hidden="true" />
    </>
  )
}

function SignUpCompleteMotion() {
  const [hasVideoStarted, setHasVideoStarted] = useState(false)
  const [hasVideoFailed, setHasVideoFailed] = useState(false)

  if (hasVideoFailed) return <SignUpCompleteFallback />

  return (
    <>
      {!hasVideoStarted && <span className="signUpCompleteCircle" aria-hidden="true" />}
      <video
        className="signUpCompleteMascot signUpCompleteVideo"
        src={mascotVideo}
        poster={mascot}
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        onLoadedMetadata={(event) => {
          event.currentTarget.defaultPlaybackRate = SIGNUP_VIDEO_PLAYBACK_RATE
          event.currentTarget.playbackRate = SIGNUP_VIDEO_PLAYBACK_RATE
        }}
        onPlaying={() => setHasVideoStarted(true)}
        onError={() => setHasVideoFailed(true)}
      />
    </>
  )
}

/**
 * 가입 완료 환영 화면. 문구 스타일: Figma `2378:31776` · `2378:31778`.
 *
 * 시안에는 상단 헤더가 없다. 되돌아갈 곳이 없는 마무리 화면이라
 * AuthLayout이 아니라 ShowcaseLayout 아래에 바로 둔다.
 *
 * `시작하기`를 누르면 항상 홈으로 간다.
 */
function SignUpCompletePage() {
  const { currentUser } = useSession()
  const navigate = useNavigate()
  const prefersReducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => true)

  // 가입 직후라 이름이 있다. 복원 중이면 시안 문구의 기본값을 쓴다.
  const name = currentUser?.isCustomProfile
    ? currentUser.name
    : currentUser?.name.replace(/^윤/, '') ?? '서아'

  return (
    <main className="signUpComplete">
      <div className="signUpCompleteArt">
        {/* 원본의 2~9초 구간을 한 번 재생하고 마지막 프레임을 유지한다.
            움직임 줄이기를 켜면 영상과 재생 상태를 함께 해제한다. */}
        {prefersReducedMotion ? <SignUpCompleteFallback /> : <SignUpCompleteMotion />}
      </div>

      <p className="signUpCompleteTitle">
        <span className="signUpCompleteTitleNameGroup">
          <strong className="signUpCompleteTitleName">{name}</strong>님,
        </span>
        <span className="signUpCompleteTitleMessage">만나서 반가워요!</span>
      </p>
      <p className="signUpCompleteLead">
        내 고민을 이야기하거나,
        <br />
        다른 사건의 배심원이 되어보세요
      </p>

      <div className="signUpCompleteFooter">
        <button
          type="button"
          className="signUpCompleteStart"
          onClick={() => {
            // 홈과 하단 내비를 먼저 고정한 뒤 팝업만 아래에서 올라오게 한다.
            if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
            navigate(PATHS.home, { replace: true })
            window.requestAnimationFrame(() => {
              window.requestAnimationFrame(() => requestLoginReward('signup'))
            })
          }}
        >
          시작하기
        </button>
      </div>
    </main>
  )
}

export default SignUpCompletePage
