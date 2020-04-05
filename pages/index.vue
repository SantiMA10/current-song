<template>
  <section
    class="w-auto h-screen bg-black"
    :style="{ backgroundColor: customColor }"
  >
    <div v-if="error" class="text-white text-3xl">
      😅 Your spotify token is not working, try to login again 😅
    </div>
    <template v-else>
      <Welcome
        v-if="showLogin"
        :customColor="customColor"
        @updateColorValue="
          (color) => {
            customColor = color;
            updateColorValue(color);
          }
        "
      />
      <template v-else>
        <CurrentSong v-if="isPlaying" :song="song" :customColor="customColor" />
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
import qs from 'qs';

import { Song } from '../entities/Song';
import CurrentSong from '~/components/CurrentSong.vue';
import Welcome from '~/components/Welcome.vue';

const spotify = namespace('spotify');

@Component({
  components: {
    Welcome,
    CurrentSong,
  },
  data() {
    return {
      customColor: '#000000',
    };
  },
  methods: {
    updateColorValue(color) {
      sessionStorage.setItem('color', color);
    },
  },
  async asyncData({ store }) {
    let accessToken: string | undefined;
    let refreshToken: string | undefined;
    const query = qs.parse(location.search, { ignoreQueryPrefix: true });

    if (query.code) {
      ({
        access_token: accessToken,
        refresh_token: refreshToken,
      } = (await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(
            `${process.env.NUXT_ENV_CLIENT_ID}:${process.env.NUXT_ENV_CLIENT_SECRET}`
          )}`,
        },
        body: qs.stringify({
          grant_type: 'authorization_code',
          code: query.code,
          redirect_uri: location.host.includes('localhost')
            ? 'http://localhost'
            : `${location.protocol}//${location.host}`,
        }),
      }).then((res) => res.json())) as any);

      location.search = `?access_token=${accessToken}&refresh_token=${refreshToken}`;
    }

    if (query.access_token && query.refresh_token) {
      accessToken = query.access_token;
      refreshToken = query.refresh_token;
    }

    if (!accessToken || !refreshToken) {
      return {};
    }

    await store.dispatch('spotify/fetchCurrentSong', { token: accessToken });

    return {
      token: accessToken,
      refreshToken,
    };
  },
  mounted() {
    (this as Index).resetTimeout();
    (this as Index).refreshTokenTimeout();
  },
} as any)
export default class Index extends Vue {
  public timeout!: NodeJS.Timeout;
  public refreshTimeout!: NodeJS.Timeout;
  public token!: string;
  public refreshToken!: string;

  @spotify.Getter('getSong') public song!: Song;
  @spotify.Getter('isError') public error!: boolean;
  @spotify.Getter('isPlaying') public isPlaying!: boolean;

  @spotify.Action('fetchCurrentSong') public fetchCurrentSong!: Function;

  public get showLogin() {
    return !this.token;
  }

  public refreshTokenTimeout() {
    if (!this.resetTimeout) {
      return;
    }

    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    const whenToRefresh = 3000 * 1000;

    this.refreshTimeout = setTimeout(async () => {
      await this.refreshTokenTimeout();
      this.refreshTokenTimeout();
    }, whenToRefresh);
  }

  public async getNewToken() {
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
    } = (await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(
          `${process.env.NUXT_ENV_CLIENT_ID}:${process.env.NUXT_ENV_CLIENT_SECRET}`
        )}`,
      },
      body: qs.stringify({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
        redirect_uri: location.host.includes('localhost')
          ? 'http://localhost'
          : `${location.protocol}//${location.host}`,
      }),
    }).then((res) => res.json())) as any;

    this.token = accessToken;
    this.refreshToken = refreshToken;

    location.search = `?access_token=${accessToken}&refresh_token=${refreshToken}`;
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
