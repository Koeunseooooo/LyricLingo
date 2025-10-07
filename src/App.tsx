import { useState } from "react";
import { SongSearchScreen } from "./components/SongSearchScreen";
import { AIProcessingScreen } from "./components/AIProcessingScreen";
import { LyricsViewScreen } from "./components/LyricsViewScreen";
import { StudyCardsScreen } from "./components/StudyCardsScreen";
import { QuizScreen } from "./components/QuizScreen";
import { LearningSummaryScreen } from "./components/LearningSummaryScreen";

export type Screen =
  | "search"
  | "loading"
  | "lyrics"
  | "studyCards"
  | "quiz"
  | "summary";

export interface SelectedSong {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("search");
  const [selectedSong, setSelectedSong] = useState<SelectedSong | null>(null);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    total: number;
  } | null>(null);

  const handleSongSelect = (song: SelectedSong) => {
    setSelectedSong(song);
    setCurrentScreen("loading");

    // Simulate AI processing
    setTimeout(() => {
      setCurrentScreen("lyrics");
    }, 3000);
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleQuizComplete = (score: number, total: number) => {
    setQuizResults({ score, total });
    setCurrentScreen("summary");
  };

  return (
    <div className="size-full bg-background flex justify-center">
      <div className="w-full max-w-md h-full bg-background overflow-hidden">
        {currentScreen === "search" && (
          <SongSearchScreen onSongSelect={handleSongSelect} />
        )}

        {currentScreen === "loading" && <AIProcessingScreen />}

        {currentScreen === "lyrics" && selectedSong && (
          <LyricsViewScreen song={selectedSong} onNavigate={handleNavigate} />
        )}

        {currentScreen === "studyCards" && selectedSong && (
          <StudyCardsScreen song={selectedSong} onNavigate={handleNavigate} />
        )}

        {currentScreen === "quiz" && selectedSong && (
          <QuizScreen song={selectedSong} onComplete={handleQuizComplete} />
        )}

        {currentScreen === "summary" && quizResults && selectedSong && (
          <LearningSummaryScreen
            score={quizResults.score}
            total={quizResults.total}
            onNavigate={handleNavigate}
            onNewSong={() => {
              setSelectedSong(null);
              setQuizResults(null);
              setCurrentScreen("search");
            }}
          />
        )}
      </div>
    </div>
  );
}
