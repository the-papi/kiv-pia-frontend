export default function ({ app }, inject) {
  const watchers = []

  inject('errors', {
    push (text) {
      const err = { text }

      for (const watcher of watchers) {
        watcher(err)
      }
    },
    watch (callback) {
      watchers.push(callback)
    }
  })
}
