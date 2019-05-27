import { Song } from '~/entities/Song';

export class SongBuilder {
  public getInstance(): Song {
    return {
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
  }
}
