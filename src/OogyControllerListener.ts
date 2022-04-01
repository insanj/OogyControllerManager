import { OogyControllerInput } from "./OogyControllerInput";

export interface OogyControllerListener {
  /**
   * UUID that will be used to remove this listener later on. If null, will be generated when adding this to the manager.
   */
  uuid?: string;

  /**
   * Delegate pattern; when the manager detects the given input, triggers this on any listeners that have been added to the MANAGER.
   */
  onControllerInput: (input: OogyControllerInput) => void;

  /**
   * Force this to not receive any events, but do not remove it from the parent set. Kinda quirky but cool API I think.
   */
  deactivated?: boolean;

  /**
   * If provided, suppresses all keyboard key events so they can be processed manually, thus supporting only Gamepad using onControllerInput.
   */
  interceptKeyboardInput?: (event: KeyboardEvent) => void;
}
