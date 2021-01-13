<template>
  <v-app>
    <div>
      <v-app-bar
        color="primary"
        dense
        dark
      >
        <v-toolbar-items>
          <v-btn text to="/dashboard">
            <v-icon>mdi-gamepad-square</v-icon>
            <span class="ml-2 d-none d-sm-flex">Games history</span>
          </v-btn>
        </v-toolbar-items>
        <v-toolbar-items>
          <v-btn v-if="account.admin" text to="/admin/users">
            <v-icon>mdi-cog</v-icon>
            <span class="ml-2 d-none d-sm-flex">Users administration</span>
          </v-btn>
        </v-toolbar-items>
        <v-spacer />
        <v-spacer />
        <v-spacer />
        <v-spacer />
        <v-spacer />
        <v-spacer />
        <v-spacer />
        <v-spacer />
        <v-spacer />
        {{ account.username }}
        <v-menu transition="slide-y-transition" offset-y left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item to="/profile">
              <v-list-item-title>My profile</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logOut">
              <v-list-item-title>Log out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
    </div>
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="12"
        md="9"
        lg="9"
        xl="10"
        style="background-image: url('https://cdn.vuetifyjs.com/images/parallax/material.jpg'); background-size: cover;"
      >
        <v-container class="pa-0 pa-sm-2 pa-md-16" fill-height>
          <v-row class="ma-0 pa-0">
            <v-col class="pa-0 pd-sm-4" />
            <v-col
              cols="12"
              sm="12"
              md="10"
              lg="9"
              xl="7"
              class="pa-0 pa-sm-4"
            >
              <nuxt />
            </v-col>
            <v-col class="pa-0 pd-sm-4" />
            <Snackbar />
          </v-row>
        </v-container>
      </v-col>
      <v-col
        cols="0"
        sm="0"
        md="3"
        lg="3"
        xl="2"
        class="pa-0"
      >
        <div class="d-flex" style="height: 100%">
          <v-divider vertical />
          <v-responsive>
            <UserList />
          </v-responsive>
        </div>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import UserList from '@/components/UserList'
import Snackbar from '@/components/Snackbar'
import me from '~/apollo/queries/me'

export default {
  components: {
    Snackbar,
    UserList
  },
  middleware: ['auth'],
  data: () => ({
    users: [],
    account: {}
  }),
  mounted () {
    this.$apollo.query({
      query: me
    }).then((data) => {
      this.account = data.data.me
    })
  },
  methods: {
    logOut () {
      this.$apolloHelpers.onLogout()
      this.$router.push('/')
    }
  }
}
</script>
