import * as React from 'react'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import * as _ from 'lodash'

import { marginSizeValues } from '@/dashboard/size-constants'
import { AnyDashboardStateVersion } from '@/migrations'
import { currentMigration } from '@/migrations/current'
import { getApplicableMigrations, migrate } from '@/migrations/utils'
import { isGrid, isSwitch } from '@/utils/type-guards'

import { Dashboard, DashboardProps } from './components/Dashboard'
import { Menu, MenuProps } from './components/Menu'
import css from './index.css'
import { DashboardState, GridItem, SwitchItem, WidgetItem } from './types'

export * from './types'

type ConstructorProps = DashboardProps &
  MenuProps & {
    dashboard: AnyDashboardStateVersion
    onChange: (state: DashboardState) => void
    onChangeVersion: (state: DashboardState) => void
  }

export const SUPPORTED_DASHBOARD_VERSION = currentMigration.versionTo

export const EMPTY_DASHBOARD: DashboardState = {
  version: SUPPORTED_DASHBOARD_VERSION,
  boxes: [],
  config: {},
  settings: {},
}

export const isDashboardSupported = (
  dashboard: AnyDashboardStateVersion
): dashboard is DashboardState => dashboard.version === SUPPORTED_DASHBOARD_VERSION

const getWidgetIdAndDatasetId = (item: WidgetItem | SwitchItem) => ({
  widgetId: item.id,
  datasetId: item.params.datasetId,
})

const flatGrid = (item: GridItem) => item.grid.items.map(row => row.flat()).flat()
const flatSwitch = (item: SwitchItem) =>
  [item, ...item.displays.flat()].map(getWidgetIdAndDatasetId)

export const getAllWidgetAndDatasetIds = (
  dashboardConfig: DashboardState['config']
): ReadonlyArray<{ widgetId: string; datasetId?: string }> => {
  const boxItems = _.flatten(Object.values(dashboardConfig))

  return _.flatMap(boxItems, boxItem => {
    if (isGrid(boxItem)) {
      const result = flatGrid(boxItem).map(item =>
        isSwitch(item) ? flatSwitch(item) : getWidgetIdAndDatasetId(item)
      )

      return result.flat()
    }

    if (isSwitch(boxItem)) {
      return flatSwitch(boxItem)
    }

    return getWidgetIdAndDatasetId(boxItem)
  })
}

export const Constructor: React.FC<ConstructorProps> = props => {
  const {
    cols = 12,
    onChange,
    onChangeVersion,
    dashboard,
    onClear,
    viewMode,
    datasets,
    data,
    baseWidthForScaling,
    baseHeightForScaling,
    baseFontSize,
    baseMargin,
    basePadding,
    rowsCount,
  } = props
  const dashboardVersion = dashboard.version || 0

  // В режиме просмотра обновляем версию тихо: без алертов и сообщений
  React.useEffect(() => {
    if (viewMode && dashboardVersion < SUPPORTED_DASHBOARD_VERSION) {
      onChangeVersion(migrate(dashboard, SUPPORTED_DASHBOARD_VERSION) as DashboardState)
    }
  }, [dashboard, dashboardVersion, viewMode, onChangeVersion])

  if (dashboardVersion > SUPPORTED_DASHBOARD_VERSION) {
    return (
      <>
        Версия {dashboardVersion} не поддерживается. Последняя поддерживаемая версия —{' '}
        {SUPPORTED_DASHBOARD_VERSION}
      </>
    )
  }

  const changeVersion = (newVersion: number) => {
    const newDashboard = migrate(dashboard, newVersion) as DashboardState

    /* eslint-disable no-console */
    console.group('Превью миграции')
    console.log(`v${dashboardVersion}:`, dashboard)
    console.log(`v${newVersion}:`, newDashboard)
    console.groupEnd()
    /* eslint-enable no-console */

    const applicableMigrations = getApplicableMigrations(dashboardVersion, newVersion)
    const changesList = applicableMigrations.reduce((acc, migration) => {
      return acc + migration.changes.map(c => `• v${migration.versionTo}: ${c}\n`).join('')
    }, '')

    const confirmText = [
      `Вы действительно хотите изменить версию данных с ${dashboardVersion} на ${newVersion}?\n`,
      newVersion > dashboardVersion
        ? 'Изменения, которые будут применены:'
        : 'Изменения, которые будут откачены:',
      changesList,
      'Превью изменений можно посмотреть в консоли (сначала придётся закрыть это окно)',
    ].join('\n')

    if (confirm(confirmText)) {
      onChangeVersion(newDashboard)
    }
  }

  if (!viewMode && dashboardVersion < SUPPORTED_DASHBOARD_VERSION) {
    return (
      <>
        Для работы с дашбордом нужно обновить данные с версии {dashboardVersion} до{' '}
        {SUPPORTED_DASHBOARD_VERSION}
        <br />
        <button
          type="button"
          className={css.button}
          onClick={() => changeVersion(SUPPORTED_DASHBOARD_VERSION)}
        >
          ОБНОВИТЬ
        </button>
      </>
    )
  }

  if (!isDashboardSupported(dashboard)) {
    return null
  }

  const { margin = 'l' } = dashboard.settings
  const margins = baseMargin || [marginSizeValues[margin], marginSizeValues[margin]]

  const handleChange = (newParts: Partial<DashboardState>) => {
    !viewMode && onChange({ ...dashboard, ...newParts })
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={css.constructor}>
        {!viewMode && (
          <Menu
            onClear={onClear}
            onChange={settings => handleChange({ settings })}
            settings={dashboard.settings}
            version={dashboardVersion}
            onChangeVersion={newVersion => changeVersion(newVersion)}
          />
        )}
        <Dashboard
          cols={cols}
          datasets={datasets}
          viewMode={viewMode}
          onChange={handleChange}
          dashboard={dashboard}
          data={data}
          baseWidthForScaling={baseWidthForScaling}
          baseHeightForScaling={baseHeightForScaling}
          baseFontSize={baseFontSize}
          baseMargin={margins}
          basePadding={basePadding}
          rowsCount={rowsCount}
        />
      </div>
    </DndProvider>
  )
}
