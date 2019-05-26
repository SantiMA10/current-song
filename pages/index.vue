<template>
  <section
    class="w-full h-screen items-center justify-center flex flex-col bg-black"
  >
    <div v-if="error" class="text-white text-5xl">
      😅 Your spotify token is not working, try to login again 😅
    </div>
    <template v-else>
      <Welcome v-if="showLogin"> </Welcome>
      <template v-else>
        <CurrentSong v-if="isPlaying" :song="song" />
        <div class="text-white text-5xl" v-else>
          🎼 You're not listening to music 🎼
        </div>
      </template>
    </template>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

import CurrentSong from '~/components/CurrentSong.vue';
import Welcome from '~/components/Welcome.vue';

import { Song } from '../entities/Song';

export default Vue.extend({
  components: {
    Welcome,
    CurrentSong
  },
  data() {
    return {
      timeout: (null as unknown) as NodeJS.Timeout,
      token: null
    };
  },
  computed: {
    ...mapGetters('spotify', {
      song: 'getSong',
      error: 'isError',
      isPlaying: 'isPlaying'
    }),
    showLogin() {
      return !(this as any).song;
    }
  },
  async asyncData({ store }) {
    if (!location.hash.includes('access_token')) {
      return {};
    }

    const token = location.hash
      .split('#access_token=')[1]
      .split('&token_type=')[0];

    await store.dispatch('spotify/fetchCurrentSong', { token });

    return {
      token
    };
  },
  mounted() {
    this.resetTimeout();
  },
  methods: {
    ...mapActions('spotify', ['fetchCurrentSong']),
    resetTimeout() {
      if ((this as any).error || !(this as any).song || !this.token) {
        return;
      }

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      const song: Song = (this as any).song as Song;
      // I add 15 to be sure than the song is finished
      const whenToRefresh = song.duration_ms - song.progress_ms + 15;

      this.timeout = setTimeout(async () => {
        await (this as any).fetchCurrentSong({ token: this.token });
        this.resetTimeout();
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
