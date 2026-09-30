export function groupQuizzesByCourse(quizzes) {
  const groups = [];
  const indexByCourse = new Map();

  for (const quiz of quizzes) {
    const courseKey = String(quiz.courseId ?? quiz.courseTitle ?? 'unknown');
    let groupIndex = indexByCourse.get(courseKey);

    if (groupIndex === undefined) {
      groupIndex = groups.length;
      indexByCourse.set(courseKey, groupIndex);
      groups.push({
        courseId: quiz.courseId ?? courseKey,
        courseTitle: quiz.courseTitle ?? 'Course',
        items: [],
      });
    }

    groups[groupIndex].items.push(quiz);
  }

  return groups;
}

const supplementalQuizGroups = [
  {
    courseId: 'course-ai-engineering-essentials',
    courseTitle: 'AI Engineering Essentials',
    items: [
      {
        id: 'quiz-ai-development',
        quizId: 'quiz-hydraulics-timed',
        title: 'Quiz: AI Development',
        attemptsLabel: '1 attempt(s)',
        questionsLabel: '10 questions',
        status: 'Passed',
        gradeLabel: 'C-',
        scoreLabel: '(1.00/5.00)',
        progressLabel: '0%',
      },
    ],
  },
  {
    courseId: 'course-seo-fundamentals',
    courseTitle: 'SEO Fundamentals for Beginners',
    items: [
      {
        id: 'quiz-seo-2',
        quizId: 'quiz-plumbing-code',
        title: 'SEO Quiz 2',
        attemptsLabel: '1 attempt(s)',
        questionsLabel: '5 questions',
        status: 'Passed',
        gradeLabel: 'C-',
        scoreLabel: '(1.00/5.00)',
        progressLabel: '0%',
      },
      {
        id: 'quiz-seo-1',
        quizId: 'quiz-plumbing-code',
        title: 'SEO Quiz 1',
        attemptsLabel: '1 attempt(s)',
        questionsLabel: '5 questions',
        status: 'Passed',
        gradeLabel: 'B+',
        scoreLabel: '(3.50/5.00)',
        progressLabel: '60%',
      },
    ],
  },
  {
    courseId: 'course-cyber-security',
    courseTitle: 'Cyber Security Fundamentals',
    items: [
      {
        id: 'quiz-cyber-risk',
        quizId: 'quiz-plumbing-code',
        title: 'Risk Management in Cyber Security',
        attemptsLabel: '1 attempt(s)',
        questionsLabel: '5 questions',
        status: 'Passed',
        gradeLabel: 'C-',
        scoreLabel: '(1.00/5.00)',
        progressLabel: '20%',
      },
    ],
  },
  {
    courseId: 'course-unity-engine',
    courseTitle: 'Engine Creating on Unity from PRO',
    items: [
      {
        id: 'quiz-unity-middle',
        quizId: 'quiz-hydraulics-timed',
        title: 'Middle Quiz',
        attemptsLabel: '4 attempt(s)',
        questionsLabel: '5 questions',
        status: 'Failed',
        gradeLabel: 'C-',
        scoreLabel: '(1.00/5.00)',
        progressLabel: '0%',
      },
    ],
  },
];

function scoreToGrade(bestScore = 0) {
  if (bestScore >= 95) return { gradeLabel: 'A+', scoreLabel: '(5.00/5.00)' };
  if (bestScore >= 90) return { gradeLabel: 'A', scoreLabel: '(4.50/5.00)' };
  if (bestScore >= 85) return { gradeLabel: 'B+', scoreLabel: '(4.00/5.00)' };
  if (bestScore >= 75) return { gradeLabel: 'B', scoreLabel: '(3.50/5.00)' };
  return { gradeLabel: 'C-', scoreLabel: '(1.00/5.00)' };
}

function buildPrimaryQuizGroups(courses, quizzes, results) {
  return courses
    .map((course) => {
      const courseQuizzes = quizzes
        .filter((quiz) => quiz.courseId === course.id)
        .map((quiz) => {
          const attempts = results.filter((result) => result.quizId === quiz.id);
          const bestScore = attempts.length
            ? Math.max(...attempts.map((attempt) => attempt.score))
            : quiz.bestScore ?? 0;
          const { gradeLabel, scoreLabel } = scoreToGrade(bestScore);

          return {
            id: quiz.id,
            quizId: quiz.id,
            title: quiz.title,
            attemptsLabel: `${quiz.attemptsUsed} attempt(s)`,
            questionsLabel: `${quiz.questionCount} questions`,
            status: bestScore >= 75 ? 'Passed' : 'Failed',
            gradeLabel,
            scoreLabel,
            progressLabel: `${bestScore}%`,
          };
        });

      if (!courseQuizzes.length) {
        return null;
      }

      return {
        courseId: course.id,
        courseTitle: course.title,
        items: courseQuizzes,
      };
    })
    .filter(Boolean);
}

export function buildStudentQuizGroups(courses, quizzes, results) {
  return [...buildPrimaryQuizGroups(courses, quizzes, results), ...supplementalQuizGroups];
}
