import blue01 from '../../assets/profile-icons/blue01.svg'
import blue02 from '../../assets/profile-icons/blue02.svg'
import green01 from '../../assets/profile-icons/green01.svg'
import green02 from '../../assets/profile-icons/green02.svg'
import orange01 from '../../assets/profile-icons/orange01.svg'
import orange02 from '../../assets/profile-icons/orange02.svg'
import pink01 from '../../assets/profile-icons/pink01.svg'
import pink02 from '../../assets/profile-icons/pink02.svg'

/** 사용자 제공 컬러 프로필. 작성자·댓글·후일담에서 같은 순서로 사용한다. */
export const profileAvatars = [
  blue01, green01, orange01, pink01,
  blue02, green02, orange02, pink02,
] as const

export const accountProfileAvatars = { seoa: pink01, jihun: blue01, custom: pink02 } as const
