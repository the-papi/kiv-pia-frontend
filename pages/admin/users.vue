<template>
  <div>
    <v-dialog v-model="showNewPassword" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">
          <span>Password reset</span>
        </v-card-title>
        <v-card-text>User's new password is:<br>{{ newPassword }}</v-card-text>
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
          <template v-slot:item.changeUserRole="{ item }">
            <v-tooltip v-if="!item.admin" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="promoteToAdmin(item.id)">
                  <v-icon>mdi-account-cog</v-icon>
                </v-btn>
              </template>
              <span>Promote to admin</span>
            </v-tooltip>
            <v-tooltip v-else bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="degradeToUser(item.id)">
                  <v-icon>mdi-account</v-icon>
                </v-btn>
              </template>
              <span>Degrade to user</span>
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
import changeUserRole from '@/apollo/mutations/changeUserRole'

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
      },
      {
        text: '',
        value: 'changeUserRole',
        width: '1%'
      }
    ],
    users: []
  }),
  mounted () {
    this.reloadUsers()
  },
  methods: {
    reloadUsers () {
      this.$apollo.query({
        query: users,
        fetchPolicy: 'network-only'
      }).then((data) => {
        this.users = data.data.users
      })
    },
    resetPassword (id) {
      this.$apollo.mutate({
        mutation: resetPassword,
        variables: {
          userId: id
        }
      }).then((data) => {
        this.newPassword = data.data.resetPassword
        this.showNewPassword = true
        this.reloadUsers()
      })
    },
    promoteToAdmin (id) {
      this.$apollo.mutate({
        mutation: changeUserRole,
        variables: {
          userId: id,
          admin: true
        }
      }).then((data) => {
        if (data.data.changeUserRole) {
          this.reloadUsers()
          this.$snackbar.success('Successfully promoted to admin')
        }
      })
    },
    degradeToUser (id) {
      this.$apollo.mutate({
        mutation: changeUserRole,
        variables: {
          userId: id,
          admin: false
        }
      }).then((data) => {
        if (data.data.changeUserRole) {
          this.reloadUsers()
          this.$snackbar.success('Successfully degraded to user')
        }
      })
    }

  }
}
</script>
