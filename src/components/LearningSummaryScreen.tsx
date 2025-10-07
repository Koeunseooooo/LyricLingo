import { RotateCcw, Home, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Screen } from "../App";

interface LearningSummaryScreenProps {
  score: number;
  total: number;
  onNavigate: (screen: Screen) => void;
  onNewSong: () => void;
}

export function LearningSummaryScreen({
  score,
  total,
  onNavigate,
  onNewSong,
}: LearningSummaryScreenProps) {
  const percentage = Math.round((score / total) * 100);
  const cardsLearned = 5;

  const getMessage = () => {
    if (percentage >= 80) {
      return {
        emoji: "🎉",
        title: "완벽해요!",
        message: "한국어 실력이 정말 좋아지고 있어요",
      };
    } else if (percentage >= 60) {
      return {
        emoji: "👏",
        title: "잘하고 있어요!",
        message: "조금만 더 연습하면 완벽할 거예요",
      };
    } else {
      return {
        emoji: "💪",
        title: "좋은 시작이에요!",
        message: "카드를 다시 복습하고 도전해보세요",
      };
    }
  };

  const result = getMessage();

  return (
    <div className="h-full flex flex-col bg-background overflow-y-auto">
      <div className="p-5 flex-1">
        {/* Result Icon */}
        <div className="flex justify-center mb-6 mt-12">
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-6xl shadow-xl">
            {result.emoji}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="mb-2 text-3xl">{result.title}</h1>
          <p className="text-muted-foreground text-lg">
            {result.message}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="space-y-3 mb-8">
          <Card className="p-6 bg-white border-0 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  정답률
                </p>
                <div className="flex items-baseline gap-2">
                  <h1 className="text-5xl text-primary">
                    {percentage}
                  </h1>
                  <span className="text-2xl text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
              <div className="text-5xl">🎯</div>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-muted-foreground">
                {total}문제 중{" "}
                <span className="text-foreground font-semibold">
                  {score}문제
                </span>{" "}
                정답
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  학습한 카드
                </p>
                <div className="flex items-baseline gap-2">
                  <h1 className="text-5xl">{cardsLearned}</h1>
                  <span className="text-2xl text-muted-foreground">
                    개
                  </span>
                </div>
              </div>
              <div className="text-5xl">📚</div>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-muted-foreground">
                새로운 표현을 배웠어요
              </p>
            </div>
          </Card>
        </div>

        {/* Encouragement Message */}
        <Card className="p-5 bg-gradient-to-r from-primary/5 to-secondary/5 border-0 mb-6 ring-1 ring-primary/20">
          <div className="flex items-start gap-3">
            <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-foreground leading-relaxed">
              {percentage >= 80
                ? "음악으로 한국어를 마스터하고 있어요! 다음 곡으로 계속 학습해보세요 🌟"
                : percentage >= 60
                  ? "좋은 진전이에요! 카드를 다시 보면서 복습하면 더 좋아질 거예요 📚"
                  : "훌륭한 시작이에요! 카드를 다시 보고 퀴즈에 재도전해보세요 💜"}
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          <Button
            className="w-full h-14 bg-primary hover:bg-primary/90 text-base rounded-xl"
            onClick={onNewSong}
          >
            <span className="mr-2">🎵</span>
            새로운 곡 선택하기
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-12 rounded-xl border-border"
              onClick={() => onNavigate("quiz")}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              다시 풀기
            </Button>

            <Button
              variant="outline"
              className="h-12 rounded-xl border-border"
              onClick={() => onNavigate("studyCards")}
            >
              <span className="mr-2">📖</span>
              카드 복습
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}