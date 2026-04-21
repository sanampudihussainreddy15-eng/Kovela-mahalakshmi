
import { Track } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 2;
export const MIN_SPEED = 50;

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neural Synapse',
    artist: 'AI Maestro',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neural/400/400'
  },
  {
    id: '2',
    title: 'Cybernetic Pulse',
    artist: 'Synthetic Soul',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/pulse/400/400'
  },
  {
    id: '3',
    title: 'Silicon Dreaming',
    artist: 'Digital Echo',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/dream/400/400'
  }
];
