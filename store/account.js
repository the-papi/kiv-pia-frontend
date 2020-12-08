export const state = () => ({
  id: null,
  username: null,
  email: null
})

export const mutations = {
  set (state, payload) {
    state.id = payload.id
    state.username = payload.username
    state.email = payload.email
  },
  flush (state) {
    state.id = null
    state.username = null
    state.email = null
  }
}
