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

const API_URL = "https://lyriclingo-be-production.up.railway.app";

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
