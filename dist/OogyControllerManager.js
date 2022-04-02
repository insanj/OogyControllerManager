export var OogyControllerManager;
(function (OogyControllerManager_1) {
    let oogyLog, oogyErrorLog, oogyWarnLog;
    const kOogyLogFontSize = "8px";
    oogyLog = (msg, ...args) => {
        try {
            throw new Error("OogyLogError");
        }
        catch (e) {
            const oogyLogCSS = `font-size: ${kOogyLogFontSize}; color: #9BACF1;`;
            const callee = e.stack.split("\n")[2].trim();
            console.log(`%c${msg}\n> ${new Date().toISOString()} ${callee}`, oogyLogCSS, ...args);
        }
    };
    oogyErrorLog = (msg, ...args) => {
        try {
            throw new Error("OogyLogError");
        }
        catch (e) {
            const oogyLogCSS = `font-size: ${kOogyLogFontSize}; color: #fff; background: tomato;`;
            const callee = e.stack.split("\n")[2].trim();
            console.error(`%c${msg}\n> ${new Date().toISOString()} ${callee}`, oogyLogCSS, ...args);
        }
    };
    oogyWarnLog = (msg, ...args) => {
        try {
            throw new Error("OogyLogError");
        }
        catch (e) {
            const oogyLogCSS = `font-size: ${kOogyLogFontSize}; color: #fff; background: goldenrod;`;
            const callee = e.stack.split("\n")[2].trim();
            console.warn(`%c${msg}\n> ${new Date().toISOString()} ${callee}`, oogyLogCSS, ...args);
        }
    };
    class OogyUUIDBuilder {
        static randomUUID() {
            return window.crypto.randomUUID();
        }
    }
    OogyControllerManager_1.OogyUUIDBuilder = OogyUUIDBuilder;
    let OogyControllerInput;
    (function (OogyControllerInput) {
        OogyControllerInput["up"] = "up";
        OogyControllerInput["down"] = "down";
        OogyControllerInput["right"] = "right";
        OogyControllerInput["left"] = "left";
        OogyControllerInput["a"] = "a";
        OogyControllerInput["b"] = "b";
        OogyControllerInput["start"] = "start";
        OogyControllerInput["guide"] = "guide";
    })(OogyControllerInput = OogyControllerManager_1.OogyControllerInput || (OogyControllerManager_1.OogyControllerInput = {}));
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
                listener.uuid = OogyUUIDBuilder.randomUUID();
            }
            if (this.listeners[listener.uuid]) {
                oogyErrorLog("!!! Strange situation where we already have added this listener??? We won't be able to remove it later because only 1 per UUID can exist on the manager... check we haven't added the same listener twice somehow!!", this);
            }
            this.listeners[listener.uuid] = listener;
            oogyLog("controller manager > registered new listener", listener, this);
            return listener;
        }
        removeListener(listener) {
            if (!listener.uuid) {
                oogyErrorLog("Unable to remove listener as it has never had a UUID assigned to it");
                return null;
            }
            if (!this.listeners[listener.uuid]) {
                oogyErrorLog("Unable to remove listener as none was found on the manager");
                return null;
            }
            const deleted = this.listeners[listener.uuid];
            delete this.listeners[listener.uuid];
            oogyLog("controller manager > removed listener", deleted, this);
            return deleted;
        }
        addBlockingListener(listener) {
            if (this.blockingListener) {
                oogyWarnLog("Already has blocking listener, the original will be forgotten to the sands of time o.o", this.blockingListener, listener);
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
                oogyWarnLog("Already has right click listener, the original will be forgotten to the sands of time o.o", this.globalRightClickListener, listener);
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
                signal: this.keyboardAbortController.signal,
            });
            this.gamepadConnectedAbortController = new AbortController();
            window.addEventListener("gamepadconnected", (e) => {
                manager.handleGamepadConnected(e);
            }, {
                signal: this.gamepadConnectedAbortController.signal,
            });
            this.gamepadDisconnectedAbortController = new AbortController();
            window.addEventListener("gamepaddisconnected", (e) => {
                manager.handleGamepadDisconnected(e);
            }, {
                signal: this.gamepadDisconnectedAbortController.signal,
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
                this.handleOogyInput(OogyControllerInput.left, event);
            }
            else if (keyNumber === 68 || keyNumber === 39) {
                this.handleOogyInput(OogyControllerInput.right, event);
            }
            else if (keyNumber === 87 || keyNumber === 38) {
                this.handleOogyInput(OogyControllerInput.up, event);
            }
            else if (keyNumber === 40 || keyNumber === 83) {
                this.handleOogyInput(OogyControllerInput.down, event);
            }
            else if (keyNumber === 13 || keyNumber === 32) {
                this.handleOogyInput(OogyControllerInput.a, event);
            }
            else if (keyNumber === 8) {
                this.handleOogyInput(OogyControllerInput.b, event);
            }
            else if (keyNumber === 27) {
                this.handleOogyInput(OogyControllerInput.start, event);
            }
            else if (keyNumber === 9) {
                this.handleOogyInput(OogyControllerInput.guide, event);
            }
            else {
                this.handleOogyInput(undefined, event);
            }
        }
        handleGamepadConnected(event) {
            const eventGamepad = event.gamepad;
            if (eventGamepad.vibrationActuator) {
                eventGamepad.vibrationActuator
                    .playEffect("dual-rumble", {
                    startDelay: 0,
                    duration: 100,
                    weakMagnitude: 1,
                    strongMagnitude: 1,
                })
                    .then(() => {
                    oogyLog("Successfully vibrated controller");
                })
                    .catch((e) => {
                    oogyErrorLog("Unable to vibrate controller", event, e);
                });
            }
            const buttonsToIgnoreInitially = eventGamepad.buttons
                .map((b, i) => {
                const oogyInput = this.generateOogyControllerInputFromButtonIndex(i);
                if (oogyInput && this.isGamepadButtonPressed(b)) {
                    return oogyInput;
                }
                else {
                    return null;
                }
            })
                .filter((b) => b !== null);
            oogyLog("controller manager > buttonsToIgnoreInitially", buttonsToIgnoreInitially);
            const oogyGamepad = {
                state: {
                    ignoreInputs: buttonsToIgnoreInitially,
                },
                gamepad: eventGamepad,
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
            const previouslyHadConnected = this.gamepads[eventGamepad.id] !== undefined;
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
            return gamepadButton === 1.0;
        }
        generateOogyControllerInputFromButtonIndex(index) {
            if (index === 0) {
                return OogyControllerInput.a;
            }
            else if (index === 1) {
                return OogyControllerInput.b;
            }
            else if (index === 14) {
                return OogyControllerInput.left;
            }
            else if (index === 15) {
                return OogyControllerInput.right;
            }
            else if (index === 12) {
                return OogyControllerInput.up;
            }
            else if (index === 13) {
                return OogyControllerInput.down;
            }
            else if (index === 9 || index === 8 || index === 17 || index === 16) {
                return OogyControllerInput.start;
            }
            else if (index === 16) {
                return OogyControllerInput.guide;
            }
            else {
                return null;
            }
        }
        generateOogyControllerInputFromAxes(axesIndex, axesVal) {
            if (axesIndex === 0) {
                if (axesVal < -0.9) {
                    return OogyControllerInput.left;
                }
                else if (axesVal > 0.9) {
                    return OogyControllerInput.right;
                }
            }
            else if (axesIndex === 1) {
                if (axesVal < -0.9) {
                    return OogyControllerInput.up;
                }
                else if (axesVal > 0.9) {
                    return OogyControllerInput.down;
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
                    state: oogyGamepadToFind.state,
                };
                const gamepadState = oogyGamepad.state
                    ? oogyGamepad.state
                    : { ignoreInputs: [] };
                const newGamepadState = Object.assign({}, gamepadState);
                for (let i = 0; i < oogyGamepad.gamepad.axes.length; i++) {
                    const axes = oogyGamepad.gamepad.axes[i];
                    const oogyInput = this.generateOogyControllerInputFromAxes(i, axes);
                    if (!oogyInput) {
                        newGamepadState.ignoreInputs = newGamepadState.ignoreInputs.filter((i) => {
                            return (i !== OogyControllerInput.down &&
                                i !== OogyControllerInput.up &&
                                i !== OogyControllerInput.left &&
                                i !== OogyControllerInput.right);
                        });
                    }
                    else {
                        if (gamepadState.ignoreInputs.includes(oogyInput)) {
                            newGamepadState.ignoreInputs =
                                newGamepadState.ignoreInputs.concat([oogyInput]);
                        }
                        else {
                            newGamepadState.ignoreInputs =
                                newGamepadState.ignoreInputs.concat([oogyInput]);
                            this.handleGamepadPollRecognizedInput(oogyInput);
                        }
                    }
                }
                for (let i = 0; i < oogyGamepad.gamepad.buttons.length; i++) {
                    const button = oogyGamepad.gamepad.buttons[i];
                    const oogyInput = this.generateOogyControllerInputFromButtonIndex(i);
                    if (!oogyInput) {
                    }
                    else if (this.isGamepadButtonPressed(button)) {
                        if (gamepadState.ignoreInputs.includes(oogyInput)) {
                            newGamepadState.ignoreInputs =
                                newGamepadState.ignoreInputs.concat([oogyInput]);
                        }
                        else {
                            newGamepadState.ignoreInputs =
                                newGamepadState.ignoreInputs.concat([oogyInput]);
                            this.handleGamepadPollRecognizedInput(oogyInput);
                        }
                    }
                    else {
                        if (gamepadState.ignoreInputs.includes(oogyInput)) {
                            newGamepadState.ignoreInputs =
                                newGamepadState.ignoreInputs.filter((i) => i !== oogyInput);
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
                    oogyLog("Blocking all other listeners as blockingListener has priority", this);
                    return;
                }
            }
            const listeners = Object.values(this.listeners);
            for (const listener of listeners) {
                if (listener.deactivated === true) {
                    oogyLog("controller manager > listener manually deactivated so suppressing input", listener, input);
                    continue;
                }
                if (keyboardEvent && listener.interceptKeyboardInput) {
                    oogyLog("controller manager > listener manually handling keyboard, so ignoring this trigger");
                    listener.interceptKeyboardInput(keyboardEvent);
                    continue;
                }
                if (!input) {
                    oogyLog("controller manager > unrecognized input and did not intercept for keyboard", listener, keyboardEvent);
                    continue;
                }
                listener.onControllerInput(input);
            }
        }
    }
    OogyControllerManager_1.OogyControllerManager = OogyControllerManager;
})(OogyControllerManager || (OogyControllerManager = {}));
