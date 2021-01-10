<template>
  <v-card flat>
    <v-card-title class="headline">
      Sign In
    </v-card-title>
    <v-card-text>
      <v-text-field v-model.trim="username" label="Username" :rules="usernameRules" hide-details="auto" @keypress.enter="signIn" />
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        :rules="passwordRules"
        hide-details="auto"
        @keypress.enter="signIn"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" :loading="loading" @click="signIn">
        Sign In
      </v-btn>
    </v-card-actions>

    <!--    <v-snackbar v-model="invalidLogin" color="red">-->
    <!--      Invalid login credentials-->
    <!--    </v-snackbar>-->
  </v-card>
</template>

<script>
import signIn from '@/apollo/mutations/login'
import me from '~/apollo/queries/me'

export default {
  layout: 'login',
  props: {
    redirectOnSuccess: {
      type: String,
      default: null
    }
  },
  data: () => ({
    loading: false,
    invalidLogin: false,
    username: '',
    password: '',
    usernameRules: [value => !!value || 'Required'],
    passwordRules: [value => !!value || 'Required']
  }),
  methods: {
    signIn () {
      this.loading = true
      this.$apollo.mutate({
        mutation: signIn,
        variables: {
          username: this.username,
          password: this.password
        }
      }).then(async (signIn) => {
        if (signIn.data.login) {
          await this.$apolloHelpers.onLogin(signIn.data.login.accessToken)
          this.$apollo.query({
            query: me
          }).then((me) => {
            this.$store.commit('account/set', me.data.me)
          })

          if (this.redirectOnSuccess) {
            await this.$router.push(this.redirectOnSuccess)
          }
        } else {
          this.$snackbar.error('Invalid login credentials')
          this.invalidLogin = true
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    }
  }
}
</script>
