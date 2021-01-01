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
            <v-text-field v-model.trim="username" label="Username" :rules="usernameRules" hide-details="auto" />
            <v-text-field v-model.trim="email" label="E-mail" type="email" :rules="emailRules" hide-details="auto" />
            <v-text-field v-model="password" label="Password" type="password" :rules="passwordRules" hide-details="auto" />
            <v-text-field v-model="passwordConfirm" label="Confirm password" type="password" :rules="passwordConfirmRules" hide-details="auto" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" :disabled="!valid" @click="signUp">
              Save
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </v-form>
</template>

<script>

export default {
  layout: 'default'
}
</script>
