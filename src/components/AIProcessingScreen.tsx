import { Loader2 } from 'lucide-react';

export function AIProcessingScreen() {
  return (
    <div className="h-full flex items-center justify-center bg-background px-6">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Loader2 className="h-20 w-20 text-primary animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center text-3xl">
              🎵
            </span>
          </div>
        </div>
        <h1 className="mb-4">AI가 가사를 분석하고 있어요</h1>
        <p className="text-muted-foreground text-lg max-w-xs mx-auto">
          학습하기 좋은 가사를<br />찾는 중이에요!
        </p>
      </div>
    </div>
  );
}
