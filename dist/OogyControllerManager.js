/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/OogyControllerInput.ts":
/*!************************************!*\
  !*** ./src/OogyControllerInput.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"OogyControllerInput\": () => (/* binding */ OogyControllerInput)\n/* harmony export */ });\nvar OogyControllerInput = /* @__PURE__ */ ((OogyControllerInput2) => {\n  OogyControllerInput2[\"up\"] = \"up\";\n  OogyControllerInput2[\"down\"] = \"down\";\n  OogyControllerInput2[\"right\"] = \"right\";\n  OogyControllerInput2[\"left\"] = \"left\";\n  OogyControllerInput2[\"a\"] = \"a\";\n  OogyControllerInput2[\"b\"] = \"b\";\n  OogyControllerInput2[\"start\"] = \"start\";\n  OogyControllerInput2[\"guide\"] = \"guide\";\n  return OogyControllerInput2;\n})(OogyControllerInput || {});\n\n\n//# sourceURL=webpack://oogy-controller-manager/./src/OogyControllerInput.ts?");

/***/ }),

/***/ "./src/OogyControllerManager.ts":
/*!**************************************!*\
  !*** ./src/OogyControllerManager.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"OogyControllerManager\": () => (/* binding */ OogyControllerManager)\n/* harmony export */ });\n/* harmony import */ var _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./OogyControllerInput */ \"./src/OogyControllerInput.ts\");\n/* harmony import */ var _OogyLog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./OogyLog */ \"./src/OogyLog.ts\");\n/* harmony import */ var _OogyUUIDBuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./OogyUUIDBuilder */ \"./src/OogyUUIDBuilder.ts\");\n\n\n\nclass OogyControllerManager {\n  constructor(model) {\n    this.shouldStopAcceptingClicks = false;\n    this.listeners = {};\n    this.gamepads = {};\n    this.gamepadPoolIntervalDelay = 100;\n    this.model = model;\n  }\n  addListener(listener) {\n    if (!listener.uuid) {\n      listener.uuid = _OogyUUIDBuilder__WEBPACK_IMPORTED_MODULE_2__.OogyUUIDBuilder.randomUUID();\n    }\n    if (this.listeners[listener.uuid]) {\n      (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyErrorLog)(\"!!! Strange situation where we already have added this listener??? We won't be able to remove it later because only 1 per UUID can exist on the manager... check we haven't added the same listener twice somehow!!\", this);\n    }\n    this.listeners[listener.uuid] = listener;\n    (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyLog)(\"controller manager > registered new listener\", listener, this);\n    return listener;\n  }\n  removeListener(listener) {\n    if (!listener.uuid) {\n      (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyErrorLog)(\"Unable to remove listener as it has never had a UUID assigned to it\");\n      return null;\n    }\n    if (!this.listeners[listener.uuid]) {\n      (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyErrorLog)(\"Unable to remove listener as none was found on the manager\");\n      return null;\n    }\n    const deleted = this.listeners[listener.uuid];\n    delete this.listeners[listener.uuid];\n    (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyLog)(\"controller manager > removed listener\", deleted, this);\n    return deleted;\n  }\n  addBlockingListener(listener) {\n    if (this.blockingListener) {\n      (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyWarnLog)(\"Already has blocking listener, the original will be forgotten to the sands of time o.o\", this.blockingListener, listener);\n    }\n    this.blockingListener = listener;\n  }\n  removeBlockingListener() {\n    const blocking = this.blockingListener;\n    this.blockingListener = null;\n    return blocking;\n  }\n  addRightClickListener(listener) {\n    if (this.globalRightClickListener) {\n      (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyWarnLog)(\"Already has right click listener, the original will be forgotten to the sands of time o.o\", this.globalRightClickListener, listener);\n    }\n    this.globalRightClickListener = listener;\n  }\n  removeRightClickListener() {\n    const rightClick = this.globalRightClickListener;\n    this.globalRightClickListener = null;\n    return rightClick;\n  }\n  start() {\n    if (this.keyboardAbortController) {\n      this.stop();\n    }\n    this.keyboardAbortController = new AbortController();\n    const manager = this;\n    document.addEventListener(\"keydown\", (event) => {\n      manager.handleKeyup(event);\n    }, {\n      signal: this.keyboardAbortController.signal\n    });\n    this.gamepadConnectedAbortController = new AbortController();\n    window.addEventListener(\"gamepadconnected\", (e) => {\n      manager.handleGamepadConnected(e);\n    }, {\n      signal: this.gamepadConnectedAbortController.signal\n    });\n    this.gamepadDisconnectedAbortController = new AbortController();\n    window.addEventListener(\"gamepaddisconnected\", (e) => {\n      manager.handleGamepadDisconnected(e);\n    }, {\n      signal: this.gamepadDisconnectedAbortController.signal\n    });\n    const handleRightClick = () => {\n      if (manager.globalRightClickListener) {\n        manager.globalRightClickListener.onRightClick();\n      }\n    };\n    window.oncontextmenu = () => {\n      handleRightClick();\n      return false;\n    };\n    window.document.body.addEventListener(\"click\", (e) => {\n      if (manager.shouldStopAcceptingClicks) {\n        return;\n      }\n      if (e.button !== 2) {\n        return;\n      }\n      e.preventDefault();\n      handleRightClick();\n    });\n  }\n  stop() {\n    const manager = this;\n    document.removeEventListener(\"keydown\", (event) => {\n      manager.handleKeyup(event);\n    });\n    window.removeEventListener(\"gamepadconnected\", (e) => {\n      manager.handleGamepadConnected(e);\n    });\n    window.removeEventListener(\"gamepaddisconnected\", (e) => {\n      manager.handleGamepadDisconnected(e);\n    });\n    if (this.keyboardAbortController) {\n      this.keyboardAbortController.abort();\n    }\n    if (this.gamepadConnectedAbortController) {\n      this.gamepadConnectedAbortController.abort();\n    }\n    if (this.gamepadDisconnectedAbortController) {\n      this.gamepadDisconnectedAbortController.abort();\n    }\n  }\n  handleKeyup(event) {\n    event.preventDefault();\n    event.stopPropagation();\n    const keyNumber = event.keyCode;\n    if (keyNumber === 65 || keyNumber === 37) {\n      this.handleOogyInput(_OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.left, event);\n    } else if (keyNumber === 68 || keyNumber === 39) {\n      this.handleOogyInput(_OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.right, event);\n    } else if (keyNumber === 87 || keyNumber === 38) {\n      this.handleOogyInput(_OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.up, event);\n    } else if (keyNumber === 40 || keyNumber === 83) {\n      this.handleOogyInput(_OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.down, event);\n    } else if (keyNumber === 13 || keyNumber === 32) {\n      this.handleOogyInput(_OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.a, event);\n    } else if (keyNumber === 8) {\n      this.handleOogyInput(_OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.b, event);\n    } else if (keyNumber === 27) {\n      this.handleOogyInput(_OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.start, event);\n    } else if (keyNumber === 9) {\n      this.handleOogyInput(_OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.guide, event);\n    } else {\n      this.handleOogyInput(void 0, event);\n    }\n  }\n  handleGamepadConnected(event) {\n    const eventGamepad = event.gamepad;\n    if (eventGamepad.vibrationActuator) {\n      eventGamepad.vibrationActuator.playEffect(\"dual-rumble\", {\n        startDelay: 0,\n        duration: 100,\n        weakMagnitude: 1,\n        strongMagnitude: 1\n      }).then(() => {\n        (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyLog)(\"Successfully vibrated controller\");\n      }).catch((e) => {\n        (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyErrorLog)(\"Unable to virbate controller\", event, e);\n      });\n    }\n    const buttonsToIgnoreInitially = eventGamepad.buttons.map((b, i) => {\n      const oogyInput = this.generateOogyControllerInputFromButtonIndex(i);\n      if (oogyInput && this.isGamepadButtonPressed(b)) {\n        return oogyInput;\n      } else {\n        return null;\n      }\n    }).filter((b) => b !== null);\n    (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyLog)(\"controller manager > buttonsToIgnoreInitially\", buttonsToIgnoreInitially);\n    const oogyGamepad = {\n      state: {\n        ignoreInputs: buttonsToIgnoreInitially\n      },\n      gamepad: eventGamepad\n    };\n    this.gamepads[eventGamepad.id] = oogyGamepad;\n    if (!this.gamepadPollInterval) {\n      const manager = this;\n      this.gamepadPollInterval = setInterval(() => {\n        manager.handleGamepadPoll();\n      }, this.gamepadPoolIntervalDelay);\n    }\n  }\n  handleGamepadDisconnected(event) {\n    const eventGamepad = event.gamepad;\n    const previouslyHadConnected = this.gamepads[eventGamepad.id] !== void 0;\n    delete this.gamepads[eventGamepad.id];\n    if (Object.keys(this.gamepads).length < 1) {\n      if (this.gamepadPollInterval) {\n        clearInterval(this.gamepadPollInterval);\n        this.gamepadPollInterval = null;\n      }\n    }\n    if (previouslyHadConnected) {\n      this.model.onControllerDisconnected(eventGamepad);\n    }\n  }\n  isGamepadButtonPressed(gamepadButton) {\n    if (typeof gamepadButton === \"object\") {\n      return gamepadButton.pressed;\n    }\n    return gamepadButton === 1;\n  }\n  generateOogyControllerInputFromButtonIndex(index) {\n    if (index === 0) {\n      return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.a;\n    } else if (index === 1) {\n      return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.b;\n    } else if (index === 14) {\n      return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.left;\n    } else if (index === 15) {\n      return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.right;\n    } else if (index === 12) {\n      return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.up;\n    } else if (index === 13) {\n      return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.down;\n    } else if (index === 9 || index === 8 || index === 17 || index === 16) {\n      return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.start;\n    } else if (index === 16) {\n      return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.guide;\n    } else {\n      return null;\n    }\n  }\n  generateOogyControllerInputFromAxes(axesIndex, axesVal) {\n    if (axesIndex === 0) {\n      if (axesVal < -0.9) {\n        return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.left;\n      } else if (axesVal > 0.9) {\n        return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.right;\n      }\n    } else if (axesIndex === 1) {\n      if (axesVal < -0.9) {\n        return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.up;\n      } else if (axesVal > 0.9) {\n        return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.down;\n      }\n    }\n    return null;\n  }\n  handleGamepadPoll() {\n    const currGamepads = Array.from(navigator.getGamepads());\n    const oogyGamepads = Object.values(this.gamepads);\n    for (const oogyGamepadToFind of oogyGamepads) {\n      const matchingGamepads = currGamepads.filter((g) => g && g.id === oogyGamepadToFind.gamepad.id);\n      if (!matchingGamepads || matchingGamepads.length < 1) {\n        continue;\n      }\n      const oogyGamepad = {\n        gamepad: matchingGamepads[0],\n        state: oogyGamepadToFind.state\n      };\n      const gamepadState = oogyGamepad.state ? oogyGamepad.state : { ignoreInputs: [] };\n      const newGamepadState = Object.assign({}, gamepadState);\n      for (let i = 0; i < oogyGamepad.gamepad.axes.length; i++) {\n        const axes = oogyGamepad.gamepad.axes[i];\n        const oogyInput = this.generateOogyControllerInputFromAxes(i, axes);\n        if (!oogyInput) {\n          newGamepadState.ignoreInputs = newGamepadState.ignoreInputs.filter((i2) => {\n            return i2 !== _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.down && i2 !== _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.up && i2 !== _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.left && i2 !== _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.right;\n          });\n        } else {\n          if (gamepadState.ignoreInputs.includes(oogyInput)) {\n            newGamepadState.ignoreInputs = newGamepadState.ignoreInputs.concat([\n              oogyInput\n            ]);\n          } else {\n            newGamepadState.ignoreInputs = newGamepadState.ignoreInputs.concat([\n              oogyInput\n            ]);\n            this.handleGamepadPollRecognizedInput(oogyInput);\n          }\n        }\n      }\n      for (let i = 0; i < oogyGamepad.gamepad.buttons.length; i++) {\n        const button = oogyGamepad.gamepad.buttons[i];\n        const oogyInput = this.generateOogyControllerInputFromButtonIndex(i);\n        if (!oogyInput) {\n        } else if (this.isGamepadButtonPressed(button)) {\n          if (gamepadState.ignoreInputs.includes(oogyInput)) {\n            newGamepadState.ignoreInputs = newGamepadState.ignoreInputs.concat([\n              oogyInput\n            ]);\n          } else {\n            newGamepadState.ignoreInputs = newGamepadState.ignoreInputs.concat([\n              oogyInput\n            ]);\n            this.handleGamepadPollRecognizedInput(oogyInput);\n          }\n        } else {\n          if (gamepadState.ignoreInputs.includes(oogyInput)) {\n            newGamepadState.ignoreInputs = newGamepadState.ignoreInputs.filter((i2) => i2 !== oogyInput);\n          }\n        }\n      }\n      oogyGamepad.state = newGamepadState;\n      this.gamepads[oogyGamepadToFind.gamepad.id] = oogyGamepad;\n    }\n  }\n  handleGamepadPollRecognizedInput(input) {\n    this.handleOogyInput(input);\n  }\n  handleOogyInput(input, keyboardEvent) {\n    if (this.blockingListener && input) {\n      const shouldBlock = this.blockingListener.interceptControllerInputAndBlock(input);\n      if (shouldBlock) {\n        (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyLog)(\"Blocking all other listeners as blockingListener has priority\", this);\n        return;\n      }\n    }\n    const listeners = Object.values(this.listeners);\n    for (const listener of listeners) {\n      if (listener.deactivated === true) {\n        (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyLog)(\"controller manager > listener manually deactivated so suppressing input\", listener, input);\n        continue;\n      }\n      if (keyboardEvent && listener.interceptKeyboardInput) {\n        (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyLog)(\"controller manager > listener manually handling keyboard, so ignoring this trigger\");\n        listener.interceptKeyboardInput(keyboardEvent);\n        continue;\n      }\n      if (!input) {\n        (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyLog)(\"controller manager > unrecognized input and did not intercept for keyboard\", listener, keyboardEvent);\n        continue;\n      }\n      listener.onControllerInput(input);\n    }\n  }\n}\n\n\n//# sourceURL=webpack://oogy-controller-manager/./src/OogyControllerManager.ts?");

/***/ }),

/***/ "./src/OogyLog.ts":
/*!************************!*\
  !*** ./src/OogyLog.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"kOogyIsDebug\": () => (/* binding */ kOogyIsDebug),\n/* harmony export */   \"oogyErrorLog\": () => (/* binding */ oogyErrorLog),\n/* harmony export */   \"oogyLog\": () => (/* binding */ oogyLog),\n/* harmony export */   \"oogyWarnLog\": () => (/* binding */ oogyWarnLog)\n/* harmony export */ });\nconst kOogyIsDebug = true;\nlet oogyLog, oogyErrorLog, oogyWarnLog;\nconst kOogyLogFontSize = \"8px\";\noogyLog = (msg, ...args) => {\n  try {\n    throw new Error(\"OogyLogError\");\n  } catch (e) {\n    const oogyLogCSS = `font-size: ${kOogyLogFontSize}; color: #9BACF1;`;\n    const callee = e.stack.split(\"\\n\")[2].trim();\n    console.log(`%c${msg}\n> ${new Date().toISOString()} ${callee}`, oogyLogCSS, ...args);\n  }\n};\noogyErrorLog = (msg, ...args) => {\n  try {\n    throw new Error(\"OogyLogError\");\n  } catch (e) {\n    const oogyLogCSS = `font-size: ${kOogyLogFontSize}; color: #fff; background: tomato;`;\n    const callee = e.stack.split(\"\\n\")[2].trim();\n    console.error(`%c${msg}\n> ${new Date().toISOString()} ${callee}`, oogyLogCSS, ...args);\n  }\n};\noogyWarnLog = (msg, ...args) => {\n  try {\n    throw new Error(\"OogyLogError\");\n  } catch (e) {\n    const oogyLogCSS = `font-size: ${kOogyLogFontSize}; color: #fff; background: goldenrod;`;\n    const callee = e.stack.split(\"\\n\")[2].trim();\n    console.warn(`%c${msg}\n> ${new Date().toISOString()} ${callee}`, oogyLogCSS, ...args);\n  }\n};\n\n\n\n//# sourceURL=webpack://oogy-controller-manager/./src/OogyLog.ts?");

/***/ }),

/***/ "./src/OogyUUIDBuilder.ts":
/*!********************************!*\
  !*** ./src/OogyUUIDBuilder.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"OogyUUIDBuilder\": () => (/* binding */ OogyUUIDBuilder)\n/* harmony export */ });\nclass OogyUUIDBuilder {\n  static randomUUID() {\n    return window.crypto.randomUUID();\n  }\n}\n\n\n//# sourceURL=webpack://oogy-controller-manager/./src/OogyUUIDBuilder.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/OogyControllerManager.ts");
/******/ 	
/******/ })()
;