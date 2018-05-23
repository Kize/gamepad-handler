export interface ButtonInformation {
	btnInfo: string
	throwKeyEvent: boolean
	key: string

	action?(): void

	canExecuteAction?: boolean
	pressed?: boolean
	delay?: number
}

export namespace BtnUtils {
	export function handleButton(button: GamepadButton, buttonInformation: ButtonInformation) {
		if (!buttonInformation) {
			return
		}

		if (buttonInformation.throwKeyEvent) {
			button.pressed ? triggerKey(buttonInformation) : triggerKeyEnd(buttonInformation)
		} else if (button.pressed) {
			execAction(buttonInformation)
		}
	}

	function triggerKey(btnInfo: ButtonInformation) {
		console.log(btnInfo.key)
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
		setTimeout(function () {
			btnInfo.canExecuteAction = true
		}, btnInfo.delay)
	}
}


