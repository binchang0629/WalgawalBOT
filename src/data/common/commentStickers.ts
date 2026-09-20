import walgadakCurious from '../../assets/case/stickers/walgadak-curious.png'
import walgadakDefault from '../../assets/case/stickers/walgadak-default.png'
import walgadakEmpathy from '../../assets/case/stickers/walgadak-empathy.png'
import walgadakJoy from '../../assets/case/stickers/walgadak-joy.png'
import walgadakListen from '../../assets/case/stickers/walgadak-listen.png'
import walgadakThinking from '../../assets/case/stickers/walgadak-thinking.png'
import wallangCurious from '../../assets/case/stickers/wallang-curious.png'
import wallangDefault from '../../assets/case/stickers/wallang-default.png'
import wallangEmpathy from '../../assets/case/stickers/wallang-empathy.png'
import wallangJoy from '../../assets/case/stickers/wallang-joy.png'
import wallangListen from '../../assets/case/stickers/wallang-listen.png'
import wallangThinking from '../../assets/case/stickers/wallang-thinking.png'

export type CommentStickerCharacter = 'walgadak' | 'wallang'
export type CommentStickerExpression = 'listen' | 'empathy' | 'curious' | 'default' | 'joy' | 'thinking'
export type CommentStickerId = `${CommentStickerCharacter}-${CommentStickerExpression}`

export interface CommentSticker {
  id: CommentStickerId
  character: CommentStickerCharacter
  characterLabel: '왈가닥이' | '왈랑이'
  expressionLabel: '경청' | '공감' | '궁금' | '기본' | '기쁨' | '생각'
  imageUrl: string
}

const stickerSources = {
  walgadak: {
    listen: walgadakListen,
    empathy: walgadakEmpathy,
    curious: walgadakCurious,
    default: walgadakDefault,
    joy: walgadakJoy,
    thinking: walgadakThinking,
  },
  wallang: {
    listen: wallangListen,
    empathy: wallangEmpathy,
    curious: wallangCurious,
    default: wallangDefault,
    joy: wallangJoy,
    thinking: wallangThinking,
  },
} as const

const expressionLabels: Record<CommentStickerExpression, CommentSticker['expressionLabel']> = {
  listen: '경청',
  empathy: '공감',
  curious: '궁금',
  default: '기본',
  joy: '기쁨',
  thinking: '생각',
}

export const commentStickers: CommentSticker[] = (
  Object.entries(stickerSources) as [CommentStickerCharacter, typeof stickerSources[CommentStickerCharacter]][]
).flatMap(([character, expressions]) => (
  Object.entries(expressions) as [CommentStickerExpression, string][]
).map(([expression, imageUrl]) => ({
  id: `${character}-${expression}`,
  character,
  characterLabel: character === 'walgadak' ? '왈가닥이' : '왈랑이',
  expressionLabel: expressionLabels[expression],
  imageUrl,
})))

export const commentStickerById = Object.fromEntries(
  commentStickers.map((sticker) => [sticker.id, sticker]),
) as Record<CommentStickerId, CommentSticker>
