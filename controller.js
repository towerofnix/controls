const div = (parent, styleConfig, propConfig) => {
  const el = document.createElement('div')

  if (parent) {
    parent.appendChild(el)
  }

  Object.assign(el.style, styleConfig)
  Object.assign(el, propConfig)

  return el
}


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
    el.addEventListener('mousedown', () => {
      el.style.background = 'blue'
      sendKey('keydown', key)
    })
    document.addEventListener('mouseup', () => {
      el.style.background = 'red'
      sendKey('keyup', key)
    })
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
    width: '20px',
    height: '20px',
    background: 'red',
    position: 'absolute'
  }

  const dPad = div(container, {
    width: '100px',
    height: '100px',
    background: 'green',
    position: 'relative'
  })

  const dPadLeft = div(dPad, Object.assign({}, dPadBtnStyle, {
    left: '10px',
    top: '40px'
  }))
  registerControl(dPadLeft, 37)

  const dPadRight = div(dPad, Object.assign({}, dPadBtnStyle, {
    right: '10px',
    top: '40px'
  }))
  registerControl(dPadRight, 39)

  const dPadUp = div(dPad, Object.assign({}, dPadBtnStyle, {
    left: '40px',
    top: '10px'
  }))
  registerControl(dPadUp, 38)

  const dPadDown = div(dPad, Object.assign({}, dPadBtnStyle, {
    left: '40px',
    bottom: '10px'
  }))
  registerControl(dPadDown, 40)
}
