<template>
  <section class="w-full h-full items-center justify-center flex bg-black">
    <a v-if="showLogin" :href="authUrl">
      Login with Spotify
    </a>
    <div v-else class="marquee">
      <div class="w-full flex items-center justify-center">
        <img class="h-screen z-10" v-if="albumCover" :src="albumCover.url" />
        <h1 class="z-0 whitespace-no-wrap text-white">
          {{ song.name }} - {{ artist }}
        </h1>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

import { Song } from '~/entities/Song'
import { AlbumCover } from '../entities/AlbumCover'
import { Artist } from '../entities/Artist'

export default Vue.extend({
  computed: {
    authUrl() {
      return `https://accounts.spotify.com/authorize?response_type=token&client_id=${
        process.env.CLIENT_ID
      }&scope=user-read-currently-playing&redirect_uri=${encodeURIComponent(
        location.href
      )}`
    },
    showLogin() {
      return !(this as any).song
    },
    albumCover(): AlbumCover | undefined {
      if (!(this as any).song) {
        return undefined
      }

      const images: AlbumCover[] = (this as any).song.album.images

      return images.find(image => image.width > 64 && image.width < 400)
    },
    artist() {
      if (!(this as any).song) {
        return undefined
      }

      const artists: Artist[] = (this as any).song.artists

      return artists.map(({ name }) => name).join(',')
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

    return { song: data.item as Song }
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

.marquee {
  width: 100%;
  overflow: hidden;
}
.marquee h1 {
  font-size: 3em;
  width: 100%;
  height: 100%;
  line-height: 50px;
  transform: translateY(-50%);
  animation: marquee 15s linear infinite;
}
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
