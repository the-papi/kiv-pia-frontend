<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6" lg="6" xl="4">
      <v-tabs
        fixed-tabs
      >
        <v-tab>
          Sign In
        </v-tab>
        <v-tab>
          Sign Up
        </v-tab>
        <v-tab-item>
          <SignIn />
        </v-tab-item>
        <v-tab-item>
          <SignUp />
        </v-tab-item>
        <v-tab-item />  <!-- Doesn't work properly without this -->
      </v-tabs>
    </v-col>
  </v-row>
</template>

<script>
import SignIn from '~/components/SignIn'
import SignUp from '~/components/SignUp'

export default {
  components: {
    SignIn, SignUp
  },
  layout: 'login'
}
</script>
