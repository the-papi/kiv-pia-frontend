<template>
  <div>
    <v-menu offset-y full-width :disabled="friendRequests.length === 0">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          depressed
          v-on="on"
        >
          <span v-if="friendRequests.length === 0">Friend requests</span>
          <span v-else>Friend requests ({{ friendRequests.length }})</span>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in friendRequests"
          :key="index"
        >
          <v-list-item-title>
            <v-row align="center">
              <v-col>{{ item.foreigner.username }}</v-col>
              <v-col align-self="end">
                <v-btn
                  icon
                  color="green"
                  @click="acceptRequest(index)"
                >
                  <v-icon>mdi-check</v-icon>
                </v-btn>
                <v-btn
                  icon
                  color="red"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>

import friendRequests from '~/apollo/queries/friendRequests'
import acceptFriendRequest from '~/apollo/mutations/acceptFriendRequest'

export default {
  name: 'FriendRequests',
  data: () => ({
    friendRequests: []
  }),
  mounted () {
    const that = this

    this.$apollo.query({
      query: friendRequests
    }).then((data) => {
      that.friendRequests = data.data.friendRequests
    })
  },
  methods: {
    acceptRequest (index) {
      const that = this

      this.$apollo.mutate({
        mutation: acceptFriendRequest,
        variables: {
          requestId: this.friendRequests[index].id
        }
      }).then((data) => {
        if (data.data.acceptFriendRequest) {
          that.friendRequests.splice(index, 1)
        }
      })
    }
  }
}
</script>
