<template>
  <v-card class="d-flex flex-column" max-height="200px" min-height="200px" flat>
    <v-card-text ref="chatMessagesWrapper" class="flex-grow-1 overflow-auto">
      <div>
        <ChatMessage message="Say hello to your opponent" username="system" />
        <ChatMessage v-for="message in messages" :key="message.id" :message="message.text" :username="message.username" :username-color="userColors[message.username]" />
      </div>
    </v-card-text>
    <v-card-text class="pt-0">
      <v-row no-gutters>
        <v-col>
          <v-textarea
            v-model="newMessage"
            auto-grow
            dense
            rows="1"
            single-line
            hide-details
            label="Start typing..."
            @keypress.enter="sendMessage"
          />
        </v-col>
        <v-col cols="auto">
          <v-btn icon color="primary" @click="sendMessage">
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>

import ChatMessage from '@/components/ChatMessage'
import chatMessagesForActiveGame from '@/apollo/queries/chatMessagesForActiveGame'
import sendChatMessage from '@/apollo/mutations/sendChatMessage'
import newChatMessage from '@/apollo/subscriptions/newChatMessage'

export default {
  components: { ChatMessage },
  props: {
    userColors: {
      type: Object,
      default: () => {
      }
    }
  },
  data: () => ({
    newMessage: null,
    messages: []
  }),
  mounted () {
    const that = this
    const newChatMessageObserver = this.$apollo.subscribe({
      query: newChatMessage
    })
    newChatMessageObserver.subscribe({
      next (data) {
        const newChatMessage = data.data.newChatMessage
        that.addChatMessage({
          id: newChatMessage.id,
          username: newChatMessage.from.username,
          text: newChatMessage.message,
          time: newChatMessage.time
        })
      }
    })

    this.$apollo.query({
      query: chatMessagesForActiveGame
    }).then((data) => {
      const chatMessages = data.data.chatMessagesForActiveGame
      for (const chatMessage of chatMessages) {
        that.addChatMessage({
          id: chatMessage.id,
          username: chatMessage.from.username,
          text: chatMessage.message,
          time: chatMessage.time
        })
      }
    })
  },
  methods: {
    addChatMessage (chatMessage) {
      this.messages.push(chatMessage)
      this.$nextTick(() => {
        this.$refs.chatMessagesWrapper.scrollTop = this.$refs.chatMessagesWrapper.scrollHeight
      })
    },
    sendMessage () {
      this.$apollo.mutate({
        mutation: sendChatMessage,
        variables: {
          message: this.newMessage
        }
      }).then((data) => {
        this.newMessage = ''
      })
    }
  }
}
</script>
