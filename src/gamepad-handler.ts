import { AxisInformation } from './axe-utils'
import { ButtonInformation } from './button-utils'
import { GamepadMapping, GamepadOptions, GamepadsMapping, handleGamepad, linkGamepadsToMappings } from './gamepad-utils'
import { isNil } from './utils'

const KEYBOARD_BUTTONS_TIME_LOOP = 50
const DEFAULT_ACTION_THROTTLE = 500
const DEFAULT_NEGATIVE_THRESHOLD = -0.3
const DEFAULT_POSITIVE_THRESHOLD = 0.3

export enum GamePadHandlerState {
  OFF,
  STARTED,
  PAUSED,
  STOPPED,
}

export class GamePadHandler {
  public readonly window: Window
  private state: GamePadHandlerState = GamePadHandlerState.OFF

  constructor(public gamepadsMapping: GamepadsMapping, public readonly options: GamepadOptions = {}, _window: Window = window) {
    this.window = _window

    this.options.keyboardButtonsTimeLoop = this.options.keyboardButtonsTimeLoop || KEYBOARD_BUTTONS_TIME_LOOP
    this.options.defaultActionThrottle = this.options.defaultActionThrottle || DEFAULT_ACTION_THROTTLE

    if (this.options.defaultNegativeThreshold === undefined
      || this.options.defaultNegativeThreshold < -1
      || this.options.defaultNegativeThreshold > 0) {

      this.options.defaultNegativeThreshold = DEFAULT_NEGATIVE_THRESHOLD
    }

    if (this.options.defaultPositiveThreshold === undefined
      || this.options.defaultPositiveThreshold > 1
      || this.options.defaultPositiveThreshold < 0) {

      this.options.defaultPositiveThreshold = DEFAULT_POSITIVE_THRESHOLD
    }
  }

  public start(): void {
    this.gamepadsMapping.forEach((gp: GamepadMapping) => {
      gp.buttonsMapping.forEach((btn: ButtonInformation) => {
        btn.canExecuteAction = true
        btn.delay = btn.delay || this.options.defaultActionThrottle
      })

      gp.axesMapping.forEach((axis: AxisInformation) => {
        axis.canExecuteAction1 = true
        axis.canExecuteAction2 = true
        axis.delay = axis.delay || this.options.defaultActionThrottle

        axis.positiveThreshold = axis.positiveThreshold || this.options.defaultNegativeThreshold
        axis.negativeThreshold = axis.negativeThreshold || this.options.defaultPositiveThreshold
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
          const gamepadList = this.window.navigator.getGamepads()
          const gamepads: Array<Gamepad> = []

          for (const gp of gamepadList) {
            if (!isNil(gp)) {
              gamepads.push(gp)
            }
          }

          if (gamepads.length === 0) {
            this.state = GamePadHandlerState.OFF
            return
          }

          const gamepadsMapped = linkGamepadsToMappings(gamepads, this.gamepadsMapping)

          gamepadsMapped.forEach((gamepadMapped: [Gamepad, GamepadMapping]) => {
            const [gp, gpMapping] = gamepadMapped
            handleGamepad(gp, gpMapping, this.window)
          })
        }, this.options.keyboardButtonsTimeLoop)

      }
    })
  }
}
