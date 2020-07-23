import { useComponentSize } from '@gpn-design/uikit/useComponentSize'
import classnames from 'classnames'

import { FormatValue } from '@/common/types'

import { Column, ColumnSize, OnMouseEnterColumn, SectionItem } from '../Column'

import { getSections } from './helpers'
import css from './index.css'

export type ColumnItem = {
  total: number
  sections?: readonly SectionItem[]
}

type Props = {
  name: string
  group: string
  columns: ReadonlyArray<ColumnItem | undefined>
  reversedColumns: ReadonlyArray<ColumnItem | undefined>
  isHorizontal: boolean
  isNegative: boolean
  size: ColumnSize
  isDense?: boolean
  activeGroup?: string
  activeSectionIndex?: number
  showValues: boolean
  scaler: (size: number, value: number) => number
  formatValueForLabel?: FormatValue
  onMouseEnterColumn: OnMouseEnterColumn
  onMouseLeaveColumn: React.MouseEventHandler
  onChangeLabelSize?: (size: number) => void
}

const sizeClasses: Record<ColumnSize, string> = {
  s: css.sizeS,
  m: css.sizeM,
  l: css.sizeL,
  xl: css.sizeXL,
  '2xl': css.size2XL,
  '3xl': css.size3XL,
}

export const Group: React.FC<Props> = ({
  columns,
  group,
  reversedColumns,
  isHorizontal,
  isNegative,
  size,
  isDense,
  activeGroup,
  activeSectionIndex,
  showValues,
  scaler,
  formatValueForLabel,
  onMouseEnterColumn,
  onMouseLeaveColumn,
  onChangeLabelSize,
}) => {
  const columnsRef = React.useRef<HTMLDivElement>(null)
  const { width, height } = useComponentSize(columnsRef)
  const scalerSize = isHorizontal ? width : height

  const renderColumn = (column: ColumnItem | undefined, index: number, isReversed?: boolean) => {
    if (!column) {
      return null
    }

    const sections = getSections({
      size: scalerSize,
      sections: column.sections,
      scaler,
    })

    return (
      <Column
        key={index}
        group={group}
        total={column.total}
        sections={sections}
        size={size}
        isHorizontal={isHorizontal}
        isReversed={isReversed}
        isDense={isDense}
        showValues={showValues}
        activeGroup={activeGroup}
        activeSectionIndex={activeSectionIndex}
        formatValueForLabel={formatValueForLabel}
        onMouseEnterColumn={onMouseEnterColumn}
        onMouseLeaveColumn={onMouseLeaveColumn}
        onChangeLabelSize={index === 0 ? onChangeLabelSize : undefined}
      />
    )
  }

  return (
    <div
      className={classnames(
        css.group,
        isHorizontal && css.isHorizontal,
        isDense && css.isDense,
        sizeClasses[size]
      )}
    >
      <div ref={columnsRef} className={css.columns}>
        <div className={css.wrapper}>
          {columns.map((column, index) => renderColumn(column, index))}
        </div>
        {isNegative && (
          <div className={classnames(css.wrapper, css.isReversed)}>
            {reversedColumns.map((column, index) => renderColumn(column, index, true))}
          </div>
        )}
      </div>
    </div>
  )
}
