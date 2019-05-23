<template>
  <div class="marquee">
    <div class="w-full flex items-center justify-center">
      <img v-if="albumCover" class="h-screen z-10" :src="albumCover.url" />
      <h1 class="z-0 whitespace-no-wrap text-white">
        {{ song.name }} - {{ artist }}
      </h1>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { AlbumCover } from '../entities/AlbumCover'
import { Artist } from '../entities/Artist'
import { Song } from '../entities/Song'

export default Vue.extend({
  props: {
    song: {
      required: true,
      type: Object as () => Song
    }
  },
  computed: {
    albumCover(): AlbumCover | undefined {
      if (!this.song) {
        return undefined
      }

      const images: AlbumCover[] = this.song.album.images

      return images.find(image => image.width > 64 && image.width < 400)
    },
    artist() {
      if (!this.song) {
        return undefined
      }

      const artists: Artist[] = this.song.artists

      return artists.map(({ name }) => name).join(',')
    }
  }
})
</script>

<style>
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
