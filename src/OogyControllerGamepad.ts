import { OogyControllerGamepadState } from "./OogyControllerGamepadState";

export interface OogyControllerGamepad {
  /**
   * Represents the "state" of the gamepad as it concerns Oogy. Each cycle/tick, we use this state to see what information the game still requires. Right now, this is the inputs to ignore -- after firing the event to listenrs, we fill in the state and only remove the input when we detect it is no longer pressed. More metadata can be added as well, such as vibration, etc.
   */
  state?: OogyControllerGamepadState;

  gamepad: Gamepad;
}
