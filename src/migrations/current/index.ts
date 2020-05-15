import { Layout } from 'react-grid-layout'

import * as _ from 'lodash'

import { Migration } from '../'
import { Dashboard17 } from '../dashboard17'

import {
  BadgeParams,
  BarChartParams,
  ButtonParams,
  CheckboxParams,
  ChoiceGroupParams,
  DatePickerParams,
  DonutParams,
  ImageParams,
  ImagesParams,
  LegendParams,
  LinearChartParams,
  MapParams,
  MultiBarChartParams,
  ProgressBarParams,
  PyramidChartParams,
  RadarChartParams,
  RoadmapParams,
  StatsParams,
  TableLegendParams,
  TextParams,
  TornadoChartParams,
} from './widget-params'

export const widgetIdsByType = {
  BadgeWidget: 'fbeb7619-ae6b-4742-ae62-deea18e1382d',
  BarChartWidget: '1a8a7577-36e3-4fe6-a23e-244a51cd37c8',
  ButtonWidget: '950e2e88-06e7-4429-86be-0a26dc93944e',
  CheckboxWidget: '07645756-85d1-43da-b66c-10f96e5aff0b',
  ChoiceGroupWidget: '430768bb-be37-42b0-a1e7-57c6c1bebcea',
  DatePickerWidget: 'f62a900b-99a2-4194-a277-eb58c49d68ff',
  DonutChartWidget: 'c7709106-fe0d-4e7c-bfce-2e5b88aa6d50',
  ImagesWidget: 'd1a60ed1-96de-49b2-badd-052e0408d55a',
  ImageWidget: '4cbc790b-7124-402f-8c7f-ec48b3403f74',
  LegendWidget: '2538ed91-7c6d-403e-9c3e-d68d3ecd8d00',
  LinearChartWidget: 'e63c468b-75bd-4c5c-95c7-696e598db6e3',
  MapWidget: '6d34ccb1-bfc6-4898-a520-7e3c8194a378',
  MultiBarChartWidget: '653e4b44-2bac-4483-8366-ace725375a35',
  ProgressBarWidget: '944a8e67-5604-444f-afe0-f4a3263b734a',
  PyramidChartWidget: '7adf7782-03cd-4452-bfc7-20f1c02d8eac',
  RadarChartWidget: '94456b61-fba4-4121-a29c-a313cac4f4c0',
  RoadmapWidget: '3e85c9b1-2507-4dd0-955c-469a3f1919b5',
  StatsWidget: '506fa3ba-e016-4b94-9ad3-547f7e70c464',
  TableLegendWidget: '2f8f8f8e-21eb-4751-ab81-56ea11ac6342',
  TextWidget: 'b69b03e4-7fb6-4ac2-bdfa-e6c7fecdcca5',
  TornadoChartWidget: 'dfa08263-9699-40e1-a701-1ee25a416b9a',
} as const

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

  export type GridItemParams = {
    verticalMargin?: BoxItemMarginSize
    horizontalMargin?: BoxItemMarginSize
  }

  export type GridItem = {
    type: 'grid'
    grid: GridContent
    params: CommonBoxItemParams & GridItemParams
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

  type WidgetItemParams<WidgetType, Params> = {
    type: 'widget'
    id: string
    debugName: string
    widgetType: WidgetType
    params: CommonBoxItemParams & {
      datasetId?: string
    } & Params
  }

  export type WidgetItem =
    | WidgetItemParams<typeof widgetIdsByType.BadgeWidget, BadgeParams>
    | WidgetItemParams<typeof widgetIdsByType.BarChartWidget, BarChartParams>
    | WidgetItemParams<typeof widgetIdsByType.ButtonWidget, ButtonParams>
    | WidgetItemParams<typeof widgetIdsByType.CheckboxWidget, CheckboxParams>
    | WidgetItemParams<typeof widgetIdsByType.ChoiceGroupWidget, ChoiceGroupParams>
    | WidgetItemParams<typeof widgetIdsByType.DatePickerWidget, DatePickerParams>
    | WidgetItemParams<typeof widgetIdsByType.DonutChartWidget, DonutParams>
    | WidgetItemParams<typeof widgetIdsByType.ImagesWidget, ImagesParams>
    | WidgetItemParams<typeof widgetIdsByType.ImageWidget, ImageParams>
    | WidgetItemParams<typeof widgetIdsByType.LegendWidget, LegendParams>
    | WidgetItemParams<typeof widgetIdsByType.LinearChartWidget, LinearChartParams>
    | WidgetItemParams<typeof widgetIdsByType.MapWidget, MapParams>
    | WidgetItemParams<typeof widgetIdsByType.MultiBarChartWidget, MultiBarChartParams>
    | WidgetItemParams<typeof widgetIdsByType.ProgressBarWidget, ProgressBarParams>
    | WidgetItemParams<typeof widgetIdsByType.PyramidChartWidget, PyramidChartParams>
    | WidgetItemParams<typeof widgetIdsByType.RadarChartWidget, RadarChartParams>
    | WidgetItemParams<typeof widgetIdsByType.RoadmapWidget, RoadmapParams>
    | WidgetItemParams<typeof widgetIdsByType.StatsWidget, StatsParams>
    | WidgetItemParams<typeof widgetIdsByType.TableLegendWidget, TableLegendParams>
    | WidgetItemParams<typeof widgetIdsByType.TextWidget, TextParams>
    | WidgetItemParams<typeof widgetIdsByType.TornadoChartWidget, TornadoChartParams>

  export type BoxItem = WidgetItem | GridItem | SwitchItem

  export type Config = { [key: string]: readonly BoxItem[] }

  export type MarginSize = 's' | 'm' | 'l' | 'xl'

  export type Settings = {
    cols?: number
    margin?: MarginSize
  }

  export type State = {
    version: 18
    boxes: readonly Layout[]
    config: Config
    settings: Settings
  }
}

// MIGRATION_GENERATION:METHODS:START
const isDashboard17Widget = (item: CurrentDashboard.BoxItem): item is Dashboard17.WidgetItem =>
  item.type === 'widget' && item.widgetType !== widgetIdsByType.TornadoChartWidget
const isDashboard17Item = (item: CurrentDashboard.BoxItem): item is Dashboard17.BoxItem =>
  item.type !== 'widget' || item.widgetType !== widgetIdsByType.TornadoChartWidget

const downgradeConfig = (config: CurrentDashboard.Config): Dashboard17.Config => {
  const downgradeItem = (item: Dashboard17.BoxItem): Dashboard17.BoxItem => {
    if (item.type === 'switch') {
      return {
        ...item,
        displays: item.displays.map(widgets =>
          widgets.map(downgradeItem).filter(isDashboard17Widget)
        ),
      }
    }

    if (item.type === 'grid') {
      return {
        ...item,
        grid: {
          ...item.grid,
          items: item.grid.items.map(row =>
            row.map(column => column.map(downgradeItem).filter(isDashboard17Widget))
          ),
        },
      }
    }

    return item
  }

  return Object.keys(config).reduce((newConfig, key) => {
    const items = config[key]

    return {
      ...newConfig,
      [key]: items.filter(isDashboard17Item).map(downgradeItem),
    }
  }, {})
}
// MIGRATION_GENERATION:METHODS:END

export const currentMigration: Migration<Dashboard17.State, CurrentDashboard.State> = {
  versionTo: 18,
  changes: ['Добавлен виджет Tornado Chart'],
  up: data => ({
    ...data,
    version: 18,
  }),
  down: data => ({
    ...data,
    version: 17,
    config: downgradeConfig(data.config),
  }),
}
