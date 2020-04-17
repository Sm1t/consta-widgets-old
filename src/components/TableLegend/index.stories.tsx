import React from 'react'

import { object } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import { withSmartKnobs } from 'storybook-addon-smart-knobs'

import { DataType } from '@/dashboard'
import { BadgeParams, legendParams } from '@/dashboard/widget-params'
import { getWidgetMockData } from '@/utils/widget-mock-data'
import { blockCenteringDecorator } from '@/utils/Storybook'
import { BadgeWidgetContent } from '@/widgets/BadgeWidget'

import { TableLegend } from '.'

type BadgeProps = React.ComponentProps<typeof BadgeWidgetContent>

type RowId = { id: string }

type ListItem = Record<string, string | number | BadgeProps> & RowId

const convertItem = ({ id, ...obj }: ListItem) =>
  Object.keys(obj).reduce<Record<string, React.ReactNode> & RowId>(
    (acc, key) => {
      const item = obj[key]

      acc[key] =
        typeof item !== 'string' && typeof item !== 'number' ? (
          <BadgeWidgetContent {...item} />
        ) : (
          item
        )

      return acc
    },
    { id }
  )

const badgeParams: BadgeParams = {
  view: 'filled',
  isMinified: true,
  size: 'm',
}

const getList = () => {
  const data: readonly ListItem[] = object('list', [
    {
      id: 'row1',
      field: 'Северный бур',
      sum: 20,
      status: {
        data: {
          status: 'normal',
          text: '',
          comment: '',
        },
        params: badgeParams,
      },
    },
    {
      id: 'row2',
      field: 'Южное месторождение',
      sum: 15,
      status: {
        data: {
          status: 'warning',
          text: '',
          comment: '',
        },
        params: badgeParams,
      },
    },
    {
      id: 'row3',
      field: 'Западный разлом',
      sum: 7,
      status: {
        data: {
          status: 'error',
          text: '',
          comment: '',
        },
        params: badgeParams,
      },
    },
  ])

  return data.map(convertItem)
}

const TableLegendWithSelectedRow = () => {
  const [activeRowId, setActiveRowId] = React.useState<string | undefined>()

  return (
    <TableLegend
      isShowLegend={false}
      size="l"
      data={{
        ...object('data', getWidgetMockData(DataType.TableLegend)),
        activeRow: {
          id: activeRowId,
          onChange: setActiveRowId,
        },
      }}
    />
  )
}

storiesOf('components/TableLegend', module)
  .addDecorator(withSmartKnobs())
  .addDecorator(blockCenteringDecorator({ width: '90vw' }))
  .add('обычная', () => (
    <TableLegend
      isShowLegend={false}
      size="l"
      data={object('data', getWidgetMockData(DataType.TableLegend))}
    />
  ))
  .add('c возможностью выбора активной строки', () => <TableLegendWithSelectedRow />)

storiesOf('components/TableLegend', module)
  .addDecorator(withSmartKnobs())
  .addDecorator(blockCenteringDecorator({ width: 500 }))
  .add('со "Светофором"', () => (
    <TableLegend
      isShowLegend={false}
      size="l"
      data={{
        colorGroups: object('colorGroups', {
          first: 'var(--color-bg-alert)',
          second: 'var(--color-bg-caution)',
          third: 'var(--color-bg-success)',
        }),
        list: getList(),
        legendFields: object('legendFields', [
          {
            field: 'Северный бур',
            colorGroupName: 'first',
            typeLegend: legendParams.labelTypes[0],
          },
          {
            field: 'Южное месторождение',
            colorGroupName: 'second',
            typeLegend: legendParams.labelTypes[0],
          },
          {
            field: 'Западный разлом',
            colorGroupName: 'third',
            typeLegend: legendParams.labelTypes[0],
          },
        ]),
        columns: object('columns', [
          {
            title: 'Локация',
            accessor: 'field',
            align: 'left',
          },
          {
            title: 'Сумма скважин без МГРП',
            accessor: 'sum',
            align: 'right',
          },
          {
            title: 'Статус',
            accessor: 'status',
            align: 'center',
          },
        ]),
        filters: [
          {
            id: 'fieldNorthDrill',
            name: 'Северный бур',
            filterer: (value: string) => value === 'Северный бур',
            field: 'field',
          },
          {
            id: 'fieldSouthWell',
            name: 'Южное месторождение',
            filterer: (value: string) => value === 'Южное месторождение',
            field: 'field',
          },
          {
            id: 'fieldWestCrack',
            name: 'Западный разлом',
            filterer: (value: string) => value === 'Западный разлом',
            field: 'field',
          },

          {
            id: 'sumLess10',
            name: 'Менее 10',
            filterer: (value: number | string) => Number(value) < 10,
            field: 'sum',
          },
          {
            id: 'sumFrom10To20',
            name: 'От 10 (вкл.) до 20 (не вкл.)',
            filterer: (value: number | string) => Number(value) >= 10 && Number(value) < 20,
            field: 'sum',
          },
          {
            id: 'sum20AndMore',
            name: '20 и более',
            filterer: (value: number | string) => Number(value) >= 20,
            field: 'sum',
          },
        ],
      }}
    />
  ))
