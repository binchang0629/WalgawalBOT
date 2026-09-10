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
| 2026-09-09 | `/login`을 시안 전 임시 연결 화면으로 추가 | 비로그인 상세 → 로그인 → 투표 가능 상세 흐름 확인용. 시안 확정 후 UI 교체 |
| 2026-09-08 | 곽지훈(B)은 가입 없이 계정 전환으로 진입 | 발표에서 윤서아 다음 순서라 로그인 시점이 필요 없음 |
| 2026-09-09 | **Figma `개발` 페이지에 올라온 화면만 구현 대상** | 팀 결정. 확정된 화면을 하나씩 옮겨 담기로 함 |
| 2026-09-09 | 아이콘은 `수정금지`의 **기타 아이콘 · nav · 화살표 · 꼬리화살표**만 사용 | 나머지는 참고용 모음이라 확정이 아님 (`PROJECT_SPEC.md` §9-17) |
| 2026-09-09 | 벡터 에셋은 Figma Plugin API `exportAsync`로 내보내 저장 | 프록시가 `figma.com` 직접 다운로드를 막아 에셋 URL을 받을 수 없음 |
| 2026-09-09 | 비트맵 에셋은 Figma에서 직접 내보내 폴더에 넣기 | 이그레스 정책이 `figma.com` 자산 URL을 막는다. 정해진 파일명으로 넣으면 코드 수정 없이 붙도록 처리 |

## 구현 상태

| 화면 | 디자인 | 구현 | 비고 |
| --- | --- | --- | --- |
| 홈 | **확정** (`김하은/홈수정`) | **구현됨** | 에셋·폰트 교체 남음 |
| 404 | — | **구현됨** | `pages/Error/NotFoundPage.tsx` |
| 배심원 광장 | **확정** (`개발 > 광장`) | **구현됨** | 정렬/검색/페이지네이션 동작 남음 |
| 사건 접수 | 작업 중 | 미착수 | `src/pages/Submit/` 빈 폴더 |
| 사건 상세 · AI 1심 | **축의금 로그인 전·후1 확정** (`1507:12874`, `1507:12987`) | **축의금 투표 상세 구현됨** | 로그인 후 카드 선택·투표 가능. 결과·AI 1심은 미정 |
| 왈가왈후~ (후일담) | 작업 중 | 미착수 | 폴더 없음 |
| MY | 작업 중 | 미착수 | `src/pages/My/` 빈 폴더 |
| 챗봇 | 미확정 | 미착수 | 화면 형태 미정 (`PROJECT_SPEC.md` §9-6) |
| 회원가입 `/signup` | **시안 없음** | **구현됨** | 팀 결정으로 추가. 더미값 readOnly + `더미텍스트 입력` 버튼 |
| 로그인 `/login` | **시안 없음** | **임시 연결 화면 구현됨** | 디자인 확정 전 데모 로그인 → 원래 상세 복귀 |
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
src/pages/Auth/LoginPage.tsx · LoginPage.css     # 시안 전 임시 로그인 연결 화면
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

**축의금 사건 상세 (2026-09-09)**

새로 만든 파일

```
src/pages/Case/CaseDetailPage.tsx · CaseDetailPage.css
src/data/common/caseDetailContent.ts
src/assets/case/                         # Figma 원본 SVG 6종
```

고친 파일

- `src/routes/AppRoutes.tsx` — `/cases/:caseId` 상세 라우트 연결
- `src/pages/Home/HomePage.tsx` · `Home.css` — 오늘 사건 CTA를 축의금 상세로 연결
- `src/styles/tokens.css` — 보유한 Paperlogy·Pretendard 폰트 파일을 `@font-face`로 등록
- 축의금 상세의 본문·AI 핵심요약·4개 판단 선택지·로그인 전 오버레이를
  Figma `축의금 사건 상세/로그인 전`(1507:12874) 기준으로 구현
- Figma `축의금 사건 상세/로그인 후1`(1507:12987) 기준으로 선택 상태와 `투표하기` 구현
- 선택 전 `투표하기`를 누르면 `투표를 먼저 해주세요.` 안내를 표시
- 로그인 CTA는 `/login?from=/cases/case-wedding-gift`로 이동하며 임시 데모 로그인 후 상세로 복귀
- 잘못된 사건 ID는 일반 404와 구분해 사건 없음 상태를 표시

**축의금 사건 투표 결과 (2026-09-09)**

새로 만든 파일

```
src/pages/Case/CaseResultPage.tsx · CaseResultPage.css
src/pages/Case/components/CaseHeader.tsx · CaseHeader.css
src/data/common/caseResultContent.ts
src/assets/case/result/                  # Figma 원본 PNG·SVG 16종
```

고친 파일

- `src/routes/paths.ts` · `AppRoutes.tsx` — `/cases/:caseId/result` 결과 라우트 추가
- `CaseDetailPage.tsx` — 로그인 사용자가 판단을 선택한 뒤 `투표하기`를 누르면 결과 화면으로 이동
- 상세·결과 양쪽에서 쓰는 `CaseHeader`를 공통 컴포넌트로 분리
- Figma `축의금 사건 상세/로그인 후2`(1507:12731)의 투표 비율·AI 판결·댓글·후일담 구현
- 댓글 입력·등록은 화면 로컬 상태로 동작한다. 등록 시 댓글 수가 증가하고 새 댓글이 목록 맨 위에 추가된다
- 전체 결과 접기/펼치기, 이모지 추가, 공감/반대, 댓글 페이지 선택도 화면 로컬 상태로 동작한다

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
- Paperlogy·Pretendard 폰트 파일과 `@font-face` 등록을 완료했다.
- 하단바 아이콘은 2026-09-09에 실제 SVG로 교체 완료.
  배심원 광장도 활성화했다. 사건 접수·왈가왈후~·MY는 아직 라우트가 없어 비활성이다.
  각 화면이 생기면 `BottomNavigation.tsx`의 `enabled`만 켜면 된다.
- 앱 헤더는 2026-09-09에 공통 `TopBar`로 올렸다.

## 배심원 광장 잔여 항목

- 히어로 배경·마스코트·트로피와 1·2·3위 마스코트 에셋을 모두 적용했다.
- 히어로 배경은 PNG에서 WebP로 최적화했다.
- 정렬·검색·페이지네이션은 동작 후 화면이 시안에 없어 비활성으로 두었다.
  카테고리 칩만 실제로 목록을 거른다.
- 랭킹 탭은 선택 상태만 로컬로 표현한다. 탭별 목록은 시안에 없다.
- `랭킹 보러가기`는 이동할 화면이 없어 링크를 걸지 않았다.

## 발표 시연 흐름

**윤서아 (퍼소나 A — 신규 사용자)**

```
비로그인 진입 → 홈 → 오늘 사건 `투표하러 가기`
→ 사건 상세 로그인 전 화면 → `로그인하고 나도 투표하기`
→ /login 임시 연결 화면 → `데모 로그인하고 투표하기`
→ 원래 사건 상세의 투표 가능 상태로 복귀 → 판단 선택 → `투표하기`
→ `/cases/case-wedding-gift/result` 투표 결과 → 댓글 입력·등록
```

축의금 사건 상세가 연결되어 홈의 `투표하러 가기`에서 상세로 진입하고,
상세의 `로그인하고 나도 투표하기`에서 임시 `/login`으로 이동한 뒤
원래 상세의 투표 가능 상태로 복귀한다.

**곽지훈 (퍼소나 B — 기존 사용자)**

가입 흐름 없음. PC 기기 바깥 패널의 계정 전환 버튼으로 윤서아 → 곽지훈으로 바꾼다.

## 서버 없이 표현한 데이터·상태

- 홈의 사건 카드·투표 수치·참여 인원은 모두 예시 데이터다 (`src/data/common/homeContent.ts`).
- 광장의 랭킹·포인트·사건 목록·페이지 수도 예시 데이터다 (`src/data/common/plazaContent.ts`).
  실제 집계가 아니며 카테고리 필터만 화면 로컬 상태로 동작한다.
- 밸런스 게임 선택은 화면 로컬 상태이며 저장되지 않는다.
- AI 판단은 실제 모델 결과가 아닌 UI 프로토타입이다.
- 축의금 결과의 집계 비율·AI 판결·기존 댓글·후일담은 예시 데이터다
  (`src/data/common/caseResultContent.ts`). 새 댓글·공감·반대·페이지 선택은 화면 로컬 상태이며 저장되지 않는다.
- 로그인·알림·저장 API는 연결되어 있지 않다.
- 퍼소나별 저장소(`walgawalbot:demo:v1:*`)는 아직 사용하지 않는다.

## 다음 작업

1. 모바일 폭(360·390·430)과 키보드가 열린 상태를 추가 확인
2. 홈 화면 실제 에셋 적용
3. 실제 로그인 화면 시안이 확정되면 `/login`의 임시 연결 UI 교체
4. 축의금 결과 화면의 실제 API가 정해지면 투표·댓글·공감 상태를 서버 데이터로 교체
5. `개발` 페이지에 화면이 올라오는 순서대로 구현하고,
   완성되면 `BottomNavigation`의 `enabled`와 `AppRoutes`에 연결

## 마지막 검증 결과

2026-09-09 축의금 사건 결과·댓글 구현 후 실행 결과.

| 검사 | 결과 | 비고 |
| --- | --- | --- |
| `npm install` | **통과** | 163 packages, 0 vulnerabilities |
| `npm run typecheck` | **통과** | `tsc -b --force`, 타입 오류 0건 |
| `npm run lint` | **통과** | ESLint 오류 0건 |
| `npm run build` | **통과** | 112 modules, 255ms |
| 브라우저 확인 | **통과** | 홈→상세→임시 로그인→투표→결과 이동, 댓글 직접 입력·등록·댓글 수 증가·입력 초기화 확인. 콘솔 경고·오류 0건 |

빌드 산출물

| 파일 | 크기 | gzip |
| --- | --- | --- |
| `index.js` | 308.75 kB | 95.18 kB |
| `index.css` | 44.63 kB | 9.09 kB |
| `vote-result.png` | 1,766.33 kB | — |
| `perilla-table.png` | **2,127.51 kB** | — |

`perilla-table.png` 하나가 번들 전체보다 9배 크다.
`src/assets/home/`의 다른 이미지도 1~3.8 MB대라, 실제 에셋을 붙이기 전에
리사이즈나 WebP 변환을 검토해야 한다.

## 알려진 문제 / 확인 필요

`PROJECT_SPEC.md` §9에 정리되어 있다.
해결된 것은 §9-5(홈 인디케이터), §9-4(하단바 표기), §9-2(가입 화면 — 팀 결정으로 추가),
§9-17(아이콘 확정 범위)이다.
광장 구현에서 §9-12~16(관점 선택 항목 수, 랭킹 탭, 정렬·검색·페이지네이션,
`랭킹 보러가기` 목적지)이 남아 있다.
축의금 로그인 전 상세·투표 가능 상세·투표 결과와 임시 로그인 진입점은 연결됐다.
댓글 등록과 반응은 시연용 로컬 상태이므로 새로고침하면 초기화된다.
