import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { CheckCircle, Circle, Clock, AlertCircle, ArrowLeft, ArrowRight, Square, Check } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
  value?: number;
  microSupport?: string;
  recognition?: string;
  anticipation?: string;
  userLevel?: 'beginner' | 'advanced';
  gentleReframe?: string;
  hopeInjection?: string;
  validation?: string;
  curiosity?: string;
  nutritionLevel?: 'never' | 'always';
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'multiple-select' | 'true-false' | 'text';
  question: string;
  options?: Option[];
  sectionHeader?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit?: number;
  explanation?: string;
}

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  onPrevious?: () => void;
  questionNumber: number;
  totalQuestions: number;
  showResults?: boolean;
  selectedAnswer?: string;
  userProfile?: {
    exerciseLevel?: 'beginner' | 'advanced';
    healthFoundation?: 'builder';
    microSupport?: string;
    recognition?: string;
    anticipation?: string;
    gentleReframe?: string;
    hopeInjection?: string;
    validation?: string;
    curiosity?: string;
    emphaticCheck?: string;
    reframe?: string;
    foundationFirst?: boolean;
    immediateReward?: string;
    energyConnection?: string;
    microInsight?: string;
    solutionPreview?: string;
    patternRecognition?: string;
  };
}

export function QuestionCard({
  question,
  onAnswer,
  onNext,
  onPrevious,
  questionNumber,
  totalQuestions,
  showResults = false,
  selectedAnswer: initialSelectedAnswer = '',
  userProfile = {},
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>(initialSelectedAnswer);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionStartTime] = useState<number>(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(question.timeLimit || 30);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !isSubmitting) {
        if (question.type === 'multiple-select' ? selectedAnswers.length > 0 : selectedAnswer) {
          handleNext();
        }
      } else if (event.key === 'ArrowLeft' && onPrevious) {
        onPrevious();
      } else if (event.key >= '1' && event.key <= '9') {
        const optionIndex = parseInt(event.key) - 1;
        if (question.options && question.options[optionIndex]) {
          handleAnswerSelect(question.options[optionIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAnswer, selectedAnswers, isSubmitting, onPrevious]);

  // Update selected answer when navigating to a different question
  useEffect(() => {
    if (question.type === 'multiple-select') {
      // For multiple-select, parse the comma-separated string or empty array
      const answers = initialSelectedAnswer ? initialSelectedAnswer.split(',') : [];
      setSelectedAnswers(answers);
    } else {
      setSelectedAnswer(initialSelectedAnswer);
    }
  }, [initialSelectedAnswer, question.id, question.type]);

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  };

  const handleAnswerSelect = (answerId: string) => {
    if (question.type === 'multiple-select') {
      // Handle multiple selection
      const newSelectedAnswers = selectedAnswers.includes(answerId)
        ? selectedAnswers.filter(id => id !== answerId) // Remove if already selected
        : [...selectedAnswers, answerId]; // Add if not selected
      
      setSelectedAnswers(newSelectedAnswers);
      onAnswer(newSelectedAnswers.join(',')); // Send as comma-separated string
    } else {
      // Handle single selection
      setSelectedAnswer(answerId);
      onAnswer(answerId);
      if (showResults) {
        setTimeout(() => setShowExplanation(true), 500);
      } else if (!onPrevious) {
        // Auto-proceed only if no navigation buttons (backward compatibility)
        setTimeout(() => {
          handleNext();
        }, 800); // 800ms delay for user to see their selection
      }
    }
    // If navigation buttons are present, user must click Next manually
  };


  // Get the selected option for micro-support/recognition display
  const selectedOption = question.options?.find(opt => opt.id === selectedAnswer);

  const validateAnswer = (): boolean => {
    setValidationError('');
    
    if (question.type === 'multiple-select') {
      if (selectedAnswers.length === 0) {
        setValidationError('Please select at least one option');
        return false;
      }
    } else {
      if (!selectedAnswer) {
        setValidationError('Please select an answer');
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (!validateAnswer()) return;
    
    setIsSubmitting(true);
    const answerTime = Date.now() - questionStartTime;
    
    // Track performance metrics for optimization
    if (answerTime > 30000) {
      console.log(`Question ${questionNumber} took ${Math.round(answerTime/1000)}s - consider simplifying`);
    }
    
    setTimeout(() => {
      setSelectedAnswer('');
      setShowExplanation(false);
      setIsSubmitting(false);
      onNext();
    }, 100); // Smooth transition delay
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full max-w-2xl mx-auto"
      role="main"
      aria-label={`Question ${questionNumber} of ${totalQuestions}`}
    >
      <Card className="p-6 md:p-8 bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              {questionNumber}/{totalQuestions}
            </Badge>
            <Badge className={difficultyColors[question.difficulty]}>
              {question.difficulty}
            </Badge>
            <Badge variant="secondary">{question.category}</Badge>
          </div>
          
          {question.timeLimit && (
            <motion.div
              className="flex items-center gap-2 text-sm text-muted-foreground"
              animate={{ color: timeLeft < 10 ? '#dc2626' : undefined }}
            >
              <Clock className="w-4 h-4" />
              <span className="font-mono">{timeLeft}s</span>
            </motion.div>
          )}
        </div>

        {/* Question */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 mb-8"
        >
          <h2 
            className="text-xl md:text-2xl font-semibold leading-relaxed"
            id={`question-${question.id}`}
            aria-live="polite"
          >
            {question.question}
          </h2>
          <div className="sr-only" aria-live="polite">
            {question.type === 'multiple-select' 
              ? 'You can select multiple options. Use numbers 1-9 to select options, Enter to continue, or left arrow to go back.'
              : 'Select one option. Use numbers 1-9 to select options, Enter to continue, or left arrow to go back.'
            }
          </div>
        </motion.div>

        {/* Section Header */}
        {question.sectionHeader && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative z-10 mb-6 p-4 bg-gradient-to-r from-purple-50/60 to-blue-50/60 dark:from-purple-900/40 dark:to-blue-900/40 backdrop-blur-sm rounded-xl border border-purple-200/50 dark:border-purple-500/30 shadow-lg"
          >
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300 text-center">
              {question.sectionHeader}
            </p>
          </motion.div>
        )}

        {/* Options */}
        <div className="relative z-10 space-y-3 mb-8">
          <AnimatePresence>
              {question.options?.map((option, index) => {
              const isSelected = question.type === 'multiple-select' 
                ? selectedAnswers.includes(option.id)
                : selectedAnswer === option.id;
              const isCorrect = showResults && option.isCorrect;
              const isWrong = showResults && isSelected && !option.isCorrect;
              
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => handleAnswerSelect(option.id)}
                    disabled={showResults}
                    aria-pressed={isSelected}
                    aria-describedby={`question-${question.id}`}
                    aria-label={`Option ${index + 1}: ${option.text}`}
                    className={`
                      w-full p-4 h-auto text-left justify-start group relative overflow-hidden
                      transition-all duration-300 border backdrop-blur-sm rounded-xl
                      touch-manipulation active:scale-[0.98] active:duration-75
                      min-h-[60px] md:min-h-[56px]
                      ${isSelected && !showResults ? 'border-primary bg-primary/20 shadow-lg' : ''}
                      ${isCorrect ? 'border-green-500 bg-green-50/60 dark:bg-green-900/40 shadow-lg' : ''}
                      ${isWrong ? 'border-red-500 bg-red-50/60 dark:bg-red-900/40 shadow-lg' : ''}
                      ${!isSelected && !showResults ? 'border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/10 hover:border-primary/50 hover:bg-primary/15 hover:shadow-md' : ''}
                    `}
                  >
                    {/* Animated background */}
                    {isSelected && !showResults && (
                      <motion.div
                        className="absolute inset-0 bg-primary/5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    <div className="flex items-center gap-4 relative z-10">
                      {/* Option Icon */}
                      <div className="flex-shrink-0">
                        {showResults ? (
                          isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : isWrong ? (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground" />
                          )
                        ) : question.type === 'multiple-select' ? (
                          // Checkbox for multiple-select
                          <motion.div
                            animate={{ 
                              scale: isSelected ? 1.1 : 1,
                              backgroundColor: isSelected ? '#030213' : 'rgba(0, 0, 0, 0)'
                            }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="w-5 h-5 rounded border-2 border-current flex items-center justify-center"
                          >
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                <Check className="w-3 h-3 text-white" />
                              </motion.div>
                            )}
                          </motion.div>
                        ) : (
                          // Radio button for single-select
                          <motion.div
                            animate={{ 
                              scale: isSelected ? 1.2 : 1,
                              backgroundColor: isSelected ? '#030213' : 'rgba(0, 0, 0, 0)'
                            }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center"
                          >
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-white rounded-full"
                              />
                            )}
                          </motion.div>
                        )}
                      </div>

                      {/* Option Text */}
                      <span className="flex-1 font-medium group-hover:text-primary transition-colors">
                        {option.text}
                      </span>
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && question.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 mb-6 p-4 bg-muted/50 backdrop-blur-sm rounded-xl border border-primary/30 shadow-lg"
            >
              <h4 className="font-semibold mb-2 text-primary">Explanation</h4>
              <p className="text-sm text-muted-foreground">{question.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auto-proceeding indicator - positioned absolutely to prevent container expansion */}
        {/* Validation Error */}
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-4 p-3 bg-red-50/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-500/30 rounded-lg"
          >
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm text-red-700 dark:text-red-300">{validationError}</span>
          </motion.div>
        )}

        {/* Navigation buttons */}
        {!showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex justify-between items-center mt-6 pt-4 border-t border-white/10"
          >
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={questionNumber === 1 || !onPrevious}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 text-foreground disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation active:scale-95 min-h-[48px] px-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Back</span>
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={isSubmitting || (question.type === 'multiple-select' ? selectedAnswers.length === 0 : !selectedAnswer)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation active:scale-95 min-h-[48px] px-6"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Processing...
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </motion.div>
        )}

      </Card>
    </motion.div>
  );
}