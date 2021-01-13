<template>
  <v-form ref="form" v-model="valid">
    <v-card flat>
      <v-card-title class="headline">
        Sign Up
      </v-card-title>
      <v-card-text>
        <v-text-field v-model.trim="email" label="E-mail" type="email" :rules="emailRules" hide-details="auto" />
        <v-text-field v-model="password" label="Password" type="password" :rules="passwordRules" hide-details="auto" />
        <v-progress-linear :color="passwordScore.color" :value="passwordScore.value" />
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
import register from '@/apollo/mutations/register'

export default {
  layout: 'login',
  data: () => ({
    valid: true,
    password: '',
    passwordConfirm: '',
    email: '',
    emailRules: [
      value => !!value || 'Required',
      value => (!!value && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) || 'E-mail must be valid'
    ],
    passwordRules: [value => !!value || 'Required', value => (value && value.length > 5) || 'Password needs to have at least 6 characters']
  }),
  computed: {
    passwordConfirmRules () {
      return [
        value => !!value || 'Required',
        value => this.password === value || 'Passwords doesn\'t match'
      ]
    },
    passwordScore () {
      if (/^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{12,}$/.test(this.password)) {
        return {
          value: 100,
          color: 'blue'
        }
      } else if (/^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/.test(this.password)) {
        return {
          value: 75,
          color: 'green'
        }
      } else if (/^(?=.*[A-Z].*[A-Z])(?=.*[0-9].*[0-9]).{6,}$/.test(this.password)) {
        return {
          value: 50,
          color: 'orange'
        }
      } else if (this.password && this.password.length > 5) {
        return {
          value: 25,
          color: 'red'
        }
      }

      return {
        value: 0,
        color: 'red'
      }
    }
  },
  watch: {
    password: 'validatePassword'
  },
  methods: {
    signUp () {
      this.$apollo.mutate({
        mutation: register,
        variables: {
          email: this.email,
          password: this.password
        }
      }).then((data) => {
        const registerData = data.data.register

        if (registerData.__typename === 'EmailAlreadyUsed') {
          this.$snackbar.error('This email is already used')
        } else if (registerData.__typename === 'PasswordTooWeak') {
          this.$snackbar.error('Password is too weak')
        } else {
          this.$refs.form.reset()
          this.$snackbar.success('Registration completed successfully. You can sign in.')
        }
      })
    },
    validatePassword () {
      this.$refs.form.validate()
    }
  }
}
</script>
