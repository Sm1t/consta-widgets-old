import { getCalculatedSize } from '@gaz/utils/lib/css'
import classnames from 'classnames'

import css from './index.css'

export const types = ['dot', 'line'] as const
export type Type = typeof types[number]

export const positions = ['top', 'left'] as const
export type Position = typeof positions[number]

export const sizes = ['xs', 's', 'm'] as const
export type Size = typeof sizes[number]

type Props = {
  children: React.ReactNode
  color: string
  type?: Type
  fontSize?: Size
  position?: Position
  lineBold?: boolean
  className?: string
  /** Обрезать текст, если он больше 2 строк */
  shouldCropText?: boolean
}

const sizeClass = {
  xs: css.sizeXS,
  s: css.sizeS,
  m: css.sizeM,
}

const getDotStyle = (): React.CSSProperties => {
  const size = getCalculatedSize(12)

  return {
    width: size,
    height: size,
  }
}

export const LegendItem: React.FC<Props> = ({
  children,
  color,
  type = 'dot',
  fontSize = 's',
  position = 'left',
  lineBold,
  className,
  shouldCropText,
}) => {
  const positionClass = type === 'dot' ? css.left : css[position]
  const dotStyle = type === 'dot' ? getDotStyle() : {}

  return (
    <div className={classnames(css.main, sizeClass[fontSize], positionClass, className)}>
      <div
        className={classnames(css.sign, css[type], lineBold && css.isBold)}
        style={{ background: color, ...dotStyle }}
      />
      <span className={classnames(css.text, shouldCropText && css.isSeparating)}>{children}</span>
    </div>
  )
}
