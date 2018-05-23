import { BtnUtils, ButtonInformation } from './btn-utils'

export interface GamepadMapping {
	identifier: string
	buttonsMapping: Array<ButtonInformation>
}

export type GamepadsMapping = Array<GamepadMapping>

export namespace GamePadUtils {
	export function linkGamepadsToMappings(gamepads: Array<Gamepad>, gamepadsMapping: GamepadsMapping): Array<[Gamepad, GamepadMapping]> {
		const gamepadsMapped: Array<[Gamepad, GamepadMapping]> = []

		gamepads.forEach(gamepad => {
			gamepadsMapping.forEach(gamepadMapping => {

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
			console.warn('Game pad disconnected :/')
		}
	}

	function handleGamePadButtons(gamepad: Gamepad, gamepadMapping: GamepadMapping): void {
		gamepad.buttons.forEach((button: GamepadButton, index: number) => {
			const btnMapped = gamepadMapping.buttonsMapping[index]
			BtnUtils.handleButton(button, btnMapped)
		})
	}

	function handleGamePadAxis(gamepad: Gamepad, gamepadMapping: GamepadMapping): void {
		console.log('TODO')
	}
}
