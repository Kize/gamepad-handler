import { ButtonInformation, handleButton } from './btn-utils'

export interface GamepadMapping {
  identifier: string
  buttonsMapping: Array<ButtonInformation>
  debug?: boolean
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

export function handleGamepad(gamepad: Gamepad, gamepadMapping: GamepadMapping): void {
  if (gamepad.connected) {
    handleGamePadButtons(gamepad, gamepadMapping)
    handleGamePadAxis(gamepad, gamepadMapping)
  } else {
    console.warn('Game pad disconnected :/', gamepad)
  }
}

function handleGamePadButtons(gamepad: Gamepad, gamepadMapping: GamepadMapping): void {
  gamepad.buttons.forEach((button: GamepadButton, index: number) => {
    const btnMapped = gamepadMapping.buttonsMapping.find((btnInfo: ButtonInformation) => btnInfo.mappingIndex === index)
    if (btnMapped !== undefined) {
      handleButton(button, btnMapped, gamepadMapping.debug)
    }
  })
}

function handleGamePadAxis(gamepad: Gamepad, gamepadMapping: GamepadMapping): void {
  // console.warn('TODO')
}
