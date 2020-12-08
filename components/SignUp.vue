<template>
  <v-form ref="form" v-model="valid">
    <v-card flat>
      <v-card-title class="headline">
        Sign Up
      </v-card-title>
      <v-card-text>
        <v-text-field v-model.trim="username" label="Username" :rules="usernameRules" hide-details="auto" />
        <v-text-field v-model.trim="email" label="E-mail" type="email" :rules="emailRules" hide-details="auto" />
        <v-text-field v-model="password" label="Password" type="password" :rules="passwordRules" hide-details="auto" />
        <v-text-field v-model="passwordConfirm" label="Confirm password" type="password" :rules="passwordConfirmRules" hide-details="auto" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" :disabled="!valid" @click="signUp">
          Sign Up
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import signUp from '~/apollo/mutations/signUp'

export default {
  layout: 'login',
  data: () => ({
    valid: true,
    username: '',
    password: '',
    passwordConfirm: '',
    email: '',
    usernameRules: [
      value => !!value || 'Required',
      value => value.length >= 4 || 'Username must have at least 4 characters'
    ],
    emailRules: [
      value => !!value || 'Required',
      value => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value) || 'E-mail must be valid'
    ],
    passwordRules: [value => !!value || 'Required']
  }),
  computed: {
    passwordConfirmRules () {
      return [
        value => !!value || 'Required',
        value => this.password === value || 'Passwords doesn\'t match'
      ]
    }
  },
  watch: {
    password: 'validatePassword'
  },
  methods: {
    signUp () {
      this.$apollo.mutate({
        mutation: signUp,
        variables: {
          username: this.username,
          email: this.email,
          password: this.password
        }
      })
    },
    validatePassword () {
      this.$refs.form.validate()
    }
  }
}
</script>
