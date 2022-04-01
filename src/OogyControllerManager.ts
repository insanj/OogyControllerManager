import { OogyControllerBlockingListener } from "./OogyControllerBlockingListener";
import { OogyControllerGamepad } from "./OogyControllerGamepad";
import { OogyControllerGamepadState } from "./OogyControllerGamepadState";
import { OogyControllerInput } from "./OogyControllerInput";
import { OogyControllerListener } from "./OogyControllerListener";
import { OogyControllerManagerModel } from "./OogyControllerManagerModel";
import { OogyControllerRightClickListener } from "./OogyControllerRightClickListener";
import { oogyErrorLog, oogyLog, oogyWarnLog } from "./OogyLog";
import { OogyNullable } from "./OogyNullable";
import { OogyUUIDBuilder } from "./OogyUUIDBuilder";

export class OogyControllerManager {
  /**
   * If non-null, has the ability to block all other listeners from firing and intercepts instead
   */
  blockingListener?: OogyNullable<OogyControllerBlockingListener>;

  globalRightClickListener?: OogyNullable<OogyControllerRightClickListener>;

  listeners: Record<string, OogyControllerListener>;
  gamepads: Record<string, OogyControllerGamepad>;

  // internal
  keyboardAbortController?: AbortController;
  gamepadConnectedAbortController?: AbortController;
  gamepadDisconnectedAbortController?: AbortController;

  shouldStopAcceptingClicks: boolean = false;

  /**
   * setInterval used to clear the scheduled block
   */
  gamepadPollInterval?: any;

  /**
   * Millisecond number value that defines how often we check for gamepad input (should be rather low)
   */
  gamepadPoolIntervalDelay: number;

  model: OogyControllerManagerModel;

  constructor(model: OogyControllerManagerModel) {
    this.listeners = {};
    this.gamepads = {};
    this.gamepadPoolIntervalDelay = 100;

    this.model = model;
  }

  /**
   * Returns listener that was given to it, will attach UUID if it did not already exist
   * @param listener
   * @returns
   */
  addListener(listener: OogyControllerListener): OogyControllerListener {
    if (!listener.uuid) {
      listener.uuid = OogyUUIDBuilder.randomUUID();
    }

    if (this.listeners[listener.uuid]) {
      oogyErrorLog(
        "!!! Strange situation where we already have added this listener??? We won't be able to remove it later because only 1 per UUID can exist on the manager... check we haven't added the same listener twice somehow!!",
        this
      );
    }

    this.listeners[listener.uuid] = listener;
    oogyLog("controller manager > registered new listener", listener, this);

    return listener;
  }

  /**
   * Returns listener if found, or null if none found
   * @param listener
   * @returns
   */
  removeListener(
    listener: OogyControllerListener
  ): OogyNullable<OogyControllerListener> {
    if (!listener.uuid) {
      oogyErrorLog(
        "Unable to remove listener as it has never had a UUID assigned to it"
      );
      return null;
    }

    if (!this.listeners[listener.uuid]) {
      oogyErrorLog(
        "Unable to remove listener as none was found on the manager"
      );
      return null;
    }

    const deleted = this.listeners[listener.uuid];
    delete this.listeners[listener.uuid];

    oogyLog("controller manager > removed listener", deleted, this);
    return deleted;
  }

  addBlockingListener(listener: OogyControllerBlockingListener) {
    if (this.blockingListener) {
      oogyWarnLog(
        "Already has blocking listener, the original will be forgotten to the sands of time o.o",
        this.blockingListener,
        listener
      );
    }

    this.blockingListener = listener;
  }

  removeBlockingListener(): OogyNullable<OogyControllerBlockingListener> {
    const blocking = this.blockingListener;
    this.blockingListener = null;
    return blocking;
  }

  addRightClickListener(listener: OogyControllerRightClickListener) {
    if (this.globalRightClickListener) {
      oogyWarnLog(
        "Already has right click listener, the original will be forgotten to the sands of time o.o",
        this.globalRightClickListener,
        listener
      );
    }

    this.globalRightClickListener = listener;
  }

  removeRightClickListener(): OogyNullable<OogyControllerRightClickListener> {
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
    document.addEventListener(
      "keydown",
      (event) => {
        manager.handleKeyup(event);
      },
      {
        signal: this.keyboardAbortController.signal,
      }
    );

    this.gamepadConnectedAbortController = new AbortController();
    window.addEventListener(
      "gamepadconnected",
      (e) => {
        manager.handleGamepadConnected(e);
      },
      {
        signal: this.gamepadConnectedAbortController.signal,
      }
    );

    this.gamepadDisconnectedAbortController = new AbortController();
    window.addEventListener(
      "gamepaddisconnected",
      (e) => {
        manager.handleGamepadDisconnected(e);
      },
      {
        signal: this.gamepadDisconnectedAbortController.signal,
      }
    );

    const handleRightClick = () => {
      if (manager.globalRightClickListener) {
        manager.globalRightClickListener.onRightClick();
      }
    };

    window.oncontextmenu = () => {
      handleRightClick();
      return false; // prevent traditional right click dropdown in web browsers
    };

    window.document.body.addEventListener("click", (e) => {
      if (manager.shouldStopAcceptingClicks) {
        return;
      }

      if (e.button !== 2) {
        // check if right click
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

  handleKeyup(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();

    const keyNumber = event.keyCode;
    if (keyNumber === 65 || keyNumber === 37) {
      // left
      this.handleOogyInput(OogyControllerInput.left, event);
    } else if (keyNumber === 68 || keyNumber === 39) {
      // right
      this.handleOogyInput(OogyControllerInput.right, event);
    } else if (keyNumber === 87 || keyNumber === 38) {
      // up
      this.handleOogyInput(OogyControllerInput.up, event);
    } else if (keyNumber === 40 || keyNumber === 83) {
      // down
      this.handleOogyInput(OogyControllerInput.down, event);
    } else if (keyNumber === 13 || keyNumber === 32) {
      // enter, space
      this.handleOogyInput(OogyControllerInput.a, event);
    } else if (keyNumber === 8) {
      // backspace
      this.handleOogyInput(OogyControllerInput.b, event);
    } else if (keyNumber === 27) {
      // esc
      this.handleOogyInput(OogyControllerInput.start, event);
    } else if (keyNumber === 9) {
      // guide
      this.handleOogyInput(OogyControllerInput.guide, event);
    } else {
      this.handleOogyInput(undefined, event);
    }
  }

  handleGamepadConnected(event: GamepadEvent) {
    const eventGamepad = event.gamepad;

    // @ts-expect-error
    if (eventGamepad.vibrationActuator) {
      // const haptic = eventGamepad.hapticActuators[0];
      // @ts-expect-error
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
        .catch((e: any) => {
          oogyErrorLog("Unable to virbate controller", event, e);
        });
    }

    const buttonsToIgnoreInitially: OogyControllerInput[] = eventGamepad.buttons
      .map((b, i) => {
        const oogyInput = this.generateOogyControllerInputFromButtonIndex(i);
        if (oogyInput && this.isGamepadButtonPressed(b)) {
          // ignore, pressed initially
          return oogyInput;
        } else {
          // unrecognized or not pressed button, do nothing
          return null;
        }
      })
      .filter((b) => b !== null) as OogyControllerInput[];

    oogyLog(
      "controller manager > buttonsToIgnoreInitially",
      buttonsToIgnoreInitially
    );

    const oogyGamepad: OogyControllerGamepad = {
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

  handleGamepadDisconnected(event: GamepadEvent) {
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

  isGamepadButtonPressed(gamepadButton: any) {
    if (typeof gamepadButton === "object") {
      return gamepadButton.pressed;
    }
    return gamepadButton === 1.0;
  }

  generateOogyControllerInputFromButtonIndex(
    index: number
  ): OogyNullable<OogyControllerInput> {
    if (index === 0) {
      return OogyControllerInput.a;
    } else if (index === 1) {
      return OogyControllerInput.b;
    } else if (index === 14) {
      return OogyControllerInput.left;
    } // ps4
    else if (index === 15) {
      return OogyControllerInput.right;
    } // ps4
    else if (index === 12) {
      return OogyControllerInput.up;
    } // ps4
    else if (index === 13) {
      return OogyControllerInput.down;
    } // ps4
    else if (index === 9 || index === 8 || index === 17 || index === 16) {
      return OogyControllerInput.start;
    } else if (index === 16) {
      return OogyControllerInput.guide;
    } else {
      return null;
    }
  }

  generateOogyControllerInputFromAxes(
    axesIndex: number,
    axesVal: number
  ): OogyControllerInput | null {
    if (axesIndex === 0) {
      // left right
      if (axesVal < -0.9) {
        // left
        return OogyControllerInput.left;
      } else if (axesVal > 0.9) {
        // right
        return OogyControllerInput.right;
      }
    } else if (axesIndex === 1) {
      // up down
      if (axesVal < -0.9) {
        // up
        return OogyControllerInput.up;
      } else if (axesVal > 0.9) {
        // down
        return OogyControllerInput.down;
      }
    }

    return null;
  }

  handleGamepadPoll() {
    const currGamepads = Array.from(navigator.getGamepads());
    const oogyGamepads = Object.values(this.gamepads);
    for (const oogyGamepadToFind of oogyGamepads) {
      const matchingGamepads = currGamepads.filter(
        (g) => g && g.id === oogyGamepadToFind.gamepad.id
      );
      if (!matchingGamepads || matchingGamepads.length < 1) {
        // we never received disconnect event, BUT we also cannot find this gamepad in the curr connected list;skip
        continue;
      }

      const oogyGamepad: OogyControllerGamepad = {
        gamepad: matchingGamepads[0]!,
        state: oogyGamepadToFind.state,
      };

      // check button values
      const gamepadState: OogyControllerGamepadState = oogyGamepad.state
        ? oogyGamepad.state
        : { ignoreInputs: [] };
      const newGamepadState: OogyControllerGamepadState = Object.assign(
        {},
        gamepadState
      );

      // left, up, down, right axes
      // oogyLog("axes", oogyGamepad.gamepad.axes);
      for (let i = 0; i < oogyGamepad.gamepad.axes.length; i++) {
        const axes = oogyGamepad.gamepad.axes[i];
        const oogyInput = this.generateOogyControllerInputFromAxes(i, axes);

        if (!oogyInput) {
          newGamepadState.ignoreInputs = newGamepadState.ignoreInputs.filter(
            (i) => {
              return (
                i !== OogyControllerInput.down &&
                i !== OogyControllerInput.up &&
                i !== OogyControllerInput.left &&
                i !== OogyControllerInput.right
              );
            }
          );
        } else {
          if (gamepadState.ignoreInputs.includes(oogyInput)) {
            // ignore, pressed and still pressed
            newGamepadState.ignoreInputs = newGamepadState.ignoreInputs.concat([
              oogyInput,
            ]);
          } else {
            newGamepadState.ignoreInputs = newGamepadState.ignoreInputs.concat([
              oogyInput,
            ]);
            this.handleGamepadPollRecognizedInput(oogyInput);
          }
        }
      }

      // a, b, start buttons
      for (let i = 0; i < oogyGamepad.gamepad.buttons.length; i++) {
        const button = oogyGamepad.gamepad.buttons[i];
        const oogyInput = this.generateOogyControllerInputFromButtonIndex(i);

        if (!oogyInput) {
          // unrecognized button, do nothing
        } else if (this.isGamepadButtonPressed(button)) {
          if (gamepadState.ignoreInputs.includes(oogyInput)) {
            // ignore, pressed and still pressed
            newGamepadState.ignoreInputs = newGamepadState.ignoreInputs.concat([
              oogyInput,
            ]);
          } else {
            // fire event! and add to ignore set
            newGamepadState.ignoreInputs = newGamepadState.ignoreInputs.concat([
              oogyInput,
            ]);
            this.handleGamepadPollRecognizedInput(oogyInput);
          }
        } else {
          if (gamepadState.ignoreInputs.includes(oogyInput)) {
            // ignoring, but no longer pressed, so stop ignoring
            newGamepadState.ignoreInputs = newGamepadState.ignoreInputs.filter(
              (i) => i !== oogyInput
            );
          }
        }
      }

      // save most up to date gamepad and state, both of which most likely
      // just changed (gamepad is new object every event fire based on HTML5,
      // and then stateis new object based on if we sent event to receiver/listener yet)
      oogyGamepad.state = newGamepadState;
      this.gamepads[oogyGamepadToFind.gamepad.id] = oogyGamepad;
    }
  }

  handleGamepadPollRecognizedInput(input: OogyControllerInput) {
    this.handleOogyInput(input);
  }

  handleOogyInput(input?: OogyControllerInput, keyboardEvent?: KeyboardEvent) {
    if (this.blockingListener && input) {
      const shouldBlock =
        this.blockingListener.interceptControllerInputAndBlock(input);
      if (shouldBlock) {
        oogyLog(
          "Blocking all other listeners as blockingListener has priority",
          this
        );
        return;
      }
    }

    const listeners = Object.values(this.listeners);
    for (const listener of listeners) {
      if (listener.deactivated === true) {
        oogyLog(
          "controller manager > listener manually deactivated so suppressing input",
          listener,
          input
        );
        continue;
      }

      if (keyboardEvent && listener.interceptKeyboardInput) {
        oogyLog(
          "controller manager > listener manually handling keyboard, so ignoring this trigger"
        );

        listener.interceptKeyboardInput(keyboardEvent);
        continue;
      }

      if (!input) {
        oogyLog(
          "controller manager > unrecognized input and did not intercept for keyboard",
          listener,
          keyboardEvent
        );
        continue;
      }

      listener.onControllerInput(input);
    }
  }

  // getAnalogStickDirection(axes: number): OogyGamepadAnalogStickDirection {
  //     if (!navigator.getGamepads()) {
  //         return null;
  //     }

  //     if (navigator.getGamepads().length < 1) {
  //         return null;
  //     }

  //     const gamepad = navigator.getGamepads()[0];
  //     const axesOffset = gamepad.axes[axes];

  //     let stickDirection: OogyGamepadAnalogStickDirection = {};

  //     if (axesOffset < -0.5) {
  //         stickDirection.left = true;
  //         stickDirection.right = false;
  //     } else if(axesOffset > 0.5) {
  //         stickDirection.left = false;
  //         stickDirection.right = true;
  //     } else {
  //         stickDirection.left = false;
  //         stickDirection.right = false;
  //     }

  //     const response: OogyGamepadAnalogStickDirection = stickDirection;
  //     return response;
  // }

  // addEventListener(button: OogyGamepadButton, handler: () => void) {

  //     $(window).on("gamepadconnected", () => {

  //         setInterval(() => {
  //             const leftStickDirection = this.getAnalogStickDirection(0);
  //             if (leftStickDirection.left) {
  //                 if (button === OogyGamepadButton.up) {
  //                     handler();
  //                 }
  //             } else if (leftStickDirection.right) {
  //                 if (button === OogyGamepadButton.down) {
  //                     handler();
  //                 }
  //             }
  //         }, 100);

  //     });

  // $(window).on("gamepadconnected", function() {

  // $(window).on("gamepaddisconnected", function() {

  // });

  // }
}
