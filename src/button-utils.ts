export interface ButtonInformation {
  mappingIndex: number
  btnInfo: string
  throwKeyEvent: boolean
  key?: string
  canExecuteAction?: boolean
  pressed?: boolean
  delay?: number

  action?(): void
}

export function handleButton(button: GamepadButton, buttonInformation: ButtonInformation, window: Window, debug: boolean = false) {
  if (debug && button.pressed) {
    console.warn('You pressed the button mapped to :', buttonInformation)
  }

  if (buttonInformation.throwKeyEvent) {
    button.pressed ? triggerKey(buttonInformation, window) : triggerKeyEnd(buttonInformation, window)
  } else if (button.pressed) {
    execAction(buttonInformation)
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
