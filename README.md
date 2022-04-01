# OogyControllerManager

🎮 ⌨️ Typescript Gamepad and Keyboard handler consolidated into a tiny, easy-to-use JS module

## About

Built and used in production for [Oogy: Can You Help](https://oogycanyouhelp.com), an indie deckbuilding adventure on Steam (PC and Mac).

## Installation

Once published, should be as simple as:

```bash
npm install -s oogy-controller-manager
```

## Usage

### Getting Started

```ts


/**
 * Represents an "event listener", primarily used to remove that listener when moving to a different screen. Has an automatically generated UUID, as well as a `deactivated` property, so may be helpful in order to detect if a current listener exists in a more complex context.
*/
currentControllerListener: OogyControllerListener;

controllerManager: OogyControllerManager;

constructor() {
  this.controllerManager = new OogyControllerManager({
    onControllerDisconnected: () => {
      this.handleUserPausedGame(); // if the controller is disconnected, simulate pause event
    }
  });

  this.controllerManager.start(); // start receiving events

  this.controllerManager.addRightClickListener({
    // do the same with right clicking as pressing pause button, globally
    onRightClick: () => {
      this.handleUserPausedGameToggled();
      // not same as `handleUserPausedGame`, as disconnect ALWAYS pauses, this can UNPAUSE as well
    }
  });

  // right click event firing can be disabled using the manager-level property:
  // this.controllerManager.shouldStopAcceptingClicks = true;
}
```

### Basic Usage

```ts
startUserInteraction(): void {

  // in this example, we are on a hypothetical screen with several "cards".
  // as we move on the keyboard on gamepad, we want to highlight the next card,
  // until eventually, we press A to select a card

  this.cardIndex = 0;
  this.cards = [{}, {}, {}]; // example UI elements, most likely, that we are navigating with keyboard or controller

  this.currentControllerListener = this.controllerManager.addListener({
    onControllerInput: (input) => {
      // here is where you may want to interrupt if you did not get a chance
      // to either (1) remove or (2) deactivate the listener beforehand,
      // such as could be the case with pausing the game (`handleUserPausedGame`)
      // example: if (this.suppressUserInteraction === true) {
      //            return;
      //          }

      switch (input) {
        default:
          return;
        case OogyControllerInput.start:
          this.handleUserPausedGameToggled();
          // here is our 3rd catch for pausing, and why this library can be helpful instead of doing this all by hand
          break;
        case OogyControllerInput.a:
          this.handleUserSelectedCard(this.cardIndex);
          // SELECT the currently highlighted card so we can trigger any action, etc
          break;
        case OogyControllerInput.right:
          this.highlightedCardIndex = this.highlightedCardIndex + 1;
          // go to the next index -> move one to the right
          if (this.highlightedCardIndex >= this.cards.length) {
            this.highlightedCardIndex = 0; // wrap to start if already at end of list
          }
          break;
        // .....
      }
    }
  });
}
```

### Disconnecting

```ts
stopUserInteraction(): void {
  this.controllerManager.removeListener(
    this.currentControllerListener
  ); // since each listener has an automagically generated UUID, this is all we need to do
}
```

### Blocking Listeners

```ts
startNavigationBarBlockingListener(): void {

  // in this example, we are entering a context where we need a "blocking"
  // listener, that can intercept and get all keyboard/controller events
  // without disrupting any existing listeners (such as, when PAUSE is active)

  this.controllerManager.addBlockingListener({

    // this is a special kind of listener that does not require a UUID,
    // as the API only supports 1 blocking listener at a time
    // (which is also its whole purpose, anything more complicated should
    //  remove listeners or use the `deactivated` property...)
    interceptControllerInputAndBlock: (input) => {

      if (
        input !== OogyControllerInput.guide &&
        input !== OogyControllerInput.start
      ) {

        if (this.userPausedGame === true) {
          // start is "active" so block anything else from receiving this input
          // until start pressed again
          this.handleInputWhileGamePaused(input);
          return true;
        }

        return false; // not paused, so return `false` to NOT intercept
      }

      this.handleUserPausedGameToggled();
      return true; // return `true` to intercept, this is the guide or pause button
    }

  });
}

stopNavigationBarBlockingListener(): void {
  this.controllerManager.removeBlockingListener();
}
```

## Authors

```
Julian (@insanj) Weiss
julian@oogycanyouhelp.com
github.com/insanj
(c) 2022
```

## License

```
MIT License

Copyright (c) 2022 Julian Weiss

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
