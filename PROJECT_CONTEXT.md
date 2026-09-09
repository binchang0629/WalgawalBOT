# 왈가왈BOT 현재 상태

마지막 업데이트: 2026-09-09

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
| 2026-09-09 | `DetailLayout` 신설, 하단바 없음 | PROJECT_SPEC.md §7-2 폴더 계획에 있던 레이아웃을 처음 구현. 지훈01~05 화면이 자체 헤더·진행률·하단 CTA를 모두 가지고 있어 레이아웃은 Outlet만 감싸는 얇은 틀로 두었다 |
| 2026-09-09 | `/cases/new*` 접근 가드 없음 | 로그인 필요 범위가 아직 미정이라(§9-9) 임의로 `RequireAuth`를 걸지 않았다 |
| 2026-09-09 | Figma `color/Blue/500`(#649EFF)를 `--blue-300`(#659EFF)에 매핑 | 프로젝트 컬러 스케일에 정확히 같은 값이 없다. 육안 차이가 없는 동일 계열 값이라 스케일 밖 새 색을 만드는 대신 가장 가까운 기존 토큰을 재사용했다 (PROJECT_SPEC.md §1-3) |
| 2026-09-09 | 사건 접수 지훈01~05 전 단계를 별도 라우트로 구현 | `/cases/new`(작성) → `/cases/new/questions`(추가 질문) → `/cases/new/summary`(요약 확인) → `/cases/new/opinion`(AI 참고 의견·접수) → `/cases/new/complete`(접수 완료). 각 단계가 새로고침·직접 URL 접근에도 견디도록 라우트로 나누고, 공유 입력 상태는 `CaseSubmitFlow`의 Context에 뒀다 |
| 2026-09-09 | `배심원 광장에 공개`는 선택 불가로 구현 | Figma 주석(node 1446:10059)에 "처음 진입 시 둘 다 회색, 배심원 광장은 비활성화, 나만보기만 클릭 시 주황"이라고 명시돼 있다. 공개 범위를 어디까지 열지 미정이라(§9-9) 시안 주석을 그대로 따랐다 — 사건 접수는 항상 `나만 보기`로만 완료된다 |
| 2026-09-09 | 지훈02~04의 질문·요약·AI 의견은 고정 예시(디자이너 잔금 미지급) 그대로 사용 | 실제 AI 없이 mock으로 구현하는 프로젝트라(§6), 1단계에 사용자가 무엇을 적든 그 내용을 실제로 분석해 질문·요약을 생성하지 않는다. Figma 시안의 예시 카피를 그대로 쓰고, 요약 화면의 제목·확인된 내용만 실제로 고쳐 쓸 수 있게 했다 |

## 구현 상태

| 화면 | 디자인 | 구현 | 비고 |
| --- | --- | --- | --- |
| 홈 | **확정** (`김하은/홈수정`) | **구현됨** | 에셋·폰트 교체 남음 |
| 404 | — | **구현됨** | `pages/Error/NotFoundPage.tsx` |
| 배심원 광장 | 작업 중 | 미착수 | `src/pages/Plaza/` 빈 폴더 |
| 사건 접수 (지훈01~05) | **확정** (node 1446:9899~10071) | **구현됨** | `/cases/new`~`/cases/new/complete` 5단계 모두 구현 |
| 사건 상세 · AI 1심 | 작업 중 | 미착수 | `src/pages/Case/` 빈 폴더 |
| 왈가왈후~ (후일담) | 작업 중 | 미착수 | 폴더 없음 |
| MY | 작업 중 | 미착수 | `src/pages/My/` 빈 폴더 |
| 챗봇 | 미확정 | 미착수 | 화면 형태 미정 (`PROJECT_SPEC.md` §9-6) |
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

### 2026-09-09 추가 — 사건 접수 지훈01~05 전체

Figma MCP(Dev Mode)로 지훈01~05 노드(파일 키 `5msPuamjPpGJOUFl0OXBOX`)의 실제 레이아웃·
색상·문구를 각각 읽어 그대로 옮겼다. 처음에는 지훈01만 구현했다가(위 결정 사항 참고),
이어서 나머지 4단계도 같은 방식으로 구현했다.

| 단계 | Figma 프레임 | node | 라우트 | 페이지 컴포넌트 |
| --- | --- | --- | --- | --- |
| 1 | 지훈01 / 사건 작성 · 기본 | 1446:9899 | `/cases/new` | `CaseSubmitPage` |
| 2 | 지훈02 / 추가 질문 | 1446:9956 | `/cases/new/questions` | `CaseSubmitQuestionsPage` |
| 3 | 지훈03 / 요약 확인 | 1446:10011 | `/cases/new/summary` | `CaseSubmitSummaryPage` |
| 4 | 지훈04 / AI 참고 의견·접수 | 1446:10041 | `/cases/new/opinion` | `CaseSubmitOpinionPage` |
| 5 | 지훈05 / 접수 완료 | 1446:10071 | `/cases/new/complete` | `CaseSubmitCompletePage` |

새로 만든 파일:

```
src/layouts/DetailLayout.tsx · DetailLayout.css
src/pages/Submit/CaseSubmitFlow.tsx              # 5단계 공유 상태 Provider + Outlet
src/pages/Submit/caseSubmitDraftContext.ts · useCaseSubmitDraft.ts
src/pages/Submit/useWizardBack.ts                # 단계 공통 뒤로가기(AuthLayout과 같은 패턴)
src/pages/Submit/types.ts                        # Relationship·QuestionAnswers·Visibility 등
src/pages/Submit/caseSubmitContent.ts            # 고정 예시 사연(요약·AI 의견) 텍스트
src/pages/Submit/CaseSubmit.css                  # 헤더·진행률·본문·CTA 등 5단계 공통 스타일
src/pages/Submit/components/CaseSubmitHeader.tsx
src/pages/Submit/components/CaseSubmitProgress.tsx
src/pages/Submit/components/CaseSubmitFooter.tsx
src/pages/Submit/CaseSubmitPage.tsx · CaseSubmitPage.css                 # 1단계
src/pages/Submit/CaseSubmitQuestionsPage.tsx · CaseSubmitQuestionsPage.css  # 2단계
src/pages/Submit/CaseSubmitSummaryPage.tsx · CaseSubmitSummaryPage.css     # 3단계
src/pages/Submit/CaseSubmitOpinionPage.tsx · CaseSubmitOpinionPage.css     # 4단계
src/pages/Submit/CaseSubmitCompletePage.tsx · CaseSubmitCompletePage.css  # 5단계
src/assets/submit/figma/imgChevronLeft.svg        # 헤더 뒤로가기 (#78757A)
src/assets/submit/figma/imgCheck.svg              # 선택된 항목의 체크 표시
src/assets/submit/figma/imgCharacterWalangJoy.svg # 판멍이 인라인 도움말 캐릭터
src/assets/submit/figma/imgRadioSelected.svg · imgRadioDefault.svg  # 4단계 공개 범위 라디오
src/assets/submit/figma/imgPanMungyeeJudge.png    # 5단계 판사 옷 판멍이 일러스트
```

고친 파일:

- `src/routes/paths.ts` — `caseSubmitQuestions`·`caseSubmitSummary`·`caseSubmitOpinion`·`caseSubmitComplete` 추가
- `src/routes/AppRoutes.tsx` — `DetailLayout` 아래 `CaseSubmitFlow`로 5개 라우트를 중첩 연결
- `src/components/common/BottomNavigation.tsx` — `사건 접수` 항목 `enabled: true`로 전환

단계 간 공유 상태:

5단계 모두 새로고침·직접 URL 접근에 견뎌야 해서(§7-7) 화면마다 독립된 라우트로 나눴다.
관계·첨부·사건 내용·질문 답변·요약·공개 범위처럼 여러 단계가 함께 쓰는 값은
화면 로컬 state가 아니라 `CaseSubmitFlow`가 들고 있는 Context(`useCaseSubmitDraft`)에 둔다.
세션·퍼소나처럼 앱 전역 상태가 아니라 이 흐름 안에서만 쓰는 상태라
`src/state/`가 아니라 `src/pages/Submit/`에 뒀다.

각 단계는 이전 단계 데이터가 없으면(예: 1단계를 거치지 않고 `/cases/new/summary`를 직접 열면)
`<Navigate>`로 앞 단계로 돌려보낸다 — 빈 상태를 완료된 것처럼 보여주지 않는다.

화면 동작 — 단계별로 정직하게 구현/미구현을 구분했다:

- **1단계** `상대와의 관계`는 6개 칩 중 단일 선택, 기본 미선택 → 선택 시 주황 + 체크.
  `사진 추가`/`파일 첨부`는 실제 `<input type=file>`로 선택한 파일명을 목록에 보여준다
  (실제 업로드는 없음 — 백엔드가 없는 데모 범위). `사건 내용`은 1,000자 제한 + 실시간 글자 수,
  비어 있으면 `다음`이 비활성 상태를 유지한다.
- **2단계** 3개 질문(최종 파일 전달 기록 / 계약서 잔금 지급일 / 수정 범위)이 모두
  실제 3지선다 단일 선택이며, 전부 답해야 `AI 요약 확인하기`가 활성화된다.
  첫 질문에서 `있어요`를 고르면 실제로 입력 가능한 추가 설명 textarea가 열린다.
- **3단계** `사건 요약`의 제목·확인된 내용만 `수정하기`로 실제 편집 가능(진짜 상태 변경).
  `확인이 필요한 쟁점`·`원하는 도움`은 AI가 정리한 결과로 취급해 이 화면에서 고치지 않는다.
  제목·확인된 내용이 비어 있으면 다음 버튼이 비활성화된다.
- **4단계** `배심원 광장에 공개`는 Figma 주석(node 1446:10059: "처음 진입 시 둘 다 회색,
  배심원 광장은 비활성화, 나만보기만 클릭 시 주황")을 그대로 따라 **선택할 수 없게** 뒀다.
  `나만 보기`를 실제로 선택해야만 `사건 접수하기`가 활성화된다.
- **5단계** 접수를 실제로 마치지 않고(Context의 `isSubmitted`가 false인 채) URL로 바로 열면
  1단계로 돌려보낸다. 뒤로가기·`홈으로 돌아가기` 모두 `/home`으로 이동한다.
- 모든 단계의 `임시저장`은 아직 구현 범위 밖이라 `BottomNavigation`의 미구현 항목과
  같은 방식으로 **비활성 버튼**으로 뒀다. 성공한 것처럼 보이는 가짜 동작을 만들지 않았다.
- 1단계 뒤로가기는 `AuthLayout`과 같은 패턴 — 앱 내부 이력이 있으면 `navigate(-1)`,
  외부에서 바로 들어온 경우 `BACK_FALLBACK.cases`(`/plaza`)로 이동한다.
  2~4단계는 같은 패턴으로 바로 이전 단계 라우트가 fallback이다.

지훈02~04의 질문·요약·AI 의견 문구는 Figma의 고정 예시 사연(디자이너 잔금 미지급 분쟁)
그대로다 — 실제 생성형 AI가 1단계 내용을 읽고 만든 결과가 아니다 (PROJECT_SPEC.md §6).

검증 (2026-09-09 재실행):

| 검사 | 결과 |
| --- | --- |
| `npm install` | **통과** (162 packages, 0 vulnerabilities) |
| `npm run typecheck` | **통과** |
| `npm run lint` | **통과** |
| `npm run build` | **통과** (84 modules) |
| 브라우저 확인 | **실행함** — Playwright(Chromium headless)로 402×900에서 지훈01→02→03→04→05
  전체 흐름을 실제로 조작(칩·질문 선택, textarea 입력, 요약 편집, 공개 범위 선택, 제출)했고
  각 단계의 URL 전환·버튼 활성화 조건이 의도대로 동작함을 확인했다. `/cases/new/summary`를
  중간 상태 없이 직접 열면 1단계로 리다이렉트되는 가드도 확인했다. 콘솔 에러 0건.
  스크린샷이 Figma 시안과 일치함을 육안으로 확인했다 |

### 삭제 정리

2026-09-08 삭제 완료.

TypeScript 전환으로 대체된 파일:
`vite.config.js` · `src/main.jsx` · `src/App.jsx` · `src/App.css` · `src/pages/Home/Home.jsx`

`PROJECT_SPEC.md`로 통합되어 삭제한 문서:
`PRD.md` · `design-analysis.md` · `project_rules.md` · `SKILL.md`

아직 문서 기준을 잡는 단계이고 코드 작업자가 한 명뿐이라,
안내문을 남겨 둘 필요 없이 바로 정리했다.
남은 문서는 `PROJECT_SPEC.md`(기준) · `PROJECT_CONTEXT.md`(상태) ·
`CLAUDE.md` / `AGENTS.md`(진입점) 네 개다.

## 홈 화면 잔여 항목

- 상단 헤더 sticky, 기기 테두리 좌우 두께, 기기 안 스크롤바는 2026-09-08에 수정 완료.
- 아이콘·일러스트가 아직 문자 표시(`●ᴗ●`, `⌂`, `♟`, `⌕`)다.
  `src/assets/home/figma/`의 실제 SVG·PNG로 교체해야 한다.
- Paperlogy·Pretendard 폰트 파일이 `src/assets/fonts/`에 있으나
  `@font-face` 등록이 아직 없다.
- 하단바의 배심원 광장·왈가왈후~·MY는 라우트가 없어 비활성 상태다.
  `사건 접수`는 2026-09-09에 라우트가 생겨 활성화했다.
  나머지도 화면이 생기면 `BottomNavigation.tsx`의 `enabled`만 켜면 된다.
- 앱 헤더가 아직 `HomePage.tsx` 안에 있다.
  두 번째 화면 컨펌 시 `TopBar` 공통 컴포넌트로 올린다.

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
- 밸런스 게임 선택은 화면 로컬 상태이며 저장되지 않는다.
- AI 판단은 실제 모델 결과가 아닌 UI 프로토타입이다.
- 로그인·알림·저장 API는 연결되어 있지 않다.
- 퍼소나별 저장소(`walgawalbot:demo:v1:*`)는 아직 사용하지 않는다.

## 다음 작업

1. `npm run lint`를 다시 실행해 2건이 해결됐는지 확인하고 결과를 이 문서에 기록
2. 모바일 폭(360·390·402·430)과 키보드가 열린 상태를 실기기 또는 기기 모드에서 확인
3. 홈 화면 실제 에셋·`@font-face` 적용
4. 사건 상세 시안이 나오면 가입 진입점(`로그인하고 나도 투표하기`)을 제자리로 옮긴다.
   지금은 홈의 `로그인 하고 사건 투표하기` 버튼에 임시로 걸려 있다
5. 확정된 화면부터 담당자별 구현, 완성되면 `BottomNavigation`과 `AppRoutes`에 연결
6. 접수한 사건이 실제 목록·MY에 반영되도록 연결 (지훈05는 아직 접수 후 어디로도 저장하지 않는다.
   `CaseSubmitFlow`의 Context는 페이지를 벗어나면 사라지는 화면 상태일 뿐이다)
7. 사건 접수 로그인 필요 여부가 정해지면 `/cases/new*`에 `RequireAuth` 적용 여부 반영 (§9-9)
8. 공개 범위(§9-9)가 정해지면 `배심원 광장에 공개`를 실제로 선택 가능하게 전환

## 마지막 검증 결과

2026-09-08 실행 결과.

| 검사 | 결과 | 비고 |
| --- | --- | --- |
| `npm install` | **통과** | 163 packages, 0 vulnerabilities |
| `npm run typecheck` | **통과** | `tsc -b --force`, 타입 오류 0건 |
| `npm run build` | **통과** | 28 modules, 143ms |
| `npm run lint` | **오류 2건 발견 → 수정함, 재실행 필요** | `react-hooks/set-state-in-effect` (`ShowcaseLayout.tsx`, `SessionProvider.tsx`). 규칙을 끄지 않고 구조를 바꿔 해결했다 |
| 브라우저 확인 | **미실행** | PC 목업·모바일 전환을 아직 눈으로 확인하지 못했다 |

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

`PROJECT_SPEC.md` §9에 11개 항목으로 정리되어 있다.
해결된 것은 §9-5(홈 인디케이터), §9-4(하단바 표기), §9-2(가입 화면 — 팀 결정으로 추가)다.
가장 급한 것은 **§9-3 사건 상세 시안**이다.
시연 흐름의 가입 진입점이 사건 상세에 있어서, 그 화면이 나와야 흐름이 제자리를 찾는다.
