import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { SelectedSong } from '../App';

interface QuizScreenProps {
  song: SelectedSong;
  onComplete: (score: number, total: number) => void;
}

const quizQuestions = [
  {
    id: '1',
    type: 'multiple-choice' as const,
    question: '"사랑해"의 의미는 무엇일까요?',
    options: ['I love you', 'Thank you', 'Goodbye', 'Hello'],
    correctAnswer: 'I love you',
  },
  {
    id: '2',
    type: 'fill-blank' as const,
    question: '빈칸을 채워주세요',
    sentence: '너는 나의 _____',
    hint: '영어 단어를 한글로 표기한 것이에요',
    correctAnswer: '소울메이트',
  },
  {
    id: '3',
    type: 'multiple-choice' as const,
    question: '"영원히"의 의미는 무엇일까요?',
    options: ['Yesterday', 'Forever', 'Maybe', 'Today'],
    correctAnswer: 'Forever',
  },
  {
    id: '4',
    type: 'fill-blank' as const,
    question: '빈칸을 채워주세요',
    sentence: '_____ 함께할 거야',
    hint: '"forever"를 의미하는 단어예요',
    correctAnswer: '영원히',
  },
  {
    id: '5',
    type: 'multiple-choice' as const,
    question: '"별빛"의 의미는 무엇일까요?',
    options: ['Moonlight', 'Starlight', 'Sunlight', 'Twilight'],
    correctAnswer: 'Starlight',
  },
];

export function QuizScreen({ song, onComplete }: QuizScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score
      const score = quizQuestions.reduce((acc, q) => {
        const userAnswer = answers[q.id]?.trim().toLowerCase();
        const correctAnswer = q.correctAnswer.toLowerCase();
        return acc + (userAnswer === correctAnswer ? 1 : 0);
      }, 0);
      
      onComplete(score, quizQuestions.length);
    }
  };

  const canProceed = answers[currentQuestion.id]?.trim().length > 0;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 bg-white border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2>퀴즈</h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <p className="text-muted-foreground">
              {currentQuestionIndex + 1} / {quizQuestions.length}
            </p>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto p-5 pb-32">
        <div className="mb-8">
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full mb-4">
            <p className="text-sm">문제 {currentQuestionIndex + 1}</p>
          </div>
          <h1 className="mb-4">{currentQuestion.question}</h1>
          {currentQuestion.type === 'fill-blank' && (
            <Card className="p-5 bg-muted border-0 mb-4">
              <p className="text-lg text-center">{currentQuestion.sentence}</p>
            </Card>
          )}
          {currentQuestion.type === 'fill-blank' && currentQuestion.hint && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span>💡</span>
              {currentQuestion.hint}
            </p>
          )}
        </div>

        {currentQuestion.type === 'multiple-choice' ? (
          <RadioGroup 
            value={answers[currentQuestion.id] || ''}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <Card 
                key={index}
                className={`p-5 cursor-pointer transition-all border-0 shadow-sm hover:shadow-md active:scale-[0.98] ${
                  answers[currentQuestion.id] === option 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'bg-white'
                }`}
                onClick={() => handleAnswer(option)}
              >
                <div className="flex items-center gap-4">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label 
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-base"
                  >
                    {option}
                  </Label>
                </div>
              </Card>
            ))}
          </RadioGroup>
        ) : (
          <div>
            <Label className="mb-3 block">정답을 입력하세요</Label>
            <Input
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="한글로 입력해주세요"
              className="text-lg h-14 bg-white border-border rounded-xl"
            />
          </div>
        )}
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
        <div className="p-5 bg-gradient-to-t from-white via-white to-transparent">
          <Button 
            className="w-full h-14 bg-primary hover:bg-primary/90 shadow-lg text-base rounded-xl disabled:opacity-50"
            onClick={handleNext}
            disabled={!canProceed}
          >
            {currentQuestionIndex < quizQuestions.length - 1 ? '다음 문제' : '결과 보기'}
          </Button>
        </div>
      </div>
    </div>
  );
}
