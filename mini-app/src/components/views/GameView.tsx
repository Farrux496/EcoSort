import React, { useState, useEffect } from 'react';
import { Heart, Timer, Zap, Trophy, RotateCcw, ArrowLeft, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, User, WasteCategoryId } from '../../types';
import { getTranslation } from '../../services/translations';
import { StorageService, GAME_ITEMS, WASTE_CATEGORIES } from '../../services/storage';

interface GameViewProps {
  user: User;
  lang: Language;
  onBack: () => void;
  onUserUpdate: (updatedUser: User) => void;
}

export const GameView: React.FC<GameViewProps> = ({
  user,
  lang,
  onBack,
  onUserUpdate,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [highScore, setHighScore] = useState(StorageService.getHighScore());

  const currentItem = GAME_ITEMS[currentIndex % GAME_ITEMS.length];

  // Timer countdown
  useEffect(() => {
    if (isGameOver || lives <= 0) return;

    if (timeLeft <= 0) {
      handleAnswer(null); // Time's up counted as wrong
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isGameOver, lives]);

  const handleAnswer = (selectedCategory: WasteCategoryId | null) => {
    if (isGameOver) return;

    const isCorrect = selectedCategory === currentItem.category;

    if (isCorrect) {
      const addedPoints = 10 + combo * 5;
      const newScore = score + addedPoints;
      const newCombo = combo + 1;
      setScore(newScore);
      setCombo(newCombo);
      setFeedback('correct');

      if (newScore > highScore) {
        setHighScore(newScore);
        StorageService.setHighScore(newScore);
      }
    } else {
      setCombo(0);
      setFeedback('wrong');
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        finishGame(score);
        return;
      }
    }

    // Advance to next question after brief feedback
    setTimeout(() => {
      setFeedback(null);
      setTimeLeft(15);
      setCurrentIndex((prev) => prev + 1);
    }, 600);
  };

  const finishGame = (finalScore: number) => {
    setIsGameOver(true);

    const coinsEarned = Math.round(finalScore / 2);
    const xpEarned = Math.round(finalScore / 3);

    if (coinsEarned > 0) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      const updatedUser: User = {
        ...user,
        balance: user.balance + coinsEarned,
        xp: user.xp + xpEarned,
      };
      StorageService.setCurrentUser(updatedUser);
      onUserUpdate(updatedUser);

      // Record transaction
      StorageService.addTransaction({
        id: `tx-game-${Date.now()}`,
        userId: user.id,
        title: 'Oyın utısı (Qaldıqtı sarala)',
        amount: coinsEarned,
        type: 'credit',
        date: new Date().toLocaleDateString(),
        status: 'completed',
      });
    }
  };

  const restartGame = () => {
    setScore(0);
    setCombo(0);
    setLives(3);
    setTimeLeft(15);
    setCurrentIndex(0);
    setFeedback(null);
    setIsGameOver(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 flex flex-col justify-between">
      {/* Top Header */}
      <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-sm font-bold text-slate-800">
          {getTranslation(lang, 'gameTitle')}
        </h1>

        {/* High score */}
        <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          <Trophy className="w-3.5 h-3.5" />
          <span>{highScore}</span>
        </div>
      </div>

      {/* Main Game Arena */}
      <div className="p-4 max-w-md mx-auto w-full space-y-4 flex-1 flex flex-col justify-between">
        {/* Game Stats Bar: Lives, Score, Timer, Combo */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-3 border border-slate-100 shadow-xs">
          {/* Lives */}
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((heartIndex) => (
              <Heart
                key={heartIndex}
                className={`w-5 h-5 transition-transform duration-300 ${
                  heartIndex <= lives
                    ? 'fill-red-500 text-red-500 scale-100'
                    : 'text-slate-200 fill-slate-100 scale-90'
                }`}
              />
            ))}
          </div>

          {/* Combo */}
          {combo > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-500 text-white rounded-full text-[11px] font-black animate-bounce">
              <Zap className="w-3 h-3 fill-current" />
              <span>x{combo} KOMBO</span>
            </div>
          )}

          {/* Score */}
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              {getTranslation(lang, 'score')}
            </span>
            <span className="text-base font-black text-[#0D7C66]">
              {score}
            </span>
          </div>
        </div>

        {/* Question & Target Item Card */}
        {isGameOver ? (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-600">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-slate-800">
                {getTranslation(lang, 'gameOver')}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {getTranslation(lang, 'highScore')}: <span className="font-bold">{highScore}</span>
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-1">
              <span className="text-xs text-emerald-800 font-bold block">
                {getTranslation(lang, 'rewardEarned', {
                  coins: Math.round(score / 2),
                  xp: Math.round(score / 3),
                })}
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={restartGame}
                className="flex-1 py-3 bg-[#0D7C66] hover:bg-[#095848] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{getTranslation(lang, 'playAgain')}</span>
              </button>

              <button
                onClick={onBack}
                className="px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200"
              >
                ←
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Timer bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  timeLeft <= 4 ? 'bg-red-500' : 'bg-[#0D7C66]'
                }`}
                style={{ width: `${(timeLeft / 15) * 100}%` }}
              />
            </div>

            <div className="text-center">
              <span className="text-xs font-bold text-slate-400">
                {getTranslation(lang, 'timer')}: {timeLeft}s
              </span>
              <h3 className="text-base font-extrabold text-slate-800 mt-0.5">
                {getTranslation(lang, 'gameQuestion')}
              </h3>
            </div>

            {/* REALISTIC WASTE PHOTOGRAPH CONTAINER */}
            <div
              className={`relative aspect-square max-h-56 mx-auto rounded-3xl overflow-hidden border-2 bg-slate-50 shadow-sm flex items-center justify-center p-2 transition-all ${
                feedback === 'correct'
                  ? 'border-emerald-500 ring-4 ring-emerald-500/20'
                  : feedback === 'wrong'
                  ? 'border-red-500 ring-4 ring-red-500/20'
                  : 'border-slate-200'
              }`}
            >
              <img
                src={currentItem.image}
                alt={currentItem.name[lang] || currentItem.name.kaa}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />

              {/* Item title banner at bottom of card */}
              <div className="absolute bottom-2 inset-x-2 bg-black/70 backdrop-blur-xs py-1.5 px-3 rounded-xl text-center">
                <span className="text-xs font-bold text-white tracking-wide">
                  {currentItem.name[lang] || currentItem.name.kaa}
                </span>
              </div>

              {/* Visual feedback popup */}
              {feedback && (
                <div
                  className={`absolute inset-0 flex items-center justify-center font-black text-2xl tracking-wider text-white backdrop-blur-xs ${
                    feedback === 'correct' ? 'bg-emerald-600/80' : 'bg-red-600/80'
                  }`}
                >
                  {feedback === 'correct'
                    ? getTranslation(lang, 'correct')
                    : getTranslation(lang, 'wrong')}
                </div>
              )}
            </div>

            {/* 6 Category Buttons (2x3 Grid) */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {WASTE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleAnswer(cat.id)}
                  disabled={feedback !== null}
                  className="py-3 px-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs text-left flex items-center gap-2.5 active:scale-95 transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 p-0.5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <img
                      src={cat.image}
                      alt={cat.id}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {getTranslation(lang, cat.nameKey as any).split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Fun fact pill */}
            <p className="text-[11px] text-slate-500 text-center italic px-4">
              💡 {currentItem.funFact[lang] || currentItem.funFact.kaa}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
