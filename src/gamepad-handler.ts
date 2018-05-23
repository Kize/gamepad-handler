// const btnIndexesDescription = {
// 	0: {
// 		btnInfo: 'a',
// 		throwKeyEvent: false,
// 		key: 'ArrowRight',
// 		action: Reveal.right
// 	},
// 	1: {
// 		btnInfo: 'b',
// 		throwKeyEvent: false,
// 		key: 'ArrowDown',
// 		action: Reveal.down
// 	},
// 	2: {
// 		btnInfo: 'POWER',
// 		throwKeyEvent: true,
// 		key: 'a',
// 		action: null
// 	},
// 	3: {
// 		btnInfo: 'x',
// 		throwKeyEvent: false,
// 		key: 'ArrowUp',
// 		action: Reveal.up
// 	},
// 	4: {
// 		btnInfo: 'y',
// 		throwKeyEvent: false,
// 		key: 'ArrowLeft',
// 		action: Reveal.left
// 	},
// 	6: {
// 		btnInfo: 'L1',
// 		throwKeyEvent: false,
// 		key: '',
// 		action: Reveal.prev
// 	},
// 	7: {
// 		btnInfo: 'R1',
// 		throwKeyEvent: false,
// 		key: '',
// 		action: Reveal.next
// 	},
// 	8: {
// 		btnInfo: 'L2',
// 		throwKeyEvent: true,
// 		key: 'a',
// 		action: Reveal.toggleHelp
// 	},
// 	9: {
// 		btnInfo: 'R2',
// 		throwKeyEvent: false,
// 		key: '',
// 		action: Reveal.toggleOverview
// 	},
// 	13: {
// 		btnInfo: 'joystick left pressed',
// 		throwKeyEvent: false,
// 		key: 'a',
// 		action: Reveal.prevFragment
// 	},
// 	14: {
// 		btnInfo: 'joystick right pressed',
// 		throwKeyEvent: false,
// 		key: 'a',
// 		action: Reveal.nextFragment
// 	}
// }

import { GamepadMapping, GamepadsMapping, GamePadUtils } from './gamepad-utils'

const KEYBOARD_BUTTONS_TIME_LOOP = 50
const DEFAULT_ACTION_THROTTLE = 500

export enum GamePadHandlerState {
	OFF,
	STARTED,
	PAUSED,
	STOPPED,
}

export class GamePadHandler {
	readonly window: Window
	private state: GamePadHandlerState = GamePadHandlerState.OFF

	constructor(public gamepadsMapping: GamepadsMapping,
							readonly keyboardButtonsTimeLoop: number = KEYBOARD_BUTTONS_TIME_LOOP,
							readonly defaultActionThrottle: number = DEFAULT_ACTION_THROTTLE,
							_window: Window = window) {
		this.window = _window
	}

	public start(): void {
		this.gamepadsMapping.forEach((gp: GamepadMapping) => {
			gp.buttonsMapping.forEach(btn => {
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
					const gamepads = this.window.navigator.getGamepads().filter(function <T>(gp: T | null | undefined): gp is T {
						return gp !== null && gp !== undefined
					})

					const gamepadsMapped = GamePadUtils.linkGamepadsToMappings(gamepads, this.gamepadsMapping)

					gamepadsMapped.forEach((gamepadMapped: [Gamepad, GamepadMapping]) => {
						const [gp, gpMapping] = gamepadMapped
						GamePadUtils.handleGamepad(gp, gpMapping)
					})
				}, this.keyboardButtonsTimeLoop)
			}
		})
	}
}
