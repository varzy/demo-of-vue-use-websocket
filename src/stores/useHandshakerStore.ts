import { ref, computed, toRefs, shallowRef, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { SettingsSchema, ClientToServerMessages, ServerToClientMessages } from './handshaker'
import { wsEmitter } from './mitt'
import { useWebSocket } from '@vueuse/core'
import type { UseWebSocketReturn } from '@vueuse/core'

export const useHandshakerStore = defineStore('handshaker', () => {
  const handshaker = shallowRef<UseWebSocketReturn<any> | null>(null)
  const handshakerId = ref<number>(0)
  const systemSettings = reactive<SettingsSchema>({
    volume: 50
  })
  const connectionInfo = reactive({
    url: '',
    isConnected: false
  })

  const initHandshaker = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const rejectTimeout = setTimeout(() => {
        if (!connectionInfo.isConnected) reject(new Error('connection_timeout'))
      }, 1000)

      if (handshaker.value) {
        console.log('initHandshaker: Handshaker instance already exists, will destroy it.')
        handshaker.value.close()
        handshaker.value = null
      }

      handshakerId.value = handshakerId.value + 1
      console.log(
        `initHandshaker: No handshaker instance, init a new one. ID: ${handshakerId.value}; URL: ${url}`
      )
      handshaker.value = useWebSocket(url, {
        heartbeat: {
          message: encodeMessage('ping')
        },
        onConnected: () => {
          connectionInfo.isConnected = true
          connectionInfo.url = url
          clearTimeout(rejectTimeout)
          wsEmitter.emit('socket_connected')
          resolve()
        },
        onDisconnected: (_, event) => {
          connectionInfo.isConnected = false
          connectionInfo.url = ''
          clearTimeout(rejectTimeout)
          wsEmitter.emit('socket_disconnected', event)
          reject(new Error('socket_disconnected'))
        },
        onError: (_, error) => {
          connectionInfo.isConnected = false
          connectionInfo.url = ''
          clearTimeout(rejectTimeout)
          wsEmitter.emit('socket_error', error)
          reject(error)
        },
        onMessage: (_, message) => {
          wsEmitter.emit('socket_message', message)
        }
      })
    })
  }

  const sendMessage = (event: ClientToServerMessages, payload?: any) =>
    new Promise((resolve) => {
      const encodedMessage = encodeMessage(event, payload)
      console.log(`⬆️ ${encodedMessage}`)
      handshaker.value?.send(encodedMessage)
      wsEmitter.on(event, resolve)
    })

  const encodeMessage = <T>(event: ClientToServerMessages, payload?: T): string =>
    JSON.stringify({
      origin: 'client',
      event,
      payload: payload || {}
    })

  return {
    handshakerId,
    handshaker,
    initHandshaker,
    connectionInfo,
    sendMessage,
    encodeMessage
  }
})
