<script setup lang="ts">
import { useHandshakerStore } from '@/stores/useHandshakerStore'

const handshakerStore = useHandshakerStore()

const onConnect = () => {
  handshakerStore.initHandshaker(`ws://localhost:9090`)
}
</script>

<template>
  <div>
    <h1>Welcome Page.</h1>
    <button @click="onConnect">Connect</button>
  </div>
</template>
