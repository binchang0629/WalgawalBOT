# 왈가왈BOT 작업 규칙

## 작업 전 확인

- `PRD.md`, `design-analysis.md`, `PROJECT_CONTEXT.md`를 먼저 읽는다.
- Figma `자료종합`의 IA·유저플로우·설문과 `확정 스타일가이드`를 확인한다.
- 변경할 화면의 컨펌 Figma 시안과 기존 코드를 함께 확인한다.
- 확인된 사실, 화면 간 불일치, 아직 정해지지 않은 항목을 구분한다.

## 변경 원칙

- 사용자가 요청한 화면과 담당 폴더만 수정한다.
- 공통 코드, `App.jsx`, `main.jsx`, `src/components`, `src/common`은 팀 담당자와 조율 없이 대규모로 바꾸지 않는다.
- 새 라이브러리 설치, 폴더 이동, 파일명 변경, 전면 리팩터링은 요청이 있을 때만 한다.
- IA와 컨펌 화면이 다르면 임의로 하나를 고르지 말고 `PROJECT_CONTEXT.md`에 기록하고 팀에 확인한다.
- 실제 사례 문구·이미지·화면 상태는 IA/컨펌 시안을 우선 사용한다. 없는 내용을 만들어 채우지 않는다.

## 제품·안전 원칙

- AI 1심은 근거와 양쪽 맥락을 설명하는 보조 의견이며, 법률·심리의 최종 판단이 아니다.
- 민감한 사연은 공개를 강제하지 않으며, 비공개·AI 우선·전문가 도움 진입점을 흐름에서 누락하지 않는다.
- 사건 관점 선택은 단순한 승패가 아니라 글쓴이·상대·둘 다 이해의 맥락을 보존한다.

## 기술 기준

- Vite + React 19 + JavaScript + CSS
- Tailwind, TypeScript, UI 라이브러리는 요청 없이 추가하지 않는다.
- 페이지 코드: `src/pages/[PageName]/`
- 공통 컴포넌트: `src/components/` 또는 `src/common/`
- 에셋: `src/assets/`

## 디자인 구현

- 모바일 우선, 기준 아트보드는 iPhone 17의 402 × 874px이다. 긴 콘텐츠는 세로 스크롤로 구성한다.
- Paperlogy(제목), Pretendard(일반 UI) 등 확정 스타일가이드의 역할과 텍스트 스케일을 사용한다.
- 공통 컬러 스케일 밖의 새 색·새 폰트 크기·새 카드 반경을 임의로 확정하지 않는다.
- 텍스트 크기를 바꾸면 카드 높이, 버튼 높이, 줄바꿈, 섹션 간격도 함께 조정한다.
- 버튼은 `button`, 화면 이동은 `a` 또는 라우팅 요소처럼 의미에 맞는 요소를 쓴다.
- 아이콘은 실제 제공 에셋을 우선 사용하고, 임의 SVG·이모지로 대체해야 하면 팀에 명시한다.

## React 컴포넌트 구성

- 화면은 한 개의 큰 JSX 파일로 만들지 않는다. 페이지는 섹션을 조립하는 역할만 맡긴다.
- 반복 가능하거나 두 화면 이상에서 쓰일 수 있는 조각은 역할별 컴포넌트로 분리한다.
  - 레이아웃: src/components/layout/ — AppShell, TopBar, BottomNavigation
  - 기본 UI: src/components/ui/ — SectionHeader, Button, Chip, Tabs, Card
  - 사건 도메인: src/components/case/ — CaseCard, CaseMeta, AiIssueSummary, OpinionChoice
  - 화면 전용 조각: 해당 src/pages/[PageName]/components/
- 공통 여부가 확실하지 않은 첫 사용 컴포넌트는 페이지 전용 폴더에 두고, 두 번째 사용이 확인되면 공통 폴더로 올린다.
- 공통 컴포넌트는 내용 대신 	itle, description, status, children, onClick처럼 데이터를 받아야 한다. 화면별 문구·수치를 컴포넌트 내부에 고정하지 않는다.
- 선택·읽음·비공개·마감 같은 상태는 prop 또는 명확한 로컬 state로 표현한다. CSS 클래스만으로 상태를 숨기지 않는다.
- 공통 구조를 바꾸기 전에는 다른 담당 화면에 미치는 영향을 확인하고 팀에 공유한다.

## 코드 품질과 기록

- 컴포넌트와 데이터는 역할별로 분리하고, 반복되는 카드·목록은 배열 데이터와 재사용 가능한 컴포넌트로 만든다.
- 이벤트 함수는 `handle`로 시작하고, 불리언 상태는 `is`·`has`·`can`·`should`로 시작한다.
- 임시 `console.log`를 남기지 않는다.
- 변경 후 `npm run lint`, `npm run build`를 실행한다.
- 완료한 화면·상태·알려진 문제·검증 결과를 `PROJECT_CONTEXT.md`에 갱신한다.