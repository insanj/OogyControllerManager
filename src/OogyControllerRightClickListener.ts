export interface OogyControllerRightClickListener {
  /**
   * UUID that will be used to remove this listener later on. If null, will be generated when adding this to the manager.
   */
  uuid?: string;

  /**
   * Delegate pattern; when the manager detects the given input, triggers this on any listeners that have been added to the MANAGER.
   */
  onRightClick: () => void;
}
