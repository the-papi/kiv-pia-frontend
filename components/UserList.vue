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
          <v-list-item dense @click="foobar">
            <v-list-item-icon>
              <v-icon>
                mdi-account-plus
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>Add to friends</v-list-item-content>
          </v-list-item>
          <v-list-item dense @click="foobar">
            <v-list-item-icon>
              <v-icon>
                mdi-gamepad-variant
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>Invite to the game</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-list>
  </div>
</template>

<script>
import userStatus from '~/apollo/subscriptions/userStatus'

export default {
  name: 'UserList',
  data: () => ({
    usersStatus: []
  }),
  mounted () {
    const observer = this.$apollo.subscribe({
      query: userStatus
    })

    const that = this
    observer.subscribe({
      next (data) {
        const newUserStatus = data.data.userStatus

        if (newUserStatus.status !== 'Offline') {
          that.usersStatus.push({
            user: {
              id: newUserStatus.user.id,
              username: newUserStatus.user.username
            },
            status: newUserStatus.status
          })
        } else {
          that.usersStatus.forEach((value, i) => {
            if (newUserStatus.user.id === value.user.id) {
              that.usersStatus.splice(i, 1)
            }
          })
        }
      }
    })
  },
  methods: {
    foobar () {
      return 5
    }
  }
}
</script>
