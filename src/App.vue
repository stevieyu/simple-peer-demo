<template>
  <old-app />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import oldApp from './components/oldApp.vue'
import peer from './lib/peer'

export default defineComponent({
  components: {
    oldApp
  },
  setup(){
    peer();

    return {

    }
  }
})
</script>