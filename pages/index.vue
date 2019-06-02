<template>
  <section
    class="w-full h-screen items-center justify-center flex flex-col bg-black"
  >
    <div v-if="error" class="text-white text-3xl">
      😅 Your spotify token is not working, try to login again 😅
    </div>
    <template v-else>
      <Welcome v-if="showLogin" />
      <template v-else>
        <CurrentSong v-if="isPlaying" :song="song" />
        <div v-else class="text-white text-3xl">
          🎼 You're not listening to music 🎼
        </div>
      </template>
    </template>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { namespace } from 'vuex-class';
import Component from 'vue-class-component';

import CurrentSong from '~/components/CurrentSong.vue';
import Welcome from '~/components/Welcome.vue';

import { Song } from '../entities/Song';

const spotify = namespace('spotify');

@Component({
  components: {
    Welcome,
    CurrentSong
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
    (this as Index).resetTimeout();
  }
})
export default class Index extends Vue {
  public timeout!: NodeJS.Timeout;
  public token!: string;

  @spotify.Getter('getSong') public song!: Song;
  @spotify.Getter('isError') public error!: boolean;
  @spotify.Getter('isPlaying') public isPlaying!: boolean;

  @spotify.Action('fetchCurrentSong') public fetchCurrentSong!: Function;

  public get showLogin() {
    return !this.token;
  }

  public resetTimeout() {
    if (this.error || !this.song || !this.token) {
      return;
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    // I add 15 to be sure than the song is finished
    const whenToRefresh = this.song.duration_ms - this.song.progress_ms + 15;

    this.timeout = setTimeout(async () => {
      await this.fetchCurrentSong({ token: this.token });
      this.resetTimeout();
    }, whenToRefresh);
  }
}
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
