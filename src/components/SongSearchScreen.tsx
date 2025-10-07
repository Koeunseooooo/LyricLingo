import { useState, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { SelectedSong } from '../App';
import { getTrendingSongs, Song } from '../lib/api';
import { Skeleton } from './ui/skeleton';

interface SongSearchScreenProps {
  onSongSelect: (song: SelectedSong) => void;
}

export function SongSearchScreen({ onSongSelect }: SongSearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);
      const fetchedSongs = await getTrendingSongs();
      setSongs(fetchedSongs);
      setIsLoading(false);
    };
    fetchSongs();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSearchResults(
        songs.filter(song =>
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          song.artist.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setSearchResults([]);
    }
  };

  const displaySongs = searchResults.length > 0 ? searchResults : songs;

  const SongItem = ({ song, onClick }: { song: Song, onClick: () => void }) => (
    <Card
      className="p-4 hover:shadow-md active:scale-[0.98] transition-all cursor-pointer border border-border bg-white"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <img src={song.coverUrl} alt={`${song.title} album cover`} className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex-shrink-0 shadow-sm object-cover" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h4 className="truncate flex-1">{song.title}</h4>
            <Badge className="bg-primary text-white hover:bg-primary flex-shrink-0 h-6 px-2">
              학습 가능
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mb-3">{song.artist}</p>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-muted text-foreground border-0 h-7 px-2.5">
              {song.genre}
            </Badge>
            <Badge variant="outline" className="bg-muted text-foreground border-0 h-7 px-2.5">
              {song.level}
            </Badge>
          </div>
        </div>
        <div className="flex items-center self-center">
          <svg
            className="w-5 h-5 text-muted-foreground"
            fill="none"
            strokeWidth="2"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Card>
  );

  const SongItemSkeleton = () => (
    <Card className="p-4 border border-border bg-white">
      <div className="flex items-start gap-4">
        <Skeleton className="w-16 h-16 rounded-2xl flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-7 w-16" />
          </div>
        </div>
      </div>
    </Card>
  );


  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 bg-white border-b border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎵✨</span>
            <h2>LyricLingo</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="곡 제목이나 아티스트를 검색하세요"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-12 h-12 bg-muted border-0 text-base rounded-xl"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
            className={`h-8 rounded-full flex-shrink-0 ${
              selectedFilter === 'all'
                ? 'bg-foreground text-white hover:bg-foreground/90'
                : 'bg-white border-border'
            }`}
          >
            전체
          </Button>
          <Button
            variant={selectedFilter === 'beginner' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('beginner')}
            className={`h-8 rounded-full flex-shrink-0 ${
              selectedFilter === 'beginner'
                ? 'bg-foreground text-white hover:bg-foreground/90'
                : 'bg-white border-border'
            }`}
          >
            초급 추천
          </Button>
          <Button
            variant={selectedFilter === 'popular' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('popular')}
            className={`h-8 rounded-full flex-shrink-0 ${
              selectedFilter === 'popular'
                ? 'bg-foreground text-white hover:bg-foreground/90'
                : 'bg-white border-border'
            }`}
          >
            인기곡
          </Button>
          <Button
            variant={selectedFilter === 'recent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('recent')}
            className={`h-8 rounded-full flex-shrink-0 ${
              selectedFilter === 'recent'
                ? 'bg-foreground text-white hover:bg-foreground/90'
                : 'bg-white border-border'
            }`}
          >
            최근 학습한 곡
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="px-5 pt-4 pb-6">
          {searchQuery && (
            <h3 className="mb-4 text-muted-foreground">
              검색 결과 {searchResults.length}곡
            </h3>
          )}

          {!searchQuery && (
            <h3 className="mb-4">지금 인기있는 곡</h3>
          )}

          <div className="space-y-3">
            {isLoading ? (
              <>
                <SongItemSkeleton />
                <SongItemSkeleton />
                <SongItemSkeleton />
                <SongItemSkeleton />
              </>
            ) : (
              displaySongs.map((song) => (
                <SongItem key={song.id} song={song} onClick={() => onSongSelect(song)} />
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
