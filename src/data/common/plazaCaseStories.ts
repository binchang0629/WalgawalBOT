import { profileAvatars } from './profileAvatars'
import writerArtwork from '../../assets/case/result/panmung-scale-first-frame.png'
import otherArtwork from '../../assets/case/result/panmung-scale-left-first-frame.png'
import { weddingGiftCase, type WeddingGiftVoteId } from './caseDetailContent'
import { latestPlazaCaseIds, plazaCases, type PlazaCase } from './plazaContent'
import type { ThreadComment } from '../../components/common/CommentThread'

type VoteId = WeddingGiftVoteId
type Viewpoints = Record<VoteId, string>

interface Narrative {
  paragraphs: [string, string, string]
  evidence: [string, string, string]
  viewpoints: Viewpoints
  aiSide: 'writer' | 'other'
  jurySide: VoteId
}

/** 목록 제목만 있던 18건의 시연용 사연. 카드의 상태·댓글 수는 plazaContent가 기준이다. */
const narratives: Record<string, Narrative> = {
  'case-secret-told': {
    paragraphs: [
      '친한 친구에게 집안 사정 때문에 요즘 학교생활이 힘들다고 털어놓았어요. 다른 사람에게는 말하지 말아 달라고 분명히 부탁했습니다.',
      '그런데 며칠 뒤 반 친구가 제 사정을 알고 말을 건넸어요. 친구는 걱정돼서 한 사람에게만 말한 거라며 악의는 없었다고 했습니다.',
      '친구가 저를 도우려 했다는 말은 알겠지만, 제 허락 없이 비밀을 전한 일을 어떻게 받아들여야 할까요?',
    ],
    evidence: ['비밀을 지켜 달라는 부탁이 먼저 있었어요.', '친구는 걱정되는 마음에 한 사람에게 말했다고 해요.', '당사자가 원하지 않는 방식으로 이야기가 퍼졌어요.'],
    viewpoints: {
      writer: '허락 없이 개인 사정을 전한 건 신뢰를 깬 행동이라고 생각해요.',
      other: '도우려는 의도가 있었다는 점도 대화에서 들어볼 필요가 있어요.',
      both: '친구의 의도와 글쓴이가 느낀 피해를 함께 인정해야 해요.',
      neither: '서로의 마음을 추측하기보다 전달 범위와 사과를 먼저 정리하면 좋겠어요.',
    },
    aiSide: 'writer', jurySide: 'both',
  },
  'case-study-presentation': {
    paragraphs: [
      '조별 과제 발표 자료를 함께 만들면서 저는 조사 결과와 발표 순서를 정리해 공유했어요. 조원들도 초안을 확인했다고 했습니다.',
      '발표 전날 한 팀원이 제게 묻지 않고 자료의 순서와 결론을 바꿨어요. 제 의견은 설명할 기회도 없이 빠졌고, 발표 준비를 다시 해야 했습니다.',
      '더 나은 자료를 만들려는 의도는 이해하지만, 함께 만든 내용을 상의 없이 바꿔도 되는 걸까요?',
    ],
    evidence: ['글쓴이가 조사 내용과 발표 순서를 먼저 공유했어요.', '팀원은 사전 상의 없이 자료를 수정했어요.', '발표를 앞두고 수정 이유와 역할을 함께 확인할 수 있어요.'],
    viewpoints: {
      writer: '공동 자료의 큰 변경은 작성자와 먼저 상의해야 해요.',
      other: '발표 완성도를 높이려는 수정이었는지도 들어봐야 해요.',
      both: '수정 이유를 공유하고 최종본을 함께 검토하는 절차가 필요해요.',
      neither: '누가 옳은지보다 발표 전에 합의할 수 있는 범위를 정해요.',
    },
    aiSide: 'writer', jurySide: 'writer',
  },
  'case-friend-mistake': {
    paragraphs: [
      '오랜 친구가 다른 친구들과 만날 때마다 제가 예전에 했던 실수를 농담처럼 꺼내요. 처음에는 같이 웃었지만 같은 이야기가 반복되니 불편해졌습니다.',
      '따로 그만 이야기해 달라고 했더니 친구는 친해서 하는 장난이고 모두가 웃는다고 했어요. 저는 다른 사람 앞에서 계속 민망해지는 게 싫습니다.',
      '친구의 장난을 이해해야 할까요, 아니면 다시 분명하게 선을 그어야 할까요?',
    ],
    evidence: ['같은 실수 이야기가 여러 모임에서 반복됐어요.', '친구는 친한 사이의 장난이라고 생각해요.', '글쓴이는 그만해 달라는 뜻을 이미 전했어요.'],
    viewpoints: {
      writer: '그만해 달라고 했다면 친구는 그 경계를 존중해야 해요.',
      other: '처음에는 함께 웃어서 친구가 불편함을 늦게 알았을 수도 있어요.',
      both: '농담의 의도와 반복해서 받은 상처를 함께 인정해야 해요.',
      neither: '공개된 자리보다 둘이서 구체적으로 어떤 말을 멈출지 정해요.',
    },
    aiSide: 'writer', jurySide: 'both',
  },
  'case-invite-ex': {
    paragraphs: [
      '오래 함께한 친구 모임에 전 연인도 속해 있어요. 헤어진 뒤에도 단체 모임에서는 가끔 마주쳤고, 큰 다툼은 없었습니다.',
      '이번 모임을 제가 준비하면서 전 연인을 초대하려고 했는데 현재 연인이 불편하다고 말했어요. 저는 친구 관계까지 끊고 싶지는 않습니다.',
      '현재 연인의 마음을 존중하면서도 기존 친구 모임을 이어가려면 어떤 기준을 세워야 할까요?',
    ],
    evidence: ['전 연인은 원래 친구 모임의 구성원이에요.', '현재 연인은 초대 사실에 불편함을 표현했어요.', '모임의 성격과 참석 범위를 사전에 조율할 수 있어요.'],
    viewpoints: {
      writer: '기존 친구 모임의 관계를 무조건 끊을 필요는 없다고 봐요.',
      other: '현재 연인에게는 불편한 자리를 피할 선택권이 있어야 해요.',
      both: '모임을 유지하되 현재 연인과 초대 기준을 먼저 상의하면 좋겠어요.',
      neither: '일방적으로 초대하거나 금지하기 전에 모두의 경계를 확인해야 해요.',
    },
    aiSide: 'writer', jurySide: 'other',
  },
  'case-group-project-credit': {
    paragraphs: [
      '조별 과제 마감이 다가오는데 두 조원이 맡은 자료를 약속한 날까지 올리지 않았어요. 저는 다른 부분을 합쳐 초안을 먼저 만들었습니다.',
      '답이 없어서 단체 대화방에 이름을 적고 역할 분담을 지켜 달라고 말했어요. 뒤늦게 조원들은 공개적으로 지적받아 당황했다고 했습니다.',
      '과제 진행을 위해 필요한 말이었다고 생각하지만, 제가 지적한 방식은 지나쳤던 걸까요?',
    ],
    evidence: ['역할과 제출 날짜가 미리 정해져 있었어요.', '자료가 늦어져 공동 작업 일정에 영향이 있었어요.', '문제 제기가 단체 대화방에서 실명으로 이뤄졌어요.'],
    viewpoints: {
      writer: '약속한 역할을 지키지 않아 공동 과제에 부담을 준 책임은 분명해요.',
      other: '실명을 적어 공개적으로 지적하기 전에 개별 연락이 가능했을 것 같아요.',
      both: '마감 문제는 짚되 표현 방식에 대해서도 서로 사과할 부분이 있어요.',
      neither: '책임을 따지기보다 남은 작업과 재분담부터 합의하는 편이 좋겠어요.',
    },
    aiSide: 'writer', jurySide: 'both',
  },
  'case-dating-anniversary': {
    paragraphs: [
      '연인과 매년 챙기던 기념일에 함께 저녁을 먹기로 했어요. 저는 시간을 비워두고 작은 선물도 준비했습니다.',
      '연인은 일이 몰려 약속을 잊었다며 당일 늦게 연락했어요. 미안하다고 했지만 저는 준비한 마음이 가볍게 여겨진 것 같아 서운합니다.',
      '사과를 들었어도 서운함을 다시 말해도 될까요? 서로 기대하는 기념일의 의미를 어떻게 맞추면 좋을까요?',
    ],
    evidence: ['매년 챙기던 날이라 함께할 거라는 기대가 있었어요.', '연인은 바쁜 일정 때문에 약속을 잊었다고 해요.', '사과 뒤에도 글쓴이의 서운함이 남아 있어요.'],
    viewpoints: {
      writer: '미리 약속한 날을 잊은 데 대해 서운함을 표현할 수 있어요.',
      other: '연인이 사과하고 다시 약속하려는 노력도 함께 봐야 해요.',
      both: '서운함을 전하면서 다음에는 서로 어떤 준비가 필요한지 맞추면 좋아요.',
      neither: '누가 더 잘못했는지보다 기념일에 대한 기대가 달랐던 이유를 살펴봐요.',
    },
    aiSide: 'writer', jurySide: 'writer',
  },
  'case-dating-phone': {
    paragraphs: [
      '연인이 제 휴대폰 화면에 뜬 알림을 보고 누구에게 연락이 왔는지 자주 물어요. 비밀번호를 공유하거나 메시지를 보여주기로 한 적은 없습니다.',
      '연인은 가까운 사이니 관심을 갖는 거라고 하지만, 저는 알림을 확인받는 느낌이 들어 불편해요. 말하면 숨기는 게 있냐고 되묻습니다.',
      '관심과 사생활 침해의 경계를 어떻게 설명하면 좋을까요?',
    ],
    evidence: ['메시지 열람에 동의한 적은 없어요.', '반복해서 상대와 내용을 묻고 있어요.', '불편함을 전했을 때 의심으로 받아들였어요.'],
    viewpoints: {
      writer: '가까운 관계여도 휴대폰 알림을 확인받을 의무는 없어요.',
      other: '불안을 느끼는 이유가 있다면 서로 충분히 대화할 필요도 있어요.',
      both: '불안은 들을 수 있지만 메시지를 확인하는 방식에는 동의가 필요해요.',
      neither: '의심과 방어만 반복하기 전에 서로 지킬 경계를 정하는 게 우선이에요.',
    },
    aiSide: 'writer', jurySide: 'both',
  },
  'case-dating-travel-cost': {
    paragraphs: [
      '연인과 함께 여행을 계획하면서 제가 예약금과 숙소 비용을 더 많이 냈어요. 비용을 낼 때 일정 결정 권한에 관한 약속은 없었습니다.',
      '가고 싶은 장소가 달라지자 제가 더 낸 만큼 제 의견을 우선해도 된다고 말했어요. 연인은 함께 가는 여행인데 돈으로 일정을 정하냐며 서운해했습니다.',
      '비용 차이를 반영하면서도 두 사람 모두 즐길 일정을 어떻게 정하면 좋을까요?',
    ],
    evidence: ['글쓴이가 실제로 더 많은 비용을 부담했어요.', '비용과 일정 선택을 연결한 사전 합의는 없었어요.', '여행에는 두 사람 모두 참여해요.'],
    viewpoints: {
      writer: '더 낸 비용에 관한 부담을 상대도 알아주면 좋겠어요.',
      other: '비용을 더 냈다는 이유만으로 일정을 혼자 정할 수는 없어요.',
      both: '비용은 다시 조정하고 일정은 함께 고르는 방식이 공평해요.',
      neither: '돈과 일정 문제를 섞지 말고 각각 따로 합의해야 해요.',
    },
    aiSide: 'other', jurySide: 'other',
  },
  'case-friend-loan': {
    paragraphs: [
      '친구가 급한 일이 있다며 300만 원을 빌려 달라고 했고, 저는 문자로 상환 날짜를 확인한 뒤 송금했습니다.',
      '약속한 날짜가 지난 지 6개월이지만 친구는 사정이 어렵다며 다음 달로 미뤄 달라는 말만 반복해요. 저는 이 돈이 필요한 시기가 다가옵니다.',
      '관계를 해치고 싶지 않지만 더 기다리기 어렵습니다. 어떤 방식으로 상환 계획을 분명히 해야 할까요?',
    ],
    evidence: ['빌려준 금액과 상환 날짜가 문자에 남아 있어요.', '약속한 날짜가 6개월 지났어요.', '친구는 어려움을 말하지만 구체적인 상환 계획은 제시하지 않았어요.'],
    viewpoints: {
      writer: '약속한 돈을 돌려받을 날짜와 방법을 분명히 요구할 수 있어요.',
      other: '친구의 현재 형편을 확인하고 가능한 분할 상환도 검토해 볼 수 있어요.',
      both: '상환 책임은 분명히 하되 현실적인 일정에 관해 협의하면 좋아요.',
      neither: '막연히 기다리거나 감정적으로 다투기보다 기록을 바탕으로 이야기해요.',
    },
    aiSide: 'writer', jurySide: 'writer',
  },
  'case-friend-trip-cancel': {
    paragraphs: [
      '친구와 둘이 여행을 가기로 하고 환불이 안 되는 숙소를 예약했어요. 예약 전에 비용과 환불 조건을 함께 확인했습니다.',
      '출발 직전 친구가 개인 사정으로 갈 수 없다고 했고, 저는 혼자 여행하기 어려워 예약금을 모두 잃게 됐어요. 친구는 절반만 부담하겠다고 합니다.',
      '취소한 친구에게 예약금 전액을 요청하는 게 맞을까요?',
    ],
    evidence: ['두 사람이 환불 불가 조건을 알고 예약했어요.', '취소는 출발 직전에 이뤄졌어요.', '실제 손실과 각자의 사용 가능성을 구분해야 해요.'],
    viewpoints: {
      writer: '갑작스러운 취소로 생긴 손실에 대해 친구가 더 책임져야 해요.',
      other: '예약금 전액을 한 사람에게 부담시키는 건 사정에 따라 과할 수 있어요.',
      both: '환불 불가 손실과 각자가 원래 부담할 몫을 나눠 봐야 해요.',
      neither: '전액과 절반 중 하나를 고르기보다 실제 손실부터 계산해요.',
    },
    aiSide: 'writer', jurySide: 'other',
  },
  'case-friend-group-chat': {
    paragraphs: [
      '친구들과 늘 함께 쓰던 단체 대화방이 있는데, 최근에는 저만 모르는 약속이 몇 번 생겼어요.',
      '우연히 다른 대화방에서 약속을 잡는다는 걸 알게 돼 서운하다고 말했지만, 친구들은 모든 모임에 다 부를 수는 없다며 제가 예민하다고 했습니다.',
      '친구마다 친밀도가 다를 수 있다는 건 알지만, 배제된 느낌을 어떻게 전해야 할까요?',
    ],
    evidence: ['별도 대화방에서 약속이 여러 번 잡혔어요.', '친구들은 모임마다 구성원이 달라질 수 있다고 해요.', '서운함을 전했지만 예민하다는 반응을 들었어요.'],
    viewpoints: {
      writer: '반복해서 빠진 사람에게 서운함이 생기는 건 자연스러워요.',
      other: '모든 약속에 같은 친구를 초대해야 하는 의무는 없어요.',
      both: '친구의 모임 선택권과 글쓴이의 소외감을 함께 인정해야 해요.',
      neither: '누가 예민한지 따지기보다 앞으로의 관계를 직접 이야기해요.',
    },
    aiSide: 'writer', jurySide: 'other',
  },
  'case-family-care': {
    paragraphs: [
      '부모님 병원 진료에 형제자매가 번갈아 동행하기로 했지만, 최근 몇 달은 제가 거의 모든 일정을 맡았습니다.',
      '다른 가족들은 일이 바쁘다고 했고 저는 가능한 날마다 시간을 냈어요. 다음 진료도 제게 부탁하자 더는 혼자 감당하기 어렵다고 말했습니다.',
      '부모님을 돌보는 마음은 같지만 동행과 연락 업무를 어떻게 나누면 좋을까요?',
    ],
    evidence: ['처음에는 번갈아 맡기로 약속했어요.', '실제 동행은 글쓴이에게 집중됐어요.', '시간을 내기 어려운 가족도 다른 방식으로 분담할 수 있어요.'],
    viewpoints: {
      writer: '동행 부담이 한 사람에게 계속 몰리는 건 조정해야 해요.',
      other: '다른 가족의 근무 시간과 이동 거리도 함께 살펴봐야 해요.',
      both: '동행뿐 아니라 예약과 비용 등 전체 돌봄 업무를 나누면 좋아요.',
      neither: '서로 바쁘다는 말만 하기보다 가능한 역할을 표로 정해 봐요.',
    },
    aiSide: 'writer', jurySide: 'writer',
  },
  'case-family-living-expenses': {
    paragraphs: [
      '취업 후 부모님과 함께 살며 매달 정해진 생활비를 내고 있어요. 저는 내년 독립을 목표로 보증금을 모으는 중입니다.',
      '최근 부모님이 공과금과 식비를 포함한 집안 생활비를 모두 맡아 달라고 하셨어요. 가족 형편이 걱정되지만 제 수입으로는 저축이 어렵습니다.',
      '가족을 돕는 범위와 독립 준비 비용을 어떻게 설명하고 합의해야 할까요?',
    ],
    evidence: ['이미 매달 일정한 생활비를 부담하고 있어요.', '부모님은 추가 부담이 필요하다고 말했어요.', '글쓴이에게는 독립을 위한 저축 계획이 있어요.'],
    viewpoints: {
      writer: '소득과 독립 계획을 고려하지 않고 전액을 맡기기는 어려워요.',
      other: '가계 형편이 급하다면 현재 지출을 함께 확인할 필요가 있어요.',
      both: '필요한 비용을 공개하고 각자의 부담 가능한 액수를 정하면 좋아요.',
      neither: '막연히 전액을 요구하거나 거절하기보다 예산부터 맞춰 봐요.',
    },
    aiSide: 'writer', jurySide: 'both',
  },
  'case-family-moving': {
    paragraphs: [
      '가족이 이사 날짜를 정하면서 제 일정은 미리 묻지 않았어요. 저는 그날 오래전에 잡은 개인 약속이 있습니다.',
      '이사 며칠 전에 짐을 옮겨 달라는 부탁을 받았고, 어렵다고 하니 가족은 중요한 날에 빠지면 서운할 것 같다고 했습니다.',
      '도울 마음은 있지만 기존 일정을 취소하기 어렵습니다. 다른 방식으로 돕겠다고 말해도 괜찮을까요?',
    ],
    evidence: ['이사 날짜가 정해질 때 글쓴이 일정은 확인하지 않았어요.', '도움 요청은 날짜가 임박해서 왔어요.', '직접 동행 외에도 준비와 정리 등 다른 도움이 가능해요.'],
    viewpoints: {
      writer: '미리 묻지 않은 일정에 맞추려고 기존 약속을 취소할 의무는 없어요.',
      other: '가족에게 이사는 큰일이니 가능한 지원을 함께 찾아보면 좋아요.',
      both: '그날은 어렵다고 말하되 전후에 맡을 수 있는 일을 제안해요.',
      neither: '서운함만 남기기보다 필요한 도움의 종류와 시간을 구체화해요.',
    },
    aiSide: 'writer', jurySide: 'writer',
  },
  'case-work-credit': {
    paragraphs: [
      '회의에 쓸 기획안을 제가 조사하고 초안부터 발표 자료까지 만들었어요. 작업 파일과 수정 기록도 남아 있습니다.',
      '회의에서는 상사가 이 아이디어를 자신의 제안으로 소개했고 제 이름은 언급하지 않았어요. 팀 성과로 볼 수는 있지만 기여가 지워진 느낌입니다.',
      '관계를 망치지 않으면서 제 작업과 기여를 어떻게 분명히 남길 수 있을까요?',
    ],
    evidence: ['기획안 작성과 수정 기록이 남아 있어요.', '발표에서 개인 기여가 언급되지 않았어요.', '팀 성과와 개인 기여를 어떻게 표기할지 합의가 없었어요.'],
    viewpoints: {
      writer: '작성 기록이 있다면 기획에 기여한 사실을 인정받아야 해요.',
      other: '팀장 명의로 발표하는 관행이 있었다면 사전에 기준을 확인할 필요가 있어요.',
      both: '팀 성과를 유지하면서 개인 기여도 정확히 남길 방법을 찾아야 해요.',
      neither: '공로 다툼만 하기보다 기록과 앞으로의 표기 기준을 함께 정해요.',
    },
    aiSide: 'writer', jurySide: 'both',
  },
  'case-work-after-hours': {
    paragraphs: [
      '퇴근한 뒤 팀 단체 대화방에 다음 날 처리할 업무 지시가 올라왔어요. 당직이나 긴급 대응을 맡기로 한 날은 아니었습니다.',
      '저는 다음 근무 시간에 확인하겠다고 남기고 답장을 멈췄어요. 다음 날 팀장은 다른 사람들은 바로 답했는데 왜 혼자 늦었냐고 했습니다.',
      '퇴근 후 연락에 어디까지 답해야 하는지 팀과 어떻게 기준을 정하면 좋을까요?',
    ],
    evidence: ['당직이나 긴급 대응 약속은 없었어요.', '메시지는 퇴근 후에 올라왔어요.', '다음 근무 시간에 확인하겠다고 답했습니다.'],
    viewpoints: {
      writer: '긴급 업무가 아니라면 퇴근 후 즉시 답하지 않을 수 있어요.',
      other: '팀에 실제 긴급한 사정이 있었다면 그 사실도 확인해야 해요.',
      both: '긴급 연락 기준과 다음 날 처리할 일을 구분해 두면 좋겠어요.',
      neither: '개인 반응 속도보다 팀의 연락 규칙을 먼저 정리해야 해요.',
    },
    aiSide: 'writer', jurySide: 'writer',
  },
  'case-work-new-hire': {
    paragraphs: [
      '신입 직원 교육 자료는 팀이 함께 만들기로 했어요. 저는 제 담당 부분의 목차와 예시를 먼저 정리했습니다.',
      '마감이 다가오는데 다른 자료가 모이지 않자 팀장이 전체 파일을 제가 마무리해 달라고 했어요. 다른 업무도 있어 혼자 감당하기 어렵습니다.',
      '요청을 무조건 거절하는 대신 현실적인 업무 범위를 어떻게 제안하면 좋을까요?',
    ],
    evidence: ['처음에는 공동 작업으로 안내됐어요.', '다른 자료가 제때 모이지 않았어요.', '글쓴이에게는 기존 업무와 마감이 있어요.'],
    viewpoints: {
      writer: '공동 업무를 한 사람에게 넘기려면 일정과 역할을 다시 조정해야 해요.',
      other: '마감이 급하다면 팀장이 우선순위를 조정해 주는지도 봐야 해요.',
      both: '가능한 범위를 밝히고 나머지는 담당자에게 다시 배분하면 좋아요.',
      neither: '막연히 혼자 맡거나 바로 거절하기보다 필요한 시간을 계산해요.',
    },
    aiSide: 'writer', jurySide: 'both',
  },
  'case-school-attendance': {
    paragraphs: [
      '친구가 늦잠을 잤다며 수업에서 자기 이름을 대신 불러 달라고 부탁했어요. 저는 출석 규정을 어기는 일이라 어렵다고 했습니다.',
      '친구는 한 번만 도와달라는 부탁이었는데 너무 원칙적이라며 이후 연락을 피하고 있어요. 친한 사이가 멀어진 것 같아 속상합니다.',
      '거절한 선택은 맞다고 생각하지만 친구와의 관계는 어떻게 풀어야 할까요?',
    ],
    evidence: ['대리 출석은 수업 규정에 어긋나요.', '친구는 한 번의 부탁이라고 생각했어요.', '거절 뒤 관계가 어색해졌어요.'],
    viewpoints: {
      writer: '규정을 어기는 부탁을 거절한 건 존중받아야 해요.',
      other: '친구가 서운했던 감정은 따로 들어볼 수 있어요.',
      both: '거절은 유지하면서 친구에게 관계를 소중히 여긴다고 전하면 좋아요.',
      neither: '대리 출석의 책임과 친구 사이의 감정을 나눠서 이야기해요.',
    },
    aiSide: 'writer', jurySide: 'writer',
  },
  'case-school-ai-report': {
    paragraphs: [
      '조별 보고서를 쓰면서 한 조원이 AI 도구로 만든 문장을 거의 그대로 붙여 넣었어요. 조원은 AI를 활용한 과제라 표절은 아니라고 합니다.',
      '저는 자료 출처를 확인하고 우리 의견으로 다시 쓰자고 했지만 마감이 가까워 이대로 제출하자는 의견도 있어요.',
      'AI 사용 자체와 출처 확인, 제출 책임을 어떻게 구분해 합의해야 할까요?',
    ],
    evidence: ['AI 도구 사용 자체는 과제에서 허용됐어요.', '문장과 정보의 출처 검토는 아직 끝나지 않았어요.', '조원 모두가 최종 보고서에 책임을 져야 해요.'],
    viewpoints: {
      writer: 'AI가 쓴 문장을 검증 없이 제출하는 건 위험해 보여요.',
      other: '허용된 도구라면 사용 범위를 먼저 확인한 뒤 판단해야 해요.',
      both: 'AI 활용은 가능하지만 출처 확인과 재작성은 함께 해야 해요.',
      neither: '표절이라는 단정 전에 과제 지침과 실제 제출 내용을 대조해요.',
    },
    aiSide: 'writer', jurySide: 'both',
  },
  'case-school-lab-data': {
    paragraphs: [
      '조별 실험에서 예상과 다른 결과가 나왔어요. 저는 측정 과정에 오류가 있었을 수 있어 원자료를 다시 확인하자고 했습니다.',
      '마감이 가까워 조원은 지금 나온 수치를 정리해 그대로 제출하자고 해요. 저는 결과가 마음에 들지 않는다고 데이터를 바꾸려는 건 아닙니다.',
      '재측정이 가능한 범위와 원자료를 그대로 보고해야 하는 기준을 어떻게 정하면 좋을까요?',
    ],
    evidence: ['예상과 다른 결과가 나온 상태예요.', '측정 오류 여부는 아직 확인되지 않았어요.', '마감까지 남은 시간에 재검토할 범위가 제한돼 있어요.'],
    viewpoints: {
      writer: '측정 과정에 의문이 있다면 원자료부터 확인해야 해요.',
      other: '마감이 임박했다면 현재 결과를 투명하게 설명하는 것도 방법이에요.',
      both: '원자료는 보존하고 가능한 만큼 재확인한 뒤 한계를 기록해요.',
      neither: '원하는 결과에 맞추기보다 실제 측정과 오류 가능성을 구분해요.',
    },
    aiSide: 'writer', jurySide: 'writer',
  },
}

/** 2심이 끝난 사건의 실제 시연 투표 수. 참여 인원과 비율은 여기서 계산한다. */
const closedCaseVotes: Record<string, Record<VoteId, number>> = {
  'case-secret-told': { writer: 30, other: 17, both: 56, neither: 5 },
  'case-study-presentation': { writer: 62, other: 13, both: 24, neither: 3 },
  'case-friend-mistake': { writer: 29, other: 12, both: 55, neither: 4 },
  'case-group-project-credit': { writer: 38, other: 19, both: 67, neither: 6 },
  'case-dating-anniversary': { writer: 42, other: 12, both: 24, neither: 3 },
  'case-friend-loan': { writer: 78, other: 17, both: 31, neither: 4 },
  'case-friend-trip-cancel': { writer: 18, other: 49, both: 23, neither: 4 },
  'case-family-care': { writer: 61, other: 12, both: 26, neither: 3 },
  'case-family-living-expenses': { writer: 27, other: 17, both: 54, neither: 3 },
  'case-work-credit': { writer: 55, other: 22, both: 86, neither: 5 },
  'case-school-attendance': { writer: 52, other: 12, both: 21, neither: 3 },
  'case-school-ai-report': { writer: 34, other: 19, both: 65, neither: 5 },
}

const voteIds: VoteId[] = ['writer', 'other', 'both', 'neither']

export function getPlazaJuryBreakdown(caseId: string | undefined) {
  if (!caseId) return null
  const votes = closedCaseVotes[caseId]
  if (!votes) return null

  const total = voteIds.reduce((sum, id) => sum + votes[id], 0)
  const ranked = [...voteIds].sort((a, b) => votes[b] - votes[a] || voteIds.indexOf(a) - voteIds.indexOf(b))
  const raw = ranked.map((id) => votes[id] * 100 / total)
  const percentages = raw.map(Math.floor)
  const remainderOrder = raw.map((value, index) => ({ index, fraction: value - percentages[index] }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index)
  const remaining = 100 - percentages.reduce((sum, value) => sum + value, 0)
  for (let index = 0; index < remaining; index += 1) percentages[remainderOrder[index].index] += 1

  return ranked.map((id, index) => ({
    id,
    label: weddingGiftCase.choices.find((choice) => choice.id === id)?.label.join(' ') ?? '',
    percent: percentages[index],
    votes: votes[id],
  }))
}

const avatarUrls = profileAvatars
const nicknames = ['차분한 배심원', '오늘도 한 표', '다른 각도', '생각 정리 중', '익명의 왈가닥', '함께 고민해요', '꼼꼼한 기록']
const voteLabels: Record<VoteId, string> = {
  writer: '투표 · 글쓴이 입장',
  other: '투표 · 상대방 입장',
  both: '투표 · 양쪽 모두',
  neither: '투표 · 양쪽 모두 아님',
}

const commentAngles = [
  '이 부분부터 서로 사실을 맞춰 보면 좋겠어요.',
  '상대가 같은 상황을 어떻게 받아들였는지도 들어보고 싶어요.',
  '감정과 실제로 있었던 일을 나눠서 이야기해야겠네요.',
  '다음에는 같은 갈등이 반복되지 않도록 기준을 정했으면 해요.',
  '지금 바꿀 수 있는 행동이 무엇인지부터 찾는 게 현실적이에요.',
  '누가 먼저 서운했는지만 따지면 해결이 더 늦어질 것 같아요.',
  '그때 서로 기대했던 바를 말로 확인하는 과정이 필요해 보여요.',
  '한 번의 반응으로 관계 전체를 단정하지 않았으면 합니다.',
  '왜 그 선택을 했는지 설명하고 나서 다음 약속을 정하면 좋겠어요.',
  '책임을 이야기할 때는 말보다 이후의 행동도 함께 봐야 해요.',
  '서운한 마음을 인정하는 것과 부탁을 들어주는 것은 구분할 수 있어요.',
  '서로 동의한 범위가 어디까지였는지 다시 확인해 보면 어떨까요?',
  '이 문제를 그냥 넘기면 비슷한 상황에서 또 부딪힐 수 있어요.',
  '각자 가능한 선택지를 먼저 적어 보면 대화가 덜 막힐 것 같아요.',
  '사과가 필요한 부분과 조정할 부분을 따로 짚어 보면 좋겠어요.',
  '지금의 판단이 앞으로의 관계에 어떤 영향을 줄지도 생각해 봐야겠어요.',
  '상대에게 원하는 변화를 한 가지씩 구체적으로 말하면 좋겠습니다.',
  '한쪽의 추측만으로 결론 내리기보다 직접 확인할 부분이 있어 보여요.',
] as const

function seededComments(id: string, narrative: Narrative, count: number, caseAgeMinutes: number): ThreadComment[] {
  const voteOrder: VoteId[] = [narrative.jurySide, narrative.aiSide, 'both', 'writer', 'other', narrative.jurySide, 'neither']
  const voteCounts = closedCaseVotes[id]
  const totalVotes = voteCounts ? voteIds.reduce((sum, side) => sum + voteCounts[side], 0) : 0

  return Array.from({ length: count }, (_, index) => {
    const sample = totalVotes ? (index * 37 + id.length * 11) % totalVotes : 0
    const voteId = voteCounts
      ? voteIds.find((side) => sample < voteIds.slice(0, voteIds.indexOf(side) + 1)
        .reduce((sum, current) => sum + voteCounts[current], 0)) ?? narrative.jurySide
      : voteOrder[index % voteOrder.length]
    const angleIndex = index % commentAngles.length
    const evidenceIndex = (Math.floor(index / commentAngles.length) + index) % narrative.evidence.length
    return {
      id: `${id}-comment-${index + 1}`,
      nickname: nicknames[index % nicknames.length],
      avatarUrl: avatarUrls[index % avatarUrls.length],
      minutesAgo: Math.max(1, Math.floor((index + 1) * caseAgeMinutes / (count + 1))),
      voteId,
      voteLabel: voteLabels[voteId],
      body: `${narrative.evidence[evidenceIndex]} ${narrative.viewpoints[voteId]} ${commentAngles[angleIndex]}`,
      likes: Math.max(0, 9 - Math.floor(index / 4)),
      dislikes: index % 4 === 0 ? 1 : 0,
    }
  })
}

const categoryCode: Record<string, string> = { 연인: 'LOVE', 친구: 'FRIEND', 가족: 'FAMILY', 직장: 'WORK', 학업: 'SCHOOL' }

/** 광장 20건의 목록 수를 유지하면서 홈의 개인화 추천에만 노출되는 사건. */
export const recommendationOnlyCases: PlazaCase[] = [
  { id: 'case-study-presentation', category: '학업', tag: '학업', title: '조별 과제에서 제 의견은 무시하고 팀원이\n발표 자료를 바꿨어요.', summary: '발표 직전 공동 자료를 상의 없이 바꿨어요.', viewCount: 238, commentCount: 25, isVerdictAligned: true, status: 'closed' },
  { id: 'case-friend-mistake', category: '친구', tag: '친구', title: '오랜 친구가 다른 친구들이 있는 자리에서\n제 실수를 계속 이야기해요.', summary: '그만해 달라고 했지만 장난이라는 대답을 들었어요.', viewCount: 207, commentCount: 24, isVerdictAligned: false, status: 'closed' },
]

export const getRecommendationCase = (caseId: string) =>
  plazaCases.find((item) => item.id === caseId) ?? recommendationOnlyCases.find((item) => item.id === caseId)

export function getPlazaCaseStory(caseId: string | undefined) {
  if (!caseId) return null
  const narrative = narratives[caseId]
  const card = getRecommendationCase(caseId)
  if (!narrative || !card) return null
  const commentCount = card.commentCount ?? 0
  const juryVotes = closedCaseVotes[caseId]
  const juryVoteCount = juryVotes ? voteIds.reduce((sum, id) => sum + juryVotes[id], 0) : null

  const latestPosition = latestPlazaCaseIds.findIndex((id) => id === caseId)
  const displayPosition = latestPosition < 0 ? latestPlazaCaseIds.length + recommendationOnlyCases.findIndex((item) => item.id === caseId) : latestPosition
  const minutesAgo = 28 + displayPosition * 37
  // 다른 시연 사건과 같은 2026-09-08 07:08 KST 기준 시각을 쓴다.
  const createdAtKst = new Date(Date.UTC(2026, 8, 8, 7, 8) - minutesAgo * 60_000)
  const createdAtLabel = `${String(createdAtKst.getUTCFullYear()).slice(2)}/${String(createdAtKst.getUTCMonth() + 1).padStart(2, '0')}/${String(createdAtKst.getUTCDate()).padStart(2, '0')} · ${String(createdAtKst.getUTCHours()).padStart(2, '0')}:${String(createdAtKst.getUTCMinutes()).padStart(2, '0')}`

  return {
    ...card,
    title: card.title.replace('\n', ' '),
    author: { nickname: `익명의 ${['고양이', '토끼', '다람쥐', '햄스터', '여우'][displayPosition % 5]}`, createdAt: createdAtLabel, avatarUrl: avatarUrls[displayPosition % avatarUrls.length] },
    age: minutesAgo < 60 ? `${minutesAgo}분 전` : `${Math.floor(minutesAgo / 60)}시간 전`,
    caseNumber: `#CASE-${categoryCode[card.category]}-${String(101 + displayPosition).padStart(3, '0')}`,
    participantCount: juryVoteCount ?? Math.max(commentCount + 10, Math.round(card.viewCount * .35)),
    deadline: '18:24:00',
    paragraphs: narrative.paragraphs,
    summary: [
      { title: '확인된 상황', body: narrative.evidence[0] },
      { title: '상대의 입장', body: narrative.evidence[1] },
      { title: '핵심 쟁점', body: narrative.evidence[2] },
    ],
    choices: weddingGiftCase.choices,
    aiSide: narrative.aiSide,
    jurySide: narrative.jurySide,
    aiReason: narrative.viewpoints[narrative.aiSide],
    juryReason: narrative.viewpoints[narrative.jurySide],
    comments: seededComments(caseId, narrative, commentCount, minutesAgo),
  }
}

export function getPlazaCaseResultContent(caseId: string | undefined) {
  const story = getPlazaCaseStory(caseId)
  if (!story) return null

  return {
    deadline: story.deadline,
    artworkUrl: story.aiSide === 'other' ? otherArtwork : writerArtwork,
    verdict: {
      label: '판멍이의 판단',
      title: story.aiSide === 'writer' ? '글쓴이의\n손을 들어줬어요' : '상대방의\n손을 들어줬어요',
      description: story.aiReason,
    },
    aiVerdictLabel: '판멍이가 주목한 점',
    aiVerdictTitle: story.summary[2].body,
    aiReasons: [story.aiReason, `${story.summary[0].body} ${story.summary[1].body}`],
    commentCount: story.comments.length,
  }
}

export const tailoredPlazaCaseIds = Object.keys(narratives)
