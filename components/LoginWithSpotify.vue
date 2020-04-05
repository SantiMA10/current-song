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
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({})
export default class LoginWithSpotify extends Vue {
  @Prop({ type: String, default: process.env.NUXT_ENV_CLIENT_ID })
  public readonly clientId!: string;
  @Prop({ type: String, default: location.href.slice(0, -1) })
  public readonly redirectUri!: string;

  public get authUrl() {
    return `https://accounts.spotify.com/authorize?response_type=code&client_id=${
      this.clientId
    }&scope=user-read-currently-playing&redirect_uri=${encodeURIComponent(
      this.redirectUri
    )}`;
  }
}
</script>
