import { merge } from 'lodash';
import { DeepPartial } from 'utility-types';
import { Song } from '~/entities/Song';

export class SongBuilder {
  protected instance: Song = {
    name: "I'm a song",
    artists: [
      {
        name: 'Artist'
      }
    ],
    album: {
      images: [],
      name: 'Album'
    },
    progress_ms: 0,
    duration_ms: 0
  };

  public with(song: DeepPartial<Song>) {
    this.instance = merge(this.instance, song);
    return this;
  }

  public getInstance(): Song {
    return this.instance;
  }
}
