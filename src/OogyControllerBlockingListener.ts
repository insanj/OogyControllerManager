import { OogyControllerInput } from "./OogyControllerInput";

export interface OogyControllerBlockingListener {
  /**
   * UUID that will be used to remove this listener later on. If null, will be generated when adding this to the manager.
   */
  uuid?: string;

  /**
   * Delegate pattern; when the manager detects the given input, triggers this on any listeners that have been added to the MANAGER.
   * @returns true if we should block this event
   */
  interceptControllerInputAndBlock: (input: OogyControllerInput) => boolean;
}
