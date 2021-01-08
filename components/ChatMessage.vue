<template>
  <v-row no-gutters>
    <v-col cols="12" sm="2" md="2" lg="2" xl="2">
      <span :class="usernameColor + '--text'">{{ username }}</span>
    </v-col>
    <v-col>
      {{ message }}
    </v-col>
  </v-row>
</template>

<script>

export default {
  props: {
    username: {
      type: String,
      default: null
    },
    time: {
      type: String,
      default: null
    },
    message: {
      type: String,
      default: null
    },
    usernameColor: {
      type: String,
      default: null
    }
  }
}
</script>
