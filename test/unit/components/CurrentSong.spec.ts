import { mount } from '@vue/test-utils';

import CurrentSong from '~/components/CurrentSong.vue';
import { SongBuilder } from '~/test/builder/SongBuilder';

describe('CurrentSong', () => {
  it('renders', () => {
    const subject = mount(CurrentSong, {
      propsData: {
        song: new SongBuilder().getInstance()
      }
    });

    expect(subject.isVueInstance()).toBeTruthy();
  });
});
