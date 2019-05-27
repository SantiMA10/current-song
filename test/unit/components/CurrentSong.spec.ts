import { mount } from '@vue/test-utils';

import CurrentSong from '~/components/CurrentSong.vue';
import { SongBuilder } from '~/test/builder/SongBuilder';
import { AlbumCover } from '~/entities/AlbumCover';
import { Artist } from '~/entities/Artist';

describe('CurrentSong', () => {
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

    expect(image.exists()).toBeTruthy();
    expect(image.attributes('src')).toEqual('https://picsum.photos/200');
  });

  it('renders multiple artist names', () => {
    const artists: Artist[] = [
      {
        name: 'artist 1'
      },
      {
        name: 'artist 2'
      }
    ];

    const subject = mount(CurrentSong, {
      propsData: {
        song: new SongBuilder().with({ artists }).getInstance()
      }
    });

    const songComponent = subject.find('.qa-song');

    expect(songComponent.exists()).toBeTruthy();
    expect(songComponent.text()).toContain(
      artists.map(({ name }) => name).join(', ')
    );
  });

  it('renders one artist name', () => {
    const artists: Artist[] = [
      {
        name: 'artist 1'
      }
    ];

    const subject = mount(CurrentSong, {
      propsData: {
        song: new SongBuilder().with({ artists }).getInstance()
      }
    });

    const songComponent = subject.find('.qa-song');

    expect(songComponent.exists()).toBeTruthy();
    expect(songComponent.text()).toContain(artists[0].name);
  });

  it('renders the song name', () => {
    const song = new SongBuilder().getInstance();

    const subject = mount(CurrentSong, {
      propsData: {
        song
      }
    });

    const songComponent = subject.find('.qa-song');

    expect(songComponent.exists()).toBeTruthy();
    expect(songComponent.text()).toContain(song.name);
  });

  it('renders', () => {
    const subject = mount(CurrentSong, {
      propsData: {
        song: new SongBuilder().getInstance()
      }
    });

    expect(subject.element).toMatchSnapshot();
  });
});
