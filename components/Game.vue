<template>
  <div>
    <v-row class="ma-0 pa-0">
      <v-col class="pa-0">
        <v-dialog v-if="winner" v-model="showWinDialog" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">
              <span v-if="opponentPlayer && winner && myPlayer.user.username !== winner.user.username">You lost!</span>
              <span v-else>You won!</span>
            </v-card-title>
            <v-card-text>Player {{ winner.user.username }} has won the game!</v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" text @click="showWinDialog = false; $router.push('/dashboard')">
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="showSurrenderDialog" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">
              Are you sure?
            </v-card-title>
            <v-card-text>This operation cannot be undone!</v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" text @click="showSurrenderDialog = false">
                No
              </v-btn>
              <v-btn color="error" text @click="showSurrenderDialog = false; surrender()">
                Yes
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-card>
          <v-card-title>
            <v-row>
              <v-col v-if="myPlayer">
                <span :class="{ 'text-decoration-underline': myTurn }">{{ myPlayer.user.username }}</span>
                <v-icon v-if="myPlayer.symbol.toLowerCase() === 'cross'" color="red">
                  mdi-close
                </v-icon>
                <v-icon v-if="myPlayer.symbol.toLowerCase() === 'circle'" color="blue">
                  mdi-circle-outline
                </v-icon>
              </v-col>
              <v-col class="text-center">
                vs.
              </v-col>
              <v-col v-if="opponentPlayer" class="text-right">
                <span :class="{ 'text-decoration-underline': !myTurn }">{{ opponentPlayer.user.username }}</span>
                <v-icon v-if="opponentPlayer.symbol.toLowerCase() === 'cross'" color="red">
                  mdi-close
                </v-icon>
                <v-icon v-if="opponentPlayer.symbol.toLowerCase() === 'circle'" color="blue">
                  mdi-circle-outline
                </v-icon>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text style="height: 100%">
            <div ref="gameWrapper" class="text-center">
              <ResizeObserver @notify="onResize" />
              <canvas
                id="game"
                ref="game"
                style="border: 1px solid black;"
                @click="placeSymbolEvent"
              />
            </div>
            <v-row>
              <v-col class="text-center">
                <v-btn color="error" @click="showSurrenderDialog = true">
                  Surrender
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <Chat :user-colors="userColors" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Chat from '@/components/Chat'
import ResizeObserver from 'vue-resize/src/components/ResizeObserver'
import gameState from '@/apollo/subscriptions/gameState'
import placeSymbol from '@/apollo/mutations/placeSymbol'
import surrender from '@/apollo/mutations/surrender'
import activeGame from '@/apollo/queries/activeGame'
import colors from 'vuetify/es5/util/colors'
import me from '@/apollo/queries/me'

export default {
  name: 'Game',
  components: {
    Chat,
    ResizeObserver
  },
  data: () => ({
    squareSize: 30,
    dragStartCoords: {
      width: null,
      height: null
    },
    symbols: {},
    myPlayer: null,
    opponentPlayer: null,
    myTurn: false,
    showWinDialog: false,
    winner: null,
    showSurrenderDialog: false,
    userColors: {},
    account: {},
    boardSize: 1
  }),
  mounted () {
    Object.assign(this.$data, this.$options.data.call(this)) // reset component data
    const that = this

    const gameStateObserver = this.$apollo.subscribe({
      query: gameState
    })
    gameStateObserver.subscribe({
      next (data) {
        const gameStateData = data.data.gameState
        if (gameStateData.__typename === 'SymbolPlacement') {
          that.placeSymbol(gameStateData.x, gameStateData.y, gameStateData.symbol.toLowerCase())
          that.myTurn = true
        } else if (gameStateData.__typename === 'GameWin') {
          that.winner = gameStateData.player
          that.showWinDialog = true
        } else if (gameStateData.__typename === 'GameSurrender') {
          if (that.myPlayer.user.username === gameStateData.player.user.username) {
            that.winner = that.opponentPlayer
          } else {
            that.winner = that.myPlayer
          }
          that.showWinDialog = true
        }
      }
    })

    this.$apollo.query({
      query: me,
      fetchPolicy: 'no-cache'
    }).then((data) => {
      that.account = data.data.me

      that.$apollo.query({
        query: activeGame,
        fetchPolicy: 'no-cache'
      }).then((data) => {
        const activeGame = data.data.activeGame
        if (!activeGame) {
          that.$router.push('/dashboard')
          return
        }

        if (activeGame.boardSize === 'Five') {
          that.boardSize = 5
        } else if (activeGame.boardSize === 'Seven') {
          that.boardSize = 7
        } else if (activeGame.boardSize === 'Eleven') {
          that.boardSize = 11
        }

        for (const player of activeGame.players) {
          if (player.user.username === that.account.username) {
            that.myPlayer = player
          } else {
            that.opponentPlayer = player
          }

          this.userColors[player.user.username] = player.symbol.toLowerCase() === 'circle' ? 'blue' : 'red'
        }

        this.myTurn = that.myPlayer.user.username === that.account.username &&
          this.myPlayer.symbol.toLowerCase() === 'circle'

        for (const gameState of activeGame.gameStates) {
          this.placeSymbol(gameState.x, gameState.y, gameState.symbol.toLowerCase())
        }
        if (activeGame.gameStates.length) {
          const lastGameState = activeGame.gameStates[activeGame.gameStates.length - 1]
          if (lastGameState.symbol !== this.myPlayer.symbol) {
            this.myTurn = true
          }
        }

        window.addEventListener('resize', that.onResize)
        this.$nextTick(() => that.onResize())
      })
    })
  },
  methods: {
    onResize () {
      if (this.$refs.game) {
        this.$refs.game.width = this.squareSize * this.boardSize
        this.$refs.game.height = this.squareSize * this.boardSize
      }

      this.draw()
    },
    draw () {
      const canvas = this.$refs.game
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.drawMatrix(ctx, this.boardSize * this.squareSize, this.boardSize * this.squareSize)
      this.drawSymbols(ctx, canvas.width, canvas.height)
      // this.drawDebug(ctx, canvas.width, canvas.height)
    },
    drawMatrix (ctx, width, height) {
      const xPos = Math.round(width / 2) + 0.5
      const stepDiff = Math.round(this.squareSize)
      let diff = Math.round(this.squareSize / 2)

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

      const yPos = Math.round(height / 2) + 0.5
      diff = Math.round(this.squareSize / 2)

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
    placeSymbolEvent (event) {
      const x = event.clientX - event.target.getBoundingClientRect().left - event.target.width / 2
      const y = event.clientY - event.target.getBoundingClientRect().top - event.target.height / 2

      const gameX = Math.floor((x + this.squareSize / 2) / this.squareSize)
      const gameY = Math.floor((y + this.squareSize / 2) / this.squareSize)

      const that = this
      this.$apollo.mutate({
        mutation: placeSymbol,
        variables: {
          x: gameX,
          y: gameY
        }
      }).then((data) => {
        if (data.data.placeSymbol) {
          that.placeSymbol(gameX, gameY, this.myPlayer.symbol.toLowerCase())
          this.myTurn = false
        }
      })
    },
    surrender () {
      this.$apollo.mutate({
        mutation: surrender
      })
    },
    placeSymbol (x, y, symbol) {
      if (this.symbols[x] && this.symbols[x][y]) {
        return
      }

      if (!this.symbols[x]) {
        this.symbols[x] = {}
      }

      this.symbols[x][y] = {
        type: symbol
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
            this.drawCircle(ctx, 10)
          } else if (this.symbols[x][y].type === 'cross') {
            this.drawCross(ctx, 10)
          }
          ctx.translate(-translateX, -translateY)
        }
      }
    },
    drawCircle (ctx, radius) {
      const oldStrokeStyle = ctx.strokeStyle
      const oldLineWidth = ctx.lineWidth
      ctx.strokeStyle = colors.blue.base
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.lineWidth = oldLineWidth
      ctx.strokeStyle = oldStrokeStyle
    },
    drawCross (ctx, radius) {
      const oldStrokeStyle = ctx.strokeStyle
      const oldLineWidth = ctx.lineWidth
      ctx.strokeStyle = colors.red.base
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(-radius, -radius)
      ctx.lineTo(radius, radius)
      ctx.moveTo(-radius, radius)
      ctx.lineTo(radius, -radius)
      ctx.stroke()
      ctx.lineWidth = oldLineWidth
      ctx.strokeStyle = oldStrokeStyle
    }
  }
}
</script>
