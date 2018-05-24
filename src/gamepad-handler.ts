import { ButtonInformation } from './btn-utils'
import { GamepadMapping, GamepadsMapping, handleGamepad, linkGamepadsToMappings } from './gamepad-utils'

const KEYBOARD_BUTTONS_TIME_LOOP = 50
const DEFAULT_ACTION_THROTTLE = 500

export enum GamePadHandlerState {
  OFF,
  STARTED,
  PAUSED,
  STOPPED,
}

export class GamePadHandler {
  public readonly window: Window
  private state: GamePadHandlerState = GamePadHandlerState.OFF

  constructor(public gamepadsMapping: GamepadsMapping,
              public readonly keyboardButtonsTimeLoop: number = KEYBOARD_BUTTONS_TIME_LOOP,
              public readonly defaultActionThrottle: number = DEFAULT_ACTION_THROTTLE,
              _window: Window = window) {
    this.window = _window
  }

  public start(): void {
    this.gamepadsMapping.forEach((gp: GamepadMapping) => {
      gp.buttonsMapping.forEach((btn: ButtonInformation) => {
        btn.canExecuteAction = true
        btn.delay = btn.delay || this.defaultActionThrottle
      })
    })

    this.listen()
  }

  public stop(): void {
    this.state = GamePadHandlerState.STOPPED
  }

  private listen(): void {
    this.window.addEventListener('gamepadconnected', () => {
      if (this.state === GamePadHandlerState.OFF) {
        this.state = GamePadHandlerState.STARTED

        // Infinite loop to listen to the state of the game pads
        this.window.setInterval(() => {
          const gamepadList: any = this.window.navigator.getGamepads()
          const gamepads: Array<Gamepad> = []

          for (const gp of gamepadList) {
            if (gp !== null && gp !== undefined) {
              gamepads.push(gp)
            }
          }

          const gamepadsMapped = linkGamepadsToMappings(gamepads, this.gamepadsMapping)

          gamepadsMapped.forEach((gamepadMapped: [Gamepad, GamepadMapping]) => {
            const [gp, gpMapping] = gamepadMapped
            handleGamepad(gp, gpMapping)
          })
        }, this.keyboardButtonsTimeLoop)
      }
    })
  }
}
