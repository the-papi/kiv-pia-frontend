<template>
  <v-card flat>
    <v-card-title class="headline">
      Sign In
    </v-card-title>
    <v-card-text>
      <v-text-field v-model.trim="username" label="Username" :rules="usernameRules" hide-details="auto" />
      <v-text-field v-model="password" label="Password" type="password" :rules="passwordRules" hide-details="auto" />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="signIn">
        Sign In
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import signIn from '~/apollo/queries/signIn'

export default {
  layout: 'login',
  data: () => ({
    username: '',
    password: '',
    usernameRules: [value => !!value || 'Required'],
    passwordRules: [value => !!value || 'Required']
  }),
  methods: {
    signIn () {
      this.$apollo.mutate({
        mutation: signIn,
        variables: {
          username: this.username,
          password: this.password
        }
      })
    }
  }
}
</script>
