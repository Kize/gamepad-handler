export interface ButtonInformation {
  mappingIndex: number
  btnInfo: string
  mode: ButtonModes

  // Keyboard event params
  key?: string
  pressed?: boolean

  // Action params
  delay?: number
  canExecuteAction?: boolean

  // Double actions params
  previousState?: boolean

  // Action method
  action?(): void

  // Double actions methods
  keydownAction?(): void

  keyupAction?(): void
}

export enum ButtonModes {
  KEYBOARD_EVENT = 'KEYBOARD_EVENT',
  ACTION = 'ACTION',
  DOUBLE_ACTION = 'DOUBLE_ACTION',
}

export function handleButton(button: GamepadButton, buttonInformation: ButtonInformation, window: Window, debug: boolean = false) {
  if (debug && button.pressed) {
    console.warn('You pressed the button mapped to :', buttonInformation)
  }

  switch (buttonInformation.mode) {
    case ButtonModes.KEYBOARD_EVENT:
      button.pressed ? triggerKey(buttonInformation, window) : triggerKeyEnd(buttonInformation, window)
      break
    case ButtonModes.ACTION:
      if (button.pressed) {
        execAction(buttonInformation)
      }
      break
    case ButtonModes.DOUBLE_ACTION:
      handleDoubleAction(buttonInformation, button.pressed)
      break
  }
}

function triggerKey(btnInfo: ButtonInformation, window: Window) {
  const e = new KeyboardEvent('keydown', { key: btnInfo.key })
  window.document.dispatchEvent(e)
  btnInfo.pressed = true
}

function triggerKeyEnd(btnInfo: ButtonInformation, window: Window) {
  if (btnInfo.pressed) {
    const e = new KeyboardEvent('keyup', { key: btnInfo.key })
    window.document.dispatchEvent(e)
    btnInfo.pressed = false
  }
}

function execAction(btnInfo: ButtonInformation) {
  if (!btnInfo.canExecuteAction) {
    return
  }

  if (typeof btnInfo.action !== 'function') {
    console.warn('No action given to execute')
    return
  }

  btnInfo.action()
  btnInfo.canExecuteAction = false
  setTimeout(() => {
    btnInfo.canExecuteAction = true
  }, btnInfo.delay)
}

function handleDoubleAction(btnInfo: ButtonInformation, currentState: boolean) {
  if (!btnInfo.keydownAction || !btnInfo.keyupAction) {
    throw Error('In double actions mode, please define `keydownAction` and `keyupAction`')
  }

  if (currentState === btnInfo.previousState) {
    return
  }

  if (currentState) {
    btnInfo.keydownAction()
  } else {
    btnInfo.keyupAction()
  }

  btnInfo.previousState = currentState
}
