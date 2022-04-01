<p align="center">
<img width="300" src="https://oogycanyouhelp.com/Store%20Desc%20Inline%20606px.png">
</p>

<h1 align="center">OogyControllerManager</h1>
<h3 align="center"><code>oogy-controller-manager</code></h3>

<p align="center">
🎮 ⌨️  Typescript Gamepad and Keyboard handler consolidated into a tiny, easy-to-use npm package
</p>

<h2>About</h2>

Built and used in production for [Oogy: Can You Help](https://oogycanyouhelp.com), an indie deckbuilding adventure on Steam (PC and Mac).

The goal of this project is to provide a useful abstraction over both the [Web Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API) and window-level [KeyboardEvents](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent).

Why? In this case, as a video game, we want to handle keyboard and controller input with consistency—particularly in special cases such as pause menu input, "on controller disconnected", and Steam Overlay handling.

<h2>Installation</h2>

Once published, should be as simple as:

```bash
npm install -s oogy-controller-manager
```

And using:

```
import { OogyControllerManager } from 'oogy-controller-manager';
```

<h2>Building</h2>

Clone the repository, and run:

```bash
npm install
npm start
```

This will generate the latest production-ready `.js` file using webpack, located at `dist/OogyControllerManager.js`.

To build with inline sourcemaps, use the `npm run dev` command. See `package.json` for details.

<h2>Usage</h2>

<h3>Getting Started</h3>

```ts
/**
 * Represents an "event listener", primarily used to remove that listener
 when moving to a different screen. Has an automatically generated UUID,
 as well as a `deactivated` property, so may be helpful in order to detect
 if a current listener exists in a more complex context.
*/
currentControllerListener: OogyControllerListener;

controllerManager: OogyControllerManager;

constructor() {
  this.controllerManager = new OogyControllerManager({
    onControllerDisconnected: () => {
      this.handleUserPausedGame();
      // if the controller is disconnected, simulate pause event
    }
  });

  this.controllerManager.start(); // start receiving events

  this.controllerManager.addRightClickListener({
    // do the same with right clicking as pressing pause button, globally
    onRightClick: () => {
      this.handleUserPausedGameToggled();
      // not same as `handleUserPausedGame`, as disconnect ALWAYS pauses,
      // this can UNPAUSE as well
    }
  });

  // click event firing can be disabled using the manager-level property:
  // (this is what I use when the Steam Overlay is activated as well)
  // this.controllerManager.shouldStopAcceptingClicks = true;
}
```

<h3>Basic Usage</h3>

```ts
startUserInteraction(): void {

  // in this example, we are on a hypothetical screen with several "cards".
  // as we move on the keyboard or gamepad, we want to highlight the next card,
  // until eventually, we press A to select a card

  this.cardIndex = 0;
  this.cards = [{}, {}, {}]; // example UI elements, most likely,
  // that we are navigating with keyboard or controller

  this.currentControllerListener = this.controllerManager.addListener({
    onControllerInput: (input) => {
      // here is where you may want to interrupt if you did not get a chance
      // to either (1) remove or (2) deactivate the listener beforehand,
      // or as a safeguard in case the screen is inactive but listener
      // was not removed (yet) for some reason.
      // example: if (this.suppressUserInteraction === true) {
      //            return;
      //          }
      // note: this is not for pausing; see blocking listeners
      // for handling pause (`handleUserPausedGame`)

      switch (input) {
        default:
          return;
        case OogyControllerInput.start:
          this.handleUserPausedGameToggled();
          // here is our 3rd path to pausing the game so far,
          // and why this library can be helpful instead of doing this by hand
          break;
        case OogyControllerInput.a:
          this.handleUserSelectedCard(this.cardIndex);
          // SELECT the currently highlighted card so we can trigger any action, etc
          break;
        case OogyControllerInput.right:
          this.highlightedCardIndex = this.highlightedCardIndex + 1;
          // go to the next index -> move one to the right
          if (this.highlightedCardIndex > this.cards.length - 1) {
            this.highlightedCardIndex = 0; // wrap to start if already at end of list
          }
          break;
        // .....
      }
    }
  });
}
```

<h3>Disconnecting</h3>

```ts
stopUserInteraction(): void {
  this.controllerManager.removeListener(
    this.currentControllerListener
  ); // this is all we need to do
  // (each listener has an automagically generated UUID)
}
```

<h3>Blocking Listeners</h3>

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
          // start is "active" so block anything else from receiving this
          // input until start pressed again
          this.handleInputWhileGamePaused(input);
          return true;
        }

        return false; // not paused, so return `false` to NOT intercept
      }

      this.handleUserPausedGameToggled();
      return true;
      // return `true` to intercept, this is the guide or pause button
    }

  });
}

stopNavigationBarBlockingListener(): void {
  this.controllerManager.removeBlockingListener();
  // no uuid, so this removes the only blocking listener active
}
```

<h2>Authors</h2>

```
Julian (@insanj) Weiss
julian@oogycanyouhelp.com
github.com/insanj
(c) 2022
```

<h2>License</h2>

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
