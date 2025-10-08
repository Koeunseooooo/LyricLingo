import { useState } from "react";
import { ArrowLeft, Play, Pause, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { SelectedSong, Screen } from "../App";

interface LyricsViewScreenProps {
  song: SelectedSong;
  onNavigate: (screen: Screen) => void;
}

const mockLyrics = [
  {
    id: "1",
    korean: "너는 나의 소울메이트",
    romaji: "neoneun naui soulmate",
    hasCard: true,
  },
  {
    id: "2",
    korean: "영원히 함께할 거야",
    romaji: "yeongwonhi hamkkehal geoya",
    hasCard: true,
  },
  {
    id: "3",
    korean: "사랑해 너를 사랑해",
    romaji: "saranghae neoreul saranghae",
    hasCard: true,
  },
  {
    id: "4",
    korean: "매일매일 너만 생각해",
    romaji: "maeilmaeil neoman saenggakae",
    hasCard: false,
  },
  {
    id: "5",
    korean: "우리 둘이 함께 걷는 이 길",
    romaji: "uri duri hamkke geotneun i gil",
    hasCard: true,
  },
  {
    id: "6",
    korean: "별빛 아래서 춤을 춰",
    romaji: "byeolbit araeseo chumeul chwo",
    hasCard: true,
  },
];

export function LyricsViewScreen({ song, onNavigate }: LyricsViewScreenProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const learnableCount = mockLyrics.filter((l) => l.hasCard).length;

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
            className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex-shrink-0 shadow-md"
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
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
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
            <p className="text-sm">
              AI가{" "}
              <span className="text-primary font-semibold">
                {learnableCount}개
              </span>
              의 학습 포인트를 찾았어요
            </p>
          </div>
        </div>
      </div>

      {/* Lyrics */}
      <div className="flex-1 overflow-y-auto px-5 pb-24">
        <h3 className="mb-4">가사</h3>
        <div className="space-y-3">
          {mockLyrics.map((lyric) => (
            <Card
              key={lyric.id}
              className={`p-5 transition-all border-0 shadow-sm ${
                lyric.hasCard
                  ? "bg-gradient-to-r from-primary/5 to-secondary/5 ring-1 ring-primary/20"
                  : "bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-lg mb-1.5">{lyric.korean}</p>
                  <p className="text-muted-foreground text-sm">
                    {lyric.romaji}
                  </p>
                </div>
                {lyric.hasCard && (
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0 flex-shrink-0">
                    학습
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
        <div className="p-5 bg-gradient-to-t from-white via-white to-transparent">
          <Button
            className="w-full h-14 bg-primary hover:bg-primary/90 shadow-lg text-base rounded-xl"
            onClick={() => onNavigate("studyCards")}
          >
            <span className="mr-2">🎵</span>
            학습 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
}
