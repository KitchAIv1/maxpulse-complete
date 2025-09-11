import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { 
  FileQuestion,
  Plus,
  Trash2,
  Edit,
  Copy,
  Eye,
  Save,
  Settings,
  Clock,
  Target,
  CheckCircle,
  X,
  RotateCcw,
  Upload,
  Image
} from 'lucide-react';

interface Question {
  id: number;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: number | string;
  explanation?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  course: string;
  timeLimit: number;
  passingScore: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  showCorrectAnswers: boolean;
  allowReview: boolean;
  questions: Question[];
  status: 'draft' | 'published' | 'archived';
}

export function QuizBuilder() {
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);

  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: 1,
      title: 'MAXPULSE Foundations Assessment',
      description: 'Test your understanding of MAXPULSE core principles',
      course: 'MAXPULSE Foundations',
      timeLimit: 30,
      passingScore: 80,
      maxAttempts: 3,
      shuffleQuestions: true,
      showCorrectAnswers: true,
      allowReview: true,
      status: 'published',
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What is the primary goal of a MAXPULSE health assessment?',
          options: [
            'To sell products immediately',
            'To understand client\'s health goals and challenges',
            'To collect personal information',
            'To schedule follow-up meetings'
          ],
          correctAnswer: 1,
          explanation: 'The primary goal is to understand the client\'s unique health situation and goals to provide personalized recommendations.',
          points: 10,
          difficulty: 'easy',
          tags: ['fundamentals', 'assessment']
        },
        {
          id: 2,
          type: 'true-false',
          question: 'Active listening is more important than talking during client consultations.',
          correctAnswer: 'true',
          explanation: 'Active listening helps build trust and ensures you understand the client\'s needs before making recommendations.',
          points: 5,
          difficulty: 'easy',
          tags: ['communication', 'skills']
        }
      ]
    },
    {
      id: 2,
      title: 'Sales Techniques Quiz',
      description: 'Advanced sales strategies assessment',
      course: 'Advanced Sales Strategies',
      timeLimit: 20,
      passingScore: 85,
      maxAttempts: 2,
      shuffleQuestions: false,
      showCorrectAnswers: false,
      allowReview: false,
      status: 'draft',
      questions: []
    }
  ]);

  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    points: 10,
    difficulty: 'medium',
    tags: []
  });

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True/False' },
    { value: 'fill-blank', label: 'Fill in the Blank' },
    { value: 'essay', label: 'Essay Question' }
  ];

  const difficultyLevels = [
    { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'hard', label: 'Hard', color: 'bg-red-100 text-red-800' }
  ];

  const addQuestion = () => {
    if (!selectedQuiz) return;
    
    const quiz = quizzes.find(q => q.id === selectedQuiz);
    if (!quiz) return;

    const question: Question = {
      id: Date.now(),
      type: newQuestion.type as Question['type'],
      question: newQuestion.question || '',
      options: newQuestion.options,
      correctAnswer: newQuestion.correctAnswer,
      explanation: newQuestion.explanation,
      points: newQuestion.points || 10,
      difficulty: newQuestion.difficulty as Question['difficulty'],
      tags: newQuestion.tags || []
    };

    setQuizzes(prev => prev.map(q => 
      q.id === selectedQuiz 
        ? { ...q, questions: [...q.questions, question] }
        : q
    ));

    // Reset form
    setNewQuestion({
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      points: 10,
      difficulty: 'medium',
      tags: []
    });
  };

  const deleteQuestion = (questionId: number) => {
    if (!selectedQuiz) return;
    
    setQuizzes(prev => prev.map(q => 
      q.id === selectedQuiz 
        ? { ...q, questions: q.questions.filter(question => question.id !== questionId) }
        : q
    ));
  };

  const updateQuestionOption = (index: number, value: string) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options?.map((opt, i) => i === index ? value : opt) || []
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedQuizData = quizzes.find(q => q.id === selectedQuiz);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Quiz Builder</h1>
          <p className="text-gray-600">Create engaging assessments to test knowledge</p>
        </div>
        <Button className="bg-brand-primary hover:bg-brand-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          New Quiz
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quiz List */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-medium mb-4">Your Quizzes</h3>
            <div className="space-y-3">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedQuiz === quiz.id
                      ? 'border-brand-primary bg-brand-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedQuiz(quiz.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                      {quiz.title}
                    </h4>
                    <Badge className={getStatusColor(quiz.status)}>
                      {quiz.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {quiz.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{quiz.questions.length} questions</span>
                    <span>{quiz.timeLimit}m</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quiz Builder */}
        <div className="lg:col-span-3">
          {selectedQuizData ? (
            <div className="space-y-6">
              {/* Quiz Settings */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{selectedQuizData.title}</h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-brand-primary">{selectedQuizData.questions.length}</div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedQuizData.passingScore}%</div>
                    <div className="text-sm text-gray-600">Pass Score</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedQuizData.timeLimit}</div>
                    <div className="text-sm text-gray-600">Minutes</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{selectedQuizData.maxAttempts}</div>
                    <div className="text-sm text-gray-600">Max Attempts</div>
                  </div>
                </div>

                <p className="text-gray-600">{selectedQuizData.description}</p>
              </Card>

              {/* Questions List */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium">Questions</h3>
                  <div className="text-sm text-gray-600">
                    Total Points: {selectedQuizData.questions.reduce((sum, q) => sum + q.points, 0)}
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedQuizData.questions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-medium text-gray-900">Q{index + 1}</span>
                            <Badge variant="outline" className="text-xs capitalize">
                              {question.type.replace('-', ' ')}
                            </Badge>
                            <Badge className={difficultyLevels.find(d => d.value === question.difficulty)?.color}>
                              {question.difficulty}
                            </Badge>
                            <span className="text-sm text-gray-500">{question.points} pts</span>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-2">{question.question}</h4>
                          
                          {question.type === 'multiple-choice' && question.options && (
                            <div className="space-y-1">
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className={`text-sm p-2 rounded ${
                                  question.correctAnswer === optIndex 
                                    ? 'bg-green-50 text-green-700 border border-green-200' 
                                    : 'bg-gray-50 text-gray-700'
                                }`}>
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                  {question.correctAnswer === optIndex && (
                                    <CheckCircle className="h-4 w-4 text-green-600 inline ml-2" />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {question.type === 'true-false' && (
                            <div className="text-sm">
                              <span className={`inline-flex items-center px-2 py-1 rounded ${
                                question.correctAnswer === 'true' 
                                  ? 'bg-green-50 text-green-700 border border-green-200' 
                                  : 'bg-gray-50 text-gray-700'
                              }`}>
                                True
                                {question.correctAnswer === 'true' && (
                                  <CheckCircle className="h-4 w-4 text-green-600 ml-1" />
                                )}
                              </span>
                              <span className="mx-2">/</span>
                              <span className={`inline-flex items-center px-2 py-1 rounded ${
                                question.correctAnswer === 'false' 
                                  ? 'bg-green-50 text-green-700 border border-green-200' 
                                  : 'bg-gray-50 text-gray-700'
                              }`}>
                                False
                                {question.correctAnswer === 'false' && (
                                  <CheckCircle className="h-4 w-4 text-green-600 ml-1" />
                                )}
                              </span>
                            </div>
                          )}

                          {question.explanation && (
                            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                              <div className="text-xs font-medium text-blue-700 mb-1">Explanation:</div>
                              <div className="text-sm text-blue-800">{question.explanation}</div>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Add New Question */}
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Add New Question</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Question Type</Label>
                      <Select 
                        value={newQuestion.type} 
                        onValueChange={(value) => setNewQuestion(prev => ({ ...prev, type: value as Question['type'] }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {questionTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Difficulty</Label>
                      <Select 
                        value={newQuestion.difficulty} 
                        onValueChange={(value) => setNewQuestion(prev => ({ ...prev, difficulty: value as Question['difficulty'] }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {difficultyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Points</Label>
                      <Input 
                        type="number" 
                        value={newQuestion.points} 
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, points: parseInt(e.target.value) || 10 }))}
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Question Text</Label>
                    <Textarea 
                      placeholder="Enter your question here..."
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                    />
                  </div>

                  {newQuestion.type === 'multiple-choice' && (
                    <div>
                      <Label>Answer Options</Label>
                      <div className="space-y-2">
                        {newQuestion.options?.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span className="text-sm font-medium w-8">{String.fromCharCode(65 + index)}.</span>
                            <Input 
                              placeholder={`Option ${index + 1}`}
                              value={option}
                              onChange={(e) => updateQuestionOption(index, e.target.value)}
                            />
                            <Button
                              variant={newQuestion.correctAnswer === index ? "default" : "outline"}
                              size="sm"
                              onClick={() => setNewQuestion(prev => ({ ...prev, correctAnswer: index }))}
                            >
                              {newQuestion.correctAnswer === index ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {newQuestion.type === 'true-false' && (
                    <div>
                      <Label>Correct Answer</Label>
                      <div className="flex space-x-4">
                        <Button
                          variant={newQuestion.correctAnswer === 'true' ? "default" : "outline"}
                          onClick={() => setNewQuestion(prev => ({ ...prev, correctAnswer: 'true' }))}
                        >
                          True
                        </Button>
                        <Button
                          variant={newQuestion.correctAnswer === 'false' ? "default" : "outline"}
                          onClick={() => setNewQuestion(prev => ({ ...prev, correctAnswer: 'false' }))}
                        >
                          False
                        </Button>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Explanation (Optional)</Label>
                    <Textarea 
                      placeholder="Provide an explanation for the correct answer..."
                      value={newQuestion.explanation || ''}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline"
                      onClick={() => setNewQuestion({
                        type: 'multiple-choice',
                        question: '',
                        options: ['', '', '', ''],
                        points: 10,
                        difficulty: 'medium',
                        tags: []
                      })}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button onClick={addQuestion} disabled={!newQuestion.question}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <FileQuestion className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Quiz</h3>
              <p className="text-gray-600 mb-6">Choose a quiz from the list to start building questions</p>
              <Button className="bg-brand-primary hover:bg-brand-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Create New Quiz
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}