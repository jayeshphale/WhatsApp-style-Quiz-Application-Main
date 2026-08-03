import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../types/quiz';
import { submitAnswer, completeQuiz } from '../api/client';
import { BotQuestionBubble, UserReplyBubble, BotFeedbackBubble } from '../components/chat/ChatBubble';
import { OptionButton } from '../components/chat/OptionButton';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { ProgressDots, QuestionStatus } from '../components/chat/ProgressDots';
import { Clock, Send, ShieldAlert } from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';

interface QuizProps {
  quizId: string;
  questions: Question[];
  chapterName: string;
  onFinish: (quizId: string) => void;
}

export const Quiz: React.FC<QuizProps> = ({ quizId, questions, chapterName, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [questionShownTime, setQuestionShownTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Conversational response state
  const [userAnswerBubble, setUserAnswerBubble] = useState<{
    text: string;
    letter: string;
    time: string;
  } | null>(null);

  const [botFeedback, setBotFeedback] = useState<{
    isCorrect: boolean;
    correctLetter?: string;
    correctText?: string;
  } | null>(null);

  // History tracking for progress dots
  const [history, setHistory] = useState<QuestionStatus[]>([]);

  const currentQuestion = questions[currentIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentIndex, userAnswerBubble, isBotTyping, botFeedback]);

  // When question index changes, reset step states
  useEffect(() => {
    const nowIso = new Date().toISOString();
    setQuestionShownTime(nowIso);
    setSelectedOptionId(null);
    setUserAnswerBubble(null);
    setBotFeedback(null);
    setIsBotTyping(false);
    setIsSubmitting(false);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex]);

  const handleSubmitChoice = async () => {
    if (!selectedOptionId || isSubmitting || botFeedback) return;

    setIsSubmitting(true);
    const answerSubmittedTime = new Date().toISOString();
    const selectedOption = currentQuestion.options.find((o) => o.option_id === selectedOptionId);
    const optionLetter = selectedOptionId.replace('opt_', '').toUpperCase();

    // 1. Instantly show user reply bubble
    setUserAnswerBubble({
      text: selectedOption?.text || '',
      letter: optionLetter,
      time: answerSubmittedTime
    });

    // 2. Start bot typing indicator
    setIsBotTyping(true);

    try {
      const result = await submitAnswer(quizId, {
        question_id: currentQuestion._id,
        selected_option_id: selectedOptionId,
        question_shown_time: questionShownTime,
        answer_submitted_time: answerSubmittedTime
      });

      // Find correct option details
      const correctOpt = currentQuestion.options.find((o) => o.option_id === result.correct_option_id);
      const correctLetter = result.correct_option_id?.replace('opt_', '').toUpperCase();

      // Simulated typing delay for conversational rhythm
      setTimeout(async () => {
        setIsBotTyping(false);
        setBotFeedback({
          isCorrect: result.is_correct,
          correctLetter,
          correctText: correctOpt?.text
        });

        // Update history for dots
        setHistory((prev) => [
          ...prev.filter((h) => h.index !== currentIndex),
          {
            index: currentIndex,
            isAnswered: true,
            isCorrect: result.is_correct
          }
        ]);

        setIsSubmitting(false);
      }, 700);

    } catch (err) {
      console.error('Error submitting answer:', err);
      setIsBotTyping(false);
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Quiz completed!
      setIsSubmitting(true);
      try {
        await completeQuiz(quizId);
        onFinish(quizId);
      } catch (err) {
        console.error('Failed to complete quiz:', err);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-2 sm:p-4 min-h-[calc(100vh-80px)] flex flex-col justify-between">
      {/* WhatsApp Chat Top Header */}
      <div className="bg-[#1A6C96] text-white p-3.5 rounded-t-3xl shadow-md flex items-center justify-between border-b border-[#58BDF2]/30">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="p-1 bg-white rounded-xl shadow-md ring-2 ring-white/20 shrink-0 flex items-center justify-center">
            <BrandLogo size="xs" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm truncate text-white">{chapterName}</h3>
            <p className="text-[11px] text-[#99D7F3] flex items-center gap-1 font-normal">
              <span className="w-2 h-2 rounded-full bg-[#F9E276] animate-pulse" />
              <span>SkillBytes Mentor • Active Chat</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-[#0F4A6A] px-3 py-1 rounded-full text-xs font-mono shrink-0 border border-[#58BDF2]/30">
          <Clock className="w-3.5 h-3.5 text-[#F9E276]" />
          <span>{timerSeconds}s</span>
        </div>
      </div>

      {/* Progress Dots Indicator */}
      <ProgressDots
        total={questions.length}
        currentIndex={currentIndex}
        history={history}
      />

      {/* WhatsApp Wallpaper Chat Scrollable Window */}
      <div
        ref={chatScrollRef}
        className="flex-1 bg-[#F4F8FC] p-3 sm:p-5 space-y-3 border-x border-gray-200/80 overflow-y-auto shadow-inner min-h-[400px] max-h-[580px] rounded-b-none relative rounded-2xl my-1"
        style={{
          backgroundImage: `radial-gradient(#58BDF2 0.5px, transparent 0.5px)`,
          backgroundSize: '16px 16px',
          backgroundOpacity: 0.05
        }}
      >
        {/* Question Bubble from AI Tutor */}
        <BotQuestionBubble
          question={currentQuestion}
          index={currentIndex}
          total={questions.length}
          shownTime={questionShownTime}
        />

        {/* Options List */}
        {!userAnswerBubble && (
          <div className="space-y-2 pt-1 max-w-[95%] sm:max-w-[88%] ml-auto my-3">
            <p className="text-[11px] font-bold text-[#1A6C96] uppercase tracking-wider text-right mb-1">
              Tap an option to respond:
            </p>
            {currentQuestion.options.map((option) => (
              <OptionButton
                key={option.option_id}
                option={option}
                isSelected={selectedOptionId === option.option_id}
                isSubmitting={isSubmitting}
                onSelect={setSelectedOptionId}
              />
            ))}
          </div>
        )}

        {/* User's Selected Answer Reply Bubble */}
        {userAnswerBubble && (
          <UserReplyBubble
            selectedText={userAnswerBubble.text}
            optionLetter={userAnswerBubble.letter}
            timestamp={userAnswerBubble.time}
          />
        )}

        {/* Bot Typing Indicator */}
        <AnimatePresence>
          {isBotTyping && (
            <TypingIndicator text="Your tutor is checking your answer..." />
          )}
        </AnimatePresence>

        {/* Bot Feedback Bubble */}
        <AnimatePresence>
          {botFeedback && (
            <BotFeedbackBubble
              isCorrect={botFeedback.isCorrect}
              correctOptionLetter={botFeedback.correctLetter}
              correctOptionText={botFeedback.correctText}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Footer */}
      <div className="bg-white p-3.5 rounded-b-3xl border border-gray-200 shadow-md flex items-center justify-between gap-3 mt-1">
        <div className="text-[11px] text-gray-500 flex items-center gap-1 font-sans font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-[#8C6D00] shrink-0" />
          <span className="hidden sm:inline">Take your time—every question helps you learn!</span>
        </div>

        {/* Dynamic Action Button */}
        {!botFeedback ? (
          <button
            id="btn-submit-answer"
            disabled={!selectedOptionId || isSubmitting}
            onClick={handleSubmitChoice}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md ${
              selectedOptionId && !isSubmitting
                ? 'bg-[#58BDF2] hover:bg-[#46AFE8] text-white cursor-pointer active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>Send Response</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            id="btn-next-question"
            disabled={isSubmitting}
            onClick={handleNextQuestion}
            className="px-6 py-2.5 bg-[#1A6C96] hover:bg-[#0F4A6A] text-white rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md active:scale-95 cursor-pointer ring-2 ring-[#F9E276]/40"
          >
            <span>{currentIndex + 1 === questions.length ? "Here's how you did today" : 'Next Question'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
