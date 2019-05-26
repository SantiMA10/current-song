import Vue from 'vue';
import axios from 'axios';

import { SET_CURRENT_PLAYING, SET_ERROR } from './mutation-types';
import { Song } from '~/entities/Song';

const state = {
  currentPlaying: null,
  error: false
};

const mutations = {
  [SET_CURRENT_PLAYING](state, currentPlaying) {
    Vue.set(state, 'currentPlaying', currentPlaying);
  },
  [SET_ERROR](state, error) {
    state.error = error;
  }
};

const actions = {
  async fetchCurrentSong({ commit }, { token }) {
    try {
      const { data } = await axios.get(
        'https://api.spotify.com/v1/me/player/currently-playing',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      commit(SET_CURRENT_PLAYING, data);
    } catch {
      commit(SET_ERROR, true);
    }
  }
};

const getters = {
  getSong({ currentPlaying }): Song | null {
    if (!currentPlaying) {
      return null;
    }

    return {
      ...currentPlaying.item,
      progress_ms: currentPlaying.progress_ms
    };
  },
  isPlaying({ currentPlaying }): boolean {
    return currentPlaying && currentPlaying.is_playing;
  },
  isError({ error }): boolean {
    return error;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
