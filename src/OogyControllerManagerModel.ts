export interface OogyControllerManagerModel {
  /**
   * Callback to fire when a controller that was previously connected is disconnected. Usually, this means we should pause the game (if it's not already paused). As per Steam guidelines, of course.
   */
  onControllerDisconnected: (gamepad: Gamepad) => void;
}
