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
| 2026-09-09 | **Figma `개발` 페이지에 올라온 화면만 구현 대상** | 팀 결정. 확정된 화면을 하나씩 옮겨 담기로 함 |
| 2026-09-09 | 아이콘은 `수정금지`의 **기타 아이콘 · nav · 화살표 · 꼬리화살표**만 사용 | 나머지는 참고용 모음이라 확정이 아님 (`PROJECT_SPEC.md` §9-17) |
| 2026-09-09 | 벡터 에셋은 Figma Plugin API `exportAsync`로 내보내 저장 | 프록시가 `figma.com` 직접 다운로드를 막아 에셋 URL을 받을 수 없음 |
| 2026-09-09 | 비트맵 에셋은 Figma에서 직접 내보내 폴더에 넣기 | 이그레스 정책이 `figma.com` 자산 URL을 막는다 |
| 2026-09-09 | 광장 에셋은 컴포넌트에서 직접 import | 자동 감지(`optionalImages.ts`) 없이 파일을 바로 넣는 편이 단순하다. 에셋 6종 반영 완료 |
| 2026-09-09 | **자료종합 페이지 전체를 기준 자료로 학습** | IA·유저플로우·설문·퍼소나·Font/Color가 모두 이 페이지에 있다. 아래 "자료종합 학습 기록" 참고 |
| 2026-09-09 | 미확정 항목을 본문에서 확정처럼 쓰지 않기 | §6의 관점 선택 3택 서술이 §9-12(미정)와 충돌했다. 본문은 §9를 가리키게만 두고 값은 §9에서 확정한다 |

## 구현 상태

| 화면 | 디자인 | 구현 | 비고 |
| --- | --- | --- | --- |
| 홈 | **확정** (`김하은/홈수정`) | **구현됨** | 에셋·폰트 교체 남음 |
| 404 | — | **구현됨** | `pages/Error/NotFoundPage.tsx` |
| 배심원 광장 | **확정** (`개발 > 광장`) | **구현됨** | 에셋 반영 완료. 정렬·검색·페이지네이션 등 **기능 구현만 남음** |
| 사건 접수 | 작업 중 | 미착수 | `src/pages/Submit/` 빈 폴더 |
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

**통합 문서 4개 — 아직 남아 있다 (2026-09-09 확인)**

`PRD.md` · `design-analysis.md` · `project_rules.md` · `SKILL.md`

이전 기록은 "삭제 완료"라고 적었지만 실제로는 파일이 그대로 있다.
다만 내용은 비었고 `PROJECT_SPEC.md`의 어느 절로 옮겨졌는지 알려주는 안내표만 남아 있으며,
네 파일 모두 본문에 **"삭제 대상 파일이다"**라고 적혀 있다.
지우면 문서는 `PROJECT_SPEC.md`(기준) · `PROJECT_CONTEXT.md`(상태) ·
`CLAUDE.md` / `AGENTS.md`(진입점) 네 개가 된다. → 남은 할 일

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
3. 통합 문서 4개(`PRD.md` · `design-analysis.md` · `project_rules.md` · `SKILL.md`) 삭제
4. 모바일 폭(360·390·402·430)과 키보드가 열린 상태를 실기기 또는 기기 모드에서 확인
5. 홈 화면 실제 에셋·`@font-face` 적용
6. 사건 상세 시안이 나오면 가입 진입점(`로그인하고 나도 투표하기`)을 제자리로 옮긴다.
   지금은 홈의 `로그인 하고 사건 투표하기` 버튼에 임시로 걸려 있다
7. `개발` 페이지에 화면이 올라오는 순서대로 구현하고,
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
§9-16(광장 비트맵 에셋), §9-17(아이콘 확정 범위)이다.

자료종합 학습에서 새로 올라온 것은 §9-18(기준 페이지 이관 범위),
§9-19(컬러 값 불일치 4건), §9-20(반경 토큰화 여부)이고,
§9-1(퍼소나 세부)과 §9-12(관점 선택)는 자료종합에서 근거를 찾아 내용을 보강했다.

가장 급한 것은 **§9-3 사건 상세 시안**이다.
시연 흐름의 가입 진입점이 사건 상세에 있어서, 그 화면이 나와야 흐름이 제자리를 찾는다.
그다음이 **§9-12 관점 선택**이다. 자료종합은 4택으로 일관되지만 문구가 세 가지로 갈려 있어
사건 상세를 만들기 전에 정해야 한다.
