let levelBubblesDrawn = 0
function LevelBubble(spec) {
  const { ui, self, parent, screen, camera, assets } = Entity(
    spec,
    'LevelBubble',
  )

  const {
    setLevel,
    levelDatum,
    getEditing,
    tickDelta,
    getBubbleByNick,
    getShowAll,
    quad,
    panCamera,
  } = spec

  const { nick, requirements, radius = 3 } = levelDatum

  const dependencies = []

  const transform = Transform(levelDatum)

  const shape = Circle({
    transform,
    radius,
  })

  const clickable = Clickable({
    entity: self,
    shape,
    transform,
    camera,
  })

  const arrows = []

  let completed = false
  let hilighted = false
  let playable = false
  let unlocked = false
  let visible = false

  let frameCounter = 0
  let bubbletRunning = false
  let bubbletRunTime = 0

  const bubbletGlobalScope = {
    get t() {
      return bubbletRunTime
    },
    dt: tickDelta,

    get running() {
      return bubbletRunning
    },
  }

  const bubbletCanvas = document.createElement('canvas')

  let bubbletPixels = 128
  bubbletCanvas.width = bubbletPixels
  bubbletCanvas.height = bubbletPixels

  ui.bubblets.appendChild(bubbletCanvas)
  const bubbletScreen = Screen({
    canvas: bubbletCanvas,
    element: bubbletCanvas,
  })

  const bubbletCamera = Camera({
    screen: bubbletScreen,
  })

  let bubbletLevel = Level({
    datum: {
      ...levelDatum,
      axesEnabled: false,
    },
    screen: bubbletScreen,
    camera: bubbletCamera,
    globalScope: bubbletGlobalScope,
    parent: self,
    useDragCamera: false,
    isBubbleLevel: true,
    drawOrder: LAYERS.levelBubbles,
  })

  bubbletLevel.sendEvent('draw')
  bubbletLevel.active = false

  bubbletLevel.destroy()

  const ctx = screen.ctx

  function awake() {
    linkRequirements()

    // Offset position by first requirement's position
    const p = Vector2()
    if (requirements.length > 0) {
      p.set(requirements[0].transform.position)
    }
    transform.position.add(p)
  }

  function start() {
    // Create an arrow to each dependency
    for (bubble of requirements) {
      let arrow = Arrow({
        truncate: [radius + 0.9, radius + 0.9],
        point0: bubble.transform.position,
        point1: transform.position,
        drawOrder: LAYERS.arrows,
        parent: self,
      })

      arrow.fromBubble = bubble
      arrow.toBubble = self
      arrows.push(arrow)
    }

    refreshPlayable()
  }

  function startLate() {}

  function tick() {}

  function drawLocal(shouldDrawImage = true) {
    const opacity = visible ? (playable ? 1 : 0.5) : 0
    ctx.globalAlpha = opacity

    ctx.beginPath()

    let strokeWidth = 0.2

    if (playable) {
      if (hilighted) strokeWidth = 0.4
      else if (playable) strokeWidth = 0.2

      if (clickable.hovering) strokeWidth *= 2
    }

    const cutsceneFrameSides = 8

    if (levelDatum.runAsCutscene) {
      ctx.rotate(((180 / cutsceneFrameSides) * Math.PI) / 180)
      ctx.beginPath()
      ctx.moveTo(radius, 0)

      for (var i = 1; i <= cutsceneFrameSides; i += 1) {
        ctx.lineTo(
          radius * Math.cos((i * 2 * Math.PI) / cutsceneFrameSides),
          radius * Math.sin((i * 2 * Math.PI) / cutsceneFrameSides),
        )
      }
    } else {
      ctx.arc(0, 0, radius, 0, Math.PI * 2)
    }

    ctx.lineWidth = strokeWidth

    ctx.fillStyle = '#fff'
    ctx.strokeStyle = hilighted ? '#f88' : '#444'

    ctx.save()

    ctx.fill()
    ctx.clip()

    if (shouldDrawImage) {
      if (levelDatum.runAsCutscene) {
        ctx.rotate((-(180 / cutsceneFrameSides) * Math.PI) / 180)
        ctx.drawImage(bubbletCanvas, -radius, -radius, radius * 2, radius * 2)
      } else {
        ctx.drawImage(bubbletCanvas, -radius, -radius, radius * 2, radius * 2)
      }
    }

    ctx.fillStyle = '#333'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'hanging'
    ctx.font = '1px Roboto Mono'
    ctx.scale(0.8, 0.8)
    // ctx.fillText(levelDatum.name, 0, radius)

    ctx.restore()

    // ctx.globalAlpha = 1

    ctx.lineCap = 'butt'
    ctx.miterLimit = 20
    ctx.lineJoin = 'miter'

    ctx.beginPath()
    if (levelDatum.runAsCutscene) {
      ctx.beginPath()
      ctx.moveTo(radius + strokeWidth / 2 - 0.02, 0)

      for (var i = 1; i < cutsceneFrameSides; i += 1) {
        ctx.lineTo(
          (radius + strokeWidth / 2 - 0.02) *
            Math.cos((i * 2 * Math.PI) / cutsceneFrameSides),
          (radius + strokeWidth / 2 - 0.02) *
            Math.sin((i * 2 * Math.PI) / cutsceneFrameSides),
        )
      }
      ctx.closePath()
    } else {
      ctx.arc(0, 0, radius + strokeWidth / 2 - 0.02, 0, Math.PI * 2)
    }

    ctx.stroke()
  }

  function refreshPlayable() {
    unlocked = _.every(requirements, 'completed')

    if (unlocked) {
      playable = true
      hilighted = !completed
    } else {
      playable = getShowAll()
      hilighted = false
    }

    visible = playable || _.some(requirements, (v) => v.playable)
  }

  function refreshArrows() {
    _.each(arrows, (v) => {
      v.opacity = visible
        ? playable
          ? 1
          : 0.5
        : v.fromBubble.visible
        ? 0.5
        : 0
      v.dashed = !v.toBubble.unlocked
      v.fadeIn = visible && !v.fromBubble.visible
      v.fadeOut = !visible && v.fromBubble.visible
    })
  }

  let centerScreen = Vector2()

  function intersectsScreen() {
    let center = transform.position

    let left = camera.lowerLeft.x - 3
    let right = camera.upperRight.x + 3
    let top = camera.upperRight.y + 3
    let bottom = camera.lowerLeft.y - 3

    if (
      center.x > left &&
      center.x < right &&
      center.y > bottom &&
      center.y < top
    ) {
      return true
    }

    // let dx = Math.min(Math.abs(center.x - left), Math.abs(center.x - right))
    // let dy = Math.min(Math.abs(center.y - top), Math.abs(center.y - bottom))

    // if (Math.hypot(dx, dy) < radius) {
    //   return true
    // }

    return false
  }

  function draw() {
    if (!visible) return

    if (!intersectsScreen()) return

    levelBubblesDrawn++

    ctx.save()

    ctx.shadowOffsetX = 8
    ctx.shadowOffsetY = 8
    ctx.shadowColor = 'black'
    ctx.shadowBlur = 13

    camera.drawThrough(ctx, drawLocal.bind(this, false), transform)

    ctx.restore()

    camera.drawThrough(ctx, drawLocal, transform)
    ctx.globalAlpha = 1
  }

  function complete() {
    if (completed) return

    completed = true
    refreshPlayable()

    _.invokeEach(dependencies, 'refreshPlayable')
  }

  function linkRequirements() {
    for (let i = 0; i < requirements.length; i++) {
      let requiredBubble = getBubbleByNick(requirements[i])
      requiredBubble.dependencies.push(self)
      requirements[i] = requiredBubble
    }
  }

  function mouseDown(point) {
    // If not playable, then delegate to parent
    if (!playable) {
      parent.updatePanVelocity(point, clickable.holding)
    }
  }

  function hoverMove(point) {
    // If not playable, then delegate to parent
    if (!playable) {
      parent.updatePanVelocity(point, clickable.holding)
    }
  }

  function click(point) {
    if (!playable) return

    console.log('LevelBubble for ' + levelDatum.name + ' clicked')

    ui.veil.setAttribute('hide', false)

    assets.sounds.enter_level.play()
    assets.sounds.map_zoom_in.play()

    completeAllRequirements()

    panCamera(transform.position, () => {
      setLevel(levelDatum.nick)
      ui.veil.setAttribute('hide', true)
    })
  }

  function completeAllRequirements() {
    for (requirement of requirements) {
      requirement.complete()
      requirement.completeAllRequirements()
    }

    refreshPlayable()
  }

  return self.mix({
    transform,
    clickable,

    start,
    startLate,
    awake,

    tick,
    draw,

    mouseDown,
    hoverMove,

    click,

    level: bubbletLevel,

    dependencies,
    linkRequirements,

    refreshPlayable,
    refreshArrows,

    get nick() {
      return nick
    },

    get completed() {
      return completed
    },
    get hilighted() {
      return hilighted
    },

    get playable() {
      return playable
    },
    get visible() {
      return visible
    },
    get unlocked() {
      return unlocked
    },

    complete,
    completeAllRequirements,
  })
}
