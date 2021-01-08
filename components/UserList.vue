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
          <v-list-item dense @click="inviteToTheGame(userStatus.user.id, userStatus.user.username)">
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
    <v-dialog v-model="showWaitingDialog" persistent max-width="420">
      <v-card>
        <v-card-title class="headline">
          Waiting for response to invitation
        </v-card-title>
        <v-card-text class="text-center">
          <v-row>
            <v-col>
              <v-progress-circular v-if="!waitingDialogData.rejected" indeterminate color="primary" />
              <v-icon v-else color="red" x-large>
                mdi-close
              </v-icon>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span v-if="!waitingDialogData.rejected">Waiting for player {{ waitingDialogData.username }}</span>
              <span v-else>Player {{ waitingDialogData.username }} rejected your request.</span>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn v-if="!waitingDialogData.rejected" color="error" text @click="cancelGameRequest(waitingDialogData.requestId)">
            Cancel
          </v-btn>
          <v-btn v-else color="error" text @click="showWaitingDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showInviteDialog" persistent max-width="420">
      <v-card>
        <v-card-title class="headline">
          Game invite
        </v-card-title>
        <v-card-text>Player {{ inviteDialogData.username }} want to invite you to the game.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" text @click="rejectGameRequest(inviteDialogData.requestId)">
            Reject
          </v-btn>
          <v-btn color="primary" text @click="acceptGameRequest(inviteDialogData.requestId)">
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
import rejectGameRequest from '~/apollo/mutations/rejectGameRequest'
import cancelGameRequest from '~/apollo/mutations/cancelGameRequest'

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
    },
    showWaitingDialog: false,
    waitingDialogData: {
      username: null,
      requestId: null,
      rejected: false
    }
  }),
  mounted () {
    this.usersStatus = []
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

      this.requestIds = {}
      const gameRequestObserver = this.$apollo.subscribe({
        query: gameRequest
      })
      gameRequestObserver.subscribe({
        next (data) {
          const gameRequestData = data.data.gameRequest
          if (gameRequestData.__typename === 'GameRequest') {
            that.inviteDialogData.userId = gameRequestData.from.id
            that.inviteDialogData.username = gameRequestData.from.username
            that.inviteDialogData.requestId = gameRequestData.requestId
            that.showInviteDialog = true
          } else if (gameRequestData.__typename === 'GameRequestCancelled') {
            that.showInviteDialog = false
          }
        }
      })

      const gameResponseObserver = this.$apollo.subscribe({
        query: gameResponse
      })
      gameResponseObserver.subscribe({
        next (data) {
          const gameResponseData = data.data.gameResponse
          if (gameResponseData.status.toLowerCase() === 'accepted') {
            that.showWaitingDialog = false
            delete that.requestIds[gameResponseData.requestId]
            that.$router.push('/game')
          } else {
            that.waitingDialogData.rejected = true
          }
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
    inviteToTheGame (userId, username) {
      this.$apollo.mutate({
        mutation: sendGameRequest,
        variables: {
          userId
        }
      }).then((value) => {
        const requestId = value.data.sendGameRequest
        this.requestIds[requestId] = userId
        this.waitingDialogData.username = username
        this.waitingDialogData.requestId = requestId
        this.waitingDialogData.rejected = false
        this.showWaitingDialog = true
      })
    },
    acceptGameRequest (requestId) {
      this.showInviteDialog = false
      this.$apollo.mutate({
        mutation: acceptGameRequestAndStartGame,
        variables: {
          requestId
        }
      }).then(async (value) => {
        const data = value.data.acceptGameRequestAndStartGame
        if (data.__typename === 'Game') {
          await this.$router.push('/game')
        }
      })
    },
    rejectGameRequest (requestId) {
      this.showInviteDialog = false
      this.$apollo.mutate({
        mutation: rejectGameRequest,
        variables: {
          requestId
        }
      })
    },
    cancelGameRequest (requestId) {
      this.showWaitingDialog = false
      this.$apollo.mutate({
        mutation: cancelGameRequest,
        variables: {
          requestId
        }
      })
    }
  }
}
</script>
