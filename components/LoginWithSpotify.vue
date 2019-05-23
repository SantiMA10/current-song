<template>
  <a
    class="bg-green-500 p-2 rounded-full m-2 hover:bg-green-400 shadow"
    :href="authUrl"
  >
    Login with Spotify
  </a>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  computed: {
    authUrl() {
      return `https://accounts.spotify.com/authorize?response_type=token&client_id=${
        process.env.NUXT_ENV_CLIENT_ID
      }&scope=user-read-currently-playing&redirect_uri=${encodeURIComponent(
        location.href.slice(0, -1)
      )}`;
    }
  }
});
</script>
