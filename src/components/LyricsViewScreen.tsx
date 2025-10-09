import { useState, useEffect } from "react";
import { ArrowLeft, Play, Pause, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { SelectedSong, Screen } from "../App";
import { getLyrics, Lyric } from "../lib/api";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";

interface LyricsViewScreenProps {
  song: SelectedSong;
  onNavigate: (screen: Screen) => void;
}

export function LyricsViewScreen({ song, onNavigate }: LyricsViewScreenProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLyrics = async () => {
      if (!song.id) return;
      setIsLoading(true);
      const fetchedLyrics = await getLyrics(song.id);
      setLyrics(fetchedLyrics);
      setIsLoading(false);
    };
    fetchLyrics();
  }, [song.id]);

  const handleToggleLyric = (lyricId: string) => {
    setLyrics((prevLyrics) =>
      prevLyrics.map((lyric) =>
        lyric.id === lyricId ? { ...lyric, hasCard: !lyric.hasCard } : lyric
      )
    );
  };

  const selectedCount = lyrics.filter((l) => l.hasCard).length;
  const canStartLearning = selectedCount >= 5;
  const LEARNABLE_THRESHOLD = 0.7; // Define a threshold for what is a 'learnable' lyric
  const totalLearnableCount = lyrics.filter(
    (l) => l.learning_score > LEARNABLE_THRESHOLD
  ).length;

  const LyricItem = ({
    lyric,
    onToggle,
  }: {
    lyric: Lyric;
    onToggle: (id: string) => void;
  }) => (
    <Card
      onClick={() => onToggle(lyric.id)}
      className={`p-5 border-0 cursor-pointer transition-[transform,box-shadow] duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg ${
        lyric.hasCard
          ? "bg-gradient-to-r from-primary/5 to-secondary/5 ring-1 ring-primary/20 scale-[1.02] shadow-lg"
          : "bg-white shadow-sm"
      }`}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-lg mb-1.5">{lyric.lyric}</p>
          <p className="text-muted-foreground text-sm">{lyric.translated}</p>
        </div>
        <Badge
          className={`border-0 flex-shrink-0 ${
            lyric.hasCard ? "bg-primary/10" : "bg-transparent"
          }`}
        >
          <span className={lyric.hasCard ? "text-primary" : "text-transparent"}>
            학습
          </span>
        </Badge>
      </div>
    </Card>
  );

  const LyricItemSkeleton = () => (
    <Card className="p-5 bg-white border-0 shadow-sm">
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </Card>
  );

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-5 bg-white border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate("search")}
          className="mb-4 -ml-2 h-9"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          뒤로
        </Button>

        <div className="flex gap-4 mb-4">
          <img
            src={song.coverUrl}
            alt={`${song.title} album cover`}
            className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex-shrink-0 shadow-md object-cover"
          />
          <div className="flex-1 min-w-0">
            <h2 className="truncate mb-1">{song.title}</h2>
            <p className="text-muted-foreground">{song.artist}</p>
          </div>
        </div>

        {/* Mini Player */}
        <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
          <Button
            size="sm"
            variant="ghost"
            className="h-9 w-9 rounded-full p-0 bg-white shadow-sm"
            onClick={() =>
              toast("아직 준비되지 않은 기능입니다.", {
                icon: "🚧",
                classNames: {
                  toast: "text-base p-4",
                },
              })
            }
          >
            <Play className="h-4 w-4 ml-0.5" />
          </Button>
          <div className="flex-1">
            <div className="h-1.5 bg-white rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-primary rounded-full" />
            </div>
          </div>
          <span className="text-sm text-muted-foreground">1:24</span>
        </div>
      </div>

      {/* Info Badge */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2 p-4 bg-white rounded-xl border border-border">
          <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm leading-relaxed">
              AI가 찾은 {totalLearnableCount}개의 학습 포인트 중 5개 이상
              선택해주세요.
              <span className="font-semibold text-primary ml-2">
                ({selectedCount}/{totalLearnableCount})
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Lyrics */}
      <div className="flex-1 overflow-y-auto px-5 pb-24">
        <h3 className="mb-4">가사</h3>
        <div className="space-y-3">
          {isLoading ? (
            <>
              <LyricItemSkeleton />
              <LyricItemSkeleton />
              <LyricItemSkeleton />
              <LyricItemSkeleton />
              <LyricItemSkeleton />
            </>
          ) : (
            lyrics.map((lyric) => (
              <LyricItem
                key={lyric.id}
                lyric={lyric}
                onToggle={handleToggleLyric}
              />
            ))
          )}
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
        <div className="p-5 bg-gradient-to-t from-white via-white to-transparent">
          <Button
            className="w-full h-14 bg-primary hover:bg-primary/90 shadow-lg text-base rounded-xl disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
            onClick={() => onNavigate("studyCards")}
            disabled={!canStartLearning}
          >
            <span className="mr-2">🎵</span>
            학습 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
}
