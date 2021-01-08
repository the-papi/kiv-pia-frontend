<template>
  <v-card>
    <v-card-title class="headline">
      Games history
    </v-card-title>
    <v-card-text>
      <v-data-table :headers="headers" :items="games" :items-per-page="10">
        <template v-slot:item.symbol="{ item }">
          <v-icon v-if="item.symbol.toLowerCase() === 'circle'" color="blue">
            mdi-circle-outline
          </v-icon>
          <v-icon v-else color="red">
            mdi-close
          </v-icon>
        </template>
        <template v-slot:item.result="{ item }">
          <span v-if="item.result === 'Win'" class="green--text">{{ item.result }}</span>
          <span v-else-if="item.result === 'Loss'" class="red--text">{{ item.result }}</span>
          <v-icon v-else class="orange--text" small>
            mdi-help
          </v-icon>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>

import gamesHistory from '@/apollo/queries/gamesHistory'
import moment from 'moment'

export default {
  layout: 'default',
  data: () => ({
    headers: [
      {
        text: 'Opponent',
        value: 'opponent'
      },
      {
        text: 'Date',
        value: 'date'
      },
      {
        text: 'Time',
        value: 'time'
      },
      {
        text: 'Symbol',
        value: 'symbol'
      },
      {
        text: 'Result',
        value: 'result'
      }
    ],
    games: []
  }),
  mounted () {
    const that = this

    this.$apollo.query({
      query: gamesHistory,
      fetchPolicy: 'network-only'
    }).then((data) => {
      const gamesHistory = data.data.gamesHistory

      that.games = []

      for (const game of gamesHistory) {
        const datetime = moment(game.datetime)

        let leftPlayer = null
        let rightPlayer = null

        if (game.players[0].user.username === this.$store.state.account.username) {
          leftPlayer = game.players[0]
          rightPlayer = game.players[1]
        } else {
          leftPlayer = game.players[1]
          rightPlayer = game.players[0]
        }

        let result = '?'
        if (game.winner) {
          result = leftPlayer.user.username === game.winner.user.username ? 'Win' : 'Loss'
        }

        that.games.push({
          opponent: `${rightPlayer.user.username}`,
          date: datetime.format('LL'),
          time: datetime.format('HH:mm'),
          symbol: leftPlayer.symbol,
          result
        })
      }
    })
  }
}
</script>
