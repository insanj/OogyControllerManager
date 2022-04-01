/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/OogyControllerInput.ts":
/*!************************************!*\
  !*** ./src/OogyControllerInput.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/***/ "./src/OogyControllerManager.ts":
/*!**************************************!*\
  !*** ./src/OogyControllerManager.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OogyControllerManager": () => (/* binding */ OogyControllerManager)
/* harmony export */ });
/* harmony import */ var _OogyControllerInput__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./OogyControllerInput */ "./src/OogyControllerInput.ts");
/* harmony import */ var _OogyLog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./OogyLog */ "./src/OogyLog.ts");
/* harmony import */ var _OogyUUIDBuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./OogyUUIDBuilder */ "./src/OogyUUIDBuilder.ts");



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

/***/ "./src/OogyLog.ts":
/*!************************!*\
  !*** ./src/OogyLog.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/***/ "./src/OogyUUIDBuilder.ts":
/*!********************************!*\
  !*** ./src/OogyUUIDBuilder.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OogyUUIDBuilder": () => (/* binding */ OogyUUIDBuilder)
/* harmony export */ });
class OogyUUIDBuilder {
  static randomUUID() {
    return window.crypto.randomUUID();
  }
}


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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _OogyControllerManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./OogyControllerManager */ "./src/OogyControllerManager.ts");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ OogyControllerManager: _OogyControllerManager__WEBPACK_IMPORTED_MODULE_0__.OogyControllerManager });

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QXFCO0FBQzFCLFdBQVEsT0FBTyxPQUE4QyxXQUFXO0FBQUEsRUFDMUU7QUFDRjs7Ozs7OztVQ1JBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7QUNOZ0U7QUFFaEUsaUVBQWUsRUFBRSxxQkFBcUIsNEVBQUMsQ0FBQyxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb29neS1jb250cm9sbGVyLW1hbmFnZXIvLi9zcmMvT29neUNvbnRyb2xsZXJJbnB1dC50cyIsIndlYnBhY2s6Ly9vb2d5LWNvbnRyb2xsZXItbWFuYWdlci8uL3NyYy9Pb2d5Q29udHJvbGxlck1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vb29neS1jb250cm9sbGVyLW1hbmFnZXIvLi9zcmMvT29neUxvZy50cyIsIndlYnBhY2s6Ly9vb2d5LWNvbnRyb2xsZXItbWFuYWdlci8uL3NyYy9Pb2d5VVVJREJ1aWxkZXIudHMiLCJ3ZWJwYWNrOi8vb29neS1jb250cm9sbGVyLW1hbmFnZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb29neS1jb250cm9sbGVyLW1hbmFnZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL29vZ3ktY29udHJvbGxlci1tYW5hZ2VyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vb29neS1jb250cm9sbGVyLW1hbmFnZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9vb2d5LWNvbnRyb2xsZXItbWFuYWdlci8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFsbCBzdXBwb3J0ZWQgaW5wdXRzIGZvciB0aGUgZ2FtZVxuICovXG5cbmV4cG9ydCBlbnVtIE9vZ3lDb250cm9sbGVySW5wdXQge1xuICAvKipcbiAgICogQ29udHJvbGxlcjpcbiAgICogLSBVcCBvbiBhbnkgc3RpY2tcbiAgICogTW91c2U6XG4gICAqIC0gTm9uZVxuICAgKiBLZXlib2FyZDpcbiAgICogLSBXXG4gICAqIC0gVXAgYXJyb3dcbiAgICovXG4gIHVwID0gXCJ1cFwiLFxuXG4gIC8qKlxuICAgKiBDb250cm9sbGVyOlxuICAgKiAtIFVwIG9uIGFueSBzdGlja1xuICAgKiBNb3VzZTpcbiAgICogLSBOb25lXG4gICAqIEtleWJvYXJkOlxuICAgKiAtIFdcbiAgICogLSBVcCBhcnJvd1xuICAgKi9cbiAgZG93biA9IFwiZG93blwiLFxuXG4gIC8qKlxuICAgKiBDb250cm9sbGVyOlxuICAgKiAtIFJpZ2h0IG9uIGFueSBzdGlja1xuICAgKiBNb3VzZTpcbiAgICogLSBOb25lXG4gICAqIEtleWJvYXJkOlxuICAgKiAtIERcbiAgICogLSBSaWdodCBhcnJvd1xuICAgKi9cbiAgcmlnaHQgPSBcInJpZ2h0XCIsXG5cbiAgLyoqXG4gICAqIENvbnRyb2xsZXI6XG4gICAqIC0gTGVmdCBvbiBhbnkgc3RpY2tcbiAgICogTW91c2U6XG4gICAqIC0gTm9uZVxuICAgKiBLZXlib2FyZDpcbiAgICogLSBBXG4gICAqIC0gTGVmdCBhcnJvd1xuICAgKi9cbiAgbGVmdCA9IFwibGVmdFwiLFxuXG4gIC8qKlxuICAgKiBDb250cm9sbGVyOlxuICAgKiAtIEFcbiAgICogTW91c2U6XG4gICAqIC0gQ2xpY2tcbiAgICogS2V5Ym9hcmQ6XG4gICAqIC0gRW50ZXJcbiAgICogLSBTcGFjZVxuICAgKi9cbiAgYSA9IFwiYVwiLFxuXG4gIC8qKlxuICAgKiBDb250cm9sbGVyOlxuICAgKiAtIEJcbiAgICogTW91c2U6XG4gICAqIC0gTm90aGluZ1xuICAgKiBLZXlib2FyZDpcbiAgICogLSBOb3RoaW5nXG4gICAqL1xuICBiID0gXCJiXCIsXG5cbiAgLyoqXG4gICAqIENvbnRyb2xsZXI6XG4gICAqIC0gU3RhcnRcbiAgICogTW91c2U6XG4gICAqIC0gTm9uZVxuICAgKiBLZXlib2FyZDpcbiAgICogLSBFc2NhcGVcbiAgICovXG4gIHN0YXJ0ID0gXCJzdGFydFwiLFxuXG4gIGd1aWRlID0gXCJndWlkZVwiLFxufVxuIiwiaW1wb3J0IHsgT29neUNvbnRyb2xsZXJCbG9ja2luZ0xpc3RlbmVyIH0gZnJvbSBcIi4vT29neUNvbnRyb2xsZXJCbG9ja2luZ0xpc3RlbmVyXCI7XG5pbXBvcnQgeyBPb2d5Q29udHJvbGxlckdhbWVwYWQgfSBmcm9tIFwiLi9Pb2d5Q29udHJvbGxlckdhbWVwYWRcIjtcbmltcG9ydCB7IE9vZ3lDb250cm9sbGVyR2FtZXBhZFN0YXRlIH0gZnJvbSBcIi4vT29neUNvbnRyb2xsZXJHYW1lcGFkU3RhdGVcIjtcbmltcG9ydCB7IE9vZ3lDb250cm9sbGVySW5wdXQgfSBmcm9tIFwiLi9Pb2d5Q29udHJvbGxlcklucHV0XCI7XG5pbXBvcnQgeyBPb2d5Q29udHJvbGxlckxpc3RlbmVyIH0gZnJvbSBcIi4vT29neUNvbnRyb2xsZXJMaXN0ZW5lclwiO1xuaW1wb3J0IHsgT29neUNvbnRyb2xsZXJNYW5hZ2VyTW9kZWwgfSBmcm9tIFwiLi9Pb2d5Q29udHJvbGxlck1hbmFnZXJNb2RlbFwiO1xuaW1wb3J0IHsgT29neUNvbnRyb2xsZXJSaWdodENsaWNrTGlzdGVuZXIgfSBmcm9tIFwiLi9Pb2d5Q29udHJvbGxlclJpZ2h0Q2xpY2tMaXN0ZW5lclwiO1xuaW1wb3J0IHsgb29neUVycm9yTG9nLCBvb2d5TG9nLCBvb2d5V2FybkxvZyB9IGZyb20gXCIuL09vZ3lMb2dcIjtcbmltcG9ydCB7IE9vZ3lOdWxsYWJsZSB9IGZyb20gXCIuL09vZ3lOdWxsYWJsZVwiO1xuaW1wb3J0IHsgT29neVVVSURCdWlsZGVyIH0gZnJvbSBcIi4vT29neVVVSURCdWlsZGVyXCI7XG5cbmV4cG9ydCBjbGFzcyBPb2d5Q29udHJvbGxlck1hbmFnZXIge1xuICAvKipcbiAgICogSWYgbm9uLW51bGwsIGhhcyB0aGUgYWJpbGl0eSB0byBibG9jayBhbGwgb3RoZXIgbGlzdGVuZXJzIGZyb20gZmlyaW5nIGFuZCBpbnRlcmNlcHRzIGluc3RlYWRcbiAgICovXG4gIGJsb2NraW5nTGlzdGVuZXI/OiBPb2d5TnVsbGFibGU8T29neUNvbnRyb2xsZXJCbG9ja2luZ0xpc3RlbmVyPjtcblxuICBnbG9iYWxSaWdodENsaWNrTGlzdGVuZXI/OiBPb2d5TnVsbGFibGU8T29neUNvbnRyb2xsZXJSaWdodENsaWNrTGlzdGVuZXI+O1xuXG4gIGxpc3RlbmVyczogUmVjb3JkPHN0cmluZywgT29neUNvbnRyb2xsZXJMaXN0ZW5lcj47XG5cbiAgZ2FtZXBhZHM6IFJlY29yZDxzdHJpbmcsIE9vZ3lDb250cm9sbGVyR2FtZXBhZD47XG5cbiAgc2hvdWxkU3RvcEFjY2VwdGluZ0NsaWNrczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8vIGludGVybmFsIHByb3BlcnRpZXNcblxuICBwcml2YXRlIGtleWJvYXJkQWJvcnRDb250cm9sbGVyPzogQWJvcnRDb250cm9sbGVyO1xuICBwcml2YXRlIGdhbWVwYWRDb25uZWN0ZWRBYm9ydENvbnRyb2xsZXI/OiBBYm9ydENvbnRyb2xsZXI7XG4gIHByaXZhdGUgZ2FtZXBhZERpc2Nvbm5lY3RlZEFib3J0Q29udHJvbGxlcj86IEFib3J0Q29udHJvbGxlcjtcblxuICAvKipcbiAgICogc2V0SW50ZXJ2YWwgdXNlZCB0byBjbGVhciB0aGUgc2NoZWR1bGVkIGJsb2NrXG4gICAqL1xuICBwcml2YXRlIGdhbWVwYWRQb2xsSW50ZXJ2YWw/OiBhbnk7XG5cbiAgLyoqXG4gICAqIE1pbGxpc2Vjb25kIG51bWJlciB2YWx1ZSB0aGF0IGRlZmluZXMgaG93IG9mdGVuIHdlIGNoZWNrIGZvciBnYW1lcGFkIGlucHV0IChzaG91bGQgYmUgcmF0aGVyIGxvdylcbiAgICovXG4gIHByaXZhdGUgZ2FtZXBhZFBvb2xJbnRlcnZhbERlbGF5OiBudW1iZXI7XG5cbiAgcHJpdmF0ZSBtb2RlbDogT29neUNvbnRyb2xsZXJNYW5hZ2VyTW9kZWw7XG5cbiAgY29uc3RydWN0b3IobW9kZWw6IE9vZ3lDb250cm9sbGVyTWFuYWdlck1vZGVsKSB7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcbiAgICB0aGlzLmdhbWVwYWRzID0ge307XG4gICAgdGhpcy5nYW1lcGFkUG9vbEludGVydmFsRGVsYXkgPSAxMDA7XG5cbiAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBsaXN0ZW5lciB0aGF0IHdhcyBnaXZlbiB0byBpdCwgd2lsbCBhdHRhY2ggVVVJRCBpZiBpdCBkaWQgbm90IGFscmVhZHkgZXhpc3RcbiAgICogQHBhcmFtIGxpc3RlbmVyXG4gICAqIEByZXR1cm5zXG4gICAqL1xuICBhZGRMaXN0ZW5lcihsaXN0ZW5lcjogT29neUNvbnRyb2xsZXJMaXN0ZW5lcik6IE9vZ3lDb250cm9sbGVyTGlzdGVuZXIge1xuICAgIGlmICghbGlzdGVuZXIudXVpZCkge1xuICAgICAgbGlzdGVuZXIudXVpZCA9IE9vZ3lVVUlEQnVpbGRlci5yYW5kb21VVUlEKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubGlzdGVuZXJzW2xpc3RlbmVyLnV1aWRdKSB7XG4gICAgICBvb2d5RXJyb3JMb2coXG4gICAgICAgIFwiISEhIFN0cmFuZ2Ugc2l0dWF0aW9uIHdoZXJlIHdlIGFscmVhZHkgaGF2ZSBhZGRlZCB0aGlzIGxpc3RlbmVyPz8/IFdlIHdvbid0IGJlIGFibGUgdG8gcmVtb3ZlIGl0IGxhdGVyIGJlY2F1c2Ugb25seSAxIHBlciBVVUlEIGNhbiBleGlzdCBvbiB0aGUgbWFuYWdlci4uLiBjaGVjayB3ZSBoYXZlbid0IGFkZGVkIHRoZSBzYW1lIGxpc3RlbmVyIHR3aWNlIHNvbWVob3chIVwiLFxuICAgICAgICB0aGlzXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMubGlzdGVuZXJzW2xpc3RlbmVyLnV1aWRdID0gbGlzdGVuZXI7XG4gICAgb29neUxvZyhcImNvbnRyb2xsZXIgbWFuYWdlciA+IHJlZ2lzdGVyZWQgbmV3IGxpc3RlbmVyXCIsIGxpc3RlbmVyLCB0aGlzKTtcblxuICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGxpc3RlbmVyIGlmIGZvdW5kLCBvciBudWxsIGlmIG5vbmUgZm91bmRcbiAgICogQHBhcmFtIGxpc3RlbmVyXG4gICAqIEByZXR1cm5zXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihcbiAgICBsaXN0ZW5lcjogT29neUNvbnRyb2xsZXJMaXN0ZW5lclxuICApOiBPb2d5TnVsbGFibGU8T29neUNvbnRyb2xsZXJMaXN0ZW5lcj4ge1xuICAgIGlmICghbGlzdGVuZXIudXVpZCkge1xuICAgICAgb29neUVycm9yTG9nKFxuICAgICAgICBcIlVuYWJsZSB0byByZW1vdmUgbGlzdGVuZXIgYXMgaXQgaGFzIG5ldmVyIGhhZCBhIFVVSUQgYXNzaWduZWQgdG8gaXRcIlxuICAgICAgKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5saXN0ZW5lcnNbbGlzdGVuZXIudXVpZF0pIHtcbiAgICAgIG9vZ3lFcnJvckxvZyhcbiAgICAgICAgXCJVbmFibGUgdG8gcmVtb3ZlIGxpc3RlbmVyIGFzIG5vbmUgd2FzIGZvdW5kIG9uIHRoZSBtYW5hZ2VyXCJcbiAgICAgICk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBkZWxldGVkID0gdGhpcy5saXN0ZW5lcnNbbGlzdGVuZXIudXVpZF07XG4gICAgZGVsZXRlIHRoaXMubGlzdGVuZXJzW2xpc3RlbmVyLnV1aWRdO1xuXG4gICAgb29neUxvZyhcImNvbnRyb2xsZXIgbWFuYWdlciA+IHJlbW92ZWQgbGlzdGVuZXJcIiwgZGVsZXRlZCwgdGhpcyk7XG4gICAgcmV0dXJuIGRlbGV0ZWQ7XG4gIH1cblxuICBhZGRCbG9ja2luZ0xpc3RlbmVyKGxpc3RlbmVyOiBPb2d5Q29udHJvbGxlckJsb2NraW5nTGlzdGVuZXIpIHtcbiAgICBpZiAodGhpcy5ibG9ja2luZ0xpc3RlbmVyKSB7XG4gICAgICBvb2d5V2FybkxvZyhcbiAgICAgICAgXCJBbHJlYWR5IGhhcyBibG9ja2luZyBsaXN0ZW5lciwgdGhlIG9yaWdpbmFsIHdpbGwgYmUgZm9yZ290dGVuIHRvIHRoZSBzYW5kcyBvZiB0aW1lIG8ub1wiLFxuICAgICAgICB0aGlzLmJsb2NraW5nTGlzdGVuZXIsXG4gICAgICAgIGxpc3RlbmVyXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuYmxvY2tpbmdMaXN0ZW5lciA9IGxpc3RlbmVyO1xuICB9XG5cbiAgcmVtb3ZlQmxvY2tpbmdMaXN0ZW5lcigpOiBPb2d5TnVsbGFibGU8T29neUNvbnRyb2xsZXJCbG9ja2luZ0xpc3RlbmVyPiB7XG4gICAgY29uc3QgYmxvY2tpbmcgPSB0aGlzLmJsb2NraW5nTGlzdGVuZXI7XG4gICAgdGhpcy5ibG9ja2luZ0xpc3RlbmVyID0gbnVsbDtcbiAgICByZXR1cm4gYmxvY2tpbmc7XG4gIH1cblxuICBhZGRSaWdodENsaWNrTGlzdGVuZXIobGlzdGVuZXI6IE9vZ3lDb250cm9sbGVyUmlnaHRDbGlja0xpc3RlbmVyKSB7XG4gICAgaWYgKHRoaXMuZ2xvYmFsUmlnaHRDbGlja0xpc3RlbmVyKSB7XG4gICAgICBvb2d5V2FybkxvZyhcbiAgICAgICAgXCJBbHJlYWR5IGhhcyByaWdodCBjbGljayBsaXN0ZW5lciwgdGhlIG9yaWdpbmFsIHdpbGwgYmUgZm9yZ290dGVuIHRvIHRoZSBzYW5kcyBvZiB0aW1lIG8ub1wiLFxuICAgICAgICB0aGlzLmdsb2JhbFJpZ2h0Q2xpY2tMaXN0ZW5lcixcbiAgICAgICAgbGlzdGVuZXJcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5nbG9iYWxSaWdodENsaWNrTGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgfVxuXG4gIHJlbW92ZVJpZ2h0Q2xpY2tMaXN0ZW5lcigpOiBPb2d5TnVsbGFibGU8T29neUNvbnRyb2xsZXJSaWdodENsaWNrTGlzdGVuZXI+IHtcbiAgICBjb25zdCByaWdodENsaWNrID0gdGhpcy5nbG9iYWxSaWdodENsaWNrTGlzdGVuZXI7XG4gICAgdGhpcy5nbG9iYWxSaWdodENsaWNrTGlzdGVuZXIgPSBudWxsO1xuICAgIHJldHVybiByaWdodENsaWNrO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYgKHRoaXMua2V5Ym9hcmRBYm9ydENvbnRyb2xsZXIpIHtcbiAgICAgIHRoaXMuc3RvcCgpO1xuICAgIH1cblxuICAgIHRoaXMua2V5Ym9hcmRBYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgY29uc3QgbWFuYWdlciA9IHRoaXM7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwia2V5ZG93blwiLFxuICAgICAgKGV2ZW50KSA9PiB7XG4gICAgICAgIG1hbmFnZXIuaGFuZGxlS2V5dXAoZXZlbnQpO1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc2lnbmFsOiB0aGlzLmtleWJvYXJkQWJvcnRDb250cm9sbGVyLnNpZ25hbCxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgdGhpcy5nYW1lcGFkQ29ubmVjdGVkQWJvcnRDb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJnYW1lcGFkY29ubmVjdGVkXCIsXG4gICAgICAoZSkgPT4ge1xuICAgICAgICBtYW5hZ2VyLmhhbmRsZUdhbWVwYWRDb25uZWN0ZWQoZSk7XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBzaWduYWw6IHRoaXMuZ2FtZXBhZENvbm5lY3RlZEFib3J0Q29udHJvbGxlci5zaWduYWwsXG4gICAgICB9XG4gICAgKTtcblxuICAgIHRoaXMuZ2FtZXBhZERpc2Nvbm5lY3RlZEFib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwiZ2FtZXBhZGRpc2Nvbm5lY3RlZFwiLFxuICAgICAgKGUpID0+IHtcbiAgICAgICAgbWFuYWdlci5oYW5kbGVHYW1lcGFkRGlzY29ubmVjdGVkKGUpO1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc2lnbmFsOiB0aGlzLmdhbWVwYWREaXNjb25uZWN0ZWRBYm9ydENvbnRyb2xsZXIuc2lnbmFsLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb25zdCBoYW5kbGVSaWdodENsaWNrID0gKCkgPT4ge1xuICAgICAgaWYgKG1hbmFnZXIuZ2xvYmFsUmlnaHRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgIG1hbmFnZXIuZ2xvYmFsUmlnaHRDbGlja0xpc3RlbmVyLm9uUmlnaHRDbGljaygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB3aW5kb3cub25jb250ZXh0bWVudSA9ICgpID0+IHtcbiAgICAgIGhhbmRsZVJpZ2h0Q2xpY2soKTtcbiAgICAgIHJldHVybiBmYWxzZTsgLy8gcHJldmVudCB0cmFkaXRpb25hbCByaWdodCBjbGljayBkcm9wZG93biBpbiB3ZWIgYnJvd3NlcnNcbiAgICB9O1xuXG4gICAgd2luZG93LmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICBpZiAobWFuYWdlci5zaG91bGRTdG9wQWNjZXB0aW5nQ2xpY2tzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGUuYnV0dG9uICE9PSAyKSB7XG4gICAgICAgIC8vIGNoZWNrIGlmIHJpZ2h0IGNsaWNrXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaGFuZGxlUmlnaHRDbGljaygpO1xuICAgIH0pO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBjb25zdCBtYW5hZ2VyID0gdGhpcztcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZXZlbnQpID0+IHtcbiAgICAgIG1hbmFnZXIuaGFuZGxlS2V5dXAoZXZlbnQpO1xuICAgIH0pO1xuXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJnYW1lcGFkY29ubmVjdGVkXCIsIChlKSA9PiB7XG4gICAgICBtYW5hZ2VyLmhhbmRsZUdhbWVwYWRDb25uZWN0ZWQoZSk7XG4gICAgfSk7XG5cbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImdhbWVwYWRkaXNjb25uZWN0ZWRcIiwgKGUpID0+IHtcbiAgICAgIG1hbmFnZXIuaGFuZGxlR2FtZXBhZERpc2Nvbm5lY3RlZChlKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmtleWJvYXJkQWJvcnRDb250cm9sbGVyKSB7XG4gICAgICB0aGlzLmtleWJvYXJkQWJvcnRDb250cm9sbGVyLmFib3J0KCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZ2FtZXBhZENvbm5lY3RlZEFib3J0Q29udHJvbGxlcikge1xuICAgICAgdGhpcy5nYW1lcGFkQ29ubmVjdGVkQWJvcnRDb250cm9sbGVyLmFib3J0KCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZ2FtZXBhZERpc2Nvbm5lY3RlZEFib3J0Q29udHJvbGxlcikge1xuICAgICAgdGhpcy5nYW1lcGFkRGlzY29ubmVjdGVkQWJvcnRDb250cm9sbGVyLmFib3J0KCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlS2V5dXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgY29uc3Qga2V5TnVtYmVyID0gZXZlbnQua2V5Q29kZTtcbiAgICBpZiAoa2V5TnVtYmVyID09PSA2NSB8fCBrZXlOdW1iZXIgPT09IDM3KSB7XG4gICAgICAvLyBsZWZ0XG4gICAgICB0aGlzLmhhbmRsZU9vZ3lJbnB1dChPb2d5Q29udHJvbGxlcklucHV0LmxlZnQsIGV2ZW50KTtcbiAgICB9IGVsc2UgaWYgKGtleU51bWJlciA9PT0gNjggfHwga2V5TnVtYmVyID09PSAzOSkge1xuICAgICAgLy8gcmlnaHRcbiAgICAgIHRoaXMuaGFuZGxlT29neUlucHV0KE9vZ3lDb250cm9sbGVySW5wdXQucmlnaHQsIGV2ZW50KTtcbiAgICB9IGVsc2UgaWYgKGtleU51bWJlciA9PT0gODcgfHwga2V5TnVtYmVyID09PSAzOCkge1xuICAgICAgLy8gdXBcbiAgICAgIHRoaXMuaGFuZGxlT29neUlucHV0KE9vZ3lDb250cm9sbGVySW5wdXQudXAsIGV2ZW50KTtcbiAgICB9IGVsc2UgaWYgKGtleU51bWJlciA9PT0gNDAgfHwga2V5TnVtYmVyID09PSA4Mykge1xuICAgICAgLy8gZG93blxuICAgICAgdGhpcy5oYW5kbGVPb2d5SW5wdXQoT29neUNvbnRyb2xsZXJJbnB1dC5kb3duLCBldmVudCk7XG4gICAgfSBlbHNlIGlmIChrZXlOdW1iZXIgPT09IDEzIHx8IGtleU51bWJlciA9PT0gMzIpIHtcbiAgICAgIC8vIGVudGVyLCBzcGFjZVxuICAgICAgdGhpcy5oYW5kbGVPb2d5SW5wdXQoT29neUNvbnRyb2xsZXJJbnB1dC5hLCBldmVudCk7XG4gICAgfSBlbHNlIGlmIChrZXlOdW1iZXIgPT09IDgpIHtcbiAgICAgIC8vIGJhY2tzcGFjZVxuICAgICAgdGhpcy5oYW5kbGVPb2d5SW5wdXQoT29neUNvbnRyb2xsZXJJbnB1dC5iLCBldmVudCk7XG4gICAgfSBlbHNlIGlmIChrZXlOdW1iZXIgPT09IDI3KSB7XG4gICAgICAvLyBlc2NcbiAgICAgIHRoaXMuaGFuZGxlT29neUlucHV0KE9vZ3lDb250cm9sbGVySW5wdXQuc3RhcnQsIGV2ZW50KTtcbiAgICB9IGVsc2UgaWYgKGtleU51bWJlciA9PT0gOSkge1xuICAgICAgLy8gZ3VpZGVcbiAgICAgIHRoaXMuaGFuZGxlT29neUlucHV0KE9vZ3lDb250cm9sbGVySW5wdXQuZ3VpZGUsIGV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oYW5kbGVPb2d5SW5wdXQodW5kZWZpbmVkLCBldmVudCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlR2FtZXBhZENvbm5lY3RlZChldmVudDogR2FtZXBhZEV2ZW50KSB7XG4gICAgY29uc3QgZXZlbnRHYW1lcGFkID0gZXZlbnQuZ2FtZXBhZDtcblxuICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICBpZiAoZXZlbnRHYW1lcGFkLnZpYnJhdGlvbkFjdHVhdG9yKSB7XG4gICAgICAvLyBjb25zdCBoYXB0aWMgPSBldmVudEdhbWVwYWQuaGFwdGljQWN0dWF0b3JzWzBdO1xuICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgZXZlbnRHYW1lcGFkLnZpYnJhdGlvbkFjdHVhdG9yXG4gICAgICAgIC5wbGF5RWZmZWN0KFwiZHVhbC1ydW1ibGVcIiwge1xuICAgICAgICAgIHN0YXJ0RGVsYXk6IDAsXG4gICAgICAgICAgZHVyYXRpb246IDEwMCxcbiAgICAgICAgICB3ZWFrTWFnbml0dWRlOiAxLFxuICAgICAgICAgIHN0cm9uZ01hZ25pdHVkZTogMSxcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIG9vZ3lMb2coXCJTdWNjZXNzZnVsbHkgdmlicmF0ZWQgY29udHJvbGxlclwiKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlOiBhbnkpID0+IHtcbiAgICAgICAgICBvb2d5RXJyb3JMb2coXCJVbmFibGUgdG8gdmlicmF0ZSBjb250cm9sbGVyXCIsIGV2ZW50LCBlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgYnV0dG9uc1RvSWdub3JlSW5pdGlhbGx5OiBPb2d5Q29udHJvbGxlcklucHV0W10gPSBldmVudEdhbWVwYWQuYnV0dG9uc1xuICAgICAgLm1hcCgoYiwgaSkgPT4ge1xuICAgICAgICBjb25zdCBvb2d5SW5wdXQgPSB0aGlzLmdlbmVyYXRlT29neUNvbnRyb2xsZXJJbnB1dEZyb21CdXR0b25JbmRleChpKTtcbiAgICAgICAgaWYgKG9vZ3lJbnB1dCAmJiB0aGlzLmlzR2FtZXBhZEJ1dHRvblByZXNzZWQoYikpIHtcbiAgICAgICAgICAvLyBpZ25vcmUsIHByZXNzZWQgaW5pdGlhbGx5XG4gICAgICAgICAgcmV0dXJuIG9vZ3lJbnB1dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyB1bnJlY29nbml6ZWQgb3Igbm90IHByZXNzZWQgYnV0dG9uLCBkbyBub3RoaW5nXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuZmlsdGVyKChiKSA9PiBiICE9PSBudWxsKSBhcyBPb2d5Q29udHJvbGxlcklucHV0W107XG5cbiAgICBvb2d5TG9nKFxuICAgICAgXCJjb250cm9sbGVyIG1hbmFnZXIgPiBidXR0b25zVG9JZ25vcmVJbml0aWFsbHlcIixcbiAgICAgIGJ1dHRvbnNUb0lnbm9yZUluaXRpYWxseVxuICAgICk7XG5cbiAgICBjb25zdCBvb2d5R2FtZXBhZDogT29neUNvbnRyb2xsZXJHYW1lcGFkID0ge1xuICAgICAgc3RhdGU6IHtcbiAgICAgICAgaWdub3JlSW5wdXRzOiBidXR0b25zVG9JZ25vcmVJbml0aWFsbHksXG4gICAgICB9LFxuICAgICAgZ2FtZXBhZDogZXZlbnRHYW1lcGFkLFxuICAgIH07XG5cbiAgICB0aGlzLmdhbWVwYWRzW2V2ZW50R2FtZXBhZC5pZF0gPSBvb2d5R2FtZXBhZDtcblxuICAgIGlmICghdGhpcy5nYW1lcGFkUG9sbEludGVydmFsKSB7XG4gICAgICBjb25zdCBtYW5hZ2VyID0gdGhpcztcbiAgICAgIHRoaXMuZ2FtZXBhZFBvbGxJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgbWFuYWdlci5oYW5kbGVHYW1lcGFkUG9sbCgpO1xuICAgICAgfSwgdGhpcy5nYW1lcGFkUG9vbEludGVydmFsRGVsYXkpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUdhbWVwYWREaXNjb25uZWN0ZWQoZXZlbnQ6IEdhbWVwYWRFdmVudCkge1xuICAgIGNvbnN0IGV2ZW50R2FtZXBhZCA9IGV2ZW50LmdhbWVwYWQ7XG4gICAgY29uc3QgcHJldmlvdXNseUhhZENvbm5lY3RlZCA9IHRoaXMuZ2FtZXBhZHNbZXZlbnRHYW1lcGFkLmlkXSAhPT0gdW5kZWZpbmVkO1xuICAgIGRlbGV0ZSB0aGlzLmdhbWVwYWRzW2V2ZW50R2FtZXBhZC5pZF07XG5cbiAgICBpZiAoT2JqZWN0LmtleXModGhpcy5nYW1lcGFkcykubGVuZ3RoIDwgMSkge1xuICAgICAgaWYgKHRoaXMuZ2FtZXBhZFBvbGxJbnRlcnZhbCkge1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuZ2FtZXBhZFBvbGxJbnRlcnZhbCk7XG4gICAgICAgIHRoaXMuZ2FtZXBhZFBvbGxJbnRlcnZhbCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByZXZpb3VzbHlIYWRDb25uZWN0ZWQpIHtcbiAgICAgIHRoaXMubW9kZWwub25Db250cm9sbGVyRGlzY29ubmVjdGVkKGV2ZW50R2FtZXBhZCk7XG4gICAgfVxuICB9XG5cbiAgaXNHYW1lcGFkQnV0dG9uUHJlc3NlZChnYW1lcGFkQnV0dG9uOiBhbnkpIHtcbiAgICBpZiAodHlwZW9mIGdhbWVwYWRCdXR0b24gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHJldHVybiBnYW1lcGFkQnV0dG9uLnByZXNzZWQ7XG4gICAgfVxuICAgIHJldHVybiBnYW1lcGFkQnV0dG9uID09PSAxLjA7XG4gIH1cblxuICBnZW5lcmF0ZU9vZ3lDb250cm9sbGVySW5wdXRGcm9tQnV0dG9uSW5kZXgoXG4gICAgaW5kZXg6IG51bWJlclxuICApOiBPb2d5TnVsbGFibGU8T29neUNvbnRyb2xsZXJJbnB1dD4ge1xuICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgcmV0dXJuIE9vZ3lDb250cm9sbGVySW5wdXQuYTtcbiAgICB9IGVsc2UgaWYgKGluZGV4ID09PSAxKSB7XG4gICAgICByZXR1cm4gT29neUNvbnRyb2xsZXJJbnB1dC5iO1xuICAgIH0gZWxzZSBpZiAoaW5kZXggPT09IDE0KSB7XG4gICAgICByZXR1cm4gT29neUNvbnRyb2xsZXJJbnB1dC5sZWZ0O1xuICAgIH0gLy8gcHM0XG4gICAgZWxzZSBpZiAoaW5kZXggPT09IDE1KSB7XG4gICAgICByZXR1cm4gT29neUNvbnRyb2xsZXJJbnB1dC5yaWdodDtcbiAgICB9IC8vIHBzNFxuICAgIGVsc2UgaWYgKGluZGV4ID09PSAxMikge1xuICAgICAgcmV0dXJuIE9vZ3lDb250cm9sbGVySW5wdXQudXA7XG4gICAgfSAvLyBwczRcbiAgICBlbHNlIGlmIChpbmRleCA9PT0gMTMpIHtcbiAgICAgIHJldHVybiBPb2d5Q29udHJvbGxlcklucHV0LmRvd247XG4gICAgfSAvLyBwczRcbiAgICBlbHNlIGlmIChpbmRleCA9PT0gOSB8fCBpbmRleCA9PT0gOCB8fCBpbmRleCA9PT0gMTcgfHwgaW5kZXggPT09IDE2KSB7XG4gICAgICByZXR1cm4gT29neUNvbnRyb2xsZXJJbnB1dC5zdGFydDtcbiAgICB9IGVsc2UgaWYgKGluZGV4ID09PSAxNikge1xuICAgICAgcmV0dXJuIE9vZ3lDb250cm9sbGVySW5wdXQuZ3VpZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGdlbmVyYXRlT29neUNvbnRyb2xsZXJJbnB1dEZyb21BeGVzKFxuICAgIGF4ZXNJbmRleDogbnVtYmVyLFxuICAgIGF4ZXNWYWw6IG51bWJlclxuICApOiBPb2d5Q29udHJvbGxlcklucHV0IHwgbnVsbCB7XG4gICAgaWYgKGF4ZXNJbmRleCA9PT0gMCkge1xuICAgICAgLy8gbGVmdCByaWdodFxuICAgICAgaWYgKGF4ZXNWYWwgPCAtMC45KSB7XG4gICAgICAgIC8vIGxlZnRcbiAgICAgICAgcmV0dXJuIE9vZ3lDb250cm9sbGVySW5wdXQubGVmdDtcbiAgICAgIH0gZWxzZSBpZiAoYXhlc1ZhbCA+IDAuOSkge1xuICAgICAgICAvLyByaWdodFxuICAgICAgICByZXR1cm4gT29neUNvbnRyb2xsZXJJbnB1dC5yaWdodDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGF4ZXNJbmRleCA9PT0gMSkge1xuICAgICAgLy8gdXAgZG93blxuICAgICAgaWYgKGF4ZXNWYWwgPCAtMC45KSB7XG4gICAgICAgIC8vIHVwXG4gICAgICAgIHJldHVybiBPb2d5Q29udHJvbGxlcklucHV0LnVwO1xuICAgICAgfSBlbHNlIGlmIChheGVzVmFsID4gMC45KSB7XG4gICAgICAgIC8vIGRvd25cbiAgICAgICAgcmV0dXJuIE9vZ3lDb250cm9sbGVySW5wdXQuZG93bjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGhhbmRsZUdhbWVwYWRQb2xsKCkge1xuICAgIGNvbnN0IGN1cnJHYW1lcGFkcyA9IEFycmF5LmZyb20obmF2aWdhdG9yLmdldEdhbWVwYWRzKCkpO1xuICAgIGNvbnN0IG9vZ3lHYW1lcGFkcyA9IE9iamVjdC52YWx1ZXModGhpcy5nYW1lcGFkcyk7XG4gICAgZm9yIChjb25zdCBvb2d5R2FtZXBhZFRvRmluZCBvZiBvb2d5R2FtZXBhZHMpIHtcbiAgICAgIGNvbnN0IG1hdGNoaW5nR2FtZXBhZHMgPSBjdXJyR2FtZXBhZHMuZmlsdGVyKFxuICAgICAgICAoZykgPT4gZyAmJiBnLmlkID09PSBvb2d5R2FtZXBhZFRvRmluZC5nYW1lcGFkLmlkXG4gICAgICApO1xuICAgICAgaWYgKCFtYXRjaGluZ0dhbWVwYWRzIHx8IG1hdGNoaW5nR2FtZXBhZHMubGVuZ3RoIDwgMSkge1xuICAgICAgICAvLyB3ZSBuZXZlciByZWNlaXZlZCBkaXNjb25uZWN0IGV2ZW50LCBCVVQgd2UgYWxzbyBjYW5ub3QgZmluZCB0aGlzIGdhbWVwYWQgaW4gdGhlIGN1cnIgY29ubmVjdGVkIGxpc3Q7c2tpcFxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb29neUdhbWVwYWQ6IE9vZ3lDb250cm9sbGVyR2FtZXBhZCA9IHtcbiAgICAgICAgZ2FtZXBhZDogbWF0Y2hpbmdHYW1lcGFkc1swXSEsXG4gICAgICAgIHN0YXRlOiBvb2d5R2FtZXBhZFRvRmluZC5zdGF0ZSxcbiAgICAgIH07XG5cbiAgICAgIC8vIGNoZWNrIGJ1dHRvbiB2YWx1ZXNcbiAgICAgIGNvbnN0IGdhbWVwYWRTdGF0ZTogT29neUNvbnRyb2xsZXJHYW1lcGFkU3RhdGUgPSBvb2d5R2FtZXBhZC5zdGF0ZVxuICAgICAgICA/IG9vZ3lHYW1lcGFkLnN0YXRlXG4gICAgICAgIDogeyBpZ25vcmVJbnB1dHM6IFtdIH07XG4gICAgICBjb25zdCBuZXdHYW1lcGFkU3RhdGU6IE9vZ3lDb250cm9sbGVyR2FtZXBhZFN0YXRlID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAge30sXG4gICAgICAgIGdhbWVwYWRTdGF0ZVxuICAgICAgKTtcblxuICAgICAgLy8gbGVmdCwgdXAsIGRvd24sIHJpZ2h0IGF4ZXNcbiAgICAgIC8vIG9vZ3lMb2coXCJheGVzXCIsIG9vZ3lHYW1lcGFkLmdhbWVwYWQuYXhlcyk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9vZ3lHYW1lcGFkLmdhbWVwYWQuYXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBheGVzID0gb29neUdhbWVwYWQuZ2FtZXBhZC5heGVzW2ldO1xuICAgICAgICBjb25zdCBvb2d5SW5wdXQgPSB0aGlzLmdlbmVyYXRlT29neUNvbnRyb2xsZXJJbnB1dEZyb21BeGVzKGksIGF4ZXMpO1xuXG4gICAgICAgIGlmICghb29neUlucHV0KSB7XG4gICAgICAgICAgbmV3R2FtZXBhZFN0YXRlLmlnbm9yZUlucHV0cyA9IG5ld0dhbWVwYWRTdGF0ZS5pZ25vcmVJbnB1dHMuZmlsdGVyKFxuICAgICAgICAgICAgKGkpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICBpICE9PSBPb2d5Q29udHJvbGxlcklucHV0LmRvd24gJiZcbiAgICAgICAgICAgICAgICBpICE9PSBPb2d5Q29udHJvbGxlcklucHV0LnVwICYmXG4gICAgICAgICAgICAgICAgaSAhPT0gT29neUNvbnRyb2xsZXJJbnB1dC5sZWZ0ICYmXG4gICAgICAgICAgICAgICAgaSAhPT0gT29neUNvbnRyb2xsZXJJbnB1dC5yaWdodFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGdhbWVwYWRTdGF0ZS5pZ25vcmVJbnB1dHMuaW5jbHVkZXMob29neUlucHV0KSkge1xuICAgICAgICAgICAgLy8gaWdub3JlLCBwcmVzc2VkIGFuZCBzdGlsbCBwcmVzc2VkXG4gICAgICAgICAgICBuZXdHYW1lcGFkU3RhdGUuaWdub3JlSW5wdXRzID0gbmV3R2FtZXBhZFN0YXRlLmlnbm9yZUlucHV0cy5jb25jYXQoW1xuICAgICAgICAgICAgICBvb2d5SW5wdXQsXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3R2FtZXBhZFN0YXRlLmlnbm9yZUlucHV0cyA9IG5ld0dhbWVwYWRTdGF0ZS5pZ25vcmVJbnB1dHMuY29uY2F0KFtcbiAgICAgICAgICAgICAgb29neUlucHV0LFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUdhbWVwYWRQb2xsUmVjb2duaXplZElucHV0KG9vZ3lJbnB1dCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGEsIGIsIHN0YXJ0IGJ1dHRvbnNcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb29neUdhbWVwYWQuZ2FtZXBhZC5idXR0b25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IG9vZ3lHYW1lcGFkLmdhbWVwYWQuYnV0dG9uc1tpXTtcbiAgICAgICAgY29uc3Qgb29neUlucHV0ID0gdGhpcy5nZW5lcmF0ZU9vZ3lDb250cm9sbGVySW5wdXRGcm9tQnV0dG9uSW5kZXgoaSk7XG5cbiAgICAgICAgaWYgKCFvb2d5SW5wdXQpIHtcbiAgICAgICAgICAvLyB1bnJlY29nbml6ZWQgYnV0dG9uLCBkbyBub3RoaW5nXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0dhbWVwYWRCdXR0b25QcmVzc2VkKGJ1dHRvbikpIHtcbiAgICAgICAgICBpZiAoZ2FtZXBhZFN0YXRlLmlnbm9yZUlucHV0cy5pbmNsdWRlcyhvb2d5SW5wdXQpKSB7XG4gICAgICAgICAgICAvLyBpZ25vcmUsIHByZXNzZWQgYW5kIHN0aWxsIHByZXNzZWRcbiAgICAgICAgICAgIG5ld0dhbWVwYWRTdGF0ZS5pZ25vcmVJbnB1dHMgPSBuZXdHYW1lcGFkU3RhdGUuaWdub3JlSW5wdXRzLmNvbmNhdChbXG4gICAgICAgICAgICAgIG9vZ3lJbnB1dCxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBmaXJlIGV2ZW50ISBhbmQgYWRkIHRvIGlnbm9yZSBzZXRcbiAgICAgICAgICAgIG5ld0dhbWVwYWRTdGF0ZS5pZ25vcmVJbnB1dHMgPSBuZXdHYW1lcGFkU3RhdGUuaWdub3JlSW5wdXRzLmNvbmNhdChbXG4gICAgICAgICAgICAgIG9vZ3lJbnB1dCxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVHYW1lcGFkUG9sbFJlY29nbml6ZWRJbnB1dChvb2d5SW5wdXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZ2FtZXBhZFN0YXRlLmlnbm9yZUlucHV0cy5pbmNsdWRlcyhvb2d5SW5wdXQpKSB7XG4gICAgICAgICAgICAvLyBpZ25vcmluZywgYnV0IG5vIGxvbmdlciBwcmVzc2VkLCBzbyBzdG9wIGlnbm9yaW5nXG4gICAgICAgICAgICBuZXdHYW1lcGFkU3RhdGUuaWdub3JlSW5wdXRzID0gbmV3R2FtZXBhZFN0YXRlLmlnbm9yZUlucHV0cy5maWx0ZXIoXG4gICAgICAgICAgICAgIChpKSA9PiBpICE9PSBvb2d5SW5wdXRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHNhdmUgbW9zdCB1cCB0byBkYXRlIGdhbWVwYWQgYW5kIHN0YXRlLCBib3RoIG9mIHdoaWNoIG1vc3QgbGlrZWx5XG4gICAgICAvLyBqdXN0IGNoYW5nZWQgKGdhbWVwYWQgaXMgbmV3IG9iamVjdCBldmVyeSBldmVudCBmaXJlIGJhc2VkIG9uIEhUTUw1LFxuICAgICAgLy8gYW5kIHRoZW4gc3RhdGUgaXMgbmV3IG9iamVjdCBiYXNlZCBvbiBpZiB3ZSBzZW50IGV2ZW50IHRvIHJlY2VpdmVyL2xpc3RlbmVyIHlldClcbiAgICAgIG9vZ3lHYW1lcGFkLnN0YXRlID0gbmV3R2FtZXBhZFN0YXRlO1xuICAgICAgdGhpcy5nYW1lcGFkc1tvb2d5R2FtZXBhZFRvRmluZC5nYW1lcGFkLmlkXSA9IG9vZ3lHYW1lcGFkO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUdhbWVwYWRQb2xsUmVjb2duaXplZElucHV0KGlucHV0OiBPb2d5Q29udHJvbGxlcklucHV0KSB7XG4gICAgdGhpcy5oYW5kbGVPb2d5SW5wdXQoaW5wdXQpO1xuICB9XG5cbiAgaGFuZGxlT29neUlucHV0KGlucHV0PzogT29neUNvbnRyb2xsZXJJbnB1dCwga2V5Ym9hcmRFdmVudD86IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAodGhpcy5ibG9ja2luZ0xpc3RlbmVyICYmIGlucHV0KSB7XG4gICAgICBjb25zdCBzaG91bGRCbG9jayA9XG4gICAgICAgIHRoaXMuYmxvY2tpbmdMaXN0ZW5lci5pbnRlcmNlcHRDb250cm9sbGVySW5wdXRBbmRCbG9jayhpbnB1dCk7XG4gICAgICBpZiAoc2hvdWxkQmxvY2spIHtcbiAgICAgICAgb29neUxvZyhcbiAgICAgICAgICBcIkJsb2NraW5nIGFsbCBvdGhlciBsaXN0ZW5lcnMgYXMgYmxvY2tpbmdMaXN0ZW5lciBoYXMgcHJpb3JpdHlcIixcbiAgICAgICAgICB0aGlzXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ZW5lcnMgPSBPYmplY3QudmFsdWVzKHRoaXMubGlzdGVuZXJzKTtcbiAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIGxpc3RlbmVycykge1xuICAgICAgaWYgKGxpc3RlbmVyLmRlYWN0aXZhdGVkID09PSB0cnVlKSB7XG4gICAgICAgIG9vZ3lMb2coXG4gICAgICAgICAgXCJjb250cm9sbGVyIG1hbmFnZXIgPiBsaXN0ZW5lciBtYW51YWxseSBkZWFjdGl2YXRlZCBzbyBzdXBwcmVzc2luZyBpbnB1dFwiLFxuICAgICAgICAgIGxpc3RlbmVyLFxuICAgICAgICAgIGlucHV0XG4gICAgICAgICk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoa2V5Ym9hcmRFdmVudCAmJiBsaXN0ZW5lci5pbnRlcmNlcHRLZXlib2FyZElucHV0KSB7XG4gICAgICAgIG9vZ3lMb2coXG4gICAgICAgICAgXCJjb250cm9sbGVyIG1hbmFnZXIgPiBsaXN0ZW5lciBtYW51YWxseSBoYW5kbGluZyBrZXlib2FyZCwgc28gaWdub3JpbmcgdGhpcyB0cmlnZ2VyXCJcbiAgICAgICAgKTtcblxuICAgICAgICBsaXN0ZW5lci5pbnRlcmNlcHRLZXlib2FyZElucHV0KGtleWJvYXJkRXZlbnQpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpbnB1dCkge1xuICAgICAgICBvb2d5TG9nKFxuICAgICAgICAgIFwiY29udHJvbGxlciBtYW5hZ2VyID4gdW5yZWNvZ25pemVkIGlucHV0IGFuZCBkaWQgbm90IGludGVyY2VwdCBmb3Iga2V5Ym9hcmRcIixcbiAgICAgICAgICBsaXN0ZW5lcixcbiAgICAgICAgICBrZXlib2FyZEV2ZW50XG4gICAgICAgICk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsaXN0ZW5lci5vbkNvbnRyb2xsZXJJbnB1dChpbnB1dCk7XG4gICAgfVxuICB9XG5cbiAgLy8gZ2V0QW5hbG9nU3RpY2tEaXJlY3Rpb24oYXhlczogbnVtYmVyKTogT29neUdhbWVwYWRBbmFsb2dTdGlja0RpcmVjdGlvbiB7XG4gIC8vICAgICBpZiAoIW5hdmlnYXRvci5nZXRHYW1lcGFkcygpKSB7XG4gIC8vICAgICAgICAgcmV0dXJuIG51bGw7XG4gIC8vICAgICB9XG5cbiAgLy8gICAgIGlmIChuYXZpZ2F0b3IuZ2V0R2FtZXBhZHMoKS5sZW5ndGggPCAxKSB7XG4gIC8vICAgICAgICAgcmV0dXJuIG51bGw7XG4gIC8vICAgICB9XG5cbiAgLy8gICAgIGNvbnN0IGdhbWVwYWQgPSBuYXZpZ2F0b3IuZ2V0R2FtZXBhZHMoKVswXTtcbiAgLy8gICAgIGNvbnN0IGF4ZXNPZmZzZXQgPSBnYW1lcGFkLmF4ZXNbYXhlc107XG5cbiAgLy8gICAgIGxldCBzdGlja0RpcmVjdGlvbjogT29neUdhbWVwYWRBbmFsb2dTdGlja0RpcmVjdGlvbiA9IHt9O1xuXG4gIC8vICAgICBpZiAoYXhlc09mZnNldCA8IC0wLjUpIHtcbiAgLy8gICAgICAgICBzdGlja0RpcmVjdGlvbi5sZWZ0ID0gdHJ1ZTtcbiAgLy8gICAgICAgICBzdGlja0RpcmVjdGlvbi5yaWdodCA9IGZhbHNlO1xuICAvLyAgICAgfSBlbHNlIGlmKGF4ZXNPZmZzZXQgPiAwLjUpIHtcbiAgLy8gICAgICAgICBzdGlja0RpcmVjdGlvbi5sZWZ0ID0gZmFsc2U7XG4gIC8vICAgICAgICAgc3RpY2tEaXJlY3Rpb24ucmlnaHQgPSB0cnVlO1xuICAvLyAgICAgfSBlbHNlIHtcbiAgLy8gICAgICAgICBzdGlja0RpcmVjdGlvbi5sZWZ0ID0gZmFsc2U7XG4gIC8vICAgICAgICAgc3RpY2tEaXJlY3Rpb24ucmlnaHQgPSBmYWxzZTtcbiAgLy8gICAgIH1cblxuICAvLyAgICAgY29uc3QgcmVzcG9uc2U6IE9vZ3lHYW1lcGFkQW5hbG9nU3RpY2tEaXJlY3Rpb24gPSBzdGlja0RpcmVjdGlvbjtcbiAgLy8gICAgIHJldHVybiByZXNwb25zZTtcbiAgLy8gfVxuXG4gIC8vIGFkZEV2ZW50TGlzdGVuZXIoYnV0dG9uOiBPb2d5R2FtZXBhZEJ1dHRvbiwgaGFuZGxlcjogKCkgPT4gdm9pZCkge1xuXG4gIC8vICAgICAkKHdpbmRvdykub24oXCJnYW1lcGFkY29ubmVjdGVkXCIsICgpID0+IHtcblxuICAvLyAgICAgICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgLy8gICAgICAgICAgICAgY29uc3QgbGVmdFN0aWNrRGlyZWN0aW9uID0gdGhpcy5nZXRBbmFsb2dTdGlja0RpcmVjdGlvbigwKTtcbiAgLy8gICAgICAgICAgICAgaWYgKGxlZnRTdGlja0RpcmVjdGlvbi5sZWZ0KSB7XG4gIC8vICAgICAgICAgICAgICAgICBpZiAoYnV0dG9uID09PSBPb2d5R2FtZXBhZEJ1dHRvbi51cCkge1xuICAvLyAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoKTtcbiAgLy8gICAgICAgICAgICAgICAgIH1cbiAgLy8gICAgICAgICAgICAgfSBlbHNlIGlmIChsZWZ0U3RpY2tEaXJlY3Rpb24ucmlnaHQpIHtcbiAgLy8gICAgICAgICAgICAgICAgIGlmIChidXR0b24gPT09IE9vZ3lHYW1lcGFkQnV0dG9uLmRvd24pIHtcbiAgLy8gICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKCk7XG4gIC8vICAgICAgICAgICAgICAgICB9XG4gIC8vICAgICAgICAgICAgIH1cbiAgLy8gICAgICAgICB9LCAxMDApO1xuXG4gIC8vICAgICB9KTtcblxuICAvLyAkKHdpbmRvdykub24oXCJnYW1lcGFkY29ubmVjdGVkXCIsIGZ1bmN0aW9uKCkge1xuXG4gIC8vICQod2luZG93KS5vbihcImdhbWVwYWRkaXNjb25uZWN0ZWRcIiwgZnVuY3Rpb24oKSB7XG5cbiAgLy8gfSk7XG5cbiAgLy8gfVxufVxuIiwiY29uc3Qga09vZ3lJc0RlYnVnID0gdHJ1ZTtcblxudHlwZSBPb2d5TG9nVHlwZSA9IChtc2c6IHN0cmluZywgLi4uYXJnczogYW55W10pID0+IHZvaWQ7XG5cbi8qKlxuICogSW50ZXJuYWwgZGVidWcgbG9nIGZvciBPb2d5IGdhbWU7IGN1cnJlbnRseSB1c2VzIGNvbnNvbGUubG9nIGJ1dCBpcyBtZWFudCB0byB1c2UgYSBtb3JlIHNvcGhpc3RpY2F0ZWQgbG9nZ2luZyBzeXN0ZW0gd2hlbiBhdmFpbGFibGUuXG4gKiBAcGFyYW0gbXNnIEFueSBzdHJpbmcgbWVzc2FnZSB0byB1c2UgYXMgZmlyc3QgcGFyYW1cbiAqIEBwYXJhbSBhcmdzIEluZGV0ZXJtaW5lbHkgbG9uZyBsaXN0IG9mIGFyZ3VtZW50cyB0byBwYXNzIHRvIGNvbnNvbGUubG9nXG4gKi9cbmxldCBvb2d5TG9nOiBPb2d5TG9nVHlwZSwgb29neUVycm9yTG9nOiBPb2d5TG9nVHlwZSwgb29neVdhcm5Mb2c6IE9vZ3lMb2dUeXBlO1xuXG5jb25zdCBrT29neUxvZ0ZvbnRTaXplID0gXCI4cHhcIjtcblxuLy8gaWYgKGtPb2d5SXNEZWJ1Zykge1xuLy8gd2luZG93LmRlYnVnID0gd2luZG93LmNvbnNvbGUubG9nLmJpbmQod2luZG93LmNvbnNvbGUsICclczogJXMnKTtcblxub29neUxvZyA9IChtc2csIC4uLmFyZ3MpID0+IHtcbiAgdHJ5IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJPb2d5TG9nRXJyb3JcIik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zdCBvb2d5TG9nQ1NTID0gYGZvbnQtc2l6ZTogJHtrT29neUxvZ0ZvbnRTaXplfTsgY29sb3I6ICM5QkFDRjE7YDtcblxuICAgIGNvbnN0IGNhbGxlZSA9IGUuc3RhY2suc3BsaXQoXCJcXG5cIilbMl0udHJpbSgpO1xuICAgIGNvbnNvbGUubG9nKFxuICAgICAgYCVjJHttc2d9XFxuPiAke25ldyBEYXRlKCkudG9JU09TdHJpbmcoKX0gJHtjYWxsZWV9YCxcbiAgICAgIG9vZ3lMb2dDU1MsXG4gICAgICAuLi5hcmdzXG4gICAgKTtcbiAgfVxufTtcblxub29neUVycm9yTG9nID0gKG1zZywgLi4uYXJncykgPT4ge1xuICB0cnkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk9vZ3lMb2dFcnJvclwiKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnN0IG9vZ3lMb2dDU1MgPSBgZm9udC1zaXplOiAke2tPb2d5TG9nRm9udFNpemV9OyBjb2xvcjogI2ZmZjsgYmFja2dyb3VuZDogdG9tYXRvO2A7XG5cbiAgICBjb25zdCBjYWxsZWUgPSBlLnN0YWNrLnNwbGl0KFwiXFxuXCIpWzJdLnRyaW0oKTtcbiAgICBjb25zb2xlLmVycm9yKFxuICAgICAgYCVjJHttc2d9XFxuPiAke25ldyBEYXRlKCkudG9JU09TdHJpbmcoKX0gJHtjYWxsZWV9YCxcbiAgICAgIG9vZ3lMb2dDU1MsXG4gICAgICAuLi5hcmdzXG4gICAgKTtcbiAgfVxufTtcblxub29neVdhcm5Mb2cgPSAobXNnLCAuLi5hcmdzKSA9PiB7XG4gIHRyeSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiT29neUxvZ0Vycm9yXCIpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc3Qgb29neUxvZ0NTUyA9IGBmb250LXNpemU6ICR7a09vZ3lMb2dGb250U2l6ZX07IGNvbG9yOiAjZmZmOyBiYWNrZ3JvdW5kOiBnb2xkZW5yb2Q7YDtcblxuICAgIGNvbnN0IGNhbGxlZSA9IGUuc3RhY2suc3BsaXQoXCJcXG5cIilbMl0udHJpbSgpO1xuICAgIGNvbnNvbGUud2FybihcbiAgICAgIGAlYyR7bXNnfVxcbj4gJHtuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9ICR7Y2FsbGVlfWAsXG4gICAgICBvb2d5TG9nQ1NTLFxuICAgICAgLi4uYXJnc1xuICAgICk7XG4gIH1cbn07XG5cbi8vIH0gZWxzZSB7XG4vLyAgICAgb29neUxvZyA9ICgpID0+IHsgfTtcbi8vICAgICBvb2d5RXJyb3JMb2cgPSAoKSA9PiB7IH07XG4vLyAgICAgb29neVdhcm5Mb2cgPSAoKSA9PiB7IH07XG4vLyB9XG5cbmV4cG9ydCB7IGtPb2d5SXNEZWJ1Zywgb29neUxvZywgb29neUVycm9yTG9nLCBvb2d5V2FybkxvZyB9O1xuIiwiZXhwb3J0IGludGVyZmFjZSBPb2d5TW9kZXJuQ3J5cHRvQnJvd3NlciB7XG4gIHJhbmRvbVVVSUQ6ICgpID0+IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIE9vZ3lVVUlEQnVpbGRlciB7XG4gIHN0YXRpYyByYW5kb21VVUlEKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICh3aW5kb3cuY3J5cHRvIGFzIHVua25vd24gYXMgT29neU1vZGVybkNyeXB0b0Jyb3dzZXIpLnJhbmRvbVVVSUQoKTtcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBPb2d5Q29udHJvbGxlck1hbmFnZXIgfSBmcm9tIFwiLi9Pb2d5Q29udHJvbGxlck1hbmFnZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgeyBPb2d5Q29udHJvbGxlck1hbmFnZXIgfTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==