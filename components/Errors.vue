<template>
  <div>
    <v-snackbar v-model="displayError" :timeout="timeout" color="red">
      {{ currentError.text }}
    </v-snackbar>
  </div>
</template>

<script>

export default {
  data: () => ({
    displayError: false,
    displayedAtTime: null,
    currentError: {
      text: null
    },
    timeout: 5000,
    queueLength: 0,
    errorQueue: []
  }),
  watch: {
    queueLength (newValue, oldValue) {
      if (newValue > oldValue) {
        this.tryShowError()
      }
    }
  },
  mounted () {
    this.$errors.watch((err) => {
      this.errorQueue.push(err)
      this.queueLength++
    })
  },
  methods: {
    tryShowError () {
      if (!this.displayError) {
        this.queueLength--
        this.showError(this.errorQueue.shift())
      } else {
        let timeout = this.timeout - ((new Date()).getTime() - this.displayedAtTime)
        if (timeout < 0) {
          timeout = 0
        }
        setTimeout(this.tryShowError, timeout)
      }
    },
    showError (err) {
      this.displayError = true
      this.displayedAtTime = (new Date()).getTime()
      this.currentError.text = err.text
    }
  }
}
</script>
