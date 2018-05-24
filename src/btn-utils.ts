export interface ButtonInformation {
  mappingIndex: number
  btnInfo: string
  throwKeyEvent: boolean
  key: string
  canExecuteAction?: boolean
  pressed?: boolean
  delay?: number

  action?(): void
}

export function handleButton(button: GamepadButton, buttonInformation: ButtonInformation, debug: boolean = false) {
  if (!buttonInformation) {
    return
  }

  if (debug && button.pressed) {
    console.warn('Here\'s the data of the gamepad\'s button pressed', button)
    console.warn('Here\'s the data of the button\'s mapping', buttonInformation)
  }

  if (buttonInformation.throwKeyEvent) {
    button.pressed ? triggerKey(buttonInformation) : triggerKeyEnd(buttonInformation)
  } else if (button.pressed) {
    execAction(buttonInformation)
  }
}

function triggerKey(btnInfo: ButtonInformation) {
  const e = new KeyboardEvent('keydown', { key: btnInfo.key })
  document.dispatchEvent(e)
  btnInfo.pressed = true
}

function triggerKeyEnd(btnInfo: ButtonInformation) {
  if (btnInfo.pressed) {
    const e = new KeyboardEvent('keyup', { key: btnInfo.key })
    document.dispatchEvent(e)
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
