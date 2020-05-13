import { Dashboard10, migration10, widgetIdsByType } from '../'
import { Dashboard9 } from '../../dashboard9'

const createTextWidget = (name: string, params = {}) =>
  ({
    type: 'widget',
    debugName: name,
    id: name,
    widgetType: widgetIdsByType.TextWidget,
    params,
  } as const)

describe('migration10', () => {
  it('повышает версию', () => {
    const source: Dashboard9.State = {
      version: 9,
      boxes: [],
      config: {
        Box0: [
          createTextWidget('1', {
            croppedLineCount: 1,
          }),
        ],
        Box2: [
          {
            type: 'grid',
            grid: {
              columnParams: [{ growRatio: 11 }, { growRatio: 22 }],
              rowParams: [{}],
              items: [
                // Строка 1
                [
                  // Колонка 1
                  [createTextWidget('col1-1'), createTextWidget('col1-2')],
                  // Колонка 2
                  [createTextWidget('col2-1')],
                ],
              ],
            },
            params: {
              growRatio: 1,
            },
          },
        ],
      },
      settings: {},
    }

    const result: Dashboard10.State = {
      version: 10,
      boxes: [],
      config: {
        Box0: [
          createTextWidget('1', {
            croppedLineCount: 1,
          }),
        ],
        Box2: [
          {
            type: 'grid',
            grid: {
              columnParams: [{ growRatio: 11 }, { growRatio: 22 }],
              rowParams: [{}],
              items: [
                // Строка 1
                [
                  // Колонка 1
                  [createTextWidget('col1-1'), createTextWidget('col1-2')],
                  // Колонка 2
                  [createTextWidget('col2-1')],
                ],
              ],
            },
            params: {
              growRatio: 1,
            },
          },
        ],
      },
      settings: {},
    }

    expect(migration10.up(source)).toEqual(result)
  })

  it('понижает версию', () => {
    const source: Dashboard10.State = {
      version: 10,
      boxes: [],
      config: {
        Box0: [createTextWidget('1')],
        Box1: [
          {
            id: 'switchId',
            type: 'switch',
            displays: [[createTextWidget('1.1')], [createTextWidget('1.2')]],
            params: {},
          },
        ],
        Box2: [
          {
            type: 'grid',
            grid: {
              columnParams: [{ growRatio: 11 }, { growRatio: 22 }],
              rowParams: [{}],
              items: [
                // Строка 1
                [
                  // Колонка 1
                  [createTextWidget('2.1a'), createTextWidget('2.1b')],
                  // Колонка 2
                  [createTextWidget('2.2')],
                ],
              ],
            },
            params: {
              growRatio: 1,
            },
          },
        ],
        Box3: [
          {
            type: 'grid',
            grid: {
              columnParams: [{}],
              rowParams: [{}],
              items: [
                // строка
                [
                  // колонка
                  [
                    {
                      id: 'switchId',
                      type: 'switch',
                      displays: [[createTextWidget('3.1')], [createTextWidget('3.2')]],
                      params: {},
                    },
                  ],
                ],
              ],
            },
            params: {},
          },
        ],
      },
      settings: {},
    }

    const result: Dashboard9.State = {
      version: 9,
      boxes: [],
      config: {
        Box0: [createTextWidget('1')],
        Box1: [createTextWidget('1.1')],
        Box2: [
          {
            type: 'grid',
            grid: {
              columnParams: [{ growRatio: 11 }, { growRatio: 22 }],
              rowParams: [{}],
              items: [
                // Строка 1
                [
                  // Колонка 1
                  [createTextWidget('2.1a'), createTextWidget('2.1b')],
                  // Колонка 2
                  [createTextWidget('2.2')],
                ],
              ],
            },
            params: {
              growRatio: 1,
            },
          },
        ],
        Box3: [
          {
            type: 'grid',
            grid: {
              columnParams: [{}],
              rowParams: [{}],
              items: [
                // строка
                [
                  // колонка
                  [createTextWidget('3.1')],
                ],
              ],
            },
            params: {},
          },
        ],
      },
      settings: {},
    }

    expect(migration10.down(source)).toEqual(result)
  })
})