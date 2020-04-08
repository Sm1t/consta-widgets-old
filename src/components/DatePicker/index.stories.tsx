import { date as knobsDate, select } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import { withSmartKnobs } from 'storybook-addon-smart-knobs'

import { isValidDate } from '@/utils/type-guards'
import { blockCenteringDecorator } from '@/utils/Storybook'

import { DatePicker, DateRange, sizes } from '.'
import { getDateMidnightFromString, getInputValue } from './components/InputDate/helpers'

const setInputValue = (value?: string) => {
  if (!value) {
    return undefined
  }

  const date = getDateMidnightFromString(value)

  return isValidDate(date) ? date : undefined
}

const defaultProps = () =>
  ({
    minDate: new Date(knobsDate('minDate', new Date(2019, 0, 1))),
    maxDate: new Date(knobsDate('maxDate', new Date(2020, 3, 2))),
    size: select('size', sizes, sizes[1]),
  } as const)

const DakePickerSingleStory = () => {
  const [date, setDate] = React.useState<Date | undefined>()

  return <DatePicker type="date" value={date} onChange={setDate} {...defaultProps()} />
}

const DatePickerThirdPartyInputStory = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2019, 3, 1))

  return (
    <DatePicker
      type="date"
      value={date}
      onChange={setDate}
      {...defaultProps()}
      renderControls={({ size, value, onChange }) => {
        return (
          <input
            type="date"
            value={getInputValue(value)}
            onChange={event => {
              onChange(setInputValue(event.target.value))
            }}
            className={size}
          />
        )
      }}
    />
  )
}

const DatePickerRangeStory = () => {
  const [range, setRange] = React.useState<DateRange | undefined>([undefined, undefined])

  return <DatePicker type="date-range" value={range} onChange={setRange} {...defaultProps()} />
}

const DatePickerRangeThirdPartyInputStory = () => {
  const [range, setRange] = React.useState<DateRange | undefined>([undefined, undefined])

  return (
    <DatePicker
      type="date-range"
      value={range}
      onChange={setRange}
      {...defaultProps()}
      renderControls={({ size, value, onChange }) => {
        return (
          <>
            <input
              type="date"
              value={value && getInputValue(value[0])}
              onChange={event => {
                onChange([setInputValue(event.target.value), (value && value[1]) || undefined])
              }}
              className={size}
            />
            <input
              type="date"
              value={value && getInputValue(value[1])}
              onChange={event => {
                onChange([(value && value[0]) || undefined, setInputValue(event.target.value)])
              }}
              className={size}
            />
          </>
        )
      }}
    />
  )
}

storiesOf('components/DatePicker', module)
  .addDecorator(withSmartKnobs())
  .addDecorator(blockCenteringDecorator())
  .add('Выбор даты', () => <DakePickerSingleStory />)
  .add('Выбор даты с сторонним инпутом', () => <DatePickerThirdPartyInputStory />)
  .add('Выбор диапазона дат', () => <DatePickerRangeStory />)
  .add('Выбор диапазона дат с сторонними инпутами', () => <DatePickerRangeThirdPartyInputStory />)
