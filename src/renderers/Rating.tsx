import { FC, useState } from 'react'
import { InputLabel } from '@mui/material'

interface RatingProps {
  value: number
  updateValue: (newValue: number) => void
  label?: string
}

export const Rating: FC<RatingProps> = ({ value, updateValue, label }) => {
  const [hoverAt, setHoverAt] = useState<number | null>(null)

  return (
    <div style={{ marginBottom: '16px' }}>
      <InputLabel shrink style={{ marginBottom: '8px' }}>
        {label || 'Rating'}
      </InputLabel>
      <div style={{ cursor: 'pointer', fontSize: '24px' }}>
        {[0, 1, 2, 3, 4].map(i => {
          const fullStars = hoverAt ?? value
          return (
            <span
              onMouseOver={() => setHoverAt(i + 1)}
              onMouseOut={() => setHoverAt(null)}
              onClick={() => updateValue(i + 1)}
              key={i}
            >
              {i < fullStars ? '\u2605' : '\u2606'}
            </span>
          )
        })}
      </div>
    </div>
  )
}
