import { motion } from 'motion/react';
import { Trophy, Target, Clock, TrendingUp, Medal, Star, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface ResultsData {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  averageTimePerQuestion: number;
  categoryBreakdown: {
    category: string;
    score: number;
    total: number;
  }[];
  difficultyBreakdown: {
    difficulty: string;
    score: number;
    total: number;
  }[];
  rank: number;
  totalParticipants: number;
  achievements: string[];
}

interface ResultsDashboardProps {
  results: ResultsData;
  onRestart: () => void;
  onShare: () => void;
}

export function ResultsDashboard({
  results,
  onRestart,
  onShare,
}: ResultsDashboardProps) {
  const percentage = Math.round((results.correctAnswers / results.totalQuestions) * 100);
  const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : 'F';
  const gradeColor = percentage >= 90 ? 'text-green-500' : percentage >= 80 ? 'text-blue-500' : percentage >= 70 ? 'text-yellow-500' : 'text-red-500';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="text-center bg-gradient-to-br from-primary/10 via-background to-purple-500/10 border-2 border-border/50">
          <CardContent className="pt-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
              className="mb-6"
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold mb-2"
            >
              Assessment Complete!
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div className={`text-6xl font-bold ${gradeColor}`}>{grade}</div>
              <div className="text-left">
                <div className="text-2xl font-bold">{percentage}%</div>
                <div className="text-sm text-muted-foreground">
                  {results.correctAnswers}/{results.totalQuestions} correct
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap justify-center gap-2"
            >
              {results.achievements.map((achievement, index) => (
                <motion.div
                  key={achievement}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                    <Star className="w-3 h-3 mr-1" />
                    {achievement}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-3 text-blue-500" />
            <div className="text-2xl font-bold">{formatTime(results.timeSpent)}</div>
            <div className="text-sm text-muted-foreground">Total Time</div>
            <div className="text-xs text-muted-foreground mt-1">
              Avg: {formatTime(results.averageTimePerQuestion)}/question
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-3 text-green-500" />
            <div className="text-2xl font-bold">{results.correctAnswers}</div>
            <div className="text-sm text-muted-foreground">Correct Answers</div>
            <div className="text-xs text-muted-foreground mt-1">
              {((results.correctAnswers / results.totalQuestions) * 100).toFixed(1)}% accuracy
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Medal className="w-8 h-8 mx-auto mb-3 text-purple-500" />
            <div className="text-2xl font-bold">#{results.rank}</div>
            <div className="text-sm text-muted-foreground">Global Rank</div>
            <div className="text-xs text-muted-foreground mt-1">
              Top {Math.round((results.rank / results.totalParticipants) * 100)}%
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.categoryBreakdown.map((category, index) => {
              const categoryPercentage = Math.round((category.score / category.total) * 100);
              return (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category.category}</span>
                    <span className="text-sm text-muted-foreground">
                      {category.score}/{category.total} ({categoryPercentage}%)
                    </span>
                  </div>
                  <Progress value={categoryPercentage} className="h-2" />
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        {/* Difficulty Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Difficulty Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.difficultyBreakdown.map((difficulty, index) => {
              const difficultyPercentage = Math.round((difficulty.score / difficulty.total) * 100);
              const colorClass = 
                difficulty.difficulty === 'easy' ? 'bg-green-500' :
                difficulty.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500';
              
              return (
                <motion.div
                  key={difficulty.difficulty}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">{difficulty.difficulty}</span>
                    <span className="text-sm text-muted-foreground">
                      {difficulty.score}/{difficulty.total} ({difficultyPercentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${colorClass}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${difficultyPercentage}%` }}
                      transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button
          onClick={onRestart}
          size="lg"
          className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
        >
          Try Again
        </Button>
        <Button
          onClick={onShare}
          variant="outline"
          size="lg"
        >
          Share Results
        </Button>
      </motion.div>
    </div>
  );
}