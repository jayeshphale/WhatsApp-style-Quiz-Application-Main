import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatHeader } from './components/chat/ChatHeader';
import { SplashScreen } from './components/chat/SplashScreen';
import { WelcomeScreen } from './components/chat/WelcomeScreen';
import { WhatsAppLayout } from './components/chat/WhatsAppLayout';
import { ChatThreadItem } from './components/chat/ChatList';
import { Login } from './pages/Login';
import { Exams } from './pages/Exams';
import { Subjects } from './pages/Subjects';
import { Chapters } from './pages/Chapters';
import { Quiz } from './pages/Quiz';
import { Result } from './pages/Result';
import { Analytics } from './pages/Analytics';
import { Exam, Subject, Chapter, Question } from './types/quiz';
import { startQuiz, fetchExams, fetchSubjects, fetchChapters } from './api/client';

function MainContent() {
  const { currentUser } = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState<'quiz' | 'analytics'>('quiz');

  // Quiz navigation flow states
  const [step, setStep] = useState<'exams' | 'subjects' | 'chapters' | 'quiz' | 'result'>('exams');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [isStartingQuiz, setIsStartingQuiz] = useState(false);

  // Data lists for sidebar chat threads
  const [examsList, setExamsList] = useState<Exam[]>([]);
  const [subjectsList, setSubjectsList] = useState<Subject[]>([]);
  const [chaptersList, setChaptersList] = useState<Chapter[]>([]);

  // Pre-fetch exams for chat sidebar
  useEffect(() => {
    if (currentUser) {
      fetchExams().then(setExamsList).catch(() => {});
    }
  }, [currentUser]);

  // Fetch subjects when exam selected
  useEffect(() => {
    if (selectedExam) {
      fetchSubjects(selectedExam._id).then(setSubjectsList).catch(() => {});
    } else {
      setSubjectsList([]);
    }
  }, [selectedExam]);

  // Fetch chapters when subject selected
  useEffect(() => {
    if (selectedSubject) {
      fetchChapters(selectedSubject._id).then(setChaptersList).catch(() => {});
    } else {
      setChaptersList([]);
    }
  }, [selectedSubject]);

  // Build sidebar chat threads based on active navigation hierarchy
  const threads: ChatThreadItem[] = useMemo(() => {
    if (step === 'exams' || !selectedExam) {
      return examsList.map((e) => ({
        id: e._id,
        type: 'exam',
        title: e.name,
        subtitle: 'Competitive Exam Thread',
        lastMessage: 'Ready for today\'s quiz?',
        time: 'Just now',
        data: e
      }));
    }

    if (step === 'subjects' || !selectedSubject) {
      return subjectsList.map((s) => ({
        id: s._id,
        type: 'subject',
        title: s.name,
        subtitle: `Exam: ${selectedExam.name}`,
        lastMessage: 'Continue your learning progress',
        time: '1m ago',
        data: s
      }));
    }

    return chaptersList.map((c) => ({
      id: c._id,
      type: 'chapter',
      title: c.name,
      subtitle: `Subject: ${selectedSubject.name}`,
      lastMessage: '15 Questions • Tap to start live quiz',
      time: 'Live',
      data: c
    }));
  }, [step, selectedExam, selectedSubject, examsList, subjectsList, chaptersList]);

  // If no user selected, show Welcome Screen then Student Login selection
  if (!currentUser) {
    if (showWelcome) {
      return <WelcomeScreen onContinue={() => setShowWelcome(false)} />;
    }
    return <Login />;
  }

  const handleSelectExam = (exam: Exam) => {
    setSelectedExam(exam);
    setSelectedSubject(null);
    setSelectedChapter(null);
    setStep('subjects');
  };

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setSelectedChapter(null);
    setStep('chapters');
  };

  const handleSelectChapter = async (chapter: Chapter) => {
    if (!currentUser || isStartingQuiz) return;

    setSelectedChapter(chapter);
    setIsStartingQuiz(true);

    try {
      const quizRes = await startQuiz(currentUser._id, chapter._id);
      setActiveQuizId(quizRes.quiz_id);
      setActiveQuestions(quizRes.questions);
      setIsStartingQuiz(false);
      setStep('quiz');
    } catch (err) {
      console.error('Failed to start quiz session:', err);
      setIsStartingQuiz(false);
    }
  };

  const handleFinishQuiz = (completedQuizId: string) => {
    setActiveQuizId(completedQuizId);
    setStep('result');
  };

  const handleRestartQuiz = () => {
    setSelectedExam(null);
    setSelectedSubject(null);
    setSelectedChapter(null);
    setActiveQuizId(null);
    setStep('exams');
  };

  const handleSelectThread = (thread: ChatThreadItem) => {
    if (thread.type === 'exam') {
      handleSelectExam(thread.data as Exam);
    } else if (thread.type === 'subject') {
      handleSelectSubject(thread.data as Subject);
    } else if (thread.type === 'chapter') {
      handleSelectChapter(thread.data as Chapter);
    }
  };

  // Determine dynamic title for header
  const getHeaderTitle = () => {
    if (activeTab === 'analytics') return 'SkillBytes Analytics Radar';
    if (step === 'quiz' && selectedChapter) return `${selectedChapter.name} Quiz`;
    if (step === 'result') return 'Quiz Performance Result';
    if (step === 'chapters' && selectedSubject) return `${selectedSubject.name} Chapters`;
    if (step === 'subjects' && selectedExam) return `${selectedExam.name} Subjects`;
    return 'SkillBytes AI Learning Assistant';
  };

  const getHeaderSubtitle = () => {
    if (activeTab === 'analytics') return 'Real-time MongoDB Pipeline Metrics';
    if (step === 'quiz') return 'AI Tutor • Live Conversational Quiz';
    if (step === 'result') return 'Synced with LVI & Fatigue Aggregations';
    return 'Online • SkillBytes Learning Chat';
  };

  const handleHeaderBack = () => {
    if (step === 'quiz' || step === 'result') {
      setStep('chapters');
    } else if (step === 'chapters') {
      setStep('subjects');
    } else if (step === 'subjects') {
      setStep('exams');
    }
  };

  return (
    <div className="min-h-screen bg-[#efeae2] text-gray-900 flex flex-col font-sans">
      {/* Top Navigation Header */}
      <ChatHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        title={getHeaderTitle()}
        subtitle={getHeaderSubtitle()}
        showBack={step !== 'exams' && activeTab === 'quiz'}
        onBack={handleHeaderBack}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-4">
        {activeTab === 'analytics' ? (
          <Analytics />
        ) : (
          <WhatsAppLayout
            threads={threads}
            selectedThreadId={
              step === 'subjects'
                ? selectedSubject?._id
                : step === 'chapters' || step === 'quiz'
                ? selectedChapter?._id
                : selectedExam?._id
            }
            onSelectThread={handleSelectThread}
          >
            {step === 'exams' && (
              <Exams onSelectExam={handleSelectExam} />
            )}

            {step === 'subjects' && selectedExam && (
              <Subjects
                exam={selectedExam}
                onBack={() => setStep('exams')}
                onSelectSubject={handleSelectSubject}
              />
            )}

            {step === 'chapters' && selectedSubject && (
              <Chapters
                subject={selectedSubject}
                onBack={() => setStep('subjects')}
                onSelectChapter={handleSelectChapter}
              />
            )}

            {step === 'quiz' && selectedChapter && activeQuizId && (
              <Quiz
                quizId={activeQuizId}
                questions={activeQuestions}
                chapterName={selectedChapter.name}
                onFinish={handleFinishQuiz}
              />
            )}

            {step === 'result' && activeQuizId && (
              <Result
                quizId={activeQuizId}
                onRestart={handleRestartQuiz}
                onViewAnalytics={() => setActiveTab('analytics')}
              />
            )}
          </WhatsAppLayout>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SplashScreen />
      <MainContent />
    </AuthProvider>
  );
}
