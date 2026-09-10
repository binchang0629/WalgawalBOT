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
| MY | **개발 시안 구현 기준** (`1883:3031`, `1863:13250`, `1863:13312`) | **구현됨** | MY → 내 사건 목록 → 결과 확인 흐름 연결 |
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
  배심원 광장과 MY를 활성화했다. 사건 접수·왈가왈후~는 아직 라우트가 없어 비활성이다.
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

### 2026-09-10 댓글 페이지네이션 공통 컴포넌트

- Figma `1846:14647` 기준으로 `components/common/Pagination.tsx`와 전용 CSS를 추가하고 오늘의 사건 결과 댓글 하단에 적용. 다른 화면의 페이지네이션은 변경하지 않음.
- 원본 이전·다음 SVG를 로컬 에셋으로 보관. 다음 아이콘은 시안의 좌우 반전을 반영. 숫자 26px·화살표 24px, 숫자 간격 10px·그룹 간격 18px, 주황 선택 상태·테두리·그림자를 고정하며 작은 화면에서도 축소하지 않음. 화면에 떠 있는 fixed 배치가 아닌 디자인 규격의 공통화.
- `currentPage`, `totalPages`, `onPageChange`, `ariaLabel`로 재사용. 최대 5개씩 번호 표시, 처음/마지막 이동 제한 및 키보드 포커스 지원. 댓글은 기존 데모처럼 선택 표시만 바뀌며 실제 페이지별 데이터 연동은 미구현.
- Figma 숫자 폰트 Gmarket Sans 원본은 프로젝트에 없어 기존 Pretendard로 대체. 원본 확보 시 공통 컴포넌트의 폰트 선언으로 연결 가능.
- 검증: build(타입 검사 포함)·lint 통과. 격리 Chromium 320·360·390·430·1440px에서 규격/간격/넘침, 번호 선택·이전/다음·끝 경계·키보드 Enter 동작 및 런타임 오류 없음 확인. 390px 캡처로 원본 화살표 방향·색상 확인.

### 2026-09-10 전체 결과 기본 펼침

- 사용자 요청으로 오늘의 사건 결과의 `전체 결과 보기` 초기 상태를 펼침으로 변경. 기존 접기/펼치기 애니메이션과 접근성 상태는 유지.
- 초기 진입·새로고침 시 펼침, 클릭 시 접기/다시 펼치기 확인. build·lint 통과.

### 2026-09-10 MY 메뉴 스타일 통일

- 사용자 요청으로 나의 활동·설정·전문가 정보 기록의 상태별 스타일 통일. 원본 단색 SVG를 CSS mask로 재사용하여 비활성 아이콘을 #939094, 원 배경을 neutral-250으로 일치. 활성 내 사건은 주황 아이콘/흰 배경/테두리 유지.
- 설정과 전문가 카드의 글자·아이콘·화살표 비활성 톤, 좌우 16px 정렬, 글자 굵기·행 간격 일치. 전문가 정보 기록은 기존 onClick/목적지가 없는 버튼이므로 disabled 의미와 시각 상태도 통일. 새 기능/목적지는 추가하지 않음.
- 접힌 섹션 하단 이중 선 제거, 키보드 포커스 표시 보완. 프로필·계정 전환·포인트·플랜은 그대로 유지.
- build·lint 통과. 격리 Chromium 320·390·1440px에서 비활성 아이콘 7개 동일 색/배경/원본 마스크, 활성 아이콘 색, 가로 넘침 없음, 접기/펼치기와 내 사건 이동 검증. 설정/전문가 카드 캡처 확인.

### 2026-09-10 프로필 전환 확인 팝업 축소

- 사용자의 크기 조정 요청에 따라 중앙 확인 팝업만 축소. 폭 354→312px, 내부 패딩 20px, 프로필 상하 여백 50→20/24px, 사진 100→72px. 제목/이름 18px, 질문 16px, 이메일 12px로 조정. 확인 버튼 높이 52→44px·글자 16→14px, 로그아웃 13px. 닫기 아이콘은 그대로 두고 클릭 영역 32px 확보.
- 양쪽 계정에서 실측 312×358px, 320px 화면에서는 폭 272px로 축소. 모션·배경 딤·확정/취소 동작 및 하단 계정 선택 시트는 유지.
- PC 1440×900·모바일 390×844/320×740에서 크기/가로 넘침·사진/버튼 크기·계정 전환 양방향·빠른 취소/포커스 복원 및 reduced-motion 검사, 캡처 확인. build·lint 통과.

### 2026-09-10 MY 포인트 표시

- Figma `1913:12480`·`1913:13356`에 맞춰 판결 신뢰도 98%를 포인트로 교체. 서아 10pt, 지훈 0pt를 DEMO_ACCOUNTS의 points로 관리. 숫자는 주황 20px Bold, 단위는 회색 14px Regular로 중앙 정렬. 나머지 통계는 유지.
- 실제 포인트 적립/차감은 미연결이며 시안의 데모 값만 표시. 양방향 계정 전환·새로고침 후 값 유지/색상/텍스트 및 캡처 확인. build·lint 통과.

### 2026-09-10 계정 전환 팝업 모션

- 하단 계정 전환 시트는 360ms ease-out 곡선으로 아래에서 진입, 배경 딤은 240ms로 서서히 표시. 중앙 확인 팝업은 220ms의 작은 이동/확대와 페이드로 연결. 정지 상태 디자인은 유지.
- X·배경·Esc 취소 및 확인/로그아웃은 240ms 퇴장 후 처리. 입장 도중 닫아도 현재 transform/opacity에서 이어지도록 Web Animations API 사용. 중복 종료 방지, 퇴장 중 입력 차단 및 배경 잠금 유지, 언마운트 시 애니메이션 취소. 별도 라이브러리 없음.
- reduced-motion 설정에서는 이동/페이드 없이 즉시 표시·종료. 양쪽 계정 전환/토스트·빠른 Esc/중복 Esc·X 닫기·포커스 복원/배경 잠금, PC 1440×900·모바일 390×844/320×740 및 reduced-motion 모의 검증. build·lint 통과.

### 2026-09-10 계정 전환 현재 사용중 표시

- Figma `1913:13062`의 `현재 사용중` 표시를 양쪽 계정 팝업에 적용: 회색 #F0EEF1 배경, 50px 반경, 상하 6px/좌우 12px 패딩, 12px Medium/줄높이 1. 작은 화면에서도 동일한 알약 모양 유지.
- 전환·확인·로그아웃 버튼과 기능은 변경하지 않음. 두 계정 × 320·390·402·1440px 스타일/가로 넘침·실제 계정 전환 테스트 및 캡처 확인, build·lint 통과.

### 2026-09-10 계정별 내 사건 목록·필터

- 사용자가 링크 배정 반대를 확인: 서아(A)는 조별 과제/Figma `1913:12839`, 지훈(B)은 잔금 미지급/Figma `1922:14963`로 구현.
- `src/data/personas/myCases.ts`에 프로필별 목록 데이터를 분리하고 기존 세션의 personaId로 선택. 계정 변경 시 목록 필터도 전체로 초기화.
- 서아는 전체 1/투표 완료 1, 지훈은 전체 1/비공개 1을 활성화. 선택한 버튼만 파란색, 선택하지 않은 활성 버튼은 흰색. 0건 또는 해당 없는 필터는 회색 비활성. 전체와 해당 상태 필터 모두 같은 계정 사건을 표시.
- 시안의 직장/나만 보기 배지, 잔금 사건 제목, AI 1심(나만 보기), 참여 없음, 사건번호 및 목록 간격·안내 텍스트 색상 반영. 목록도 헤더 아래 독립 스크롤로 낮은 화면에서 하단 접근 가능.
- 서아 사건번호를 CASE-FRIEND-01로 갱신하고 결과 링크·상세 표시도 맞춤. 기존 CASE-SEOA-01 직접 링크는 호환 유지. 지훈 CASE-COMPANY-01 결과 상세 시안은 제공되지 않아 결과 버튼 비활성 유지(서아 결과로 연결하지 않음).
- 검증: build·lint 통과. 격리 Chromium에서 두 계정 × PC 1440×900/1366×768·모바일 320/360/390/402/430·가로 844×390, 필터 선택/색상/건수, 동일 사건 유지, 하단 안내 접근, 가로 넘침 없음, 서아 결과 연결 확인. 실제 MY 계정 전환 양방향→내 사건 진입·새로고침 유지 및 이전 결과 URL 호환 확인. 화면 캡처로 두 시안 대조. 실제 휴대폰 미검증.

### 2026-09-10 내 사건 결과 상세 스크롤·최신 디자인

- Figma `1913:12900` 기준으로 내 사건 결과 상세를 갱신. 높이 제한 없는 페이지가 AppViewport에서 잘리던 문제를 해결: 결과 페이지를 화면 높이의 flex 컨테이너로 만들고 헤더 아래 본문에만 `flex: 1; min-height: 0; overflow-y: auto` 적용. 헤더는 스크롤 밖에서 고정, 모바일 하단 안전 영역 확보.
- 최신 판멍이 원본 이미지를 `panmung-curiosity.png`로 추가. 판별이 이미지는 Figma 다운로드와 기존 파일의 SHA-256이 같아 기존 `verdict-difference.png` 재사용. 캐릭터 크기/위치, 46% 강조 26px, 집계 항목 14px 및 막대별 주황 단계, 안내 카드 테두리/반경, 하단 문구 간격 반영.
- 기존 헤더 64px·상태바 경계 비침 방지 유지. Figma 헤더 위 2px 오프셋은 사용자의 앞선 간격 제거 요청에 따라 재도입하지 않음. Gmarket Sans 숫자 폰트는 보유 소스가 없어 기존 Pretendard 굵은 글꼴 유지.
- 검증: 격리 Chromium에서 PC 1440×900·1366×768 및 모바일 320·360·374·390·402·430px, 가로 844×390 확인. 실제 휠 입력·키보드 Ctrl+End·CDP 터치 스와이프로 내부 스크롤, 마지막 문구 노출, 헤더 고정, 가로/바깥 스크롤 없음, 이미지 로드, 목록 복귀 후 재진입 상단 시작 확인. 전체/상단/하단 캡처로 시안 대조. build·lint 통과. 실기기 테스트는 미실시.
- 배심원 의견 전체 보기·후일담 작성하기는 목적지 화면 미구현으로 기존 비활성 유지. 내 사건 목록의 별도 스크롤 구조는 이번 결과 상세 범위에서 변경하지 않음.

### 2026-09-10 MY·오늘의 사건 상단 정렬

- 후속 수정: 좌표상 간격이 0이어도 PC 목업의 소수점 축소 배율에서 sticky 헤더 위로 본문이 1px 비치는 현상을 재현. 앞선 경계 좌표 검사만으로는 이 렌더링 문제를 찾지 못했음.
- `AppViewport.css`에서 상태바/모바일 안전 영역을 불투명한 흰 배경으로 덮고 헤더 쪽으로 2px 겹쳐 경계 비침 차단. 공통 상단 인셋 변수로 실제 여백과 덮개 높이를 함께 계산. 헤더·본문 좌표/높이, 상태바 아이콘, 네비, 팝업 레이어 순서는 유지.
- 후속 검증: 격리 Chromium에서 MY 메인·내 사건 목록·내 사건 결과·오늘의 사건 상세·결과 5개 경로 × PC/모바일 7개 화면·DPR 조건 × 5개 스크롤 요청(175개) 경계 픽셀 검사 통과. 본문에 고대비 테스트 배경을 넣어도 경계 비침 0건. MY 하위 페이지는 기존 스크롤 미구현 상태여서 정적 경계만 검사. 실제 화면 캡처 확인, 계정 팝업 상단 딤/닫기·모바일 47px 안전 영역 모의 검사 통과. build·lint 통과. 실제 휴대폰은 미검증.
- MY 메인·내 사건 목록·내 사건 결과의 헤더를 오늘의 사건 상세/결과와 같은 64px 높이로 통일(이전 MY 66px). MY 페이지 범위의 변수만 조정하고 공통 상태바 62px 및 홈 등 다른 페이지는 유지.
- PC 5개 경로에서 상태바 하단과 헤더 상단의 경계 차이 0px 확인. 기존에도 경계 여백은 없었으며 이번 변경은 헤더 내부 제목 높이 차이만 정리한 것. build·lint 통과.
- 별도 발견 당시: MY 하위 결과에 내부 스크롤 컨테이너가 없어 긴 내용을 휠로 스크롤할 수 없었음. 위의 후속 내 사건 결과 상세 작업에서 수정 완료.

### 2026-09-10 익명 프로필·상세 인터랙션 보완

- 카운트다운은 직전 복구 상태 그대로 유지. 요약 숫자 연결선만 각 행의 중앙 사이로 연결해 첫 숫자 위·마지막 숫자 아래 돌출 제거.
- `전체 결과 보기`는 목록을 유지한 채 CSS grid 높이와 투명도를 300ms/200ms로 전환. 빠르게 다시 눌러도 자연스럽게 역전하며, 닫힌 내용은 aria-hidden/inert 처리. reduced-motion에서는 즉시 전환.
- Figma `1913:12458` 기준으로 MY 실명 옆에 작은 익명 닉네임을 추가. 실제 인물 프로필 사진·계정 전환의 실명은 유지.
- 공개 닉네임: A 윤서아=`익명의 왈가닥`, B 곽지훈=`익명의 왈랑이`. `DEMO_ACCOUNTS`→세션→MY/댓글에서 같은 데이터 사용(데모 가입 닉네임에도 반영).
- 댓글 캐릭터는 보유 원본 소스 재사용: 서아는 분홍 사각 캐릭터(`comment-avatar-2.png`), 지훈은 초록 원형 캐릭터(`comment-avatar-3.png`). 새 댓글 생성 시 작성자 닉네임·이미지를 함께 기록.
- 검증: build·lint 통과. 격리 Chromium에서 실제 MY 계정 전환 후 양쪽 닉네임·댓글/이미지 확인, 320·360·390·402·430px MY 가로 넘침·계정 전환 버튼 겹침 없음 확인. 아코디언 열기/닫기 중간 높이·빠른 역전·reduced-motion 및 요약 연결선 확인. 댓글은 기존 시연용 로컬 상태로 새로고침 시 초기화.

### 2026-09-10 축의금 상세·결과 최신 시안 반영

- 사용자 지정 Figma `1802:5912`·`1846:14556` 기준으로 홈의 축의금 CTA 이후 화면을 수정. 홈 자체와 공통 네비 디자인은 유지.
- 상세: 작성자 이미지, 네 가지 투표 캐릭터 원본 SVG, 본문 좌우 여백, 선택지 간격·CTA 간격 반영. 로그인 전 안내와 임시 로그인 후 복귀 유지.
- 결과: 새 판결 일러스트에 실제 텍스트로 한 줄 판결 표시, 우측 마감 배지, 기본 접힘 집계 카드, 연한 파랑 AI 판결 카드, 댓글 헤더·프로필·후일담 스타일 적용.
- Figma 메모대로 공감/반대는 처음 회색이며 선택한 반응만 색을 표시. 기존 댓글 입력·등록·반응 시연 동작 유지.
- 상세·결과 진입 시 실제 내부 스크롤 컨테이너를 맨 위로 이동.
- 카운트다운은 각 프레임의 예시 시간에서 시작해 0까지 감소하는 표시용 데모. 두 시안의 시작 시간이 서로 달라 화면별로 초기화하며 실제 마감 판정/서버 동기화는 미연결.
- 기존 댓글 저장·정렬·페이지별 데이터·대댓글·후일담 이동의 미구현 범위는 변경하지 않음. 댓글/반응은 새로고침 시 초기화.
- RIDIBatang 원본 폰트가 없어 후일담은 serif 대체 폰트 사용. AI 제목은 상대방 지지, 근거는 글쓴이 지지로 읽히는 시안 카피 불일치를 임의로 바꾸지 않고 유지(디자인 확인 필요).
- 검증: 타입 검사 포함 build 및 lint 통과. 격리 Chromium에서 홈→상세→로그인→선택→결과→댓글 등록, 미선택 안내, 결과 접기/펼치기, 반응 전환 및 320·360·390·430px/PC 가로 넘침·에셋 로드를 확인. 실제 휴대폰 키보드는 미검증.

### 2026-09-10 계정 전환 팝업

- MY 메인 화면의 상단 뒤로가기 화살표를 모든 계정에서 제거하고 제목 중앙 정렬을 유지. 내 사건 목록·결과의 뒤로가기는 유지.

- 사용자 지정 Figma `1913:13042` 기준으로 MY 계정 전환을 하단 팝업으로 구현.
- `app-overlay-root`를 재사용하여 목업 내부 전체를 어둡게 덮고, 배경 입력·스크롤을 차단.
- 현재 계정과 전환 가능 계정을 사진·이메일로 표시. 선택 아이콘은 Figma `1446:10062` 원본 SVG를 사용.
- `프로필 전환하기` → 대상별 중앙 확인 팝업(Figma `1913:13090` 곽지훈 / `1913:13110` 윤서아) → `확인` 순서로 동작. 마지막 확인에서만 기존 세션의 `switchPersona`를 호출.
- 전환 완료 후 `○○○ 프로필로 전환되었습니다` 안내를 3.5초간 표시. 중앙 팝업 취소 시 계정 유지, 로그아웃은 기존 세션 종료 후 홈 이동.
- 닫기·배경 클릭·Esc는 변경 없이 취소. 키보드 포커스 제한 및 닫은 뒤 버튼 포커스 복원.
- MY 사진도 세션에 맞춰 변경. 기존 세션 저장 방식으로 계정 전환 유지.
- 임시 저장 사건·프로필별 설정 저장 기능은 아직 미구현이며 팝업 안내 문구는 Figma 카피를 반영한 것.
- 검증: lint 및 타입 검사 포함 build 통과. 격리된 브라우저에서 선택/취소/확정/역방향 전환/새로고침/사진/포커스 복원/320·360·390·430px 가로 넘침/PC 오버레이 경계를 확인. 런타임 오류 없음.
- 중앙 확인 팝업 추가 검증: 양방향 대상 표시·확인 전 계정 유지·완료 안내·취소·로그아웃 및 모바일/PC 중앙 배치 확인. 타입 검사 포함 build와 lint 통과.

1. 모바일 폭(360·390·430)과 키보드가 열린 상태를 추가 확인
2. 홈 화면 실제 에셋 적용
3. 실제 로그인 화면 시안이 확정되면 `/login`의 임시 연결 UI 교체
4. 축의금 결과 화면의 실제 API가 정해지면 투표·댓글·공감 상태를 서버 데이터로 교체
5. `개발` 페이지에 화면이 올라오는 순서대로 구현하고,
   완성되면 `BottomNavigation`의 `enabled`와 `AppRoutes`에 연결

## 마지막 검증 결과

2026-09-10 MY·내 사건 목록·내 사건 결과 연결 후 실행 결과.

| 검사 | 결과 | 비고 |
| --- | --- | --- |
| `npm install` | **통과** | 163 packages, 0 vulnerabilities |
| `npm run typecheck` | **통과** | `tsc -b --force`, 타입 오류 0건 |
| `npm run lint` | **통과** | ESLint 오류 0건 |
| `npm run build` | **통과** | 135 modules, 210ms |
| MY 라우팅 | **구현됨** | `/my` → `/my/cases` → `/my/cases/CASE-SEOA-01` 연결 |

빌드 산출물

| 파일 | 크기 | gzip |
| --- | --- | --- |
| `index.js` | 327.98 kB | 99.91 kB |
| `index.css` | 50.03 kB | 9.85 kB |
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
