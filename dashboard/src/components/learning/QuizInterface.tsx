import React from 'react';
import { Button } from '../ui/button';
import { FileText, Award } from 'lucide-react';
import { quizQuestions } from '../constants/learningData';

interface QuizInterfaceProps {
  moduleData: {
    id: number;
    title: string;
    duration: string;
    completed: boolean;
  };
  quizAnswers: {[key: string]: string};
  showQuizResults: boolean;
  onAnswerChange: (questionId: number, answer: string) => void;
  onSubmitQuiz: () => void;
  onRetakeQuiz: () => void;
  onComplete: () => void;
}

export function QuizInterface({ 
  moduleData, 
  quizAnswers, 
  showQuizResults, 
  onAnswerChange, 
  onSubmitQuiz, 
  onRetakeQuiz, 
  onComplete 
}: QuizInterfaceProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <FileText className="h-12 w-12 text-brand-primary mx-auto mb-4" />
        <h3 className="text-xl font-medium">{moduleData.title}</h3>
        <p className="text-gray-600">Test your knowledge from the previous modules</p>
      </div>

      {!showQuizResults ? (
        <div className="space-y-6">
          {quizQuestions.map((question, index) => (
            <div key={question.id} className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3">
                {index + 1}. {question.question}
              </h4>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={optionIndex}
                      onChange={(e) => onAnswerChange(question.id, e.target.value)}
                      className="text-brand-primary"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          
          <div className="text-center">
            <Button 
              onClick={onSubmitQuiz}
              disabled={Object.keys(quizAnswers).length < quizQuestions.length}
              className="bg-brand-primary hover:bg-brand-primary/90"
            >
              Submit Quiz
            </Button>
          </div>
        </div>
      ) : (
        /* Quiz Results */
        <div className="text-center space-y-6">
          <div className="p-6 bg-green-50 rounded-lg">
            <Award className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-green-800 mb-2">
              Congratulations! 
            </h3>
            <p className="text-green-700">
              You scored 85% on this knowledge check.
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={onRetakeQuiz}>
              Retake Quiz
            </Button>
            <Button 
              onClick={onComplete}
              className="bg-green-600 hover:bg-green-700"
            >
              Continue to Next Module
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}