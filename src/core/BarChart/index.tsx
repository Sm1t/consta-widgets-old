import React, { useRef, useState } from 'react'

import useComponentSize from '@rehooks/component-size'
import classnames from 'classnames'

import { FormatValue } from '@/common/types'
import { scaleBand, scaleLinear } from '@/common/utils/scale'
import { getTicks } from '@/common/utils/ticks'
import { Grid } from '@/core/Grid'
import { Axis } from '@/BarChartAxis'
import { useBaseSize } from '@/BaseSizeContext'

import { ColumnItem, Group } from './components/Group'
import { Tooltip, TooltipData } from './components/Tooltip'
import {
  defaultGetAxisShowPositions,
  GetAxisShowPositions,
  getColumnSize,
  getEveryNTick,
  getGroupsDomain,
  getRange,
  getScaler,
  getValuesDomain,
  GROUP_INNER_PADDING,
  OUTER_PADDING,
  Size,
  toAxisSize,
} from './helpers'
import css from './index.css'

export const unitPositions = ['left', 'bottom', 'left-and-bottom', 'none'] as const
export type UnitPosition = typeof unitPositions[number]

export type Group = {
  name: string
  columns: ReadonlyArray<ColumnItem | undefined>
  reversedColumns: ReadonlyArray<ColumnItem | undefined>
}

export type Groups = readonly Group[]

export type Props = {
  groups: Groups
  gridTicks: number
  valuesTicks: number
  size: Size
  isHorizontal?: boolean
  showValues?: boolean
  unit?: string
  unitPosition?: UnitPosition
  getAxisShowPositions?: GetAxisShowPositions
  formatValueForLabel?: FormatValue
}

export const CoreBarChart: React.FC<Props> = props => {
  const {
    groups,
    gridTicks,
    valuesTicks,
    isHorizontal = false,
    showValues = false,
    size,
    unit,
    unitPosition = 'none',
    getAxisShowPositions = defaultGetAxisShowPositions,
    formatValueForLabel,
  } = props
  const ref = useRef(null)
  const svgRef = useRef(null)
  const { width, height } = useComponentSize(ref)
  const { getCalculatedSizeWithBaseSize } = useBaseSize()
  const [tooltipData, setTooltipData] = useState<TooltipData>()

  const showReversed = groups.some(group =>
    group.reversedColumns.some(column => column && column.sections)
  )

  const groupsDomain = getGroupsDomain(groups)
  const valuesDomain = getValuesDomain(groups, showReversed)
  const maxValue = valuesDomain[1]
  const columnSize = getColumnSize({
    size,
    valueLength: maxValue.toString().length,
    isHorizontal,
  })
  const padding = isHorizontal && showValues ? getCalculatedSizeWithBaseSize(50) : 0
  const paddingCount = showReversed ? 2 : 1
  const svgWidth = width ? Math.round(width - padding * paddingCount) : 0
  const svgHeight = height ? Math.round(height) : 0
  const scaler = getScaler({ maxValue, showReversed })
  const groupScale = scaleBand({
    range: getRange(isHorizontal ? svgHeight : svgWidth),
    domain: groupsDomain,
    paddingInner: getCalculatedSizeWithBaseSize(GROUP_INNER_PADDING[columnSize]),
    paddingOuter: getCalculatedSizeWithBaseSize(OUTER_PADDING),
  })
  const valuesScale = scaleLinear({
    domain: valuesDomain,
    range: getRange(isHorizontal ? svgWidth : svgHeight, !isHorizontal),
  })
  const gridItems = getTicks(valuesDomain, gridTicks)
  const axisValues = getEveryNTick(gridItems, valuesTicks)
  const gridXTickValues = isHorizontal ? gridItems : []
  const gridYTickValues = isHorizontal ? [] : gridItems
  const axisShowPositions = getAxisShowPositions({ isHorizontal, showReversed })
  const commonStyle = {
    paddingLeft: showReversed ? padding : 0,
    paddingRight: padding,
  }

  return (
    <Axis
      values={axisValues}
      labels={groupsDomain}
      valuesScaler={valuesScale}
      labelsScaler={groupScale}
      isHorizontal={isHorizontal}
      unit={unit}
      unitPosition={unitPosition}
      size={toAxisSize(columnSize)}
      formatValue={formatValueForLabel}
      showPositions={axisShowPositions}
      horizontalStyles={commonStyle}
      showValues={showValues}
      isNegative={showReversed}
    >
      <div ref={ref} className={css.main} style={commonStyle}>
        <svg className={css.svg} width={svgWidth} height={svgHeight} ref={svgRef}>
          <Grid
            scalerX={valuesScale}
            scalerY={valuesScale}
            xTickValues={gridXTickValues}
            yTickValues={gridYTickValues}
            width={svgWidth}
            height={svgHeight}
          />
        </svg>
        <div className={classnames(css.chart, isHorizontal && css.isHorizontal)}>
          {groups.map(group => (
            <Group
              {...group}
              key={group.name}
              size={columnSize}
              isHorizontal={isHorizontal}
              isNegative={showReversed}
              showValues={showValues}
              scaler={scaler}
              onMouseEnterColumn={setTooltipData}
              onMouseLeaveColumn={() => setTooltipData(undefined)}
            />
          ))}
        </div>
        {tooltipData && (
          <Tooltip
            data={tooltipData}
            isHorizontal={isHorizontal}
            formatValue={formatValueForLabel}
          />
        )}
      </div>
    </Axis>
  )
}
