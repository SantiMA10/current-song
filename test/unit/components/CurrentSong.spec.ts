import { mount } from '@vue/test-utils';

import CurrentSong from '~/components/CurrentSong.vue';
import { SongBuilder } from '~/test/builder/SongBuilder';
import { AlbumCover } from '~/entities/AlbumCover';

describe('CurrentSong', () => {
  it('renders', () => {
    const subject = mount(CurrentSong, {
      propsData: {
        song: new SongBuilder().getInstance()
      }
    });

    expect(subject.isVueInstance()).toBeTruthy();
  });

  it('not renders the album cover if there is images', () => {
    const subject = mount(CurrentSong, {
      propsData: {
        song: new SongBuilder().getInstance()
      }
    });

    expect(subject.find('img').exists()).toBeFalsy();
  });

  it('renders the album cover with width between 64 and 400 pixels', () => {
    const images: AlbumCover[] = [
      { url: 'https://picsum.photos/10', width: 10, height: 10 },
      { url: 'https://picsum.photos/200', width: 200, height: 200 }
    ];

    const subject = mount(CurrentSong, {
      propsData: {
        song: new SongBuilder().with({ album: { images } }).getInstance()
      }
    });

    const image = subject.find('img');

    expect(image).not.toBeNull();
    expect(image.attributes('src')).toEqual('https://picsum.photos/200');
  });
});
