<template>
  <div>
    <v-container v-show="!usersStatus.length" class="text-center accent--text mt-8">
      <div>
        <v-icon>
          mdi-account-off
        </v-icon>
      </div>
      No users are currently online.
    </v-container>
    <v-list>
      <v-menu v-for="userStatus in usersStatus" :key="userStatus.user.id" transition="slide-y-transition" offset-y left>
        <template v-slot:activator="{ on, attrs }">
          <v-list-item v-bind="attrs" v-on="on">
            <v-list-item-icon>
              <v-icon v-if="false" color="blue">
                mdi-account-clock
              </v-icon>
              <v-icon v-else-if="userStatus.status === 'Online'" color="green">
                mdi-account
              </v-icon>
              <v-icon v-else>
                mdi-account
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ userStatus.user.username }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <v-list>
          <v-list-item dense @click="inviteToTheGame(userStatus.user.id)">
            <v-list-item-icon>
              <v-icon>
                mdi-gamepad-variant
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>Invite to the game</v-list-item-content>
          </v-list-item>
          <v-list-item dense @click="() => ({})">
            <v-list-item-icon>
              <v-icon>
                mdi-account-plus
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>Add to friends</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-list>
    <v-dialog v-model="showInviteDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">
          Game invite
        </v-card-title>
        <v-card-text>Player {{ inviteDialogData.username }} want to invite you to the game.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" text @click="showInviteDialog = false">
            Reject
          </v-btn>
          <v-btn color="primary" text @click="acceptGameRequest">
            Accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import userStatus from '~/apollo/subscriptions/userStatus'
import gameRequest from '~/apollo/subscriptions/gameRequest'
import gameResponse from '~/apollo/subscriptions/gameResponse'
import activeUsers from '~/apollo/queries/activeUsers'
import sendGameRequest from '~/apollo/mutations/sendGameRequest'
import acceptGameRequestAndStartGame from '~/apollo/mutations/acceptGameRequestAndStartGame'

export default {
  name: 'UserList',
  data: () => ({
    usersStatus: [],
    requestIds: {},
    showInviteDialog: false,
    inviteDialogData: {
      userId: null,
      username: null,
      requestId: null
    }
  }),
  mounted () {
    this.$apollo.query({
      query: activeUsers
    }).then((data) => {
      for (const activeUser of data.data.activeUsers) {
        this.updateUserStatus(activeUser)
      }

      const that = this

      const userStatusObserver = this.$apollo.subscribe({
        query: userStatus
      })
      userStatusObserver.subscribe({
        next (data) {
          that.updateUserStatus(data.data.userStatus)
        }
      })

      const gameRequestObserver = this.$apollo.subscribe({
        query: gameRequest
      })
      gameRequestObserver.subscribe({
        next (data) {
          const gameRequestData = data.data.gameRequest
          that.inviteDialogData.userId = gameRequestData.from.id
          that.inviteDialogData.username = gameRequestData.from.username
          that.inviteDialogData.requestId = gameRequestData.requestId
          that.showInviteDialog = true
        }
      })

      const gameResponseObserver = this.$apollo.subscribe({
        query: gameResponse
      })
      gameResponseObserver.subscribe({
        next (data) {
          const gameResponseData = data.data.gameResponse
          delete that.requestIds[gameResponseData.requestId]
          that.$router.push('/game')
        }
      })
    })
  },
  methods: {
    updateUserStatus (userStatus) {
      if (userStatus.status !== 'Offline') {
        this.usersStatus.push({
          user: {
            id: userStatus.user.id,
            username: userStatus.user.username
          },
          status: userStatus.status
        })
      } else {
        this.usersStatus.forEach((value, i) => {
          if (userStatus.user.id === value.user.id) {
            this.usersStatus.splice(i, 1)
          }
        })
      }
    },
    inviteToTheGame (userId) {
      this.$apollo.mutate({
        mutation: sendGameRequest,
        variables: {
          userId
        }
      }).then((value) => {
        this.requestIds[value.data.sendGameRequest] = userId
      })
    },
    acceptGameRequest () {
      this.showInviteDialog = false
      this.$apollo.mutate({
        mutation: acceptGameRequestAndStartGame,
        variables: {
          requestId: this.inviteDialogData.requestId
        }
      }).then(async (value) => {
        const data = value.data.acceptGameRequestAndStartGame
        if (data.__typename === 'Game') {
          await this.$router.push('/game')
        }
      })
    }
  }
}
</script>
