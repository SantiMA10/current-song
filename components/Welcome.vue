<template>
  <div class="text-white flex items-center justify-center flex-col">
    <h1 class="text-3xl">
      🎵 Current song 🎵
    </h1>
    <p class="ml-8 mr-8 pt-4 pb-4">
      Login with Spotify and get an URL you can add to OBS (or other streaming
      programs) to show your audiciente your current Spotify song.
    </p>
    <LoginWithSpotify />
    <footer class="text-white pt-4">
      Made with ❤ by <a href="https://santiagomartin.dev">@SantiMA10</a>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import LoginWithSpotify from '~/components/LoginWithSpotify.vue';

export default Vue.extend({
  components: {
    LoginWithSpotify
  }
});
</script>
