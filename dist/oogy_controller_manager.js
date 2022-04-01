/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (() => {



/***/ }),
/* 2 */
/***/ (() => {



/***/ }),
/* 3 */
/***/ (() => {



/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OogyControllerInput": () => (/* binding */ OogyControllerInput)
/* harmony export */ });
var OogyControllerInput = /* @__PURE__ */ ((OogyControllerInput2) => {
  OogyControllerInput2["up"] = "up";
  OogyControllerInput2["down"] = "down";
  OogyControllerInput2["right"] = "right";
  OogyControllerInput2["left"] = "left";
  OogyControllerInput2["a"] = "a";
  OogyControllerInput2["b"] = "b";
  OogyControllerInput2["start"] = "start";
  OogyControllerInput2["guide"] = "guide";
  return OogyControllerInput2;
})(OogyControllerInput || {});


/***/ }),
/* 5 */
/***/ (() => {



/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OogyControllerManager": () => (/* binding */ OogyControllerManager)
/* harmony export */ });
/* harmony import */ var _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _OogyLog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var _OogyUUIDBuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);



class OogyControllerManager {
  constructor(model) {
    this.shouldStopAcceptingClicks = false;
    this.listeners = {};
    this.gamepads = {};
    this.gamepadPoolIntervalDelay = 100;
    this.model = model;
  }
  addListener(listener) {
    if (!listener.uuid) {
      listener.uuid = _OogyUUIDBuilder__WEBPACK_IMPORTED_MODULE_2__.OogyUUIDBuilder.randomUUID();
    }
    if (this.listeners[listener.uuid]) {
      (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyErrorLog)("!!! Strange situation where we already have added this listener??? We won't be able to remove it later because only 1 per UUID can exist on the manager... check we haven't added the same listener twice somehow!!", this);
    }
    this.listeners[listener.uuid] = listener;
    (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyLog)("controller manager > registered new listener", listener, this);
    return listener;
  }
  removeListener(listener) {
    if (!listener.uuid) {
      (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyErrorLog)("Unable to remove listener as it has never had a UUID assigned to it");
      return null;
    }
    if (!this.listeners[listener.uuid]) {
      (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyErrorLog)("Unable to remove listener as none was found on the manager");
      return null;
    }
    const deleted = this.listeners[listener.uuid];
    delete this.listeners[listener.uuid];
    (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyLog)("controller manager > removed listener", deleted, this);
    return deleted;
  }
  addBlockingListener(listener) {
    if (this.blockingListener) {
      (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyWarnLog)("Already has blocking listener, the original will be forgotten to the sands of time o.o", this.blockingListener, listener);
    }
    this.blockingListener = listener;
  }
  removeBlockingListener() {
    const blocking = this.blockingListener;
    this.blockingListener = null;
    return blocking;
  }
  addRightClickListener(listener) {
    if (this.globalRightClickListener) {
      (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyWarnLog)("Already has right click listener, the original will be forgotten to the sands of time o.o", this.globalRightClickListener, listener);
    }
    this.globalRightClickListener = listener;
  }
  removeRightClickListener() {
    const rightClick = this.globalRightClickListener;
    this.globalRightClickListener = null;
    return rightClick;
  }
  start() {
    if (this.keyboardAbortController) {
      this.stop();
    }
    this.keyboardAbortController = new AbortController();
    const manager = this;
    document.addEventListener("keydown", (event) => {
      manager.handleKeyup(event);
    }, {
      signal: this.keyboardAbortController.signal
    });
    this.gamepadConnectedAbortController = new AbortController();
    window.addEventListener("gamepadconnected", (e) => {
      manager.handleGamepadConnected(e);
    }, {
      signal: this.gamepadConnectedAbortController.signal
    });
    this.gamepadDisconnectedAbortController = new AbortController();
    window.addEventListener("gamepaddisconnected", (e) => {
      manager.handleGamepadDisconnected(e);
    }, {
      signal: this.gamepadDisconnectedAbortController.signal
    });
    const handleRightClick = () => {
      if (manager.globalRightClickListener) {
        manager.globalRightClickListener.onRightClick();
      }
    };
    window.oncontextmenu = () => {
      handleRightClick();
      return false;
    };
    window.document.body.addEventListener("click", (e) => {
      if (manager.shouldStopAcceptingClicks) {
        return;
      }
      if (e.button !== 2) {
        return;
      }
      e.preventDefault();
      handleRightClick();
    });
  }
  stop() {
    const manager = this;
    document.removeEventListener("keydown", (event) => {
      manager.handleKeyup(event);
    });
    window.removeEventListener("gamepadconnected", (e) => {
      manager.handleGamepadConnected(e);
    });
    window.removeEventListener("gamepaddisconnected", (e) => {
      manager.handleGamepadDisconnected(e);
    });
    if (this.keyboardAbortController) {
      this.keyboardAbortController.abort();
    }
    if (this.gamepadConnectedAbortController) {
      this.gamepadConnectedAbortController.abort();
    }
    if (this.gamepadDisconnectedAbortController) {
      this.gamepadDisconnectedAbortController.abort();
    }
  }
  handleKeyup(event) {
    event.preventDefault();
    event.stopPropagation();
    const keyNumber = event.keyCode;
    if (keyNumber === 65 || keyNumber === 37) {
      this.handleOogyInput(_OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.left, event);
    } else if (keyNumber === 68 || keyNumber === 39) {
      this.handleOogyInput(_OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.right, event);
    } else if (keyNumber === 87 || keyNumber === 38) {
      this.handleOogyInput(_OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.up, event);
    } else if (keyNumber === 40 || keyNumber === 83) {
      this.handleOogyInput(_OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.down, event);
    } else if (keyNumber === 13 || keyNumber === 32) {
      this.handleOogyInput(_OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.a, event);
    } else if (keyNumber === 8) {
      this.handleOogyInput(_OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.b, event);
    } else if (keyNumber === 27) {
      this.handleOogyInput(_OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.start, event);
    } else if (keyNumber === 9) {
      this.handleOogyInput(_OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.guide, event);
    } else {
      this.handleOogyInput(void 0, event);
    }
  }
  handleGamepadConnected(event) {
    const eventGamepad = event.gamepad;
    if (eventGamepad.vibrationActuator) {
      eventGamepad.vibrationActuator.playEffect("dual-rumble", {
        startDelay: 0,
        duration: 100,
        weakMagnitude: 1,
        strongMagnitude: 1
      }).then(() => {
        (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyLog)("Successfully vibrated controller");
      }).catch((e) => {
        (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyErrorLog)("Unable to vibrate controller", event, e);
      });
    }
    const buttonsToIgnoreInitially = eventGamepad.buttons.map((b, i) => {
      const oogyInput = this.generateOogyControllerInputFromButtonIndex(i);
      if (oogyInput && this.isGamepadButtonPressed(b)) {
        return oogyInput;
      } else {
        return null;
      }
    }).filter((b) => b !== null);
    (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyLog)("controller manager > buttonsToIgnoreInitially", buttonsToIgnoreInitially);
    const oogyGamepad = {
      state: {
        ignoreInputs: buttonsToIgnoreInitially
      },
      gamepad: eventGamepad
    };
    this.gamepads[eventGamepad.id] = oogyGamepad;
    if (!this.gamepadPollInterval) {
      const manager = this;
      this.gamepadPollInterval = setInterval(() => {
        manager.handleGamepadPoll();
      }, this.gamepadPoolIntervalDelay);
    }
  }
  handleGamepadDisconnected(event) {
    const eventGamepad = event.gamepad;
    const previouslyHadConnected = this.gamepads[eventGamepad.id] !== void 0;
    delete this.gamepads[eventGamepad.id];
    if (Object.keys(this.gamepads).length < 1) {
      if (this.gamepadPollInterval) {
        clearInterval(this.gamepadPollInterval);
        this.gamepadPollInterval = null;
      }
    }
    if (previouslyHadConnected) {
      this.model.onControllerDisconnected(eventGamepad);
    }
  }
  isGamepadButtonPressed(gamepadButton) {
    if (typeof gamepadButton === "object") {
      return gamepadButton.pressed;
    }
    return gamepadButton === 1;
  }
  generateOogyControllerInputFromButtonIndex(index) {
    if (index === 0) {
      return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.a;
    } else if (index === 1) {
      return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.b;
    } else if (index === 14) {
      return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.left;
    } else if (index === 15) {
      return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.right;
    } else if (index === 12) {
      return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.up;
    } else if (index === 13) {
      return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.down;
    } else if (index === 9 || index === 8 || index === 17 || index === 16) {
      return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.start;
    } else if (index === 16) {
      return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.guide;
    } else {
      return null;
    }
  }
  generateOogyControllerInputFromAxes(axesIndex, axesVal) {
    if (axesIndex === 0) {
      if (axesVal < -0.9) {
        return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.left;
      } else if (axesVal > 0.9) {
        return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.right;
      }
    } else if (axesIndex === 1) {
      if (axesVal < -0.9) {
        return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.up;
      } else if (axesVal > 0.9) {
        return _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.down;
      }
    }
    return null;
  }
  handleGamepadPoll() {
    const currGamepads = Array.from(navigator.getGamepads());
    const oogyGamepads = Object.values(this.gamepads);
    for (const oogyGamepadToFind of oogyGamepads) {
      const matchingGamepads = currGamepads.filter((g) => g && g.id === oogyGamepadToFind.gamepad.id);
      if (!matchingGamepads || matchingGamepads.length < 1) {
        continue;
      }
      const oogyGamepad = {
        gamepad: matchingGamepads[0],
        state: oogyGamepadToFind.state
      };
      const gamepadState = oogyGamepad.state ? oogyGamepad.state : { ignoreInputs: [] };
      const newGamepadState = Object.assign({}, gamepadState);
      for (let i = 0; i < oogyGamepad.gamepad.axes.length; i++) {
        const axes = oogyGamepad.gamepad.axes[i];
        const oogyInput = this.generateOogyControllerInputFromAxes(i, axes);
        if (!oogyInput) {
          newGamepadState.ignoreInputs = newGamepadState.ignoreInputs.filter((i2) => {
            return i2 !== _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.down && i2 !== _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.up && i2 !== _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.left && i2 !== _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__.OogyControllerInput.right;
          });
        } else {
          if (gamepadState.ignoreInputs.includes(oogyInput)) {
            newGamepadState.ignoreInputs = newGamepadState.ignoreInputs.concat([
              oogyInput
            ]);
          } else {
            newGamepadState.ignoreInputs = newGamepadState.ignoreInputs.concat([
              oogyInput
            ]);
            this.handleGamepadPollRecognizedInput(oogyInput);
          }
        }
      }
      for (let i = 0; i < oogyGamepad.gamepad.buttons.length; i++) {
        const button = oogyGamepad.gamepad.buttons[i];
        const oogyInput = this.generateOogyControllerInputFromButtonIndex(i);
        if (!oogyInput) {
        } else if (this.isGamepadButtonPressed(button)) {
          if (gamepadState.ignoreInputs.includes(oogyInput)) {
            newGamepadState.ignoreInputs = newGamepadState.ignoreInputs.concat([
              oogyInput
            ]);
          } else {
            newGamepadState.ignoreInputs = newGamepadState.ignoreInputs.concat([
              oogyInput
            ]);
            this.handleGamepadPollRecognizedInput(oogyInput);
          }
        } else {
          if (gamepadState.ignoreInputs.includes(oogyInput)) {
            newGamepadState.ignoreInputs = newGamepadState.ignoreInputs.filter((i2) => i2 !== oogyInput);
          }
        }
      }
      oogyGamepad.state = newGamepadState;
      this.gamepads[oogyGamepadToFind.gamepad.id] = oogyGamepad;
    }
  }
  handleGamepadPollRecognizedInput(input) {
    this.handleOogyInput(input);
  }
  handleOogyInput(input, keyboardEvent) {
    if (this.blockingListener && input) {
      const shouldBlock = this.blockingListener.interceptControllerInputAndBlock(input);
      if (shouldBlock) {
        (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyLog)("Blocking all other listeners as blockingListener has priority", this);
        return;
      }
    }
    const listeners = Object.values(this.listeners);
    for (const listener of listeners) {
      if (listener.deactivated === true) {
        (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyLog)("controller manager > listener manually deactivated so suppressing input", listener, input);
        continue;
      }
      if (keyboardEvent && listener.interceptKeyboardInput) {
        (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyLog)("controller manager > listener manually handling keyboard, so ignoring this trigger");
        listener.interceptKeyboardInput(keyboardEvent);
        continue;
      }
      if (!input) {
        (0,_OogyLog__WEBPACK_IMPORTED_MODULE_1__.oogyLog)("controller manager > unrecognized input and did not intercept for keyboard", listener, keyboardEvent);
        continue;
      }
      listener.onControllerInput(input);
    }
  }
}


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "kOogyIsDebug": () => (/* binding */ kOogyIsDebug),
/* harmony export */   "oogyErrorLog": () => (/* binding */ oogyErrorLog),
/* harmony export */   "oogyLog": () => (/* binding */ oogyLog),
/* harmony export */   "oogyWarnLog": () => (/* binding */ oogyWarnLog)
/* harmony export */ });
const kOogyIsDebug = true;
let oogyLog, oogyErrorLog, oogyWarnLog;
const kOogyLogFontSize = "8px";
oogyLog = (msg, ...args) => {
  try {
    throw new Error("OogyLogError");
  } catch (e) {
    const oogyLogCSS = `font-size: ${kOogyLogFontSize}; color: #9BACF1;`;
    const callee = e.stack.split("\n")[2].trim();
    console.log(`%c${msg}
> ${new Date().toISOString()} ${callee}`, oogyLogCSS, ...args);
  }
};
oogyErrorLog = (msg, ...args) => {
  try {
    throw new Error("OogyLogError");
  } catch (e) {
    const oogyLogCSS = `font-size: ${kOogyLogFontSize}; color: #fff; background: tomato;`;
    const callee = e.stack.split("\n")[2].trim();
    console.error(`%c${msg}
> ${new Date().toISOString()} ${callee}`, oogyLogCSS, ...args);
  }
};
oogyWarnLog = (msg, ...args) => {
  try {
    throw new Error("OogyLogError");
  } catch (e) {
    const oogyLogCSS = `font-size: ${kOogyLogFontSize}; color: #fff; background: goldenrod;`;
    const callee = e.stack.split("\n")[2].trim();
    console.warn(`%c${msg}
> ${new Date().toISOString()} ${callee}`, oogyLogCSS, ...args);
  }
};



/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OogyUUIDBuilder": () => (/* binding */ OogyUUIDBuilder)
/* harmony export */ });
class OogyUUIDBuilder {
  static randomUUID() {
    return window.crypto.randomUUID();
  }
}


/***/ }),
/* 9 */
/***/ (() => {



/***/ }),
/* 10 */
/***/ (() => {



/***/ }),
/* 11 */
/***/ (() => {



/***/ })
/******/ 	]);
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OogyControllerInput": () => (/* reexport safe */ _OogyControllerInput__WEBPACK_IMPORTED_MODULE_3__.OogyControllerInput),
/* harmony export */   "OogyControllerManager": () => (/* reexport safe */ _OogyControllerManager__WEBPACK_IMPORTED_MODULE_5__.OogyControllerManager),
/* harmony export */   "OogyUUIDBuilder": () => (/* reexport safe */ _OogyUUIDBuilder__WEBPACK_IMPORTED_MODULE_10__.OogyUUIDBuilder),
/* harmony export */   "kOogyIsDebug": () => (/* reexport safe */ _OogyLog__WEBPACK_IMPORTED_MODULE_8__.kOogyIsDebug),
/* harmony export */   "oogyErrorLog": () => (/* reexport safe */ _OogyLog__WEBPACK_IMPORTED_MODULE_8__.oogyErrorLog),
/* harmony export */   "oogyLog": () => (/* reexport safe */ _OogyLog__WEBPACK_IMPORTED_MODULE_8__.oogyLog),
/* harmony export */   "oogyWarnLog": () => (/* reexport safe */ _OogyLog__WEBPACK_IMPORTED_MODULE_8__.oogyWarnLog)
/* harmony export */ });
/* harmony import */ var _OogyControllerBlockingListener__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _OogyControllerBlockingListener__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_OogyControllerBlockingListener__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _OogyControllerBlockingListener__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _OogyControllerBlockingListener__WEBPACK_IMPORTED_MODULE_0__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _OogyControllerGamepad__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _OogyControllerGamepad__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_OogyControllerGamepad__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _OogyControllerGamepad__WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _OogyControllerGamepad__WEBPACK_IMPORTED_MODULE_1__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _OogyControllerGamepadState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _OogyControllerGamepadState__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_OogyControllerGamepadState__WEBPACK_IMPORTED_MODULE_2__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _OogyControllerGamepadState__WEBPACK_IMPORTED_MODULE_2__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _OogyControllerGamepadState__WEBPACK_IMPORTED_MODULE_2__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _OogyControllerInput__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);
/* harmony import */ var _OogyControllerListener__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5);
/* harmony import */ var _OogyControllerListener__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_OogyControllerListener__WEBPACK_IMPORTED_MODULE_4__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _OogyControllerListener__WEBPACK_IMPORTED_MODULE_4__) if(["default","OogyControllerInput"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _OogyControllerListener__WEBPACK_IMPORTED_MODULE_4__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _OogyControllerManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6);
/* harmony import */ var _OogyControllerManagerModel__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9);
/* harmony import */ var _OogyControllerManagerModel__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_OogyControllerManagerModel__WEBPACK_IMPORTED_MODULE_6__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _OogyControllerManagerModel__WEBPACK_IMPORTED_MODULE_6__) if(["default","OogyControllerInput","OogyControllerManager"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _OogyControllerManagerModel__WEBPACK_IMPORTED_MODULE_6__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _OogyControllerRightClickListener__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(10);
/* harmony import */ var _OogyControllerRightClickListener__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_OogyControllerRightClickListener__WEBPACK_IMPORTED_MODULE_7__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _OogyControllerRightClickListener__WEBPACK_IMPORTED_MODULE_7__) if(["default","OogyControllerInput","OogyControllerManager"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _OogyControllerRightClickListener__WEBPACK_IMPORTED_MODULE_7__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _OogyLog__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(7);
/* harmony import */ var _OogyNullable__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(11);
/* harmony import */ var _OogyNullable__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_OogyNullable__WEBPACK_IMPORTED_MODULE_9__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _OogyNullable__WEBPACK_IMPORTED_MODULE_9__) if(["default","OogyControllerInput","OogyControllerManager","kOogyIsDebug","oogyErrorLog","oogyLog","oogyWarnLog"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _OogyNullable__WEBPACK_IMPORTED_MODULE_9__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _OogyUUIDBuilder__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(8);












})();

/******/ })()
;