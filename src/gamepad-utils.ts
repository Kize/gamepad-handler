import { AxisInformation, handleAxis } from './axe-utils'
import { ButtonInformation, handleButton } from './button-utils'
import { isNil } from './utils'

export interface GamepadMapping {
  identifier: string
  buttonsMapping: Array<ButtonInformation>
  axesMapping: Array<AxisInformation>
  debug?: boolean
}

export interface GamepadOptions {
  keyboardButtonsTimeLoop?: number
  defaultActionThrottle?: number

  defaultNegativeThreshold?: number
  defaultPositiveThreshold?: number
}

export type GamepadsMapping = Array<GamepadMapping>

export function linkGamepadsToMappings(gamepads: Array<Gamepad>, gamepadsMapping: GamepadsMapping): Array<[Gamepad, GamepadMapping]> {
  const gamepadsMapped: Array<[Gamepad, GamepadMapping]> = []

  gamepads.forEach((gamepad: Gamepad) => {
    gamepadsMapping.forEach((gamepadMapping: GamepadMapping) => {

      if (gamepad.id.includes(gamepadMapping.identifier)) {
        gamepadsMapped.push([gamepad, gamepadMapping])
      }
    })
  })

  return gamepadsMapped
}

export function handleGamepad(gamepad: Gamepad, gamepadMapping: GamepadMapping, window: Window): void {
  if (gamepad.connected) {
    handleGamePadButtons(gamepad, gamepadMapping, window)
    handleGamePadAxis(gamepad, gamepadMapping, window)
  } else {
    console.warn('Game pad disconnected :/', gamepad)
  }
}

function handleGamePadButtons(gamepad: Gamepad, gamepadMapping: GamepadMapping, window: Window): void {
  if (!gamepadMapping.buttonsMapping || gamepadMapping.buttonsMapping.length === 0) {
    return
  }

  gamepad.buttons.forEach((button: GamepadButton, index: number) => {
    const btnMapped = gamepadMapping.buttonsMapping.find((btnInfo: ButtonInformation) => btnInfo.mappingIndex === index)
    if (!isNil(btnMapped)) {
      handleButton(button, btnMapped, window, gamepadMapping.debug)
    }
  })
}

function handleGamePadAxis(gamepad: Gamepad, gamepadMapping: GamepadMapping, window: Window): void {
  if (!gamepadMapping.axesMapping || gamepadMapping.axesMapping.length === 0) {
    return
  }

  gamepad.axes.forEach((axisValue: number, axisIndex: number) => {
    const axisMapped = gamepadMapping.axesMapping.find((axisInfo: AxisInformation) => axisInfo.mappingIndex === axisIndex)
    if (!isNil(axisMapped)) {
      handleAxis(axisValue, axisIndex, axisMapped, window, gamepadMapping.debug)
    }
  })
}
