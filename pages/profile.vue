<template>
  <v-form ref="form" v-model="valid">
    <v-card>
      <v-row>
        <v-col>
          <v-container fill-height>
            <v-icon size="200px" class="ml-auto mr-auto">
              mdi-account
            </v-icon>
          </v-container>
        </v-col>
        <v-divider vertical />
        <v-col>
          <v-card-title class="headline">
            My profile
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="oldPassword" label="Old password" type="password" hide-details="auto" />
            <v-text-field v-model="password" label="Password" type="password" :rules="passwordRules" hide-details="auto" />
            <v-progress-linear :color="passwordScore.color" :value="passwordScore.value" />
            <v-text-field v-model="passwordConfirm" label="Confirm password" type="password" :rules="passwordConfirmRules" hide-details="auto" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" :disabled="!valid" @click="updateProfile">
              Save
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </v-form>
</template>

<script>

import changePassword from '~/apollo/mutations/changePassword'

export default {
  layout: 'default',
  data: () => ({
    valid: true,
    oldPassword: '',
    password: '',
    passwordConfirm: '',
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
    validatePassword () {
      this.$refs.form.validate()
    },
    updateProfile () {
      this.$apollo.mutate({
        mutation: changePassword,
        variables: {
          oldPassword: this.oldPassword,
          newPassword: this.password
        }
      }).then((data) => {
        if (data.data.changePassword) {
          this.$refs.form.reset()
          this.$snackbar.success('Password changed successfully')
        } else {
          this.$snackbar.error('Old password is incorrect')
        }
      })
    }
  }
}
</script>
