import { WidgetSettingsSelect } from '@/components/WidgetSettingsSelect'
import { WidgetSettingsText } from '@/components/WidgetSettingsText'
import { DataMap, DataType } from '@/dashboard/types'
import { Hint } from '@/ui/Hint'
import { StyleProps, Text } from '@/ui/Text'
import { createWidget, WidgetContentProps } from '@/utils/WidgetFactory'

import css from './index.css'

const dataType = DataType.Text
type Data = DataMap[typeof dataType] | typeof undefined

export const widgetId = 'b69b03e4-7fb6-4ac2-bdfa-e6c7fecdcca5'

export const typeNames = ['heading1', 'heading2', 'heading3', 'text1', 'text2'] as const
export type TypeNames = typeof typeNames[number]

type Params = {
  text: string
  type: TypeNames
}

type TextType = {
  [key in TypeNames]: {
    text: string
    props: StyleProps
  }
}

const textType: TextType = {
  heading1: {
    text: 'Заголовок 1',
    props: {
      size: '3xl',
      bold: true,
    },
  },
  heading2: {
    text: 'Заголовок 2',
    props: {
      size: 'xl',
      bold: true,
    },
  },
  heading3: {
    text: 'Заголовок 3',
    props: {
      size: 's',
      bold: true,
      uppercase: true,
    },
  },
  text1: {
    text: 'Текст 1',
    props: {
      size: 's',
    },
  },
  text2: {
    text: 'Текст 2',
    props: {
      size: 'xs',
      secondary: true,
    },
  },
}

export const defaultParams: Params = { text: 'Заголовок', type: 'text1' }

export const TextWidgetContent: React.FC<WidgetContentProps<Data, Params>> = ({
  data,
  params: { text, type },
}) => {
  const [tooltipVisible, setTooltipVisibility] = React.useState(false)
  const onToggleClick = () => setTooltipVisibility(!tooltipVisible)

  return (
    <div className={css.text}>
      <Text {...textType[type].props} className={css.content}>
        {data && data.text ? data.text : text}
      </Text>
      {data && data.tooltip && (
        <div className={css.toggleable}>
          <button className={css.button} onClick={onToggleClick}>
            Скрыть/отобразить настройки
          </button>
          {tooltipVisible && <Hint className={css.tooltip}>{data.tooltip}</Hint>}
        </div>
      )}
    </div>
  )
}

export const TextWidget = createWidget<Data, Params>({
  id: widgetId,
  name: 'Текст',
  defaultParams,
  dataType,
  Content: TextWidgetContent,
  allowEmptyData: true,
  renderSettings(params, onChangeParam) {
    return (
      <>
        <WidgetSettingsText
          name="Текст"
          value={params.text}
          onChange={value => onChangeParam('text', value)}
        />
        <WidgetSettingsSelect
          name="Тип"
          value={params.type}
          onChange={value => onChangeParam('type', value)}
          values={typeNames.map(i => ({ value: i, name: i }))}
        />
      </>
    )
  },
})
