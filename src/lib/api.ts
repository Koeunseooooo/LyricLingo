// const API_URL = "https://lyriclingo-be-production-7e27.up.railway.app/api";
const API_URL = "http://localhost:3001/api";
export interface SongFromAPI {
  id: number;
  title: string;
  artist: string;
  album: string;
  release_date: string;
  created_at: string;
  album_image_url: string;
  genre: string;
  level: string;
}

// This is the type the component uses internally
export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  genre: string;
  level: string;
}

export async function getTrendingSongs(): Promise<Song[]> {
  try {
    const response = await fetch(`${API_URL}/songs`);
    if (!response.ok) {
      throw new Error("Failed to fetch songs");
    }
    const data: SongFromAPI[] = await response.json();

    // Adapt API data to the component's expected format
    return data.map((song) => ({
      id: String(song.id),
      title: song?.title,
      artist: song?.artist,
      coverUrl: song?.album_image_url,
      genre: song?.genre,
      level: song?.level,
    }));
  } catch (error) {
    console.error("Error fetching trending songs:", error);
    return [];
  }
}

export interface Lyric {
  id: string;
  lyric: string;
  translated: string;
  hasCard: boolean;
  learning_score: number;
}

interface LyricFromAPI {
  line_no: number;
  text: string;
  translated?: string;
  learning_score: number;
}

/**
 * Fetch lyrics for a given song from backend
 */
export async function getLyrics(songId: string): Promise<Lyric[]> {
  try {
    const response = await fetch(`${API_URL}/lyrics?song=${songId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch lyrics: ${response.status}`);
    }

    const data: LyricFromAPI[] = await response.json();

    // Adapt API data, setting hasCard to false by default for manual selection
    return data
      .map((item) => ({
        id: String(item.line_no),
        lyric: item.text,
        translated: item.translated ?? "",
        hasCard: false, // Default to false for manual selection
        learning_score: item.learning_score,
      }))
      .sort((a, b) => parseInt(a.id) - parseInt(b.id));
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return [];
  }
}
