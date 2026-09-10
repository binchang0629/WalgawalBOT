/**
 * 사건 접수 화면 전용 타입.
 * 다른 화면과 공유하지 않아 src/types/index.ts가 아니라 이 폴더에 둔다. (PROJECT_SPEC.md §7-9)
 */

/** 상대와의 관계. `CaseCategory`(사건 주제 분류)와는 다른 개념이라 재사용하지 않는다. */
export type Relationship = '연인' | '친구' | '가족' | '직장' | '학교' | '기타'

export const RELATIONSHIPS: Relationship[] = ['연인', '친구', '가족', '직장', '학교', '기타']

/** 지훈02 추가 질문의 3지선다 답변. */
export type TriAnswer = 'yes' | 'no' | 'unsure'

export interface QuestionAnswers {
  /** 최종 파일을 전달한 기록이 있나요? */
  deliveryRecord: TriAnswer | null
  /** deliveryRecord === 'yes'일 때만 보이는 추가 설명. */
  deliveryDetail: string
  /** 잔금 지급일이 계약서에 적혀 있나요? */
  contractTerms: TriAnswer | null
  /** 수정 횟수나 범위를 정해두었나요? */
  revisionScope: TriAnswer | null
}

export const INITIAL_ANSWERS: QuestionAnswers = {
  deliveryRecord: null,
  deliveryDetail: '',
  contractTerms: null,
  revisionScope: null,
}

/**
 * 공개 범위. Figma 주석에 따라 `배심원 광장에 공개`는 이번 구현에서 선택할 수 없다 —
 * "처음 진입 시 둘 다 회색, 배심원 광장은 비활성화, 나만보기만 클릭 시 주황"(node 1446:10059 주석).
 * 공개 범위를 어디까지 열지는 아직 미정이라(PROJECT_SPEC.md §9-9) 비활성 상태로 정직하게 표시한다.
 */
export type Visibility = 'private' | null

/** 지훈03 요약 확인에서 편집 가능한 AI 요약 문서. */
export interface CaseSummary {
  title: string
  facts: string
  issues: string
  help: string
}
