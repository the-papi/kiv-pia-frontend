<template>
  <v-card ref="gameContainer" fluid height="100%">
    <ResizeObserver @notify="onResize" />
    <canvas
      id="game"
      ref="game"
      @click="placeSymbol"
    />
  </v-card>
</template>

<script>
import ResizeObserver from 'vue-resize/src/components/ResizeObserver'

export default {
  name: 'Game',
  components: {
    ResizeObserver
  },
  data: () => ({
    squareSize: 40,
    dragStartCoords: {
      width: null,
      height: null
    },
    symbols: {}
  }),
  mounted () {
    this.onResize()
  },
  methods: {
    onResize () {
      this.$refs.game.width = this.$refs.game.parentElement.clientWidth - 1
      this.$refs.game.height = this.$refs.game.parentElement.clientHeight - 10
      this.draw()
    },
    draw () {
      const canvas = this.$refs.game
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.drawMatrix(ctx, canvas.width, canvas.height)
      this.drawSymbols(ctx, canvas.width, canvas.height)
      this.drawDebug(ctx, canvas.width, canvas.height)
    },
    drawMatrix (ctx, width, height) {
      const xPos = width / 2
      const stepDiff = this.squareSize
      let diff = this.squareSize / 2

      while (diff < width / 2) {
        ctx.beginPath()
        ctx.moveTo(xPos + diff, 0)
        ctx.lineTo(xPos + diff, height)
        ctx.stroke()

        if (diff) {
          ctx.beginPath()
          ctx.moveTo(xPos - diff, 0)
          ctx.lineTo(xPos - diff, height)
          ctx.stroke()
        }

        diff += stepDiff
      }

      const yPos = height / 2
      diff = this.squareSize / 2

      while (diff < height / 2) {
        ctx.beginPath()
        ctx.moveTo(0, yPos + diff)
        ctx.lineTo(width, yPos + diff)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(0, yPos - diff)
        ctx.lineTo(width, yPos - diff)
        ctx.stroke()

        diff += stepDiff
      }
    },
    drawDebug (ctx, width, height) {
      ctx.translate(0, 20)
      const xPos = width / 2
      const stepDiff = this.squareSize
      let diff = 0
      let diffValue = 0

      ctx.font = '15px Arial'
      let text = diffValue.toString()
      ctx.fillText(text, xPos - ctx.measureText(text).width / 2, 0)

      diffValue += 1
      diff += stepDiff

      while (diff < width / 2) {
        text = diffValue.toString()
        ctx.fillText(text, xPos - ctx.measureText(text).width / 2 + diff, 0)

        text = (-diffValue).toString()
        ctx.fillText(text, xPos - ctx.measureText(text).width / 2 - diff, 0)

        diffValue += 1
        diff += stepDiff
      }

      ctx.translate(15, -20)

      const yPos = height / 2
      diffValue = 0
      diff = 0
      text = diffValue.toString()
      ctx.fillText(text, 0, yPos + 5)

      diffValue += 1
      diff += stepDiff

      while (diff < height / 2) {
        text = diffValue.toString()
        ctx.fillText(text, 0, yPos + 5 + diff)

        text = (-diffValue).toString()
        ctx.fillText(text, 0, yPos + 5 - diff)

        diffValue += 1
        diff += stepDiff
      }

      ctx.translate(-15, 0)
    },
    placeSymbol (event) {
      const x = event.clientX - event.target.getBoundingClientRect().left - event.target.width / 2
      const y = event.clientY - event.target.getBoundingClientRect().top - event.target.height / 2

      const gameX = Math.floor((x + this.squareSize / 2) / this.squareSize)
      const gameY = Math.floor((y + this.squareSize / 2) / this.squareSize)

      if (this.symbols[gameX] && this.symbols[gameX][gameY]) {
        return
      }

      if (!this.symbols[gameX]) {
        this.symbols[gameX] = {}
      }

      this.symbols[gameX][gameY] = {
        type: 'cross'
      }

      this.draw()
    },
    drawSymbols (ctx, width, height) {
      for (const x in this.symbols) {
        for (const y in this.symbols[x]) {
          const translateX = x * this.squareSize + width / 2
          const translateY = y * this.squareSize + height / 2
          ctx.translate(translateX, translateY)
          if (this.symbols[x][y].type === 'circle') {
            this.drawCircle(ctx, 13)
          } else if (this.symbols[x][y].type === 'cross') {
            this.drawCross(ctx, 13)
          }
          ctx.translate(-translateX, -translateY)
        }
      }
    },
    drawCircle (ctx, radius) {
      const oldLineWidth = ctx.lineWidth
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.lineWidth = oldLineWidth
    },
    drawCross (ctx, radius) {
      const oldLineWidth = ctx.lineWidth
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.moveTo(-radius, -radius)
      ctx.lineTo(radius, radius)
      ctx.moveTo(-radius, radius)
      ctx.lineTo(radius, -radius)
      ctx.stroke()
      ctx.lineWidth = oldLineWidth
    }
  }
}
</script>
