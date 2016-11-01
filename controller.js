// Not all devices have the same device pixel ratio, so this function is used
// as a hack to make shapes appear roughly the same (or at least a GOOD)
// physical size across various devices.
const dpiNormalize = (n, u) => (window.devicePixelRatio * n) + (u || 'px')


// Super quick <div style>-creating function.
const div = (parent, styleConfig, children) => {
  const el = document.createElement('div')

  if (parent) {
    parent.appendChild(el)
  }

  if (children) {
    for (let child of children) {
      el.appendChild(child)
    }
  }

  Object.assign(el.style, styleConfig)

  return el
}


// The main `controller` function. Takes some options:
// * eventTarget: where to dispatch events, defaults to document.body
// * buildTarget: where to append the controller DOM, defaults to document.body
// * disableZoom: whether or not to automatically disable browser zoom,
//                defaults to false becaues it's a huge hack!
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

  let disableZoom
  if (typeof opts.disableZoom === 'undefined') {
    disableZoom = false
  } else {
    disableZoom = opts.disableZoom
  }

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

      el.addEventListener('touchend', () => {
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

  // Disable zoom!? --------------------------
  if (disableZoom) {
    let lastTouchEnd = 0
    document.body.addEventListener('touchend', evt => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) {
        evt.preventDefault()
      }
      lastTouchEnd = now
    }, false)
  }

  // Directional Pad -------------------------
  const dPadBtnStyle = {
    width: dpiNormalize(20),
    height: dpiNormalize(20),
    background: 'red',
    position: 'absolute'
  }

  const dPad = div(null, {
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

  // Space bar -------------------------------
  const spaceBar = div(null, {
    width: '80%',
    height: dpiNormalize(30),
    background: 'red'
  })
  registerControl(spaceBar, 32)

  const container = div(buildTarget, {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  }, [
    dPad,
    div(null, {
      flexGrow: 1,

      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingBottom: dpiNormalize(20)
    }, [spaceBar])
  ])
}
