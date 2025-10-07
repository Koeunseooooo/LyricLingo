import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { SelectedSong, Screen } from '../App';

interface StudyCardsScreenProps {
  song: SelectedSong;
  onNavigate: (screen: Screen) => void;
}

const studyCards = [
  {
    id: '1',
    korean: '소울메이트',
    romaji: 'soulmate',
    meaning: 'Soulmate',
    culturalNote: '한국어는 영어 단어를 차용하는 경우가 많아요. 특히 현대 팝 음악에서 자주 사용됩니다.',
    example: '너는 나의 소울메이트야',
    exampleTranslation: 'You are my soulmate',
    similarPhrase: 'My other half (내 반쪽)',
  },
  {
    id: '2',
    korean: '영원히',
    romaji: 'yeongwonhi',
    meaning: 'Forever, eternally',
    culturalNote: 'K-pop에서 영원한 사랑과 헌신을 표현할 때 자주 사용되는 단어입니다.',
    example: '영원히 기억할게',
    exampleTranslation: 'I will remember forever',
    similarPhrase: 'For all time (모든 시간 동안)',
  },
  {
    id: '3',
    korean: '사랑해',
    romaji: 'saranghae',
    meaning: 'I love you',
    culturalNote: '반말(친근한 표현)입니다. 존댓말은 "사랑합니다"예요.',
    example: '정말 사랑해',
    exampleTranslation: 'I really love you',
    similarPhrase: 'Love you (사랑해)',
  },
  {
    id: '4',
    korean: '함께',
    romaji: 'hamkke',
    meaning: 'Together',
    culturalNote: '"함께하다"(to be together, to do together)와 자주 쓰입니다.',
    example: '함께 걷자',
    exampleTranslation: 'Let\'s walk together',
    similarPhrase: 'Side by side (나란히)',
  },
  {
    id: '5',
    korean: '별빛',
    romaji: 'byeolbit',
    meaning: 'Starlight',
    culturalNote: '한국 시와 가사에서 자주 사용되는 낭만적인 이미지입니다.',
    example: '별빛처럼 빛나',
    exampleTranslation: 'Shine like starlight',
    similarPhrase: 'Light of the stars (별들의 빛)',
  },
];

export function StudyCardsScreen({ song, onNavigate }: StudyCardsScreenProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = studyCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / studyCards.length) * 100;

  const handleNext = () => {
    if (currentCardIndex < studyCards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentCardIndex((prev) => prev + 1);
      }, 150);
    } else {
      onNavigate('quiz');
    }
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => Math.max(prev - 1, 0));
    }, 150);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 bg-white border-b border-border">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onNavigate('lyrics')}
          className="mb-4 -ml-2 h-9"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          뒤로
        </Button>
        <div className="flex items-center justify-between mb-3">
          <h2>학습 카드</h2>
          <p className="text-muted-foreground">
            {currentCardIndex + 1} / {studyCards.length}
          </p>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Card Display */}
      <div className="flex-1 flex flex-col items-center justify-center p-5">
        <Card 
          className="w-full max-w-sm h-[28rem] cursor-pointer perspective-1000 border-0 shadow-xl"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`relative w-full h-full transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            {/* Front */}
            <div className="absolute inset-0 backface-hidden p-8 flex flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-xl text-white">
              <div className="text-center">
                <div className="mb-4 text-4xl">🎵</div>
                <h1 className="text-4xl mb-4 text-white">{currentCard.korean}</h1>
                <p className="text-white/80 text-xl mb-12">{currentCard.romaji}</p>
                <div className="inline-block px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <p className="text-sm text-white/90">탭해서 뜻 확인하기</p>
                </div>
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 p-6 bg-white rounded-xl overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">📖</span>
                    <h4 className="text-primary">의미</h4>
                  </div>
                  <p className="text-lg">{currentCard.meaning}</p>
                </div>
                
                <div className="h-px bg-border" />
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">💡</span>
                    <h4 className="text-primary">문화적 배경</h4>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{currentCard.culturalNote}</p>
                </div>
                
                <div className="h-px bg-border" />
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">✏️</span>
                    <h4 className="text-primary">예문</h4>
                  </div>
                  <p className="mb-1.5">{currentCard.example}</p>
                  <p className="text-sm text-muted-foreground">{currentCard.exampleTranslation}</p>
                </div>
                
                <div className="h-px bg-border" />
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🌐</span>
                    <h4 className="text-primary">비슷한 영어 표현</h4>
                  </div>
                  <p className="text-muted-foreground">{currentCard.similarPhrase}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <p className="text-sm text-muted-foreground mt-4">
          {isFlipped ? '다시 탭하면 앞면이 보여요' : '카드를 탭해서 내용을 확인하세요'}
        </p>
      </div>

      {/* Navigation */}
      <div className="p-5 bg-white border-t border-border">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
            className="flex-1 h-12 rounded-xl"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            이전
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 h-12 bg-primary hover:bg-primary/90 rounded-xl"
          >
            {currentCardIndex === studyCards.length - 1 ? (
              <>
                퀴즈 풀기
                <span className="ml-1">✨</span>
              </>
            ) : (
              <>
                다음
                <ChevronRight className="h-5 w-5 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
