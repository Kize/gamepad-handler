# Game Pad Handler

Version 1.1.0 released.

## Description

This little library can be used to simplify the mapping of a gamepad in a web application.
It's based on the [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API), which is on the Working Draft status.
It's supported only in recent browsers.

The idea is to give some mappings for connected devices, in order to link a button to either an action (`function`), or just a keyboard binding to throw an event.

This library has no dependency.

## Installation

```npm
npm i gamepad-handler
```  

> Typings for TypeScript apps are declared within the library.
If you want to use directly the TypeScript version, import everything you need from `gamepad-handler/src`.

Imports :

```javascript 1.6
import { GamePadHandler } from 'gamepad-handler'
```


## Usage

One you have imported the GamePadHandler constructor, you have to give it some parameters to create an handler.

Example :

```javascript 1.8
const buttonsMapping = [
    {
      mappingIndex: 0,
      btnInfo: 'a',
      throwKeyEvent: false,
      action: this.nextStep
    },
    {
      mappingIndex: 4,
      btnInfo: 'y',
      throwKeyEvent: false,
      action: this.previousStep,
      delay: 2000
    },
    {
      mappingIndex: 6,
      btnInfo: 'L1',
      throwKeyEvent: true,
      key: 'ArrowLeft'
    },
    {
      mappingIndex: 7,
      btnInfo: 'R1',
      throwKeyEvent: true,
      key: 'ArrowRight'
    }
    ]
    const eightbitdoGamepad = {
    identifier: '8Bitdo',
    debug: false,
    buttonsMapping,
    }
const gamepadHandler = new GamePadHandler([eightbitdoGamepad])
gamepadHandler.start()
```

In this example, I'm defining a binding for [a 8Bitdo gamepad](http://www.8bitdo.com/n30pro-f30pro/), to bind buttons **A**, **Y**, **L1**, **R1**.
The `action` property is a method, and the `key` property is [the parameter](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) for a KeyboardEvent.

## Data Model

### GamePad Handler
The gamePad Handler constructor takes 4 parameters, one is mandatory:
- `gamepadsMapping` : an Array of **GamePadMapping**
- `keyboardButtonsTimeLoop` : the number of milliseconds before checking the new state of the button. By default: 50ms
- `defaultActionThrottle`: the default number of milliseconds before the action can called again. By default: 500ms
- `window` : a reference to your window object. Take by default the global window's variable. 


### GamePadMapping
A GamePad Mapping defines how to bind a type of gamepad. It must be an object with 3 properties, 1 optional:
- `identifier`: The is used to match the type of gamepad with the mapping defined. Each gamepad has a long description, but you can just provide a `string` which is included in the description of the gamepad.
- `buttonsMapping`: An array of **ButtonInformation**
- `axisMapping`: An array of **AxisInformation**
- `debug`: a boolean in order to have some logs. This can be useful to test your mapping. By default: false


### ButtonInformation
This object needs some properties to define which button you want to map, with a specific behavior.

Properties :
- `mappingIndex` : a number, used to retrieve a button of a gamepad. (The gamepad API provides an Array of buttons, this parameter is the value of the index of the button to map, you have to find out which index is linked to the **A** button of your gamepad)
- `btnInfo`: A string, useless to the library. It's just here to help you to define which button is associated to the **mappingIndex** property.
- `throwKeyEvent` : A boolean. This flag lets you decide the behavior you want for the mapped button. If `true`, when the button is pressed, the GamePadHandler will dispatch a KeyboardEvent with the `key` property provided. If `false`, the GamPadHandler will call the `action` property given.
- `key` : a string defining which KeyboardEvent you want to dispatch.
- `action` : A function to call when the button is pressed.
- `delay` : The number of milliseconds to throttle the action called. See **defaultActionThrottle** property of the GamePadHandler.


### AxisInformation
Like the `ButtonInforation`, this described the mapping of an axis. 
An axis is a value between -1 and 1, describing the direction and the intensity.
A joystick is composed of 2 axes, to handle every direction.

This handler has been built to handle 2 behaviors per axis, just like buttons.
The first behavior (`key1` or `action1`) is triggered when the value of the axis is positive; the second one when the value is negative.
In order to avoid fake calls due to the high sensibility of joysticks, you can provide per axe a `negativeThreshold` and a `positiveThreshold`.
Those values will help you define deadzones. 

**Example of thresholds**: 
If an axis has a `negativeThreshold` defined to `-0.5`, the second behavior selected will be triggered only if the axisValue is between [-1;-0.5[

**Example of axis Mapping**:

```javascript 1.8
const axesMapping = [
    {
      mappingIndex: 0,
      axeInfo: 'Left stick 🢀🢂',
      throwKeyEvent: true,
      key1: 'a',
      key2: 'z'
    },
    {
      mappingIndex: 1,
      axeInfo: 'Left stick 🢁🢃',
      throwKeyEvent: false,
      action1: () => {
        this.nextStep()
      },
      action2: () => {
        this.previousStep()
      }
    }
]

gamepadHandler.axesMapping = axesMapping
```


## Contribution
This library is developped in TypeScript, please respect the tslint provided.
Every contribution is welcomed :)

## Changelog

### 1.1.0

- Handle axes
  - 2 mappings per axis
  - Same behaviors as buttons
- Rename variables
- Add an option parameter to the GamePad Handler, to avoid to pass a list of arguments.


### 1.0.0

- Handle multiple gamepads
- Handle multiple gamepads mappings
- Handle buttons mappings with 2 behaviors
  - Key: throw keyboard events to simulate a key pressed.
  - Action: bind the button to a function.

### 0.0.1

- Initial release, to test if the package was corecctly released.

## Roadmap

- [X] Typings for TypeScript apps. (packaged within the library)
- [ ] Replace the `setInterval` method to listen to gamepads buttons. [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) might be a better way to handle that.
- [X] Handle axis mapping
- [ ] Provide an API to easily allow the final user to define/redefine the mapping
