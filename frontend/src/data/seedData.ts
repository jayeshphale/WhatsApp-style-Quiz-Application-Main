import {
  User,
  Exam,
  Subject,
  Chapter,
  Question,
  Quiz,
  QuestionEvent
} from '../types/quiz';

// Helper deterministic pseudo-random generator for consistent seed output
function seededRandom(seed: number) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rohan', 'Priya', 'Aditya', 'Sanya', 'Vikram', 'Neha', 'Kabir', 'Isha',
  'Dev', 'Diya', 'Arjun', 'Meera', 'Karan', 'Riya', 'Rahul', 'Anushka', 'Aman', 'Pooja',
  'Siddharth', 'Tanvi', 'Yash', 'Kavya', 'Gaurav', 'Sneha', 'Nikhil', 'Simran', 'Varun', 'Shreya',
  'Aakash', 'Deepika', 'Manish', 'Kritika', 'Suraj', 'Divya', 'Tarun', 'Nisha', 'Raj', 'Bhavna',
  'Kunal', 'Rashmi', 'Sameer', 'Swati', 'Harsh', 'Ritika', 'Vikas', 'Monika', 'Abhishek', 'Ritu'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Gupta', 'Singh', 'Kumar', 'Reddy', 'Joshi', 'Mehta', 'Nair',
  'Chawla', 'Bhasin', 'Deshmukh', 'Kulkarni', 'Rao', 'Agarwal', 'Shah', 'Banerjee', 'Iyer', 'Pillai'
];

export function generateSeedData() {
  let rngSeed = 42;
  const rand = () => seededRandom(rngSeed++);

  // 1. Generate 50 Users
  const users: User[] = [];
  for (let i = 1; i <= 50; i++) {
    const fName = FIRST_NAMES[(i - 1) % FIRST_NAMES.length];
    const lName = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    users.push({
      _id: `user_${i.toString().padStart(3, '0')}`,
      name: `${fName} ${lName}`,
      email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@example.com`,
      created_at: new Date(Date.now() - (100 - i) * 86400000).toISOString()
    });
  }

  // 2. Generate 3 Exams
  const exams: Exam[] = [
    {
      _id: 'exam_upsc',
      name: 'UPSC Civil Services Examination',
      description: 'General Studies, Indian Polity, Economy & History Mastery'
    },
    {
      _id: 'exam_jee',
      name: 'JEE Advanced',
      description: 'Physics, Chemistry & Mathematics for Engineering Admissions'
    },
    {
      _id: 'exam_neet',
      name: 'NEET UG Entrance Test',
      description: 'Biology, Physics & Chemistry for Medical Aspirants'
    }
  ];

  // 3. Generate 10 Subjects distributed across Exams
  const subjects: Subject[] = [
    // UPSC
    { _id: 'subj_polity', exam_id: 'exam_upsc', name: 'Indian Polity & Constitution' },
    { _id: 'subj_economy', exam_id: 'exam_upsc', name: 'Indian Economy & Development' },
    { _id: 'subj_history', exam_id: 'exam_upsc', name: 'Ancient & Modern History' },
    { _id: 'subj_geography', exam_id: 'exam_upsc', name: 'Indian & World Geography' },

    // JEE
    { _id: 'subj_physics_jee', exam_id: 'exam_jee', name: 'Physics (Mechanics & Electrodynamics)' },
    { _id: 'subj_chem_jee', exam_id: 'exam_jee', name: 'Chemistry (Physical & Organic)' },
    { _id: 'subj_maths_jee', exam_id: 'exam_jee', name: 'Mathematics (Calculus & Algebra)' },

    // NEET
    { _id: 'subj_biology_neet', exam_id: 'exam_neet', name: 'Biology (Botany & Zoology)' },
    { _id: 'subj_physics_neet', exam_id: 'exam_neet', name: 'Physics (Optics & Modern Physics)' },
    { _id: 'subj_chem_neet', exam_id: 'exam_neet', name: 'Chemistry (Inorganic & Environmental)' }
  ];

  // 4. Generate 30 Chapters distributed across Subjects
  const chapters: Chapter[] = [
    // Polity
    { _id: 'chap_polity_1', subject_id: 'subj_polity', exam_id: 'exam_upsc', name: 'Preamble & Fundamental Rights' },
    { _id: 'chap_polity_2', subject_id: 'subj_polity', exam_id: 'exam_upsc', name: 'Directive Principles & Fundamental Duties' },
    { _id: 'chap_polity_3', subject_id: 'subj_polity', exam_id: 'exam_upsc', name: 'Parliament & Judiciary Structure' },

    // Economy
    { _id: 'chap_econ_1', subject_id: 'subj_economy', exam_id: 'exam_upsc', name: 'Monetary Policy & Inflation' },
    { _id: 'chap_econ_2', subject_id: 'subj_economy', exam_id: 'exam_upsc', name: 'Fiscal Policy & Banking Sector' },
    { _id: 'chap_econ_3', subject_id: 'subj_economy', exam_id: 'exam_upsc', name: 'International Trade & Balance of Payments' },

    // History
    { _id: 'chap_hist_1', subject_id: 'subj_history', exam_id: 'exam_upsc', name: 'Indus Valley & Vedic Civilization' },
    { _id: 'chap_hist_2', subject_id: 'subj_history', exam_id: 'exam_upsc', name: 'Freedom Struggle & National Movement' },
    { _id: 'chap_hist_3', subject_id: 'subj_history', exam_id: 'exam_upsc', name: 'Post-Independence Consolidation' },

    // Geography
    { _id: 'chap_geo_1', subject_id: 'subj_geography', exam_id: 'exam_upsc', name: 'Geomorphology & Plate Tectonics' },
    { _id: 'chap_geo_2', subject_id: 'subj_geography', exam_id: 'exam_upsc', name: 'Monsoons & Climate Systems' },
    { _id: 'chap_geo_3', subject_id: 'subj_geography', exam_id: 'exam_upsc', name: 'Resource Distribution & Industries' },

    // JEE Physics
    { _id: 'chap_phys_1', subject_id: 'subj_physics_jee', exam_id: 'exam_jee', name: 'Kinematics & Laws of Motion' },
    { _id: 'chap_phys_2', subject_id: 'subj_physics_jee', exam_id: 'exam_jee', name: 'Work, Power & Energy' },

    // JEE Chemistry
    { _id: 'chap_chem_1', subject_id: 'subj_chem_jee', exam_id: 'exam_jee', name: 'Chemical Bonding & Molecular Structure' },
    { _id: 'chap_chem_2', subject_id: 'subj_chem_jee', exam_id: 'exam_jee', name: 'Thermodynamics & Electrochemistry' },

    // JEE Maths
    { _id: 'chap_math_1', subject_id: 'subj_maths_jee', exam_id: 'exam_jee', name: 'Differential & Integral Calculus' },
    { _id: 'chap_math_2', subject_id: 'subj_maths_jee', exam_id: 'exam_jee', name: 'Matrices, Determinants & Vectors' },
    { _id: 'chap_math_3', subject_id: 'subj_maths_jee', exam_id: 'exam_jee', name: 'Probability & Complex Numbers' },

    // NEET Biology
    { _id: 'chap_bio_1', subject_id: 'subj_biology_neet', exam_id: 'exam_neet', name: 'Cell Biology & Genetics' },
    { _id: 'chap_bio_2', subject_id: 'subj_biology_neet', exam_id: 'exam_neet', name: 'Human Physiology & Anatomy' },
    { _id: 'chap_bio_3', subject_id: 'subj_biology_neet', exam_id: 'exam_neet', name: 'Plant Physiology & Ecology' },
    { _id: 'chap_bio_4', subject_id: 'subj_biology_neet', exam_id: 'exam_neet', name: 'Biotechnology & Applications' },

    // NEET Physics
    { _id: 'chap_phys_neet_1', subject_id: 'subj_physics_neet', exam_id: 'exam_neet', name: 'Ray & Wave Optics' },
    { _id: 'chap_phys_neet_2', subject_id: 'subj_physics_neet', exam_id: 'exam_neet', name: 'Dual Nature of Matter & Atoms' },

    // NEET Chemistry
    { _id: 'chap_chem_neet_1', subject_id: 'subj_chem_neet', exam_id: 'exam_neet', name: 'Periodic Classification & Coordination Compounds' },
    { _id: 'chap_chem_neet_2', subject_id: 'subj_chem_neet', exam_id: 'exam_neet', name: 'Environmental Chemistry & Polymers' },
    { _id: 'chap_chem_neet_3', subject_id: 'subj_chem_neet', exam_id: 'exam_neet', name: 'Biomolecules & Organic Reactions' }
  ];

  // 5. Generate 500 Questions distributed across chapters
  const questions: Question[] = [];
  const difficultyTypes: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];

  let qCounter = 1;
  for (const chap of chapters) {
    // ~16-17 questions per chapter -> total 500
    const questionsForChap = 17;
    for (let k = 0; k < questionsForChap; k++) {
      if (qCounter > 500) break;

      const diff = difficultyTypes[(qCounter + k) % 3];
      const qId = `q_${qCounter.toString().padStart(4, '0')}`;

      questions.push({
        _id: qId,
        chapter_id: chap._id,
        subject_id: chap.subject_id,
        exam_id: chap.exam_id,
        question_text: `[${chap.name}] Question #${qCounter}: Which statement best describes key principle #${(qCounter % 9) + 1}?`,
        options: [
          { option_id: 'opt_a', text: `Option A: Primary mechanism involving factor X and parameter ${(qCounter % 5) + 10}.` },
          { option_id: 'opt_b', text: `Option B: Secondary pathway governed by constitutional principle Y.` },
          { option_id: 'opt_c', text: `Option C: Neutral balance condition observed under standard testing.` },
          { option_id: 'opt_d', text: `Option D: None of the above alternate formulations.` }
        ],
        correct_option_id: ['opt_a', 'opt_b', 'opt_c', 'opt_d'][qCounter % 4],
        difficulty_seed: diff
      });

      qCounter++;
    }
  }

  // Fill up to exactly 500 if needed
  while (questions.length < 500) {
    const chap = chapters[questions.length % chapters.length];
    const diff = difficultyTypes[questions.length % 3];
    const qId = `q_${(questions.length + 1).toString().padStart(4, '0')}`;
    questions.push({
      _id: qId,
      chapter_id: chap._id,
      subject_id: chap.subject_id,
      exam_id: chap.exam_id,
      question_text: `[${chap.name}] Additional question #${questions.length + 1} regarding specialized topic application.`,
      options: [
        { option_id: 'opt_a', text: 'Option A: Analytical condition 1' },
        { option_id: 'opt_b', text: 'Option B: Empirical result 2' },
        { option_id: 'opt_c', text: 'Option C: Theoretical baseline 3' },
        { option_id: 'opt_d', text: 'Option D: Derived formula 4' }
      ],
      correct_option_id: ['opt_a', 'opt_b', 'opt_c', 'opt_d'][questions.length % 4],
      difficulty_seed: diff
    });
  }

  // 6. Generate Quizzes & Question Events (~20 quizzes per user = 1000 quizzes total)
  const quizzes: Quiz[] = [];
  const questionEvents: QuestionEvent[] = [];

  let quizCounter = 1;
  let eventCounter = 1;

  for (let uIdx = 0; uIdx < users.length; uIdx++) {
    const user = users[uIdx];
    // Each user has a baseline capability (some fast & accurate, some consistent, etc.)
    const userBaseAccuracy = 0.5 + 0.4 * rand(); // 0.5 to 0.9
    const userBaseSpeedMs = 7000 + 12000 * rand(); // 7,000ms to 19,000ms
    const userVarianceFactor = 0.1 + 0.3 * rand(); // consistency factor

    // ~18 completed quizzes per user across different chapters
    const userQuizCount = 18;
    for (let qz = 0; qz < userQuizCount; qz++) {
      const chap = chapters[(uIdx * 3 + qz) % chapters.length];
      const chapQuestions = questions.filter(q => q.chapter_id === chap._id);
      if (chapQuestions.length < 10) continue;

      const quizId = `quiz_${quizCounter.toString().padStart(5, '0')}`;
      quizCounter++;

      const numQuestionsInQuiz = 15; // 15 questions per quiz
      const selectedQuestions = chapQuestions.slice(0, numQuestionsInQuiz);

      let correctCount = 0;
      const quizStartTime = new Date(Date.now() - (30 - qz) * 86400000 + uIdx * 100000);
      let currentTimeMs = quizStartTime.getTime();

      for (let qIdx = 0; qIdx < selectedQuestions.length; qIdx++) {
        const question = selectedQuestions[qIdx];
        const qPos = qIdx + 1; // 1-based position for fatigue analysis

        // Fatigue factors: as qPos increases from 1 to 15:
        // Response time increases by up to 35%
        // Accuracy drops by up to 20%
        const fatigueTimeMultiplier = 1.0 + (qPos - 1) * 0.025; // 1.0 -> 1.35
        const fatigueAccuracyPenalty = (qPos - 1) * 0.015; // 0% -> 21% penalty

        // Difficulty multipliers
        let diffTimeMult = 1.0;
        let diffAccMult = 1.0;
        if (question.difficulty_seed === 'hard') {
          diffTimeMult = 1.5;
          diffAccMult = 0.7;
        } else if (question.difficulty_seed === 'medium') {
          diffTimeMult = 1.1;
          diffAccMult = 0.88;
        } else {
          diffTimeMult = 0.8;
          diffAccMult = 1.1;
        }

        // Noise & variance
        const noise = (rand() - 0.5) * 2 * userVarianceFactor; // -variance to +variance
        const durationMs = Math.round(
          Math.max(2500, userBaseSpeedMs * diffTimeMult * fatigueTimeMultiplier * (1 + noise))
        );

        const calculatedAccuracyProb = Math.min(
          0.95,
          Math.max(0.15, (userBaseAccuracy * diffAccMult - fatigueAccuracyPenalty) + noise * 0.2)
        );

        const isCorrect = rand() < calculatedAccuracyProb;
        if (isCorrect) correctCount++;

        const shownTime = new Date(currentTimeMs).toISOString();
        currentTimeMs += durationMs;
        const submittedTime = new Date(currentTimeMs).toISOString();
        currentTimeMs += 1000; // 1 second gap before next question

        // Choose option
        let selectedOption = question.correct_option_id || 'opt_a';
        if (!isCorrect) {
          const wrongOptions = ['opt_a', 'opt_b', 'opt_c', 'opt_d'].filter(
            o => o !== question.correct_option_id
          );
          selectedOption = wrongOptions[Math.floor(rand() * wrongOptions.length)];
        }

        questionEvents.push({
          _id: `evt_${eventCounter.toString().padStart(6, '0')}`,
          user_id: user._id,
          quiz_id: quizId,
          question_id: question._id,
          exam_id: chap.exam_id,
          subject_id: chap.subject_id,
          chapter_id: chap._id,
          question_index_in_quiz: qPos,
          question_shown_time: shownTime,
          answer_submitted_time: submittedTime,
          response_duration_ms: durationMs,
          selected_option_id: selectedOption,
          is_correct: isCorrect
        });

        eventCounter++;
      }

      quizzes.push({
        _id: quizId,
        user_id: user._id,
        chapter_id: chap._id,
        subject_id: chap.subject_id,
        exam_id: chap.exam_id,
        started_at: quizStartTime.toISOString(),
        completed_at: new Date(currentTimeMs).toISOString(),
        status: 'completed',
        total_questions: selectedQuestions.length,
        score: correctCount
      });
    }
  }

  return {
    users,
    exams,
    subjects,
    chapters,
    questions,
    quizzes,
    questionEvents
  };
}
