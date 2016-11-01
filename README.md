# Controller

A simple virtual physical controller. Made for `slw` but portable enough to be used basically anywhere (just include `controller.js`!).

# Usage

```js
const controller = /* require [TODO], or <script> */
controller({
  eventTarget: // Where to dispatch events - defaults to document.body
  buildTarget: // Where to append the controller DOM - defaults to body again
  // THAT IS ALL
})
```

It should work just fine with your project already. Note that it uses `keyCode` which is [lovely and deprecated and all](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode) but *whatever.* I've already done enough hacks for this project (few kept), I'm not going to polyfill `key` for Safari!
