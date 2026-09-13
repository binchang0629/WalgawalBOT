import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useSession from '../../hooks/useSession'
import { PATHS } from '../../routes/paths'
import { AUTH_DEMO_ACCOUNT, EMAIL_DOMAINS } from './authDemoAccount'
import AuthSelect from './components/AuthSelect'
import type { AuthSelectOption } from './components/AuthSelect'
import SignUpAgreeSheet from './components/SignUpAgreeSheet'
import { EMPTY_AGREE } from './components/signUpAgreeState'
import type { AgreeState } from './components/signUpAgreeState'
import eyeOnIcon from '../../assets/auth/loginEyeOn.svg'
import eyeOffIcon from '../../assets/auth/loginEyeOff.svg'
import checkOnIcon from '../../assets/auth/signUpCheckOn.svg'
import checkOffIcon from '../../assets/auth/signUpCheckOff.svg'
import clearIcon from '../../assets/auth/signUpClear.svg'
import addIcon from '../../assets/auth/signUpAdd.svg'
import './SignupPage.css'

/**
 * 회원가입. Figma `2264:10514`(빈 상태) · `2187:24632`(입력됨) · `2264:13995`(비밀번호 확인 보임).
 * 동의 시트는 `2264:13125` · `2264:13294`.
 *
 * 닉네임·이메일·비밀번호·비밀번호 확인이 필수이고 생년월일은 선택이다.
 * 필수 네 칸이 채워지고 비밀번호 두 칸이 같아야 동의 시트를 열 수 있다.
 * 동의 시트에서 필수 두 항목에 동의하면 가입이 끝나고 환영 화면으로 간다.
 *
 * 실제 백엔드가 없는 데모 동작이다.
 * 비밀번호는 화면 표시에만 쓰고 어디에도 저장하지 않는다. (PROJECT_SPEC.md §6)
 */

/** 시안 `2264:13030`의 도메인 목록. 첫 줄의 `직접 입력`은 입력창으로 바뀌는 선택지다. */
const CUSTOM_DOMAIN = '__custom__'

const [FIRST_DOMAIN, ...OTHER_DOMAINS] = EMAIL_DOMAINS

const DOMAIN_OPTIONS: AuthSelectOption[] = [
  { value: FIRST_DOMAIN, label: FIRST_DOMAIN },
  { value: CUSTOM_DOMAIN, label: '직접 입력' },
  ...OTHER_DOMAINS.map((domain) => ({ value: domain, label: domain })),
]

/** 생년월일 월. 시안에 목록 모양이 없어 도메인 선택과 같은 구조로 1~12월을 넣었다. */
const MONTH_OPTIONS: AuthSelectOption[] = Array.from({ length: 12 }, (_, index) => {
  const month = String(index + 1).padStart(2, '0')
  return { value: month, label: `${index + 1}월` }
})

function SignupPage() {
  const { personaId, signIn } = useSession()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [nickname, setNickname] = useState('')
  const [emailId, setEmailId] = useState('')
  const [emailDomain, setEmailDomain] = useState<string>(EMAIL_DOMAINS[0])
  const [isCustomDomain, setIsCustomDomain] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)
  const [birthYear, setBirthYear] = useState('')
  const [birthMonth, setBirthMonth] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [agree, setAgree] = useState<AgreeState>(EMPTY_AGREE)
  const [isAgreeOpen, setIsAgreeOpen] = useState(false)

  /** 가입 후 돌아갈 곳. 앱 내부 경로만 허용한다. (PROJECT_SPEC.md §7-5) */
  const rawFrom = searchParams.get('from')
  const from = rawFrom && rawFrom.startsWith('/') && !rawFrom.startsWith('//') ? rawFrom : PATHS.home

  const isNicknameValid = nickname.length >= 2 && nickname.length <= 6
  const isPasswordMatched = password !== '' && password === passwordConfirm
  const canOpenAgree = isNicknameValid && emailId.trim() !== '' && isPasswordMatched

  /** 발표에서 타이핑 없이 넘어가기 위한 한 번에 채우기. 시안의 값과 같다. */
  const handleDemoFill = () => {
    setNickname(AUTH_DEMO_ACCOUNT.nickname)
    setEmailId(AUTH_DEMO_ACCOUNT.emailId)
    setEmailDomain(AUTH_DEMO_ACCOUNT.emailDomain)
    setIsCustomDomain(false)
    setPassword(AUTH_DEMO_ACCOUNT.password)
    setPasswordConfirm(AUTH_DEMO_ACCOUNT.password)
    setBirthYear(AUTH_DEMO_ACCOUNT.birthYear)
    setBirthMonth(AUTH_DEMO_ACCOUNT.birthMonth)
    setBirthDay(AUTH_DEMO_ACCOUNT.birthDay)
  }

  const handleComplete = () => {
    setIsAgreeOpen(false)
    signIn(personaId)
    // 환영 화면을 거쳐 원래 가려던 곳으로 이어진다.
    navigate(`${PATHS.signupComplete}?from=${encodeURIComponent(from)}`, { replace: true })
  }

  return (
    <main className="signUp">
      <div className="signUpFields">
        <button type="button" className="signUpDemoFill" onClick={handleDemoFill}>
          서아 계정으로 채우기
        </button>

        {/* 닉네임 */}
        <div className="signUpField">
          <p className="signUpLabel">
            <b>*</b> 닉네임 <em>(2~6자)</em>
          </p>
          <div className="signUpInputBox">
            <input
              className="signUpInput"
              type="text"
              value={nickname}
              maxLength={6}
              onChange={(event) => setNickname(event.target.value)}
            />
          </div>
          <p className={isNicknameValid ? 'signUpHelp signUpHelpOk' : 'signUpHelp'}>
            {isNicknameValid ? '사용 가능한 닉네임이에요.' : '특수기호 없이 적어주세요'}
          </p>
        </div>

        {/* 이메일 아이디 */}
        <div className="signUpField">
          <p className="signUpLabel">
            <b>*</b> 이메일 아이디
          </p>
          <div className="signUpRow">
            <div className="signUpInputBox signUpInputBoxGrow">
              <input
                className="signUpInput"
                type="text"
                autoComplete="username"
                value={emailId}
                onChange={(event) => setEmailId(event.target.value)}
              />
            </div>
            <span className="signUpAt" aria-hidden="true">@</span>
            <div className="signUpInputBox signUpDomainBox">
              {isCustomDomain ? (
                /* `직접 입력`을 고르면 같은 자리가 입력창이 된다. 되돌리려면 비우고 나간다. */
                <input
                  className="signUpInput signUpInputDomain"
                  type="text"
                  aria-label="이메일 도메인 직접 입력"
                  placeholder="직접 입력"
                  value={emailDomain}
                  autoFocus
                  onChange={(event) => setEmailDomain(event.target.value)}
                  onBlur={() => {
                    if (emailDomain.trim() === '') {
                      setIsCustomDomain(false)
                      setEmailDomain(EMAIL_DOMAINS[0])
                    }
                  }}
                />
              ) : (
                <AuthSelect
                  options={DOMAIN_OPTIONS}
                  value={emailDomain}
                  ariaLabel="이메일 도메인"
                  closedLabel={emailDomain}
                  onChange={(next) => {
                    if (next === CUSTOM_DOMAIN) {
                      setIsCustomDomain(true)
                      setEmailDomain('')
                      return
                    }
                    setEmailDomain(next)
                  }}
                />
              )}
            </div>
          </div>
          <p className="signUpHelp signUpHelpHidden" aria-hidden="true">&nbsp;</p>
        </div>

        {/* 비밀번호 */}
        <div className="signUpField">
          <p className="signUpLabel">
            <b>*</b> 비밀번호 <em>(특수문자 포함, 8자 이상)</em>
          </p>
          <div className="signUpRow">
            <div className="signUpInputBox signUpInputBoxGrow signUpInputBoxTall">
              <input
                className="signUpInput"
                type={isPasswordVisible ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="signUpEye"
                onClick={() => setIsPasswordVisible((visible) => !visible)}
                aria-label={isPasswordVisible ? '비밀번호 가리기' : '비밀번호 보기'}
                aria-pressed={isPasswordVisible}
              >
                <img src={isPasswordVisible ? eyeOnIcon : eyeOffIcon} alt="" aria-hidden="true" />
              </button>
            </div>
            {password !== '' && (
              <button type="button" className="signUpClear" onClick={() => setPassword('')} aria-label="비밀번호 지우기">
                <img src={clearIcon} alt="" aria-hidden="true" />
              </button>
            )}
          </div>
          <p className="signUpHelp signUpHelpHidden" aria-hidden="true">&nbsp;</p>
        </div>

        {/* 비밀번호 확인 */}
        <div className="signUpField">
          <p className="signUpLabel">
            <b>*</b> 비밀번호 확인
          </p>
          <div className="signUpRow">
            <div className="signUpInputBox signUpInputBoxGrow signUpInputBoxTall">
              <input
                className="signUpInput"
                type={isConfirmVisible ? 'text' : 'password'}
                autoComplete="new-password"
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
              />
              <button
                type="button"
                className="signUpEye"
                onClick={() => setIsConfirmVisible((visible) => !visible)}
                aria-label={isConfirmVisible ? '비밀번호 가리기' : '비밀번호 보기'}
                aria-pressed={isConfirmVisible}
              >
                <img src={isConfirmVisible ? eyeOnIcon : eyeOffIcon} alt="" aria-hidden="true" />
              </button>
            </div>
            {passwordConfirm !== '' && (
              <button
                type="button"
                className="signUpClear"
                onClick={() => setPasswordConfirm('')}
                aria-label="비밀번호 확인 지우기"
              >
                <img src={clearIcon} alt="" aria-hidden="true" />
              </button>
            )}
          </div>
          {passwordConfirm === '' ? (
            <p className="signUpHelp signUpHelpHidden" aria-hidden="true">&nbsp;</p>
          ) : (
            <p className={isPasswordMatched ? 'signUpMatch' : 'signUpMatch signUpMatchNo'}>
              <img src={isPasswordMatched ? checkOnIcon : checkOffIcon} alt="" aria-hidden="true" />
              {isPasswordMatched ? '비밀번호 일치' : '비밀번호 불일치'}
            </p>
          )}
        </div>

        {/* 생년월일 (선택) */}
        <div className="signUpField">
          <p className="signUpLabel signUpLabelOptional">
            생년월일 <em>(선택)</em>
          </p>
          <div className="signUpRow">
            <div className="signUpInputBox signUpInputBoxThird">
              <label className="signUpSrOnly" htmlFor="signUpYear">출생 연도</label>
              <input
                id="signUpYear"
                className="signUpInput signUpInputNarrow"
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={birthYear}
                onChange={(event) => setBirthYear(event.target.value.replace(/\D/g, ''))}
              />
              <span className="signUpUnit">년</span>
            </div>
            <div className="signUpInputBox signUpInputBoxThird signUpMonthBox">
              <AuthSelect
                options={MONTH_OPTIONS}
                value={birthMonth}
                ariaLabel="출생 월"
                scrollable
                closedLabel={<span className="signUpSelectMonth">{birthMonth}</span>}
                suffix={<span className="signUpUnit">월</span>}
                onChange={setBirthMonth}
              />
            </div>
            <div className="signUpInputBox signUpInputBoxThird">
              <label className="signUpSrOnly" htmlFor="signUpDay">출생 일</label>
              <input
                id="signUpDay"
                className="signUpInput signUpInputNarrow"
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={birthDay}
                onChange={(event) => setBirthDay(event.target.value.replace(/\D/g, ''))}
              />
              <span className="signUpUnit">일</span>
            </div>
          </div>
          <p className="signUpHelp signUpHelpBirth">
            생년월일 입력시 생일 때 <b>ai판결 추가 이용권</b>을 지급해드려요.
          </p>
        </div>
      </div>

      {/* 동의 열기 줄 */}
      <button
        type="button"
        className="signUpAgreeOpen"
        onClick={() => setIsAgreeOpen(true)}
        disabled={!canOpenAgree}
        title={canOpenAgree ? undefined : '위 항목을 모두 채우면 열 수 있어요'}
      >
        <span>
          <b>*</b> 어플 이용시 동의가 필요해요
        </span>
        <img src={addIcon} alt="" aria-hidden="true" />
      </button>

      <div className="signUpFooter">
        <button
          type="button"
          className="signUpSubmit"
          onClick={() => setIsAgreeOpen(true)}
          disabled={!canOpenAgree}
        >
          회원 가입 완료하기
        </button>
      </div>

      {isAgreeOpen && (
        <SignUpAgreeSheet
          value={agree}
          onChange={setAgree}
          onClose={() => setIsAgreeOpen(false)}
          onSubmit={handleComplete}
        />
      )}
    </main>
  )
}

export default SignupPage
