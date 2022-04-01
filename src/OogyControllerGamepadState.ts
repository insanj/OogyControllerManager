import { OogyControllerInput } from "./OogyControllerInput";

export interface OogyControllerGamepadState {
  /**
   * Buttons that we should IGNORE if we recognize they are (still) pressed down
   */
  ignoreInputs: OogyControllerInput[];
}
