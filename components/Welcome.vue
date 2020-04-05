<template>
  <div class="h-full flex flex-col text-white">
    <div class="text-right p-5">
      <modal name="colorSelector" class="h-screen">
        <chrome-picker v-model="color" class="z-50" @input="updateColor" />
      </modal>
      <button @click="show()">Color</button>
    </div>
    <div class="h-full flex items-center justify-center flex-col">
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import VModal from 'vue-js-modal';
import { Chrome } from 'vue-color';

import LoginWithSpotify from '~/components/LoginWithSpotify.vue';

Vue.use(VModal, { dialog: true });

export default Vue.extend({
  components: {
    LoginWithSpotify,
    'chrome-picker': Chrome,
  },
  props: {
    customColor: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      color: this.$props.customColor,
    };
  },
  methods: {
    show() {
      this.$modal.show('colorSelector');
    },
    hide() {
      this.$modal.hide('colorSelector');
    },
    updateColor({ hex }) {
      this.$emit('updateColorValue', hex);
    },
  },
});
</script>

<style>
.v--modal {
  background-color: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  place-items: center;
  box-shadow: none;
}
</style>
