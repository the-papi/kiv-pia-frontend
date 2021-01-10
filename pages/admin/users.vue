<template>
  <div>
    <v-dialog v-model="showNewPassword" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">
          <span>Password reset</span>
        </v-card-title>
        <v-card-text>User's new password is:<br />{{ newPassword }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="showNewPassword = false">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-title class="headline">
        Users
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="users" :items-per-page="10">
          <template v-slot:item.resetPassword="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="resetPassword(item.id)">
                  <v-icon>mdi-lock-reset</v-icon>
                </v-btn>
              </template>
              <span>Reset password</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>

import users from '@/apollo/queries/users'
import resetPassword from '@/apollo/mutations/resetPassword'

export default {
  layout: 'default',
  data: () => ({
    showNewPassword: false,
    newPassword: null,
    headers: [
      {
        text: 'Username',
        value: 'username'
      },
      {
        text: 'E-mail',
        value: 'email'
      },
      {
        text: '',
        value: 'resetPassword',
        width: '1%'
      }
    ],
    users: []
  }),
  mounted () {
    this.$apollo.query({
      query: users,
      fetchPolicy: 'network-only'
    }).then((data) => {
      this.users = data.data.users
    })
  },
  methods: {
    resetPassword (id) {
      this.$apollo.mutate({
        mutation: resetPassword,
        variables: {
          userId: id
        }
      }).then((data) => {
        this.newPassword = data.data.resetPassword
        this.showNewPassword = true
      })
    }
  }
}
</script>
