import { isNil, truncateDecimal } from './utils'

export interface AxisInformation {
  mappingIndex: number
  axeInfo: string
  throwKeyEvent: boolean
  negativeThreshold?: number
  positiveThreshold?: number
  delay?: number

  key1?: string
  key2?: string
  pressed1?: boolean
  pressed2?: boolean

  canExecuteAction1?: boolean
  canExecuteAction2?: boolean
  previousValue?: number

  action1?(value?: number, previousValue?: number): void

  action2?(value?: number, previousValue?: number): void
}

export function handleAxis(axisValue: number, axisIndex: number, axisInformation: AxisInformation, window: Window, debug: boolean = false) {
  if (!isNil(axisInformation.negativeThreshold)
    && axisValue < 0
    && axisValue > axisInformation.negativeThreshold) {

    axisValue = 0
  }

  if (!isNil(axisInformation.positiveThreshold)
    && axisValue > 0
    && axisValue < axisInformation.positiveThreshold) {

    axisValue = 0
  }

  if (debug && axisValue !== 0) {
    console.warn(`Axis '${axisInformation.axeInfo}' registered at index ${axisIndex}.
      Value : ${truncateDecimal(axisValue, 3)}`, axisInformation)
  }

  if (axisInformation.throwKeyEvent) {
    if (axisValue !== 0) {
      triggerKey(axisInformation, axisValue > 0, window)
    } else {
      triggerKeyEnd(axisInformation, window)
    }
  } else if (axisValue !== 0) {
    execAction(axisValue, axisInformation)
  }
}

function triggerKey(axisInfo: AxisInformation, isPositive: boolean, window: Window) {
  let event

  if (isPositive) {
    event = new KeyboardEvent('keydown', { key: axisInfo.key1 })
    axisInfo.pressed1 = true
  } else {
    event = new KeyboardEvent('keydown', { key: axisInfo.key2 })
    axisInfo.pressed2 = true
  }

  window.document.dispatchEvent(event)
}

function triggerKeyEnd(axisInfo: AxisInformation, window: Window) {
  if (axisInfo.pressed1) {
    const e = new KeyboardEvent('keyup', { key: axisInfo.key1 })
    window.document.dispatchEvent(e)
    axisInfo.pressed1 = false
  }

  if (axisInfo.pressed2) {
    const e = new KeyboardEvent('keyup', { key: axisInfo.key2 })
    window.document.dispatchEvent(e)
    axisInfo.pressed2 = false
  }
}

function execAction(value: number, axisInfo: AxisInformation) {
  if (value > 0) {
    if (!axisInfo.canExecuteAction1) {
      return
    }

    if (typeof axisInfo.action1 !== 'function') {
      console.warn('No action given to execute')
      return
    }

    axisInfo.action1(value, axisInfo.previousValue)
    axisInfo.canExecuteAction1 = false
    setTimeout(() => {
      axisInfo.canExecuteAction1 = true
    }, axisInfo.delay)

  } else {
    if (!axisInfo.canExecuteAction2) {
      return
    }

    if (typeof axisInfo.action2 !== 'function') {
      console.warn('No action given to execute')
      return
    }

    axisInfo.action2(value, axisInfo.previousValue)
    axisInfo.canExecuteAction2 = false
    setTimeout(() => {
      axisInfo.canExecuteAction2 = true
    }, axisInfo.delay)
  }
}
