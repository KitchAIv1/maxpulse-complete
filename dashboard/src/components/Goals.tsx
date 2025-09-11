import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Target, 
  Trophy, 
  Flame, 
  Star, 
  Crown, 
  Zap,
  Gift,
  Calendar,
  Award,
  ChevronRight,
  ArrowUpRight,
  TrendingUp,
  Plus,
  Edit,
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  Medal,
  Rocket,
  Sparkles,
  Timer,
  BarChart3
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export function Goals() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGoalType, setSelectedGoalType] = useState('daily');

  // Mock goals data with extensive gamification
  const goalsData = {
    currentStreak: 12,
    longestStreak: 28,
    totalGoalsCompleted: 147,
    streakMultiplier: 2.5,
    currentLevel: 'Goal Crusher',
    nextLevel: 'Target Master',
    levelProgress: 68,
    weeklyRank: 3,
    totalPoints: 2840,
    
    dailyGoals: [
      { 
        id: 1, 
        title: 'Complete 3 Assessments', 
        current: 2, 
        target: 3, 
        points: 50, 
        bonus: 25,
        category: 'assessments',
        difficulty: 'easy',
        completed: false,
        streak: 5
      },
      { 
        id: 2, 
        title: 'Earn $150 Commission', 
        current: 125, 
        target: 150, 
        points: 75, 
        bonus: 35,
        category: 'earnings',
        difficulty: 'medium',
        completed: false,
        streak: 3
      },
      { 
        id: 3, 
        title: 'Follow Up 5 Leads', 
        current: 5, 
        target: 5, 
        points: 40, 
        bonus: 20,
        category: 'follow-ups',
        difficulty: 'easy',
        completed: true,
        streak: 8
      }
    ],

    weeklyGoals: [
      { 
        id: 4, 
        title: 'Complete 20 Assessments', 
        current: 16, 
        target: 20, 
        points: 200, 
        bonus: 100,
        category: 'assessments',
        difficulty: 'medium',
        completed: false,
        deadline: '2 days left'
      },
      { 
        id: 5, 
        title: 'Earn $1,000 Revenue', 
        current: 850, 
        target: 1000, 
        points: 300, 
        bonus: 150,
        category: 'earnings',
        difficulty: 'hard',
        completed: false,
        deadline: '2 days left'
      },
      { 
        id: 6, 
        title: 'Recruit 2 New Clients', 
        current: 2, 
        target: 2, 
        points: 250, 
        bonus: 125,
        category: 'recruitment',
        difficulty: 'hard',
        completed: true,
        deadline: 'Completed!'
      }
    ],

    monthlyGoals: [
      { 
        id: 7, 
        title: 'Reach Gold Level Status', 
        current: 3420, 
        target: 4000, 
        points: 1000, 
        bonus: 500,
        category: 'earnings',
        difficulty: 'epic',
        completed: false,
        deadline: '8 days left'
      },
      { 
        id: 8, 
        title: 'Complete 100 Assessments', 
        current: 76, 
        target: 100, 
        points: 500, 
        bonus: 250,
        category: 'assessments',
        difficulty: 'hard',
        completed: false,
        deadline: '8 days left'
      }
    ],

    challenges: [
      {
        id: 1,
        title: 'Weekend Warrior',
        description: 'Complete all daily goals this weekend',
        reward: '$500 Bonus + Badge',
        timeLeft: '1 day 14 hours',
        difficulty: 'legendary',
        participants: 127,
        progress: 60,
        active: true
      },
      {
        id: 2,
        title: 'Perfect Week',
        description: 'Complete every daily goal for 7 days straight',
        reward: '$1,000 Bonus + Crown',
        timeLeft: '3 days 8 hours',
        difficulty: 'epic',
        participants: 89,
        progress: 30,
        active: true
      },
      {
        id: 3,
        title: 'Triple Threat',
        description: 'Complete 3x your daily targets',
        reward: '3x Multiplier + Lightning Badge',
        timeLeft: 'Ended',
        difficulty: 'legendary',
        participants: 45,
        progress: 100,
        active: false
      }
    ],

    achievements: [
      { id: 1, title: 'First Goal', icon: Target, earned: true, rarity: 'common' },
      { id: 2, title: 'Streak Master', icon: Flame, earned: true, rarity: 'rare' },
      { id: 3, title: 'Goal Crusher', icon: Trophy, earned: true, rarity: 'epic' },
      { id: 4, title: 'Perfect Month', icon: Crown, earned: false, rarity: 'legendary' },
      { id: 5, title: 'Lightning Strike', icon: Zap, earned: false, rarity: 'mythic' }
    ],

    personalBests: [
      { metric: 'Daily Assessments', record: 8, date: '2 weeks ago' },
      { metric: 'Weekly Revenue', record: 1250, date: 'Last week' },
      { metric: 'Goal Streak', record: 28, date: 'Last month' },
      { metric: 'Monthly Earnings', record: 4200, date: '2 months ago' }
    ],

    leaderboard: [
      { rank: 1, name: 'Sarah Chen', points: 3420, streak: 15, avatar: '🏆' },
      { rank: 2, name: 'Mike Rodriguez', points: 3180, streak: 12, avatar: '🥈' },
      { rank: 3, name: 'You', points: 2840, streak: 12, avatar: '🥉', isUser: true },
      { rank: 4, name: 'Lisa Park', points: 2650, streak: 8, avatar: '⭐' },
      { rank: 5, name: 'David Kim', points: 2430, streak: 6, avatar: '🔥' }
    ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'hard': return 'bg-purple-100 text-purple-800';
      case 'epic': return 'bg-orange-100 text-orange-800';
      case 'legendary': return 'bg-red-100 text-red-800';
      case 'mythic': return 'bg-gradient-to-r from-purple-400 to-pink-400 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-orange-100 text-orange-800';
      case 'mythic': return 'bg-gradient-to-r from-pink-400 to-purple-400 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'assessments': return Target;
      case 'earnings': return DollarSign;
      case 'follow-ups': return Users;
      case 'recruitment': return Award;
      default: return Star;
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 max-w-7xl mx-auto">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="lg:col-span-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-xl lg:text-2xl text-gray-900 flex items-center gap-3">
                <Target className="h-6 w-6 lg:h-8 lg:w-8 text-red-600" />
                Goals & Targets
              </h1>
              <p className="text-sm lg:text-base text-gray-600 mt-1">Crush your targets and unlock exclusive rewards</p>
            </div>
          </div>
        </div>

        {/* Streak Counter */}
        <Card className="p-4 lg:p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="h-6 w-6 text-orange-500" />
              <span className="text-2xl font-bold text-orange-600">{goalsData.currentStreak}</span>
            </div>
            <p className="text-sm text-orange-700">Day Streak</p>
            <p className="text-xs text-orange-600 mt-1">{goalsData.streakMultiplier}x Multiplier</p>
          </div>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="p-4 lg:p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-green-700">Goals Completed</p>
              <p className="text-xl lg:text-2xl text-green-800">{goalsData.totalGoalsCompleted}</p>
            </div>
            <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
          </div>
          <div className="flex items-center mt-3 text-xs lg:text-sm text-green-600">
            <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
            <span>+23% this week</span>
          </div>
        </Card>

        <Card className="p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-blue-700">Total Points</p>
              <p className="text-xl lg:text-2xl text-blue-800">{goalsData.totalPoints.toLocaleString()}</p>
            </div>
            <Star className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
          </div>
          <div className="flex items-center mt-3 text-xs lg:text-sm text-blue-600">
            <Medal className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
            <span>Rank #{goalsData.weeklyRank} this week</span>
          </div>
        </Card>

        <Card className="p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-purple-700">Current Level</p>
              <p className="text-lg lg:text-xl text-purple-800">{goalsData.currentLevel}</p>
            </div>
            <Crown className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600" />
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs lg:text-sm text-purple-600 mb-1">
              <span>To {goalsData.nextLevel}</span>
              <span>{goalsData.levelProgress}%</span>
            </div>
            <Progress value={goalsData.levelProgress} className="h-2" />
          </div>
        </Card>

        <Card className="p-4 lg:p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-amber-700">Best Streak</p>
              <p className="text-xl lg:text-2xl text-amber-800">{goalsData.longestStreak}</p>
            </div>
            <Trophy className="h-6 w-6 lg:h-8 lg:w-8 text-amber-600" />
          </div>
          <div className="flex items-center mt-3 text-xs lg:text-sm text-amber-600">
            <Rocket className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
            <span>Personal Record</span>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="overview" className="text-xs lg:text-sm py-2">Overview</TabsTrigger>
          <TabsTrigger value="challenges" className="text-xs lg:text-sm py-2">Challenges</TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs lg:text-sm py-2">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard" className="text-xs lg:text-sm py-2">Leaderboard</TabsTrigger>
          <TabsTrigger value="records" className="text-xs lg:text-sm py-2">Records</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 lg:space-y-6">
          {/* Goal Type Selector */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'daily', label: 'Daily Goals', icon: Clock },
              { id: 'weekly', label: 'Weekly Goals', icon: Calendar },
              { id: 'monthly', label: 'Monthly Goals', icon: BarChart3 }
            ].map((type) => (
              <Button
                key={type.id}
                variant={selectedGoalType === type.id ? "default" : "outline"}
                onClick={() => setSelectedGoalType(type.id)}
                className={selectedGoalType === type.id ? "bg-red-800 text-white hover:bg-red-900" : ""}
              >
                <type.icon className="h-4 w-4 mr-2" />
                {type.label}
              </Button>
            ))}
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {(selectedGoalType === 'daily' ? goalsData.dailyGoals : 
              selectedGoalType === 'weekly' ? goalsData.weeklyGoals : 
              goalsData.monthlyGoals).map((goal) => {
              const CategoryIcon = getCategoryIcon(goal.category);
              const progress = calculateProgress(goal.current, goal.target);
              
              return (
                <Card key={goal.id} className={`p-4 lg:p-6 transition-all hover:scale-105 hover:shadow-lg ${
                  goal.completed ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' : 'bg-white'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${goal.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <CategoryIcon className={`h-4 w-4 ${goal.completed ? 'text-green-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{goal.title}</h4>
                        <Badge className={getDifficultyColor(goal.difficulty)} variant="secondary">
                          {goal.difficulty}
                        </Badge>
                      </div>
                    </div>
                    {goal.completed && <CheckCircle className="h-5 w-5 text-green-600" />}
                  </div>

                  {/* Progress Ring */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16">
                      <CircularProgressbar
                        value={progress}
                        text={`${Math.round(progress)}%`}
                        styles={buildStyles({
                          textSize: '20px',
                          pathColor: goal.completed ? '#10B981' : '#8B1538',
                          textColor: goal.completed ? '#10B981' : '#8B1538',
                          trailColor: '#E5E7EB',
                        })}
                      />
                    </div>
                    <div>
                      <p className="text-lg font-medium">
                        {typeof goal.current === 'number' && goal.current > 999 ? 
                          `$${goal.current.toLocaleString()}` : 
                          goal.current
                        } / {typeof goal.target === 'number' && goal.target > 999 ? 
                          `$${goal.target.toLocaleString()}` : 
                          goal.target
                        }
                      </p>
                      <p className="text-xs text-gray-600">
                        {selectedGoalType === 'daily' && 'streak' in goal && `${goal.streak} day streak`}
                        {selectedGoalType !== 'daily' && 'deadline' in goal && goal.deadline}
                      </p>
                    </div>
                  </div>

                  {/* Rewards */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{goal.points} pts</span>
                      {goal.bonus && (
                        <>
                          <span className="text-gray-300">•</span>
                          <Zap className="h-4 w-4 text-orange-500" />
                          <span className="text-orange-600">+{goal.bonus} bonus</span>
                        </>
                      )}
                    </div>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Add New Goal */}
          <Card className="p-4 lg:p-6 border-2 border-dashed border-gray-300 hover:border-red-300 transition-colors">
            <div className="text-center">
              <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <h4 className="text-sm font-medium text-gray-600 mb-2">Create Custom Goal</h4>
              <Button variant="outline" size="sm">
                Add New Goal
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4 lg:space-y-6">
          <Card className="p-4 lg:p-6">
            <h3 className="text-base lg:text-lg mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Active Challenges
            </h3>
            <div className="space-y-4">
              {goalsData.challenges.filter(c => c.active).map((challenge) => (
                <div key={challenge.id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{challenge.title}</h4>
                        <Badge className={getDifficultyColor(challenge.difficulty)} variant="secondary">
                          {challenge.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {challenge.participants} joined
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Timer className="h-4 w-4 text-red-500" />
                          <span className="text-red-600">{challenge.timeLeft}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Gift className="h-4 w-4 text-purple-500" />
                          <span className="text-purple-600">{challenge.reward}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16">
                        <CircularProgressbar
                          value={challenge.progress}
                          text={`${challenge.progress}%`}
                          styles={buildStyles({
                            textSize: '18px',
                            pathColor: '#8B5CF6',
                            textColor: '#8B5CF6',
                            trailColor: '#E5E7EB',
                          })}
                        />
                      </div>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        Join Challenge
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 lg:p-6">
            <h3 className="text-base lg:text-lg mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Completed Challenges
            </h3>
            <div className="space-y-3">
              {goalsData.challenges.filter(c => !c.active).map((challenge) => (
                <div key={challenge.id} className="p-3 bg-gray-50 rounded-lg opacity-60">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{challenge.title}</h4>
                      <p className="text-xs text-gray-600">{challenge.description}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800" variant="secondary">
                      Completed
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4 lg:space-y-6">
          <Card className="p-4 lg:p-6">
            <h3 className="text-base lg:text-lg mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              Achievement Gallery
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {goalsData.achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    achievement.earned 
                      ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300 shadow-lg' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      achievement.earned ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      <achievement.icon className={`h-8 w-8 ${
                        achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <h4 className="font-medium mb-2">{achievement.title}</h4>
                    <Badge className={getRarityColor(achievement.rarity)} variant="secondary">
                      {achievement.rarity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4 lg:space-y-6">
          <Card className="p-4 lg:p-6">
            <h3 className="text-base lg:text-lg mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Weekly Leaderboard
            </h3>
            <div className="space-y-3">
              {goalsData.leaderboard.map((player) => (
                <div key={player.rank} className={`p-4 rounded-lg flex items-center justify-between ${
                  player.isUser ? 'bg-gradient-to-r from-red-50 to-rose-50 border border-red-200' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{player.avatar}</span>
                      <span className="font-medium">#{player.rank}</span>
                    </div>
                    <div>
                      <h4 className={`font-medium ${player.isUser ? 'text-red-800' : ''}`}>{player.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{player.points.toLocaleString()} pts</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          <span>{player.streak}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {player.isUser && (
                    <Badge className="bg-red-100 text-red-800" variant="secondary">
                      You
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-4 lg:space-y-6">
          <Card className="p-4 lg:p-6">
            <h3 className="text-base lg:text-lg mb-4 flex items-center gap-2">
              <Medal className="h-5 w-5 text-yellow-600" />
              Personal Records
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {goalsData.personalBests.map((record, index) => (
                <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-800">{record.metric}</h4>
                    <Medal className="h-5 w-5 text-yellow-500" />
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {typeof record.record === 'number' && record.record > 999 ? 
                      `$${record.record.toLocaleString()}` : 
                      record.record
                    }
                  </p>
                  <p className="text-xs text-blue-700 mt-1">{record.date}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 lg:p-6 bg-gradient-brand text-white">
            <div className="text-center">
              <Rocket className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-lg font-medium mb-2">Ready to Break a Record?</h3>
              <p className="text-sm opacity-90 mb-4">Push your limits and set new personal bests!</p>
              <Button variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
                View All Targets
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}