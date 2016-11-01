// Not all devices have the same device pixel ratio, so this function is used
// as a hack to make shapes appear roughly the same (or at least a GOOD)
// physical size across various devices.
const dpiNormalize = (n, u) => (window.devicePixelRatio * n) + (u || 'px')


// Super quick <div style>-creating function.
const div = (parent, styleConfig) => {
  const el = document.createElement('div')

  if (parent) {
    parent.appendChild(el)
  }

  Object.assign(el.style, styleConfig)

  return el
}


// The main `controller` function. Takes some options:
// * eventTarget: where to dispatch events, defaults to document.body
// * buildTarget: where to append the controller DOM, defaults to document.body
function controller(opts) {
  let eventTarget
  if (typeof opts.eventTarget === 'undefined') {
    eventTarget = document.body
  } else {
    eventTarget = opts.eventTarget
  }

  let buildTarget
  if (typeof opts.buildTarget === 'undefined') {
    buildTarget = document.body
  } else {
    buildTarget = opts.buildTarget
  }

  const container = div(buildTarget)

  // Etc -------------------------------------
  const controls = []

  const registerControl = (el, key) => {
    let touching = false

    if (!('ontouchstart' in window)) {
      el.addEventListener('mousedown', () => {
        el.style.background = 'blue'
        sendKey('keydown', key)
      })

      document.addEventListener('mouseup', () => {
        el.style.background = 'red'
        sendKey('keyup', key)
      })
    } else {
      el.addEventListener('touchstart', () => {
        el.style.background = 'yellow'
        sendKey('keydown', key)
      })

      document.addEventListener('touchend', () => {
        el.style.background = 'red'
        sendKey('keyup', key)
      })
    }
  }

  const sendKey = (evtType, keyCode) => {
    const evt = new KeyboardEvent(evtType)

    // Stupid hack
    Object.defineProperty(evt, 'keyCode', {
      get: () => keyCode
    })

    eventTarget.dispatchEvent(evt)
  }

  // Directional Pad -------------------------
  const dPadBtnStyle = {
    width: dpiNormalize(20),
    height: dpiNormalize(20),
    background: 'red',
    position: 'absolute'
  }

  const dPad = div(container, {
    width: dpiNormalize(100),
    height: dpiNormalize(100),
    background: 'green',
    position: 'relative'
  })

  const dPadLeft = div(dPad, Object.assign({}, dPadBtnStyle, {
    left: dpiNormalize(10),
    top: dpiNormalize(40)
  }))
  registerControl(dPadLeft, 37)

  const dPadRight = div(dPad, Object.assign({}, dPadBtnStyle, {
    right: dpiNormalize(10),
    top: dpiNormalize(40)
  }))
  registerControl(dPadRight, 39)

  const dPadUp = div(dPad, Object.assign({}, dPadBtnStyle, {
    left: dpiNormalize(40),
    top: dpiNormalize(10)
  }))
  registerControl(dPadUp, 38)

  const dPadDown = div(dPad, Object.assign({}, dPadBtnStyle, {
    left: dpiNormalize(40),
    bottom: dpiNormalize(10)
  }))
  registerControl(dPadDown, 40)
}
