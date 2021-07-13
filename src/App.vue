<template>
  <old-app />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import oldApp from './components/oldApp.vue'
import peer from './lib/peer'
// import GenUserSig from './lib/genUserSig.ts'

export default defineComponent({
  components: {
    oldApp
  },
  setup(){
    peer()

    // const sig = (new GenUserSig('1400085368', '9f0fb95bd7a8b97f6bc86b2b4910b37b15643b56a6cd1ea5691463f95b6eed50'))
    //     .genSig('1', 604800)

    // console.log(sig)

    return {

    }
  }
})
</script>