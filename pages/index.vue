<template>
  <section class="w-full h-full items-center justify-center flex bg-black">
    <LoginWithSpotify v-if="showLogin"></LoginWithSpotify>
    <CurrentSong v-else :song="song"></CurrentSong>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

import LoginWithSpotify from '~/components/LoginWithSpotify.vue'
import CurrentSong from '~/components/CurrentSong.vue'

import { Song } from '~/entities/Song'

export default Vue.extend({
  components: {
    LoginWithSpotify,
    CurrentSong
  },
  computed: {
    showLogin() {
      return !(this as any).song
    }
  },
  async asyncData() {
    if (!location.hash.includes('access_token')) {
      return {}
    }

    const token = location.hash
      .split('#access_token=')[1]
      .split('&token_type=')[0]

    const { data } = await axios.get(
      'https://api.spotify.com/v1/me/player/currently-playing',
      { headers: { Authorization: `Bearer ${token}` } }
    )

    return {
      song: {
        ...data.item,
        progress_ms: data.progress_ms
      } as Song
    }
  },
  data() {
    return {
      timeout: (null as unknown) as NodeJS.Timeout
    }
  },
  mounted() {
    this.resetTimeout()
  },
  methods: {
    async getCurrentSong(): Promise<Song> {
      const token = location.hash
        .split('#access_token=')[1]
        .split('&token_type=')[0]

      const { data } = await axios.get(
        'https://api.spotify.com/v1/me/player/currently-playing',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      return {
        ...data.item,
        progress_ms: data.progress_ms
      }
    },
    resetTimeout() {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      const song: Song = (this as any).song

      this.timeout = setTimeout(() => {
        this.$set(this, 'song', this.getCurrentSong())
        this.resetTimeout()
      }, song.duration_ms)
    }
  }
})
</script>

<style>
.container {
  margin: 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
