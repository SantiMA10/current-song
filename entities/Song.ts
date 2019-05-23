import { Album } from './Album'
import { Artist } from './Artist'

export interface Song {
  album: Album
  artists: Artist[]
  name: string
  duration_ms: number
}
