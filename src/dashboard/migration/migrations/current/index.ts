import { Layout } from 'react-grid-layout'

import { isDefined } from '@csssr/gpn-utils/lib/type-guards'
import * as _ from 'lodash'

import { isWidget } from '@/utils/type-guards'
import { TextWidget } from '@/widgets/TextWidget'

import { Migration } from '../..'
import { Dashboard10 } from '../dashboard10'

export namespace CurrentDashboard {
  export type VerticalAlignment = 'top' | 'middle' | 'bottom'

  export type ColumnParams = {
    growRatio?: number
    verticalAlignment?: VerticalAlignment
  }

  export type RowParams = {
    growRatio?: number
  }

  export type GridContent = {
    items: ReadonlyArray<ReadonlyArray<ReadonlyArray<WidgetItem | SwitchItem>>>
    columnParams: readonly ColumnParams[]
    rowParams: readonly RowParams[]
  }

  export type BoxItemMarginSize = '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl'

  export type CommonBoxItemParams = {
    marginTop?: BoxItemMarginSize
    growRatio?: number
    fallbackPlaceholderText?: string
  }

  export type GridItem = {
    type: 'grid'
    grid: GridContent
    params: CommonBoxItemParams
  }

  export type SwitchContent = ReadonlyArray<readonly WidgetItem[]>

  export type SwitchItem = {
    type: 'switch'
    id: string
    displays: SwitchContent
    params: CommonBoxItemParams & {
      datasetId?: string
    }
  }

  export type WidgetItem = {
    type: 'widget'
    id: string
    debugName: string
    widgetType: string
    params: CommonBoxItemParams & {
      [key: string]: any
      datasetId?: string
    }
  }

  export type BoxItem = WidgetItem | GridItem | SwitchItem

  export type Config = { [key: string]: readonly BoxItem[] }

  export type MarginSize = 's' | 'm' | 'l' | 'xl'

  export type Settings = {
    cols?: number
    margin?: MarginSize
  }

  export type State = {
    version: 11
    boxes: readonly Layout[]
    config: Config
    settings: Settings
  }
}

export const currentMigration: Migration<Dashboard10.State, CurrentDashboard.State> = {
  versionTo: 11,
  changes: ['Добавлена кастомизация текстового виджета'],
  // MIGRATION_GENERATION:METHOD:START
  up: data => {
    return {
      ...data,
      version: 11,
    }
  },
  // MIGRATION_GENERATION:METHOD:END

  // MIGRATION_GENERATION:METHOD:START
  down: data => {
    const updateItem = (item: CurrentDashboard.BoxItem): Dashboard10.BoxItem => {
      if (item.type === 'switch') {
        return {
          ...item,
          displays: item.displays.map(widgets => widgets.map(updateItem).filter(isWidget)),
        }
      }

      if (item.type === 'grid') {
        return {
          ...item,
          grid: {
            ...item.grid,
            items: item.grid.items.map(row =>
              row.map(column => column.map(updateItem).filter(isWidget))
            ),
          },
        }
      }

      if (item.widgetType === TextWidget.id) {
        return item.params.type === 'advanced'
          ? {
              ...item,
              params: {
                type: 'text1',
                ..._.omit(item.params, [
                  'type',
                  'size',
                  'fontStyle',
                  'lineHeight',
                  'align',
                  'weight',
                  'transform',
                  'spacing',
                  'font',
                  'decoration',
                ]),
              },
            }
          : item
      }
      return item
    }

    return {
      ...data,
      version: 10,
      config: Object.keys(data.config).reduce((newConfig, key) => {
        const items = data.config[key]

        return {
          ...newConfig,
          [key]: items.map(updateItem).filter(isDefined),
        }
      }, {}),
    }
  },
  // MIGRATION_GENERATION:METHOD:END
}
