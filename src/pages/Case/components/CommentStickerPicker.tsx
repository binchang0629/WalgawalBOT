import { useEffect, useRef, useState } from 'react'
import {
  commentStickers,
  type CommentStickerCharacter,
  type CommentStickerId,
} from '../../../data/common/commentStickers'

interface CommentStickerPickerProps {
  defaultCharacter: CommentStickerCharacter
  selectedStickerId: CommentStickerId | null
  onSelect: (stickerId: CommentStickerId) => void
  onClose: () => void
}

function CommentStickerPicker({
  defaultCharacter,
  selectedStickerId,
  onSelect,
  onClose,
}: CommentStickerPickerProps) {
  const [character, setCharacter] = useState(defaultCharacter)
  const pickerRef = useRef<HTMLDivElement>(null)
  const visibleStickers = commentStickers.filter((sticker) => sticker.character === character)

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) onClose()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div ref={pickerRef} className="comment-sticker-picker" role="dialog" aria-label="캐릭터 스티커 선택">
      <div className="comment-sticker-picker__tabs" role="tablist" aria-label="캐릭터 선택">
        {(['walgadak', 'wallang'] as const).map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={character === item}
            className={character === item ? 'is-selected' : ''}
            onClick={() => setCharacter(item)}
          >
            {item === 'walgadak' ? '왈가닥이' : '왈랑이'}
          </button>
        ))}
      </div>

      <div className="comment-sticker-picker__grid">
        {visibleStickers.map((sticker) => (
          <button
            key={sticker.id}
            type="button"
            className={selectedStickerId === sticker.id ? 'is-selected' : ''}
            aria-label={`${sticker.characterLabel} ${sticker.expressionLabel} 스티커`}
            aria-pressed={selectedStickerId === sticker.id}
            onClick={() => onSelect(sticker.id)}
          >
            <img src={sticker.imageUrl} alt="" />
            <span>{sticker.expressionLabel}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default CommentStickerPicker
