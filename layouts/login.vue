<template>
  <v-app>
    <v-main>
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col>
            <nuxt />
          </v-col>
          <Snackbar />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

import Snackbar from '@/components/Snackbar'

export default {
  components: { Snackbar },
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  mounted () {
    if (this.$apolloHelpers.getToken()) {
      this.$router.push('/dashboard')
    }
  }
}
</script>
