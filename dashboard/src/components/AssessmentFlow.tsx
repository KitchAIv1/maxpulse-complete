import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle, Home } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'scale';
  options?: string[];
  category: 'health' | 'business' | 'lifestyle';
}

const assessmentQuestions: Question[] = [
  {
    id: 'q1',
    text: 'What is your primary goal right now?',
    type: 'single',
    options: ['Improve my health', 'Build additional income', 'Both health and wealth', 'Not sure yet'],
    category: 'lifestyle'
  },
  {
    id: 'q2',
    text: 'How would you rate your current energy levels?',
    type: 'scale',
    category: 'health'
  },
  {
    id: 'q3',
    text: 'What best describes your current work situation?',
    type: 'single',
    options: ['Full-time employed', 'Part-time/freelance', 'Self-employed', 'Looking for opportunities', 'Retired'],
    category: 'business'
  },
  {
    id: 'q4',
    text: 'Which health challenges concern you most?',
    type: 'multiple',
    options: ['Low energy/fatigue', 'Weight management', 'Sleep quality', 'Stress levels', 'Digestive health', 'None of these'],
    category: 'health'
  },
  {
    id: 'q5',
    text: 'How much time could you dedicate to a side business weekly?',
    type: 'single',
    options: ['Less than 5 hours', '5-10 hours', '10-20 hours', '20+ hours', 'Not interested'],
    category: 'business'
  },
  {
    id: 'q6',
    text: 'What motivates you most about improving your health?',
    type: 'single',
    options: ['More energy for family', 'Better physical appearance', 'Long-term wellness', 'Professional performance', 'Personal confidence'],
    category: 'health'
  },
  {
    id: 'q7',
    text: 'How comfortable are you with social media and online marketing?',
    type: 'scale',
    category: 'business'
  },
  {
    id: 'q8',
    text: 'What is your ideal monthly additional income goal?',
    type: 'single',
    options: ['$500-1,000', '$1,000-2,500', '$2,500-5,000', '$5,000+', 'Just want to try products'],
    category: 'business'
  }
];

export function AssessmentFlow() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [scaleValue, setScaleValue] = useState(5);

  // Get distributor info from URL params
  const distributorParam = searchParams.get('distributor');
  const actualDistributorId = distributorParam ? distributorParam.split('-')[0] : null;

  // If no session ID, show error
  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Invalid Assessment Session</h1>
          <p className="text-gray-600 mb-6">This assessment session appears to be invalid.</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700"
          >
            <Home className="h-4 w-4 mr-2" />
            Return to Homepage
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;
  const question = assessmentQuestions[currentQuestion];

  const handleResponse = (value: any) => {
    const newResponses = { ...responses, [question.id]: value };
    setResponses(newResponses);

    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setScaleValue(5); // Reset scale for next question
    } else {
      // Assessment complete
      setTimeout(() => setShowResults(true), 500);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      // Restore the previous scale value if it was a scale question
      const prevQuestion = assessmentQuestions[currentQuestion - 1];
      if (prevQuestion.type === 'scale' && responses[prevQuestion.id]) {
        setScaleValue(responses[prevQuestion.id]);
      }
    }
  };

  const calculateResults = () => {
    const healthScore = Math.min(100, Object.entries(responses)
      .filter(([key]) => assessmentQuestions.find(q => q.id === key)?.category === 'health')
      .length * 25);
    
    const businessScore = Math.min(100, Object.entries(responses)
      .filter(([key]) => assessmentQuestions.find(q => q.id === key)?.category === 'business')
      .length * 25);

    const primaryInterest = responses.q1;
    let recommendation = 'health';
    
    if (primaryInterest?.includes('income') || primaryInterest?.includes('Both')) {
      recommendation = businessScore >= healthScore ? 'business' : 'both';
    }

    return { healthScore, businessScore, recommendation, primaryInterest };
  };

  const startNewAssessment = () => {
    if (distributorParam) {
      navigate(`/assess/${distributorParam}`);
    } else {
      navigate('/');
    }
  };

  if (showResults) {
    const results = calculateResults();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50 flex items-center">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 text-center bg-white shadow-xl">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Your Personalized Results</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="text-lg font-medium mb-2 text-red-900">Health Readiness</h3>
                  <div className="text-3xl font-bold text-red-600 mb-2">{results.healthScore}%</div>
                  <p className="text-sm text-red-700">Ready to transform your wellness</p>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h3 className="text-lg font-medium mb-2 text-amber-900">Business Potential</h3>
                  <div className="text-3xl font-bold text-amber-600 mb-2">{results.businessScore}%</div>
                  <p className="text-sm text-amber-700">Opportunity for income growth</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-medium mb-4">Recommended Next Steps</h3>
                {results.recommendation === 'health' && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="mb-4">Focus on our premium health solutions to optimize your wellness journey.</p>
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-medium">
                      Explore Health Solutions
                    </Button>
                  </div>
                )}
                
                {results.recommendation === 'business' && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="mb-4">You're ready to start building income with our distributor opportunity.</p>
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white font-medium">
                      Learn About Business Opportunity
                    </Button>
                  </div>
                )}
                
                {results.recommendation === 'both' && (
                  <div className="p-4 bg-gradient-to-r from-red-50 to-amber-50 rounded-lg border border-red-200">
                    <p className="mb-4 font-medium">Perfect! You're ideal for our comprehensive health + wealth program.</p>
                    <Button className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-medium">
                      View Complete Program
                    </Button>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>What happens next?</strong>
                </p>
                <p className="text-sm text-gray-600">
                  A MAXPULSE distributor will follow up with your personalized recommendations within 24 hours.
                </p>
                {actualDistributorId && (
                  <p className="text-xs text-gray-500 mt-2">
                    Referred by: {actualDistributorId}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={startNewAssessment}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  Take Another Assessment
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Learn More About MAXPULSE
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-red-800">MAXPULSE Assessment</h1>
              <span className="text-sm text-gray-600">
                {currentQuestion + 1} of {assessmentQuestions.length}
              </span>
            </div>
            <Progress value={progress} className="h-3 bg-red-100" />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Progress: {Math.round(progress)}%</span>
              <span>Est. time: {Math.ceil((assessmentQuestions.length - currentQuestion) * 0.5)} min</span>
            </div>
          </div>

          {/* Question Card */}
          <Card className="p-8 mb-6 bg-white shadow-lg">
            <h2 className="text-xl font-medium mb-6 text-gray-800">{question.text}</h2>
            
            {question.type === 'single' && question.options && (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start p-4 h-auto hover:bg-red-50 hover:border-red-300 border-gray-200 transition-colors"
                    onClick={() => handleResponse(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {question.type === 'multiple' && question.options && (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <label key={index} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer border-gray-200 transition-colors">
                    <input
                      type="checkbox"
                      className="mr-3 text-red-600 focus:ring-red-500 rounded"
                      checked={responses[question.id]?.includes(option) || false}
                      onChange={(e) => {
                        const currentSelections = responses[question.id] || [];
                        if (e.target.checked) {
                          setResponses({
                            ...responses,
                            [question.id]: [...currentSelections, option]
                          });
                        } else {
                          setResponses({
                            ...responses,
                            [question.id]: currentSelections.filter((item: string) => item !== option)
                          });
                        }
                      }}
                    />
                    {option}
                  </label>
                ))}
                <Button
                  className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-medium"
                  onClick={() => handleResponse(responses[question.id] || [])}
                  disabled={!responses[question.id]?.length}
                >
                  Continue
                </Button>
              </div>
            )}

            {question.type === 'scale' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Very Low (1)</span>
                  <span>Very High (10)</span>
                </div>
                <div className="px-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scaleValue}
                    onChange={(e) => setScaleValue(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #8B1538 0%, #8B1538 ${(scaleValue - 1) * 11.11}%, #e5e7eb ${(scaleValue - 1) * 11.11}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="text-center mt-3">
                    <span className="text-3xl font-bold text-red-600">{scaleValue}</span>
                    <span className="text-gray-600 font-medium">/10</span>
                  </div>
                </div>
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
                  onClick={() => handleResponse(scaleValue)}
                >
                  Continue
                </Button>
              </div>
            )}
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="text-sm text-gray-600 text-center">
              <p>Your responses help us personalize recommendations</p>
            </div>

            <div className="w-24"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>
    </div>
  );
}