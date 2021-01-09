<template>
  <v-app>
    <v-main>
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col>
            <nuxt />
          </v-col>
          <Errors />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

import Errors from '@/components/Errors'

export default {
  components: { Errors },
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
  }
}
</script>
