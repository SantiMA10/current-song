<template>
  <section
    class="w-full h-screen items-center justify-center flex flex-col bg-black"
  >
    <Welcome v-if="showLogin"> </Welcome>
    <template v-else>
      <CurrentSong v-if="isPlaying" :song="song" />
      <div class="text-white text-5xl" v-else>
        🎼 You're not listening to music 🎼
      </div>
    </template>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';

import CurrentSong from '~/components/CurrentSong.vue';
import Welcome from '~/components/Welcome.vue';

import { Song } from '~/entities/Song';

export default Vue.extend({
  components: {
    Welcome,
    CurrentSong
  },
  data() {
    return {
      timeout: (null as unknown) as NodeJS.Timeout,
      song: (null as unknown) as Song
    };
  },
  computed: {
    showLogin() {
      return !(this as any).song;
    }
  },
  async asyncData() {
    if (!location.hash.includes('access_token')) {
      return {};
    }

    const token = location.hash
      .split('#access_token=')[1]
      .split('&token_type=')[0];

    const { data } = await axios.get(
      'https://api.spotify.com/v1/me/player/currently-playing',
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return {
      isPlaying: data.is_playing,
      song: {
        ...data.item,
        progress_ms: data.progress_ms
      } as Song
    };
  },
  mounted() {
    (this as any).resetTimeout();
  },
  methods: {
    async getCurrentSong(): Promise<Song> {
      const token = location.hash
        .split('#access_token=')[1]
        .split('&token_type=')[0];

      const { data } = await axios.get(
        'https://api.spotify.com/v1/me/player/currently-playing',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return {
        isPlaying: data.is_playing,
        ...data.item,
        progress_ms: data.progress_ms
      };
    },
    resetTimeout() {
      const song: Song = (this as any).song;

      if (!song) {
        return;
      }

      if ((this as any).timeout) {
        clearTimeout((this as any).timeout);
      }

      // I add 15 to be sure than the song is finished
      const whenToRefresh = song.duration_ms - song.progress_ms + 15;

      (this as any).timeout = setTimeout(async () => {
        this.$set(this, 'song', await (this as any).getCurrentSong());
        (this as any).resetTimeout();
      }, whenToRefresh);
    }
  }
});
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
