<template>
  <v-app>
    <div>
      <v-app-bar
        color="primary"
        dense
        dark
      >
        <v-toolbar-title>
          Tic Tac Toe
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn text to="/dashboard">
            Dashborad
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
        {{ this.$store.state.account.username }}
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
          </v-list>
        </v-menu>
      </v-app-bar>
    </div>
    <v-row>
      <v-col
        cols="10"
        sm="9"
        md="10"
        lg="10"
        xl="10"
        style="background-image: url('https://cdn.vuetifyjs.com/images/parallax/material.jpg'); background-size: cover;"
      >
        <v-container class="pa-16" fill-height>
          <v-row>
            <v-col />
            <v-col cols="12" sm="10" md="8" lg="7" xl="6">
              <nuxt />
            </v-col>
            <v-col />
          </v-row>
        </v-container>
      </v-col>
      <v-col
        cols="2"
        sm="3"
        md="2"
        lg="2"
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

export default {
  components: { UserList },
  middleware: ['auth'],
  data: () => ({
    users: []
  })
}
</script>
