/**
 * 사건 접수 화면 전용 타입.
 * 다른 화면과 공유하지 않아 src/types/index.ts가 아니라 이 폴더에 둔다. (PROJECT_SPEC.md §7-9)
 */

/** 상대와의 관계. `CaseCategory`(사건 주제 분류)와는 다른 개념이라 재사용하지 않는다. */
export type Relationship = '연인' | '친구' | '가족' | '직장' | '학업' | '기타'

export const RELATIONSHIPS: Relationship[] = ['연인', '친구', '가족', '직장', '학업', '기타']

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
 * Figma 시연 범위: 처음에는 미선택. 서아는 community만(1446:10195),
 * 지훈은 private만(1446:10059) 선택 가능. 실제 서버 공개 권한을 뜻하지 않는다.
 */
export type Visibility = 'private' | 'community' | null

/** 지훈03 요약 확인에서 편집 가능한 AI 요약 문서. */
export interface CaseSummary {
  title: string
  facts: string
  issues: string
  help: string
}
