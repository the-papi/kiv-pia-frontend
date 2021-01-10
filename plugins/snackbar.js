export default function ({ app }, inject) {
  const watchers = []

  function push (text, severity) {
    const err = {
      text,
      severity
    }

    for (const watcher of watchers) {
      watcher(err)
    }
  }

  inject('snackbar', {
    error (text) {
      push(text, 'error')
    },
    warning (text) {
      push(text, 'warning')
    },
    info (text) {
      push(text, 'info')
    },
    success (text) {
      push(text, 'success')
    },
    watch (callback) {
      watchers.push(callback)
    }
  })
}
