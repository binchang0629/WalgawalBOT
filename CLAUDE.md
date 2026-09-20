@PROJECT_SPEC.md
@PROJECT_CONTEXT.md

# 작업 규칙

- 구현 전 `PROJECT_SPEC.md`(기준)와 `PROJECT_CONTEXT.md`(현재 상태)를 먼저 확인한다.
- Figma `1차 디자인 시안 > 컨펌`의 해당 화면을 최우선 근거로 사용하고,
  `자료종합`의 IA·유저플로우·설문과 `확정 스타일가이드`를 함께 확인한다.
- 여러 파일을 바꾸기 전에 변경 범위와 공통 파일 영향 여부를 짧게 정리한다.
- 컨펌 시안과 IA가 충돌하거나 시안에 없는 결정을 해야 하면
  임의로 확정하지 말고 `PROJECT_SPEC.md` §9 확인 필요 항목에 남긴다.
- 실제 에셋, 기존 CSS, 기존 컴포넌트와 확정된 토큰을 우선 재사용한다.
- 작업이 끝나면 `npm run lint`, `npm run typecheck`, `npm run build`를 실행하고
  `PROJECT_CONTEXT.md`에 완료 내용과 검증 결과를 갱신한다.

# 문서 구조

| 파일 | 역할 |
| --- | --- |
| `PROJECT_SPEC.md` | 단일 기준 문서 — 서비스·퍼소나·디자인 토큰·구현 규칙·검증 기준 |
| `PROJECT_CONTEXT.md` | 현재 상태 — 완료·진행·문제·검증 기록 |
| `CLAUDE.md` / `AGENTS.md` | 위 두 문서를 불러오는 진입점 |
