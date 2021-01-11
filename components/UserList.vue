<template>
  <div>
    <v-list>
      <v-subheader v-show="Object.keys(onlineFriends).length">
        Online friends
      </v-subheader>
      <v-list-item v-for="user in onlineFriends" :key="'of' + user.id">
        <v-menu transition="slide-y-transition" offset-y left>
          <template v-slot:activator="{ on, attrs }">
            <v-list-item v-bind="attrs" v-on="on">
              <v-list-item-icon>
                <v-icon v-if="false" color="blue">
                  mdi-account-clock
                </v-icon>
                <v-icon v-else-if="user.online" color="green">
                  mdi-account
                </v-icon>
                <v-icon v-else>
                  mdi-account
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ user.username }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list>
            <v-list-item dense @click="inviteToTheGame(user.id, user.username)">
              <v-list-item-icon>
                <v-icon>
                  mdi-gamepad-variant
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>Invite to the game</v-list-item-content>
            </v-list-item>
            <v-list-item dense @click="removeFriend(user.id, user.username)">
              <v-list-item-icon>
                <v-icon>
                  mdi-account-minus
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>Remove friend</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item>
      <v-subheader v-show="Object.keys(pendingFriendRequests).length">
        Pending friend requests
      </v-subheader>
      <v-list-item v-for="user in pendingFriendRequests" :key="'pfr' + user.id">
        <v-menu transition="slide-y-transition" offset-y left>
          <template v-slot:activator="{ on, attrs }">
            <v-list-item v-bind="attrs" v-on="on">
              <v-list-item-icon>
                <v-icon v-if="false" color="blue">
                  mdi-account-clock
                </v-icon>
                <v-icon v-else-if="user.online" color="green">
                  mdi-account
                </v-icon>
                <v-icon v-else>
                  mdi-account
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ user.username }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list>
            <v-list-item dense @click="inviteToTheGame(user.id, user.username)">
              <v-list-item-icon>
                <v-icon>
                  mdi-gamepad-variant
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>Invite to the game</v-list-item-content>
            </v-list-item>
            <v-list-item dense @click="acceptFriendRequest(user.id)">
              <v-list-item-icon>
                <v-icon>
                  mdi-account-plus
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>Accept friend request</v-list-item-content>
            </v-list-item>
            <v-list-item dense @click="rejectFriendRequest(user.id)">
              <v-list-item-icon>
                <v-icon>
                  mdi-account-minus
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>Reject friend request</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item>
      <v-subheader v-show="Object.keys(onlineUsers).length">
        Online
      </v-subheader>
      <v-list-item v-for="user in onlineUsers" :key="'ou' + user.id">
        <v-menu transition="slide-y-transition" offset-y left>
          <template v-slot:activator="{ on, attrs }">
            <v-list-item v-bind="attrs" v-on="on">
              <v-list-item-icon>
                <v-icon v-if="false" color="blue">
                  mdi-account-clock
                </v-icon>
                <v-icon v-else-if="user.online" color="green">
                  mdi-account
                </v-icon>
                <v-icon v-else>
                  mdi-account
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ user.username }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list>
            <v-list-item dense @click="inviteToTheGame(user.id, user.username)">
              <v-list-item-icon>
                <v-icon>
                  mdi-gamepad-variant
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>Invite to the game</v-list-item-content>
            </v-list-item>
            <v-list-item dense @click="sendFriendRequest(user.id)">
              <v-list-item-icon>
                <v-icon>
                  mdi-account-plus
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>Send friend request</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item>
      <v-subheader v-show="Object.keys(offlineUsers).length">
        Offline
      </v-subheader>
      <v-list-item v-for="user in offlineUsers" :key="'offu' + user.id">
        <v-menu transition="slide-y-transition" offset-y left>
          <template v-slot:activator="{ on, attrs }">
            <v-list-item v-bind="attrs" v-on="on">
              <v-list-item-icon>
                <v-icon v-if="false" color="blue">
                  mdi-account-clock
                </v-icon>
                <v-icon v-else-if="user.online" color="green">
                  mdi-account
                </v-icon>
                <v-icon v-else>
                  mdi-account
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ user.username }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list />
        </v-menu>
      </v-list-item>
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
import me from '@/apollo/queries/me'
import acceptFriendRequest from '@/apollo/mutations/acceptFriendRequest'
import rejectFriendRequest from '@/apollo/mutations/rejectFriendRequest'
import userStatus from '~/apollo/subscriptions/userStatus'
import gameRequest from '~/apollo/subscriptions/gameRequest'
import gameResponse from '~/apollo/subscriptions/gameResponse'
import newFriendRequest from '~/apollo/subscriptions/newFriendRequest'
import updatedFriendStatus from '~/apollo/subscriptions/updatedFriendStatus'
import users from '~/apollo/queries/users'
import sendFriendRequest from '~/apollo/mutations/sendFriendRequest'
import sendGameRequest from '~/apollo/mutations/sendGameRequest'
import acceptGameRequestAndStartGame from '~/apollo/mutations/acceptGameRequestAndStartGame'
import rejectGameRequest from '~/apollo/mutations/rejectGameRequest'
import cancelGameRequest from '~/apollo/mutations/cancelGameRequest'
import removeFriend from '~/apollo/mutations/removeFriend'

export default {
  name: 'UserList',
  data: () => ({
    users: {},
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
    },
    account: {}
  }),
  computed: {
    onlineFriends () {
      const onlineFriends = {}
      for (const userId in this.users) {
        if (this.users[userId].friendStatus === 'Friend' && this.users[userId].online) {
          onlineFriends[userId] = this.users[userId]
        }
      }

      return onlineFriends
    },
    pendingFriendRequests () {
      const pendingFriendRequests = {}
      for (const userId in this.users) {
        if (this.users[userId].friendStatus === 'PendingRequest') {
          pendingFriendRequests[userId] = this.users[userId]
        }
      }

      return pendingFriendRequests
    },
    onlineUsers () {
      const onlineUsers = {}
      for (const userId in this.users) {
        if (this.users[userId].friendStatus === 'NotFriend' && this.users[userId].online) {
          onlineUsers[userId] = this.users[userId]
        }
      }

      return onlineUsers
    },
    offlineUsers () {
      const offlineUsers = {}
      for (const userId in this.users) {
        if (!this.users[userId].online) {
          offlineUsers[userId] = this.users[userId]
        }
      }

      return offlineUsers
    }
  },
  mounted () {
    this.users = {}

    const that = this

    this.$apollo.query({
      query: me
    }).then((data) => {
      that.account = data.data.me

      that.$apollo.query({
        query: users
      }).then((data) => {
        for (const user of data.data.users) {
          if (user.username === that.account.username) {
            continue
          }

          that.$set(that.users, user.id, {
            ...user
          })
        }

        const userStatusObserver = that.$apollo.subscribe({
          query: userStatus
        })
        userStatusObserver.subscribe({
          next (data) {
            const userStatus = data.data.userStatus
            that.updateUserStatus(userStatus.user.id, userStatus.status)
          }
        })

        const friendRequestObserver = that.$apollo.subscribe({
          query: newFriendRequest
        })
        friendRequestObserver.subscribe({
          next (data) {
            that.users[data.data.newFriendRequest.foreigner.id].friendStatus = 'PendingRequest'
          }
        })

        const updatedFriendStatusObserver = that.$apollo.subscribe({
          query: updatedFriendStatus
        })
        updatedFriendStatusObserver.subscribe({
          next (data) {
            that.users[data.data.updatedFriendStatus.id].friendStatus = data.data.updatedFriendStatus.friendStatus
          }
        })

        that.requestIds = {}
        const gameRequestObserver = that.$apollo.subscribe({
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

        const gameResponseObserver = that.$apollo.subscribe({
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
    })
  },
  methods: {
    updateUserStatus (id, status) {
      if (this.users[id]) {
        if (status === 'Online') {
          this.users[id].online = true
        } else if (status === 'Offline') {
          this.users[id].online = false
        }
      }
    },
    sendFriendRequest (userId) {
      this.$apollo.mutate({
        mutation: sendFriendRequest,
        variables: {
          foreignUserId: userId
        }
      })
    },
    acceptFriendRequest (userId) {
      this.$apollo.mutate({
        mutation: acceptFriendRequest,
        variables: {
          userId
        }
      }).then((data) => {
        if (data.data.acceptFriendRequest) {
          this.users[userId].friendStatus = 'Friend'
        }
      })
    },
    rejectFriendRequest (userId) {
      this.$apollo.mutate({
        mutation: rejectFriendRequest,
        variables: {
          userId
        }
      }).then((data) => {
        if (data.data.rejectFriendRequest) {
          this.users[userId].friendStatus = 'NotFriend'
        }
      })
    },
    removeFriend (userId) {
      this.$apollo.mutate({
        mutation: removeFriend,
        variables: {
          friendId: userId
        }
      }).then((data) => {
        console.log(data)
      })
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
