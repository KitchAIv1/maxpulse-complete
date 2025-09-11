import React, { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { VideoPlayer } from './learning/VideoPlayer';
import { QuizInterface } from './learning/QuizInterface';
import { ModuleNavigation } from './learning/ModuleNavigation';
import { CelebrationModal } from './learning/CelebrationModal';
import { mockLearningPaths, keyTakeaways, additionalResources, transcript } from './constants/learningData';
import { formatTime, calculateProgress, getBadgeForCompletion, shouldShowCelebration } from './utils/learningHelpers';
import { 
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  MessageSquare,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RotateCcw,
  Download,
  Users,
  FileText
} from 'lucide-react';

interface LearningModuleProps {
  pathId: number;
  onBack: () => void;
}

export function LearningModule({ pathId, onBack }: LearningModuleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(900); // 15 minutes in seconds
  const [currentModule, setCurrentModule] = useState(1);
  const [notes, setNotes] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: string}>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const learningPath = mockLearningPaths[pathId as keyof typeof mockLearningPaths] || mockLearningPaths[1];

  const currentModuleData = learningPath.modules[currentModule - 1];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleModuleComplete = () => {
    const updatedModules = [...learningPath.modules];
    updatedModules[currentModule - 1].completed = true;
    
    const completedCount = updatedModules.filter(m => m.completed).length;
    const badge = getBadgeForCompletion(completedCount, learningPath.totalModules, learningPath.badge);
    
    if (badge && shouldShowCelebration(completedCount, learningPath.totalModules)) {
      setEarnedBadge(badge);
      setShowCelebration(true);
    }
    
    if (currentModule < learningPath.totalModules) {
      setCurrentModule(currentModule + 1);
    }
    
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleQuizAnswerChange = (questionId: number, answer: string) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: answer
    });
  };

  const handleRetakeQuiz = () => {
    setShowQuizResults(false);
    setQuizAnswers({});
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 animate-in slide-in-from-right-1 duration-300 relative">
      <CelebrationModal 
        show={showCelebration}
        badge={earnedBadge || ''}
        onClose={() => setShowCelebration(false)}
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Button variant="outline" onClick={onBack} className="mb-2 sm:mb-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Training Center
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl text-gray-900">{learningPath.title}</h1>
            <p className="text-sm md:text-base text-gray-600">{learningPath.description}</p>
          </div>
        </div>
        <Badge className="bg-brand-primary text-white self-start sm:self-auto">
          {learningPath.level}
        </Badge>
      </div>

      {/* Progress Overview */}
      <Card className="p-6 glass-card-brand">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg text-gray-900">Course Progress</h3>
            <p className="text-sm text-gray-600">
              Module {currentModule} of {learningPath.totalModules} • {currentModuleData.title}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl text-brand-primary">
              {Math.round((learningPath.completedModules / learningPath.totalModules) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
        <Progress value={(learningPath.completedModules / learningPath.totalModules) * 100} className="h-3" />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{learningPath.completedModules} modules completed</span>
          <span>{learningPath.totalModules - learningPath.completedModules} remaining</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Module Navigation Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <ModuleNavigation 
            modules={learningPath.modules}
            currentModule={currentModule}
            onModuleSelect={setCurrentModule}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6 order-1 lg:order-2">
          {/* Video Player or Quiz Content */}
          <Card className="p-6">
            {currentModuleData.type === 'video' ? (
              <>
                <VideoPlayer 
                  moduleData={currentModuleData}
                  isPlaying={isPlaying}
                  currentTime={currentTime}
                  duration={duration}
                  onTogglePlay={togglePlay}
                  onComplete={handleModuleComplete}
                />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{currentModuleData.title}</h3>
                    <p className="text-sm text-gray-600">Duration: {currentModuleData.duration}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restart
                    </Button>
                    {!currentModuleData.completed && (
                      <Button onClick={handleModuleComplete} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <QuizInterface 
                moduleData={currentModuleData}
                quizAnswers={quizAnswers}
                showQuizResults={showQuizResults}
                onAnswerChange={handleQuizAnswerChange}
                onSubmitQuiz={() => setShowQuizResults(true)}
                onRetakeQuiz={handleRetakeQuiz}
                onComplete={handleModuleComplete}
              />
            )}
          </Card>

          {/* Module Content Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="notes">My Notes</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Key Takeaways */}
                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <Lightbulb className="h-5 w-5 text-yellow-600 mr-2" />
                    <h3 className="font-medium">Key Takeaways</h3>
                  </div>
                  <ul className="space-y-2">
                    {keyTakeaways.map((takeaway, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Transcript */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="font-medium">Transcript</h3>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTranscript(!showTranscript)}
                    >
                      {showTranscript ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                  {showTranscript && (
                    <div className="max-h-60 overflow-y-auto text-sm text-gray-700 leading-relaxed">
                      {transcript}
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notes">
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-medium">Personal Notes</h3>
                </div>
                <Textarea
                  placeholder="Take notes while watching the video. Your notes are automatically saved."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-32 mb-4"
                />
                <div className="text-xs text-gray-500">
                  Last saved: Just now
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="resources">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {additionalResources.map((resource, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-2">
                      <Download className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="font-medium text-sm">{resource.title}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3 capitalize">{resource.type}</p>
                    <Button size="sm" variant="outline" className="w-full">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="discussion">
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-5 w-5 text-purple-600 mr-2" />
                  <h3 className="font-medium">Discussion Forum</h3>
                </div>
                
                {/* Sample Discussion Posts */}
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-medium text-blue-600">JD</span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">John Doe</div>
                        <div className="text-xs text-gray-500">2 hours ago</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      Great module! The active listening techniques really resonated with me. Has anyone tried the "mirror and clarify" approach with their clients?
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <button className="flex items-center hover:text-blue-600">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        5 likes
                      </button>
                      <button className="hover:text-blue-600">Reply</button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-medium text-green-600">SM</span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">Sarah Martinez</div>
                        <div className="text-xs text-gray-500">1 day ago</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      The communication framework from this module helped me close 3 new clients this week! Thank you for the practical tips.
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <button className="flex items-center hover:text-blue-600">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        12 likes
                      </button>
                      <button className="hover:text-blue-600">Reply</button>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Textarea 
                      placeholder="Share your thoughts, questions, or experiences with this module..."
                      className="mb-3"
                    />
                    <div className="flex justify-end">
                      <Button size="sm">Post Comment</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Navigation Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              variant="outline"
              disabled={currentModule === 1}
              onClick={() => setCurrentModule(Math.max(1, currentModule - 1))}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous Module
            </Button>

            <div className="text-sm text-gray-600 order-first sm:order-none">
              Module {currentModule} of {learningPath.totalModules}
            </div>

            <Button
              disabled={currentModule === learningPath.totalModules}
              onClick={() => setCurrentModule(Math.min(learningPath.totalModules, currentModule + 1))}
              className="bg-brand-primary hover:bg-brand-primary/90 w-full sm:w-auto"
            >
              Next Module
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}