# 왈가왈BOT 현재 상태

마지막 업데이트: 2026-09-10

기준 문서는 `PROJECT_SPEC.md`다. 이 문서는 **현재 상태만** 기록한다.
규칙·토큰·구현 기준을 이 문서에 다시 적지 않는다.

## 검사 명령

```bash
npm run typecheck   # tsc -b --force
npm run lint        # eslint .
npm run build       # tsc -b && vite build
npm run dev
```

`tsconfig.json`이 프로젝트 참조(solution) 방식이라 `tsc --noEmit`은 아무것도 검사하지 않는다.
반드시 빌드 모드(`tsc -b`)를 쓴다.

## 결정 사항

| 날짜 | 결정 | 근거 |
| --- | --- | --- |
| 2026-09-08 | md 문서를 `PROJECT_SPEC.md` 하나로 통합 | 강사 제공 기준 초안 적용, 기존 6개 문서의 중복 제거 |
| 2026-09-08 | **TypeScript 전면 전환** | 강사 기준 "React + TypeScript + Vite", 팀 결정 |
| 2026-09-08 | React Router Declarative Mode 도입 | 라우터가 없던 상태 → 강사 기준의 기본안 채택 |
| 2026-09-08 | 스타일은 기존 일반 CSS 방식 유지 | 강사 기준 "스타일은 기존 프로젝트 방식을 유지한다" |
| 2026-09-08 | 402 × 874는 PC 목업 내부 크기로만 사용 | 강사 기준 "모바일에서는 402×874로 고정하지 않는다" |
| 2026-09-08 | **퍼소나 A=윤서아(신규 가입), B=곽지훈(기존 사용자), C 없음** | 팀 결정. 강사 초안은 3개를 전제하나 "실제 기획을 따른다" 단서 적용 |
| 2026-09-08 | 시스템 상태바·홈 인디케이터는 목업이 담당 | Figma `top_nav` 상단 62px = 상태바, `down_nav` 하단에 인디케이터 자리 확인 |
| 2026-09-08 | 페이지 폴더는 기존 대문자 표기 유지 | `Home/`, `Plaza/`, `Case/`, `Submit/`, `My/`가 이미 있음 |
| 2026-09-08 | **회원가입 화면(`/signup`)을 시안 없이 추가** | 팀 결정. 발표 시연에 필요. 확정 스타일가이드 토큰만 사용 |
| 2026-09-08 | 온보딩·별도 로그인 화면은 만들지 않음 | 시안도 없고 시연 흐름에도 없음 |
| 2026-09-08 | 곽지훈(B)은 가입 없이 계정 전환으로 진입 | 발표에서 윤서아 다음 순서라 로그인 시점이 필요 없음 |
| 2026-09-09 | **Figma `개발` 페이지에 올라온 화면만 구현 대상** | 팀 결정. 확정된 화면을 하나씩 옮겨 담기로 함 |
| 2026-09-09 | 아이콘은 `수정금지`의 **기타 아이콘 · nav · 화살표 · 꼬리화살표**만 사용 | 나머지는 참고용 모음이라 확정이 아님 (`PROJECT_SPEC.md` §9-17) |
| 2026-09-09 | 벡터 에셋은 Figma Plugin API `exportAsync`로 내보내 저장 | 프록시가 `figma.com` 직접 다운로드를 막아 에셋 URL을 받을 수 없음 |
| 2026-09-09 | 비트맵 에셋은 Figma에서 직접 내보내 폴더에 넣기 | 이그레스 정책이 `figma.com` 자산 URL을 막는다 |
| 2026-09-09 | 광장 에셋은 컴포넌트에서 직접 import | 자동 감지(`optionalImages.ts`) 없이 파일을 바로 넣는 편이 단순하다. 에셋 6종 반영 완료 |
| 2026-09-09 | **자료종합 페이지 전체를 기준 자료로 학습** | IA·유저플로우·설문·퍼소나·Font/Color가 모두 이 페이지에 있다. 아래 "자료종합 학습 기록" 참고 |
| 2026-09-09 | 미확정 항목을 본문에서 확정처럼 쓰지 않기 | §6의 관점 선택 3택 서술이 §9-12(미정)와 충돌했다. 본문은 §9를 가리키게만 두고 값은 §9에서 확정한다 |
| 2026-09-10 | 사건 접수(지훈01~05) 라우트를 `AppRoutes.tsx`에 다시 연결, `BottomNavigation`의 `사건 접수`를 `enabled: true`로 전환 | 사용자 요청. `src/pages/Submit/`은 이미 5단계가 모두 구현돼 있었으나, 배심원 광장 작업 중 `AppRoutes.tsx`·`BottomNavigation.tsx`가 다시 쓰이면서 연결이 빠져 있었다. §7-3 기준으로는 아직 `개발` 페이지에 없어 디자인 미확정이지만, 사용자가 지훈01~05 프레임을 직접 지정해 구현을 요청한 화면이라 라우트를 유지한다 (`CaseSubmitFlow.tsx` 상단 주석 참고) |
| 2026-09-10 | **챗봇(`/chatbot`) 구현. §9-6 해결** | 사용자가 Figma `Chatbot / Initial`·`Conversation`·`Conversation02`(node 1951:4051~4539, `개발` 페이지) 세 프레임을 직접 지정해 구현을 요청했다. 세 프레임은 한 화면의 상태 3개(대화 시작 전 / 진행 중 두 단계)라 라우트 하나로 합쳤다 |
| 2026-09-10 | `useWizardBack`을 `pages/Submit/`에서 `src/hooks/`로 승격 | 챗봇 헤더의 뒤로가기가 두 번째 사용처가 됐다. §7-2 "두 번째 사용이 확인되면 공통 폴더로" 규칙 적용 |

## 구현 상태

| 화면 | 디자인 | 구현 | 비고 |
| --- | --- | --- | --- |
| 홈 | **확정** (`김하은/홈수정`) | **구현됨** | 에셋·폰트 교체 남음 |
| 404 | — | **구현됨** | `pages/Error/NotFoundPage.tsx` |
| 배심원 광장 | **확정** (`개발 > 광장`) | **구현됨** | 에셋 반영 완료. 정렬·검색·페이지네이션 등 **기능 구현만 남음** |
| 사건 접수 (지훈01~05) | 작업 중 — `개발` 페이지에는 아직 없음 | **구현됨** | `/cases/new`~`/cases/new/complete` 5단계. 컨펌 섹션 지훈01~05(node 1446:9899~10071) 프레임을 사용자 요청으로 그대로 옮겼다 |
| 사건 상세 · AI 1심 | 작업 중 | 미착수 | `src/pages/Case/` 빈 폴더 |
| 왈가왈후~ (후일담) | 작업 중 | 미착수 | 폴더 없음 |
| MY | 작업 중 | 미착수 | `src/pages/My/` 빈 폴더 |
| 챗봇 | **확정** (`Chatbot / Initial`·`Conversation`·`Conversation02`, node 1951:4051~4539) | **구현됨** | `/chatbot`. mock 대화 스크립트, 응답 대기·오류·재시도 상태 포함 |
| 회원가입 `/signup` | **시안 없음** | **구현됨** | 팀 결정으로 추가. 더미값 readOnly + `더미텍스트 입력` 버튼 |
| 계정 전환 (시연 도구) | — | **구현됨** | `PersonaSwitcher` — PC 기기 바깥 패널 |
| 온보딩·별도 로그인 | — | 만들지 않음 | 시연 흐름에 없음 |

## 이번 작업에서 추가·변경한 파일

### 새로 만든 파일

```
tsconfig.json · tsconfig.app.json · tsconfig.node.json
vite.config.ts                          # vite.config.js 대체
src/vite-env.d.ts
src/main.tsx                            # main.jsx 대체, BrowserRouter 연결
src/App.tsx                             # App.jsx 대체
src/styles/tokens.css                   # 확정 스타일가이드 컬러·폰트·기기 크기
src/config/app.ts                       # 서비스·기기·배경·브레이크포인트·데모 설정
src/types/index.ts
src/routes/paths.ts · src/routes/AppRoutes.tsx
src/hooks/useIsDesktop.ts
src/components/device/DeviceFrame.tsx · DeviceFrame.css
src/components/device/StatusBar.tsx · HomeIndicator.tsx
src/components/device/AppViewport.tsx · AppViewport.css
src/components/common/BottomNavigation.tsx
src/layouts/ShowcaseLayout.tsx · ShowcaseLayout.css
src/layouts/MainLayout.tsx · MainLayout.css
src/pages/Home/HomePage.tsx             # Home.jsx 대체
src/pages/Error/NotFoundPage.tsx · NotFoundPage.css
src/data/common/homeContent.ts          # 홈 더미데이터 분리
src/data/personas/index.ts              # A 윤서아 · B 곽지훈 + 시연 계정
src/state/sessionContext.ts             # 세션 컨텍스트 타입
src/state/SessionProvider.tsx           # 퍼소나·로그인 상태, localStorage 복원
src/hooks/useSession.ts
src/layouts/AuthLayout.tsx · AuthLayout.css
src/pages/Auth/SignupPage.tsx · SignupPage.css   # 시안 없이 추가한 데모 화면
src/components/demo/PersonaSwitcher.tsx · PersonaSwitcher.css
```

### 고친 파일

- `package.json` — `typescript`, `typescript-eslint`, `react-router-dom` 추가.
  `typecheck` 스크립트 추가, `build`가 타입 검사를 먼저 실행
- `eslint.config.js` — TypeScript 파서 연결, 대상을 `**/*.{ts,tsx}`로 변경
- `index.html` — `/src/main.tsx`, `viewport-fit=cover`, `lang="ko"`, 타이틀
- `src/index.css` — 전역 초기화 확장 (`100dvh`, 폰트 변수)
- `src/pages/Home/Home.css` — `:root` 토큰과 전역 리셋을 분리해 내보냄,
  `.home-screen`의 402px·100vh 고정 제거, `.home-header` 66px로 조정,
  `.status-bar`·`.island`·`.bottom-nav`·`@media (min-width: 600px)` 제거,
  `.all-cases`를 링크로 쓸 수 있게 `display: block` + `text-align: center` 추가
- `src/pages/Home/HomePage.tsx` — `로그인 하고 사건 투표하기`를 `/signup` 링크로 연결
- `src/App.tsx` — `SessionProvider` 연결
- `src/routes/` — `/signup` 경로와 `AuthLayout` 추가
- `src/layouts/ShowcaseLayout.tsx` — 기기 바깥 패널에 `PersonaSwitcher` 배치

**레이아웃 수정 (2026-09-08 오후)**

- `src/pages/Home/Home.css` — `.home-screen`의 `overflow: hidden`을 `overflow-x: clip`으로.
  `hidden`은 스크롤 컨테이너를 만들어 `.home-header`의 `position: sticky`를 무력화했다
- `src/components/device/DeviceFrame.tsx` · `.css` — `.device-frame-fit` 래퍼 추가.
  `transform: scale()`이 레이아웃 자리를 줄이지 않아 기기 아래 빈 공간이 생기던 문제 수정.
  프레임 폭을 `화면 + 24`에서 `화면 + 30`으로 정정 (검은 베젤 3px × 2 누락이라
  화면이 베젤을 밀고 나가 오른쪽 테두리만 얇았다)
- `src/config/app.ts` — `DEVICE_FRAME` 추가. 프레임·베젤 두께를 상수로 분리
- `src/layouts/ShowcaseLayout.tsx` · `.css` — 절대 위치 패널을 걷어내고
  좌 패널 · 기기 · 우 패널의 3단 flex로. 양쪽 폭이 같아 기기가 항상 가로 중앙에 온다.
  축소 비율을 `(창 높이 − 여백) / 기기 높이`로 정정.
  `화면에 맞추기`에서는 페이지 스크롤을 막아 가로 중앙이 밀리지 않게 했다
- `src/layouts/MainLayout.css` · `AuthLayout.css` — 기기 안 데스크톱 스크롤바 숨김
  (스크롤 동작은 유지)
- `src/state/SessionProvider.tsx` — 복원을 effect에서 첫 렌더 초기값으로 이동.
  저장은 effect로 분리 (린트 `react-hooks/set-state-in-effect`)
- `src/layouts/ShowcaseLayout.tsx` — 축소 비율을 state에서 빼고 렌더 중 계산 (같은 린트 규칙)

**배심원 광장 (2026-09-09)**

새로 만든 파일

```
src/pages/Plaza/PlazaPage.tsx
src/pages/Plaza/Plaza.css
src/pages/Plaza/components/RankingHeroSection.tsx
src/pages/Plaza/components/CaseFeedSection.tsx
src/data/common/plazaContent.ts        # 랭킹·카테고리·사건 목록 더미데이터
src/components/common/TopBar.tsx · TopBar.css
src/assets/icons/                      # 17개 (nav 5, 기타 아이콘, 화살표, 꼬리화살표)
src/assets/plaza/rank-1.svg            # 왈가닥이
src/assets/plaza/rank-2.svg            # 왈랑이
```

고친 파일

- `src/pages/Home/HomePage.tsx` — 화면 안에 있던 앱 헤더를 공통 `TopBar`로 올림
  (§7-2 "두 번째 사용이 확인되면 공통 폴더로" 규칙 적용)
- `src/components/common/BottomNavigation.tsx` — 문자 아이콘을 실제 SVG로 교체.
  아이콘 경로를 `--nav-icon` CSS 변수로 넘긴다. 인라인 `mask-image`를 쓰면
  중앙 CTA의 원형 배경까지 함께 잘려 나간다. `배심원 광장`을 `enabled: true`로 전환
- `src/layouts/MainLayout.css` — `.bottom-nav__icon`과 CTA `::after`가
  `var(--nav-icon)`을 마스크로 쓰도록 정정 (`mask-image: inherit`은 동작하지 않았다)
- `src/routes/AppRoutes.tsx` — `/plaza` 라우트 추가
- `src/routes/paths.ts` — `plaza` 경로 상수
- `src/types/index.ts` — `JurorRank`, `PlazaSortKey` 추가

### 삭제 정리

**TypeScript 전환으로 대체된 파일 — 2026-09-08 삭제 완료 (폴더에서 확인함)**

`vite.config.js` · `src/main.jsx` · `src/App.jsx` · `src/App.css` · `src/pages/Home/Home.jsx`

**통합 문서 4개 — 2026-09-09 삭제 완료**

`PRD.md` · `design-analysis.md` · `project_rules.md` · `SKILL.md`

2026-09-08 기록에는 이미 삭제했다고 적혀 있었지만, 09-09에 확인해 보니
안내표만 남은 껍데기 파일 네 개가 그대로 있었다. 같은 날 실제로 지웠다.

이제 문서는 네 개다 — `PROJECT_SPEC.md`(기준) · `PROJECT_CONTEXT.md`(상태) ·
`CLAUDE.md` / `AGENTS.md`(진입점).

## 홈 화면 잔여 항목

- 상단 헤더 sticky, 기기 테두리 좌우 두께, 기기 안 스크롤바는 2026-09-08에 수정 완료.
- 아이콘·일러스트가 아직 문자 표시(`●ᴗ●`, `⌂`, `♟`, `⌕`)다.
  `src/assets/home/figma/`의 실제 SVG·PNG로 교체해야 한다.
- Paperlogy·Pretendard 폰트 파일이 `src/assets/fonts/`에 있으나
  `@font-face` 등록이 아직 없다.
- 하단바 아이콘은 2026-09-09에 실제 SVG로 교체 완료.
  배심원 광장도 활성화했다. 사건 접수·왈가왈후~·MY는 아직 라우트가 없어 비활성이다.
  각 화면이 생기면 `BottomNavigation.tsx`의 `enabled`만 켜면 된다.
- 앱 헤더는 2026-09-09에 공통 `TopBar`로 올렸다.

## 배심원 광장 잔여 항목

**에셋은 끝났다 (2026-09-09).** `src/assets/plaza/`에 6종이 들어와 있고
`RankingHeroSection.tsx`가 직접 import 한다.

```
hero-bg.webp · hero-mascot.png · hero-trophy.png
rank-1.png · rank-2.png · rank-3.png
```

이전 기록에 있던 `hero.png` / `hero-bg.png` 3종 규격과
`src/assets/plaza/optionalImages.ts`(폴더를 훑어 자동 반영) 방식은 **더 이상 쓰지 않는다.**
그 파일은 만들지 않았고, 1·2위 마스코트도 SVG가 아니라 PNG로 교체됐다.

남은 것은 **기능 구현뿐이다.**

- 정렬·검색·페이지네이션은 동작 후 화면이 시안에 없어 비활성으로 두었다.
  카테고리 칩만 실제로 목록을 거른다. (§9-14)
- 랭킹 탭은 선택 상태만 로컬로 표현한다. 탭별 목록은 시안에 없다. (§9-13)
- `랭킹 보러가기`는 이동할 화면이 없어 링크를 걸지 않았다. (§9-15)

## 챗봇 (2026-09-10)

Figma `Chatbot / Initial`(1951:4252) · `Chatbot / Conversation`(1951:4539) ·
`Chatbot / Conversation02`(1951:4051) 세 프레임 — 대화 시작 전 화면과, 대화가 진행된
두 시점의 스냅샷이라 `/chatbot` 라우트 하나에서 상태로 표현했다.

새로 만든 파일

```
src/pages/Chatbot/ChatbotPage.tsx
src/pages/Chatbot/Chatbot.css
src/pages/Chatbot/chatbotScript.ts        # mock 대화 스크립트(스텝·선택지·자유 입력 분기)
src/pages/Chatbot/types.ts
src/pages/Chatbot/components/ChatbotHeader.tsx
src/pages/Chatbot/components/ChatbotComposer.tsx
src/pages/Chatbot/components/ChatEmptyState.tsx
src/pages/Chatbot/components/ChatOptionButtons.tsx
src/pages/Chatbot/components/BotMessageContent.tsx
src/services/chatbotService.ts            # mock 응답 경계. 실제 API로 바꿀 때 이 파일만 교체
src/assets/chatbot/figma/imgBotLogo.png · imgAddButton.svg · imgSendArrow.svg
```

고친 파일

- `src/routes/paths.ts` · `AppRoutes.tsx` — `/chatbot` 경로 추가(`DetailLayout`, 하단바 없음)
- `src/pages/Home/components/AiRecommendSection.tsx` · `Home.css` — AI 추천 카드를
  `/chatbot`으로 연결(§9-6 해결). 챗봇 화면 미확정이라 링크를 걸지 않았던 이전 상태를 대체
- `src/pages/Submit/useWizardBack.ts` → `src/hooks/useWizardBack.ts`로 이동.
  `CaseSubmit*.tsx` 4개 파일의 import 경로만 갱신(동작 변경 없음)

구현 메모

- **"내 사건에 대해 물어볼게요"**는 세션 퍼소나로 분기한다. 곽지훈(B)만 최근 사건이 있는
  데모 상태라 Figma 시안 그대로(최근 사건 카드 + 2버튼)를 보여주고, 윤서아(A)나 비로그인은
  "아직 접수한 사건이 없어요" 빈 상태로 안내한다. (§9-1의 곽지훈 메모 — 프리랜서 잔금 사건 — 기준)
- Figma가 다루지 않은 분기(초기 5칩 중 4개, "메시지만 있어요" 등 세부 답변)는 §0-6 안전
  원칙에 맞춰 새로 썼고, 모든 종착 답변에 `다른 질문 할게요`를 달아 대화가 막히지 않게 했다.
- 자유 텍스트 입력은 실제 NLP가 아니라 스텝별 `freeTextNext`를 따라간다.
  정의되지 않은 지점에서 입력하면 "정해진 답변만 드릴 수 있어요" 안내 후 같은 선택지를
  다시 보여준다 — mock임을 숨기지 않는다는 원칙(§6)에 따른 선택.
- 응답 대기(타이핑 표시)·오류·재시도가 실제로 동작한다. `chatbotService`가 낮은 확률(12%)로
  실패를 재현해 재시도 버튼을 검증할 수 있게 했다.
- 아이콘 3종(첨부 `+`, 전송 화살표, 봇 얼굴)은 Figma MCP 에셋 URL에서 실제로 내려받아
  그대로 저장했다(§1-4 "실제 제공 에셋 우선 사용"). 헤더 뒤로가기는 새 아이콘을 만들지 않고
  기존 `chevron-right.svg`를 좌우 반전해 재사용했다(사건 접수 헤더와 같은 방식).
- `imgBotLogo.png`가 1.2MB로 크다(Figma 원본 그대로). 홈의 `perilla-table.png`(2.1MB) 등과
  같은 종류의 후속 정리 대상이라 별도로 처리하지 않았다.

검증

- `npm run typecheck` · `npm run lint` · `npm run build` 모두 통과.
- Puppeteer(로컬 Chrome, 390×844, 데스크톱 기준 미만이라 PC 목업 없이 실기기 폭) 로
  실제 클릭·타이핑을 재현: 첫 화면 → "내 사건에 대해 물어볼게요"(퍼소나 B로 전환해 확인) →
  응답 대기 표시 → 최근 사건 카드 → "이 사건으로 질문할게요" → 추천 질문 칩 →
  자유 텍스트 전송 → 뒤로가기(`/home`으로 이동) 전 과정 스크린샷 확인.
  `document.documentElement.scrollWidth === clientWidth`(가로 넘침 없음), 콘솔 오류 0건.
  퍼소나 A(기본값)로는 "아직 접수한 사건이 없어요" 빈 상태 분기도 확인됨.
- 실제 모바일 터치·키보드, PC 목업 배율에서의 확인은 미실행.

## 자료종합 학습 기록 (2026-09-09)

Figma `자료종합` 페이지(노드 `1264:12056`)의 최상위 16개 항목을 모두 읽었다.
상세 정리는 별도 노트에 있고, 여기에는 **기준 문서에 영향을 준 것만** 남긴다.

읽은 것

| 자료 | 노드 | 얻은 것 |
| --- | --- | --- |
| 유저플로우 1, 2 | `1264:12058` | 서아·지훈의 화면 단위 플로우, 1·2순위 퍼소나 보드 |
| 전제구조ia | `1264:12421` | 홈·광장·사건 상세·접수·후일담·MY·챗봇·FAQ 전체 IA |
| 결과요약 · 설문결과 | `1264:16599` · `1264:16611` | 설문 Q1~Q21 전체와 해석 주의사항 |
| 서아 · 지훈 | `1264:14326` · `1264:14357` | 퍼소나 나이·직업·유형·사건 예시·필요한 도움 |
| Font · Color · Corner_Radius | `1264:16617` · `16688` · `16878` | Headline 1~23 램프, 컬러 스케일, 임시 반경 |
| 왈 패밀리 · 컴포넌트_신상 | `1264:16913` · `1264:16932` | 캐릭터 3종 역할, `radio`/`RadioList`/`PanMungyee` 컴포넌트 |

새로 확인된 것

- **사건 상세의 화면 순서**가 IA에 정의되어 있다.
  `사건 본문 → AI가 정리한 핵심 쟁점 → 당신의 판단은?(투표) → AI와 배심원의 판단은? → 댓글`
- **투표 전에는 AI·배심원 판단을 보여주지 않는다**는 설계 이유가 명시돼 있다.
  "의견을 따라가는 편향이 생길 수 있으므로 투표 후에 보여준다."
- 결과 화면에는 배심원 최다 선택 비율, AI 최종 판결, **판단 확신도**(예: 68% · 73%),
  AI와 배심원의 일치/불일치 문구가 함께 들어간다.
- 챗봇은 추천 질문 칩 5종과 각 응답·이동 버튼까지 정의돼 있다.
- 사건 진행 상태는 5단계다.
  `사건 접수 완료 → AI 1심 완료 → 커뮤니티 공개 완료 → 배심원 투표 완료 → 결과 확인 가능`
- 계정 전환 경로는 `내정보 → 프로필 → 계정 전환`이다.

## 발표 시연 흐름

**윤서아 (퍼소나 A — 신규 사용자)**

```
비로그인 진입 → 홈 → 오늘 사건 `투표하러 가기`
→ 사건 상세 투표 화면 → `로그인하고 나도 투표하기`
→ /signup → `더미텍스트 입력` → `가입하고 투표하기` → 원래 화면 복귀
```

사건 상세 화면이 아직 없어서, 지금은 홈의 `로그인 하고 사건 투표하기` 버튼이
`/signup`으로 가는 임시 진입점이다.

**곽지훈 (퍼소나 B — 기존 사용자)**

가입 흐름 없음. PC 기기 바깥 패널의 계정 전환 버튼으로 윤서아 → 곽지훈으로 바꾼다.

## 서버 없이 표현한 데이터·상태

- 홈의 사건 카드·투표 수치·참여 인원은 모두 예시 데이터다 (`src/data/common/homeContent.ts`).
- 광장의 랭킹·포인트·사건 목록·페이지 수도 예시 데이터다 (`src/data/common/plazaContent.ts`).
  실제 집계가 아니며 카테고리 필터만 화면 로컬 상태로 동작한다.
- 밸런스 게임 선택은 화면 로컬 상태이며 저장되지 않는다.
- AI 판단은 실제 모델 결과가 아닌 UI 프로토타입이다.
- 로그인·알림·저장 API는 연결되어 있지 않다.
- 퍼소나별 저장소(`walgawalbot:demo:v1:*`)는 아직 사용하지 않는다.

## 다음 작업

1. `npm run typecheck && npm run lint && npm run dev`로 광장 화면 확인 (아직 안 함)
2. 광장 기능 구현 — 정렬·검색·페이지네이션·랭킹 탭. 동작 후 화면 시안이 없으므로
   §9-13~15를 먼저 확인한 뒤 붙인다
3. 모바일 폭(360·390·402·430)과 키보드가 열린 상태를 실기기 또는 기기 모드에서 확인
4. 홈 화면 실제 에셋·`@font-face` 적용
5. 사건 상세 시안이 나오면 가입 진입점(`로그인하고 나도 투표하기`)을 제자리로 옮긴다.
   지금은 홈의 `로그인 하고 사건 투표하기` 버튼에 임시로 걸려 있다
6. `개발` 페이지에 화면이 올라오는 순서대로 구현하고,
   완성되면 `BottomNavigation`의 `enabled`와 `AppRoutes`에 연결

## 마지막 검증 결과

2026-09-08 실행 결과.

| 검사 | 결과 | 비고 |
| --- | --- | --- |
| `npm install` | **통과** | 163 packages, 0 vulnerabilities |
| `npm run typecheck` | **통과** | `tsc -b --force`, 타입 오류 0건 |
| `npm run build` | **통과** | 28 modules, 143ms |
| `npm run lint` | **오류 2건 발견 → 수정함, 재실행 필요** | `react-hooks/set-state-in-effect` (`ShowcaseLayout.tsx`, `SessionProvider.tsx`). 규칙을 끄지 않고 구조를 바꿔 해결했다 |
| 브라우저 확인 | **미실행** | PC 목업·모바일 전환을 아직 눈으로 확인하지 못했다 |

배심원 광장(2026-09-09)은 아직 `typecheck` · `lint` · 브라우저 확인을 하지 않았다.

빌드 산출물

| 파일 | 크기 | gzip |
| --- | --- | --- |
| `index.js` | 236.78 kB | 75.78 kB |
| `index.css` | 12.61 kB | 3.58 kB |
| `perilla-table.png` | **2,127.51 kB** | — |

`perilla-table.png` 하나가 번들 전체보다 9배 크다.
`src/assets/home/`의 다른 이미지도 1~3.8 MB대라, 실제 에셋을 붙이기 전에
리사이즈나 WebP 변환을 검토해야 한다.

## 알려진 문제 / 확인 필요

`PROJECT_SPEC.md` §9에 정리되어 있다.
해결된 것은 §9-2(가입 화면), §9-4(하단바 표기), §9-5(홈 인디케이터),
§9-16(광장 비트맵 에셋), §9-17(아이콘 확정 범위), §9-6(챗봇 화면 형태 — `/chatbot` 구현됨)이다.

자료종합 학습에서 새로 올라온 것은 §9-18(기준 페이지 이관 범위),
§9-19(컬러 값 불일치 4건), §9-20(반경 토큰화 여부)이고,
§9-1(퍼소나 세부)과 §9-12(관점 선택)는 자료종합에서 근거를 찾아 내용을 보강했다.

가장 급한 것은 **§9-3 사건 상세 시안**이다.
시연 흐름의 가입 진입점이 사건 상세에 있어서, 그 화면이 나와야 흐름이 제자리를 찾는다.
그다음이 **§9-12 관점 선택**이다. 자료종합은 4택으로 일관되지만 문구가 세 가지로 갈려 있어
사건 상세를 만들기 전에 정해야 한다.

## 밸런스 게임 후속 구현 (2026-09-09)

- 현재 기준 Figma 노드: `1692:12930` (기존 `1402:7202`는 없어짐).
- 깻잎 + 사용자 승인 데모 문항 3개(새우 껍질·패딩 지퍼·차량 블루투스). 주제 참고: https://www.nocutnews.co.kr/news/5788798
- 새로고침 아이콘으로 1→2→3→4→1 순환. 문항별 선택은 로컬 상태로 유지하고 새로고침·퍼소나 전환 시 초기화.
- 좌우 버튼 및 Pointer Events 드래그 선택. PC 목업 배율 보정, 세로 스크롤·취소·짧은 탭은 선택하지 않음. 선택 결과를 스크린리더에 알림.
- 깻잎·접시 에셋을 Figma에서 별도로 렌더/내보냄. 처음 받은 원본 URL은 전 픽셀이 투명해 교체함.
- 타입 검사·린트·프로덕션 빌드 통과. Headless Edge에서 클릭·드래그·4문항 순환·선택 유지 및 폭 360/390/402/430/844/1366/1440의 가로 넘침 검사 통과.
- 실제 모바일 터치·키보드 실기기 검증은 미실행. PC↔모바일 레이아웃 변경 시 기존 상위 레이아웃이 재마운트되어 로컬 게임 상태가 초기화되는 현상은 공통 레이아웃 후속 항목.
- 최종 추가 검증: 투명 깻잎 PNG 적용 후 타입·린트·빌드 재통과. 키보드 Enter 선택, 축소된 PC 목업 드래그, pointercancel에서 기존 선택 유지 확인.

## 깻잎 선택 애니메이션 정정
- 사용자 첨부 시안을 우선 적용. 다른 3문항은 노출하지 않고 깻잎만 시연한다. 상단 아이콘은 다시하기이며 1/4 표시는 참조 시안 유지.
- 클릭/드래그 → 선택 접시 위 고정(400ms) → 점진 확대 → 1700ms 시점 깻잎 더미 이미지로 전환. 결과는 중앙 접시와 선택 문구로 표시하며 젓가락 깻잎을 위에 유지한다.
- 제공된 PNG를 perilla-pile.png로 원본 복사. 양쪽 모두 제공된 파란 접시 이미지를 사용하고 선택 문구는 해당 색상을 유지한다.
- 애니메이션 중 중복 선택 방지, 다시하기/이탈 시 타이머 정리, reduced-motion 전환 효과 제거.
- 타입·린트·빌드 통과. Edge에서 왼쪽 클릭·오른쪽 드래그·결과 전환·애니메이션 중 다시하기·360/402/430/1440 폭 넘침 검증 통과. 실기기 터치는 미검증.

- 깻잎 접시 정렬 수정: 젓가락 포함 이미지 박스 대신 잎 중심(가로 35%)을 접시 중심에 맞춤. 확대 원점도 잎 하단으로 변경. 깻잎 최대 확대 1.55→1.08, 선택 접시 1.2배·버튼 1.15배로 첨부 시안 비율 적용. 402px 브라우저에서 양쪽 확인, 오른쪽 잎/접시 중심 오차 0.01px 미만.

- 드래그 범위를 고정 ±70px에서 실제 양쪽 접시 중심까지의 거리로 변경. 초기 잎 중심도 보드 중앙으로 정렬. 선택 즉시 접시 중심에 고정한 뒤 확대 시작하며 결과의 잎 역시 중앙 정렬. Edge에서 양쪽 드래그 끝점 및 선택 후 50/500/1100ms 중심 오차 1px 미만 확인. 타입·린트·빌드 통과.

- 최종 상태 위치 조정: 확대 중 중앙 정렬은 유지하고 결과에서 잎 중심을 보드 너비 74%의 오른쪽 위로 이동. 750ms ease-out 전환, 좁은 화면에서 이미지 오른쪽 경계 제한. 402px Edge 렌더에서 위치/넘침 확인. reduced-motion 유지.

## 드래그 놓기 시점 정정
- 사용자 설명에 따라 드래그 중 접시에 접근하면 해당 접시를 900ms 동안 1.2배로 확대하는 미리보기로 변경. 잡고 있는 동안 결과를 확정하지 않는다.
- 접시에서 벗어나면 미리보기 해제. 유효 접시 위에서 pointerup일 때만 확정하고, 같은 접시 위치에서 중앙으로 확대/이동하면서 깻잎 더미로 교차 전환. 기존 놓은 뒤 1700ms 대기는 제거. 클릭도 동일한 확정 전환 사용.
- 양쪽 각각 1.9초 드래그 유지 시 미확정·1.2배 미리보기, 중앙 복귀 시 해제, 놓은 뒤 결과 전환 확인. 타입·린트·빌드 통과.

- 전환 자연스러움 수정: 놓은 뒤 빈 접시 확대(900ms)를 먼저 완료하고, 결과 이미지는 같은 위치/최종 크기에서 550ms opacity 교차 전환. 확대 중 결과 이미지가 나타나며 이동하던 효과 제거. Edge에서 확대 중 opacity 0 → 완료 후 1 및 초기화 확인, 타입·린트·빌드 통과.

- 빈 접시 2종 배경 제거: 흰 배경이 포함된 렌더 PNG를 Figma 원본 노드 1554:8700/1554:8699의 contentsOnly 투명 PNG로 교체. plate-left.png·plate-right.png 경로 유지, 실제 alpha 최소 0 확인. 접시 모양 재생성 없이 원본 보존.
