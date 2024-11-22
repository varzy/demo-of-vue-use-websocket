<script lang="ts" setup>
import { onMounted } from 'vue'
import { wsEmitter } from '@/stores/mitt'
import { useRouter } from 'vue-router'

const router = useRouter()

const log = (title: string, extra?: any) => {
  console.log(title)
  if (extra) console.log(extra)
}

const backToWelcome = () => {
  if (router.currentRoute.value.name !== 'Welcome') {
    router.replace({ name: 'Welcome' })
  }
}

const registerListeners = () => {
  wsEmitter.on('socket_connected', () => {
    log('✅ Connected to ws server.')
    router.replace({ name: 'Index' })
  })

  wsEmitter.on('socket_disconnected', (event) => {
    log('💔 Disconnected from ws server.', event)
    backToWelcome()
  })

  wsEmitter.on('socket_error', (error) => {
    log('❌ Connection error', error)
    backToWelcome()
  })

  wsEmitter.on('socket_message', (message: any) => {
    console.log(`⬇️ ${message.data}`)
    // ...
  })
}

onMounted(() => {
  registerListeners()
})
</script>

<template>
  <slot />
</template>
