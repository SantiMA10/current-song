import Vue from 'vue';
import axios from 'axios';

import { SET_CURRENT_PLAYING, SET_ERROR } from './mutation-types';
import { Song } from '~/entities/Song';

const state = () => ({
  currentPlaying: null,
  error: false,
});

const mutations = {
  [SET_CURRENT_PLAYING](state, currentPlaying) {
    console.log(currentPlaying);

    Vue.set(state, 'currentPlaying', currentPlaying);
  },
  [SET_ERROR](state, error) {
    state.error = error;
  },
};

const actions = {
  async fetchCurrentSong({ commit }, { token }) {
    try {
      const {
        data,
      } = await axios.get(
        'https://api.spotify.com/v1/me/player/currently-playing',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      commit(SET_CURRENT_PLAYING, data);
    } catch {
      commit(SET_ERROR, true);
    }
  },
};

const getters = {
  getSong({ currentPlaying }): Song | null {
    if (
      !currentPlaying ||
      currentPlaying.currently_playing_type === 'ad' ||
      currentPlaying.currently_playing_type === 'unknown'
    ) {
      return null;
    }

    if (currentPlaying.currently_playing_type === 'episode') {
      // eslint-disable-next-line camelcase
      const { album, artists, name, duration_ms } = currentPlaying.item || {};

      return {
        album: album || {
          name: '',
          images: [{ height: 100, url: '/podcast.png', width: 100 }],
        },
        artists: artists || [{ name: 'Podcast' }],
        name: name || 'Episode',
        // eslint-disable-next-line camelcase
        duration_ms: duration_ms || 5 * 1000,
        // eslint-disable-next-line camelcase
        progress_ms: duration_ms ? currentPlaying.progress_ms : 0,
      };
    }

    return {
      ...currentPlaying.item,
      progress_ms: currentPlaying.progress_ms,
    };
  },
  isPlaying({ currentPlaying }): boolean {
    return currentPlaying && currentPlaying.is_playing;
  },
  isError({ error }): boolean {
    return error;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
