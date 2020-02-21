import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import { getDayPlural } from '@csssr/gpn-utils/lib/pluralization'
import { isDefined } from '@csssr/gpn-utils/lib/type-guards'
import classnames from 'classnames'
import { reverse } from 'lodash'

import { ColorGroups } from '@/dashboard/types'
import { daysDiff, formatDate, getEndOfDay, getStartOfDay } from '@/utils/time'

import { Item } from '../..'

import css from './index.css'

type Props = {
  colorGroups: ColorGroups
  direction?: 'top' | 'bottom'
  plan: Item
  fact: Item
  left: number
  top?: number
  bottom?: number
}

const MAX_LENGTH_COMMENT = 280
const CLEAN_COMMENT = 'Комментария нет'

const stopEventHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
  event.stopPropagation()

const getDayText = (start: number, end: number) =>
  getDayPlural(daysDiff(getStartOfDay(start), getEndOfDay(end)))

const renderDates = (color: string, fact: Item, plan: Item) => (
  <>
    <div className={css.dateBlock}>
      <span className={classnames(css.circle, css.transparent)} style={{ background: color }} />
      <span className={css.label}>План:</span>
      {formatDate(plan.startDate)} – {formatDate(plan.endDate)}{' '}
      <b>({getDayText(plan.startDate, plan.endDate)})</b>
    </div>
    <div className={css.dateBlock}>
      <span className={css.circle} style={{ background: color }} />
      <span className={css.label}>Факт:</span>
      {formatDate(fact.startDate)} – {formatDate(fact.endDate)}{' '}
      <b>({getDayText(fact.startDate, fact.endDate)})</b>
    </div>
  </>
)

const renderComment = (comment: string) => {
  const text = comment.substr(0, MAX_LENGTH_COMMENT)

  return (
    <>
      <div className={css.title}>Комментарий:</div>
      {text}
      {comment.length > MAX_LENGTH_COMMENT ? '...' : ''}
    </>
  )
}

export const RoadmapTooltip: React.FC<Props> = ({
  fact,
  plan,
  colorGroups,
  direction = 'top',
  left,
  top,
  bottom,
}) => {
  const [activeSection, changeActiveSection] = useState('')
  const isActiveDates = activeSection === 'dates'
  const isActiveComment = activeSection === 'comment'
  const isOpened = isActiveDates || isActiveComment
  const { comment = CLEAN_COMMENT, groupName } = fact
  const content = [
    isOpened ? (
      <div
        onClick={stopEventHandler}
        key="content"
        className={classnames(css.content, isActiveDates && css.dates)}
      >
        {isActiveComment ? renderComment(comment) : renderDates(colorGroups[groupName], fact, plan)}
      </div>
    ) : null,
    <div key="buttons" className={css.buttons}>
      <div
        className={classnames(css.button, css.dates, isActiveDates && css.active)}
        onClick={event => {
          stopEventHandler(event)
          changeActiveSection('dates')
        }}
      />
      <div
        className={classnames(css.button, css.comment, isActiveComment && css.active)}
        onClick={event => {
          stopEventHandler(event)
          changeActiveSection('comment')
        }}
      />
    </div>,
  ] as const

  if (!isDefined(top) && !isDefined(bottom)) {
    return null
  }

  return ReactDOM.createPortal(
    <div
      className={classnames(css.main, isOpened && css.opened, css[direction])}
      style={{ left, top, bottom }}
    >
      {direction === 'top' ? content : reverse(content)}
    </div>,
    window.document.body
  )
}
