# Game Pad Handler

Version 1.0.0 released.

## Description

This little library can be used to simplify the mapping of a gamepad in a web application.
It's based on the [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API), which is on the Working Draft status.
It's supported only in recent browsers.

The idea where is to give some mappings for devices connected, in order to link a button to either an action (`function`), or just a keyboard binding to throw an event.

This library has no dependency.

## Installation

```npm
npm i gamepad-handler
```  

> Typings for TypeScript apps will be coming soon.

Imports :

```javascript 1.6
  import { GamePadHandler } from 'gamepad-handler'
```


## Usage

One you have imported the GamePadHandler constructor, you have to give it some parameters to create an handler.

Example :

```javascript 1.6
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
      const gamepagHandler = new GamePadHandler([eightbitdoGamepad])

      gamepagHandler.start()
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


## Contribution

This library is developped in TypeScript, please respect the tslint provided.
Every contribution is welcomed :)

## Roadmap

- [ ] Typings for TypeScript apps.
- [ ] Replace the `setInterval` method to listen to gamepads buttons. [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) might be a better way to handle that.
- [ ] Handle axis mapping
- [ ] Provide an API to easily allow the final user to define/redefine the mapping
