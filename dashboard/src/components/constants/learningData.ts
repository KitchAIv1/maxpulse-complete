export const mockLearningPaths = {
  1: {
    id: 1,
    title: 'MAXPULSE Foundations',
    description: 'Master the basics of health and wealth building',
    level: 'Beginner',
    totalModules: 8,
    completedModules: 6,
    totalDuration: '2 hours',
    badge: 'Foundation Certified',
    modules: [
      {
        id: 1,
        title: 'Introduction to MAXPULSE',
        duration: '15:30',
        type: 'video' as const,
        completed: true,
        videoUrl: 'https://example.com/video1'
      },
      {
        id: 2,
        title: 'Understanding Health Assessments',
        duration: '22:15',
        type: 'video' as const,
        completed: true,
        videoUrl: 'https://example.com/video2'
      },
      {
        id: 3,
        title: 'Building Your Client Base',
        duration: '18:45',
        type: 'video' as const,
        completed: true,
        videoUrl: 'https://example.com/video3'
      },
      {
        id: 4,
        title: 'Effective Communication Strategies',
        duration: '25:00',
        type: 'video' as const,
        completed: false,
        videoUrl: 'https://example.com/video4'
      },
      {
        id: 5,
        title: 'Knowledge Check: Module 1-4',
        duration: '10:00',
        type: 'quiz' as const,
        completed: false
      },
      {
        id: 6,
        title: 'Advanced Sales Techniques',
        duration: '30:20',
        type: 'video' as const,
        completed: false,
        videoUrl: 'https://example.com/video6'
      },
      {
        id: 7,
        title: 'Digital Marketing Fundamentals',
        duration: '28:10',
        type: 'video' as const,
        completed: false,
        videoUrl: 'https://example.com/video7'
      },
      {
        id: 8,
        title: 'Final Assessment',
        duration: '15:00',
        type: 'quiz' as const,
        completed: false
      }
    ]
  }
};

export const quizQuestions = [
  {
    id: 1,
    question: "What is the primary goal of a MAXPULSE health assessment?",
    options: [
      "To sell products immediately",
      "To understand client's health goals and challenges",
      "To collect personal information",
      "To schedule follow-up meetings"
    ],
    correct: 1
  },
  {
    id: 2,
    question: "Which communication approach is most effective with new prospects?",
    options: [
      "Aggressive sales tactics",
      "Active listening and empathy",
      "Technical product specifications",
      "Price comparisons"
    ],
    correct: 1
  },
  {
    id: 3,
    question: "What percentage of communication is non-verbal?",
    options: [
      "35%",
      "55%",
      "75%",
      "90%"
    ],
    correct: 1
  }
];

export const keyTakeaways = [
  "Always listen more than you speak in initial conversations",
  "Focus on understanding client needs before presenting solutions",
  "Use open-ended questions to encourage detailed responses",
  "Build trust through consistent follow-up and value delivery"
];

export const additionalResources = [
  {
    title: "Communication Best Practices PDF",
    type: "document",
    url: "#"
  },
  {
    title: "Client Conversation Templates",
    type: "template",
    url: "#"
  },
  {
    title: "Follow-up Email Scripts",
    type: "script",
    url: "#"
  }
];

export const transcript = `
  Welcome to MAXPULSE Foundations. In this comprehensive training module, you'll learn the fundamental principles that drive success in health and wealth building.

  Today we're covering the essential components of effective client communication. Remember, your success as a MAXPULSE distributor depends not just on product knowledge, but on your ability to connect authentically with prospects and clients.

  The key principles we'll explore include:
  1. Active listening techniques
  2. Building rapport and trust
  3. Identifying client pain points
  4. Presenting solutions effectively
  5. Following up professionally

  Let's begin with active listening...
`;