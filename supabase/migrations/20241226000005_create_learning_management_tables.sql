-- MAXPULSE Platform - Learning Management System Tables
-- Migration: 20241226000005_create_learning_management_tables.sql
-- Created: December 26, 2024

-- =============================================
-- COURSES TABLE - Training courses and content
-- =============================================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  trainer_id UUID REFERENCES trainer_profiles(id),
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration INTEGER, -- in minutes
  thumbnail_url TEXT,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  enrollment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_courses_trainer_id ON courses(trainer_id);
CREATE INDEX idx_courses_difficulty ON courses(difficulty);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_courses_featured ON courses(is_featured);
CREATE INDEX idx_courses_enrollment_count ON courses(enrollment_count);

-- =============================================
-- MODULES TABLE - Course modules and lessons
-- =============================================
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  video_url TEXT,
  order_index INTEGER NOT NULL,
  duration INTEGER, -- in minutes
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_modules_course_id ON modules(course_id, order_index);
CREATE INDEX idx_modules_order ON modules(order_index);
CREATE INDEX idx_modules_required ON modules(is_required);

-- =============================================
-- QUIZZES TABLE - Module quizzes and assessments
-- =============================================
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70 CHECK (passing_score >= 0 AND passing_score <= 100),
  time_limit INTEGER, -- in minutes
  max_attempts INTEGER DEFAULT 3 CHECK (max_attempts > 0),
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_quizzes_module_id ON quizzes(module_id);
CREATE INDEX idx_quizzes_required ON quizzes(is_required);
CREATE INDEX idx_quizzes_passing_score ON quizzes(passing_score);

-- =============================================
-- QUIZ QUESTIONS TABLE - Individual quiz questions
-- =============================================
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
  options JSONB DEFAULT '{}',
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  points INTEGER DEFAULT 1 CHECK (points > 0),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id, order_index);
CREATE INDEX idx_quiz_questions_type ON quiz_questions(question_type);

-- =============================================
-- STUDENT ENROLLMENTS TABLE - Course enrollments
-- =============================================
CREATE TABLE student_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_status TEXT DEFAULT 'active' CHECK (enrollment_status IN ('active', 'completed', 'dropped', 'suspended')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  certificate_issued BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- Add indexes
CREATE INDEX idx_student_enrollments_student_id ON student_enrollments(student_id);
CREATE INDEX idx_student_enrollments_course_id ON student_enrollments(course_id);
CREATE INDEX idx_student_enrollments_status ON student_enrollments(enrollment_status);
CREATE INDEX idx_student_enrollments_progress ON student_enrollments(progress_percentage);

-- =============================================
-- STUDENT PROGRESS TABLE - Module completion tracking
-- =============================================
CREATE TABLE student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES student_enrollments(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  completion_status TEXT DEFAULT 'not_started' CHECK (completion_status IN ('not_started', 'in_progress', 'completed')),
  time_spent INTEGER DEFAULT 0, -- in seconds
  completed_at TIMESTAMP WITH TIME ZONE,
  score DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(enrollment_id, module_id)
);

-- Add indexes
CREATE INDEX idx_student_progress_enrollment_id ON student_progress(enrollment_id);
CREATE INDEX idx_student_progress_module_id ON student_progress(module_id);
CREATE INDEX idx_student_progress_status ON student_progress(completion_status);
CREATE INDEX idx_student_progress_score ON student_progress(score);

-- =============================================
-- QUIZ ATTEMPTS TABLE - Quiz attempt tracking
-- =============================================
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL CHECK (attempt_number > 0),
  score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  time_taken INTEGER, -- in seconds
  passed BOOLEAN NOT NULL,
  answers JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_quiz_attempts_student_id ON quiz_attempts(student_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_score ON quiz_attempts(score);
CREATE INDEX idx_quiz_attempts_passed ON quiz_attempts(passed);
CREATE INDEX idx_quiz_attempts_completed_at ON quiz_attempts(completed_at);

-- =============================================
-- LEARNING RESOURCES TABLE - Additional course resources
-- =============================================
CREATE TABLE learning_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  resource_type TEXT CHECK (resource_type IN ('document', 'video', 'audio', 'link', 'image')),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_size INTEGER,
  is_downloadable BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_learning_resources_course_id ON learning_resources(course_id);
CREATE INDEX idx_learning_resources_module_id ON learning_resources(module_id);
CREATE INDEX idx_learning_resources_type ON learning_resources(resource_type);

-- =============================================
-- LEARNING ANALYTICS TABLE - Student learning analytics
-- =============================================
CREATE TABLE learning_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id),
  total_time_spent INTEGER DEFAULT 0, -- in seconds
  modules_completed INTEGER DEFAULT 0,
  quizzes_passed INTEGER DEFAULT 0,
  average_quiz_score DECIMAL(5,2) DEFAULT 0,
  learning_streak INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE,
  engagement_score DECIMAL(5,2) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_learning_analytics_student_id ON learning_analytics(student_id);
CREATE INDEX idx_learning_analytics_course_id ON learning_analytics(course_id);
CREATE INDEX idx_learning_analytics_engagement ON learning_analytics(engagement_score);
CREATE INDEX idx_learning_analytics_last_activity ON learning_analytics(last_activity);

-- =============================================
-- TRAINER ANALYTICS TABLE - Trainer performance analytics
-- =============================================
CREATE TABLE trainer_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES trainer_profiles(id) ON DELETE CASCADE,
  total_courses INTEGER DEFAULT 0,
  total_students INTEGER DEFAULT 0,
  average_course_rating DECIMAL(3,2) DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  course_completion_rate DECIMAL(5,2) DEFAULT 0,
  student_satisfaction DECIMAL(5,2) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_trainer_analytics_trainer_id ON trainer_analytics(trainer_id);
CREATE INDEX idx_trainer_analytics_rating ON trainer_analytics(average_course_rating);
CREATE INDEX idx_trainer_analytics_completion_rate ON trainer_analytics(course_completion_rate);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_analytics ENABLE ROW LEVEL SECURITY;

-- Courses - trainers see their courses, students see published courses
CREATE POLICY "courses_trainer_access" ON courses
FOR ALL USING (
  trainer_id = (
    SELECT id FROM trainer_profiles 
    WHERE user_id = auth.uid()
  ) OR
  is_admin(auth.uid())
);

CREATE POLICY "courses_student_read" ON courses
FOR SELECT USING (is_published = true);

-- Modules - linked to courses
CREATE POLICY "modules_course_access" ON modules
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id = modules.course_id
    AND (
      c.trainer_id = (
        SELECT id FROM trainer_profiles 
        WHERE user_id = auth.uid()
      ) OR
      c.is_published = true OR
      is_admin(auth.uid())
    )
  )
);

-- Quizzes - linked to modules
CREATE POLICY "quizzes_module_access" ON quizzes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM modules m
    JOIN courses c ON m.course_id = c.id
    WHERE m.id = quizzes.module_id
    AND (
      c.trainer_id = (
        SELECT id FROM trainer_profiles 
        WHERE user_id = auth.uid()
      ) OR
      c.is_published = true OR
      is_admin(auth.uid())
    )
  )
);

-- Quiz questions - linked to quizzes
CREATE POLICY "quiz_questions_access" ON quiz_questions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM quizzes q
    JOIN modules m ON q.module_id = m.id
    JOIN courses c ON m.course_id = c.id
    WHERE q.id = quiz_questions.quiz_id
    AND (
      c.trainer_id = (
        SELECT id FROM trainer_profiles 
        WHERE user_id = auth.uid()
      ) OR
      c.is_published = true OR
      is_admin(auth.uid())
    )
  )
);

-- Student enrollments - students see their enrollments, trainers see their course enrollments
CREATE POLICY "student_enrollments_access" ON student_enrollments
FOR ALL USING (
  student_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id = student_enrollments.course_id
    AND c.trainer_id = (
      SELECT id FROM trainer_profiles 
      WHERE user_id = auth.uid()
    )
  ) OR
  is_admin(auth.uid())
);

-- Student progress - students see their progress, trainers see their students' progress
CREATE POLICY "student_progress_access" ON student_progress
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM student_enrollments se
    WHERE se.id = student_progress.enrollment_id
    AND (
      se.student_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM courses c
        WHERE c.id = se.course_id
        AND c.trainer_id = (
          SELECT id FROM trainer_profiles 
          WHERE user_id = auth.uid()
        )
      ) OR
      is_admin(auth.uid())
    )
  )
);

-- Quiz attempts - students see their attempts, trainers see their students' attempts
CREATE POLICY "quiz_attempts_access" ON quiz_attempts
FOR ALL USING (
  student_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM quizzes q
    JOIN modules m ON q.module_id = m.id
    JOIN courses c ON m.course_id = c.id
    WHERE q.id = quiz_attempts.quiz_id
    AND c.trainer_id = (
      SELECT id FROM trainer_profiles 
      WHERE user_id = auth.uid()
    )
  ) OR
  is_admin(auth.uid())
);

-- Learning resources - same as modules
CREATE POLICY "learning_resources_access" ON learning_resources
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id = learning_resources.course_id
    AND (
      c.trainer_id = (
        SELECT id FROM trainer_profiles 
        WHERE user_id = auth.uid()
      ) OR
      c.is_published = true OR
      is_admin(auth.uid())
    )
  )
);

-- Learning analytics - students see their analytics, trainers see their students' analytics
CREATE POLICY "learning_analytics_access" ON learning_analytics
FOR ALL USING (
  student_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id = learning_analytics.course_id
    AND c.trainer_id = (
      SELECT id FROM trainer_profiles 
      WHERE user_id = auth.uid()
    )
  ) OR
  is_admin(auth.uid())
);

-- Trainer analytics - trainers see their analytics, admins see all
CREATE POLICY "trainer_analytics_access" ON trainer_analytics
FOR ALL USING (
  trainer_id = (
    SELECT id FROM trainer_profiles 
    WHERE user_id = auth.uid()
  ) OR
  is_admin(auth.uid())
);

-- =============================================
-- LEARNING MANAGEMENT HELPER FUNCTIONS
-- =============================================

-- Function to calculate course progress for a student
CREATE OR REPLACE FUNCTION calculate_course_progress(
  student_uuid UUID,
  course_uuid UUID
)
RETURNS INTEGER AS $$
DECLARE
  total_modules INTEGER;
  completed_modules INTEGER;
  progress INTEGER;
BEGIN
  -- Get total required modules
  SELECT COUNT(*) INTO total_modules
  FROM modules
  WHERE course_id = course_uuid AND is_required = true;
  
  -- Get completed modules for this student
  SELECT COUNT(*) INTO completed_modules
  FROM student_progress sp
  JOIN student_enrollments se ON sp.enrollment_id = se.id
  JOIN modules m ON sp.module_id = m.id
  WHERE se.student_id = student_uuid
    AND se.course_id = course_uuid
    AND m.is_required = true
    AND sp.completion_status = 'completed';
  
  -- Calculate progress percentage
  IF total_modules > 0 THEN
    progress := ROUND((completed_modules::DECIMAL / total_modules::DECIMAL) * 100);
  ELSE
    progress := 0;
  END IF;
  
  RETURN progress;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to enroll student in course
CREATE OR REPLACE FUNCTION enroll_student(
  student_uuid UUID,
  course_uuid UUID
)
RETURNS UUID AS $$
DECLARE
  enrollment_id UUID;
BEGIN
  -- Insert enrollment record
  INSERT INTO student_enrollments (
    student_id,
    course_id,
    enrollment_status,
    progress_percentage
  ) VALUES (
    student_uuid,
    course_uuid,
    'active',
    0
  ) RETURNING id INTO enrollment_id;
  
  -- Update course enrollment count
  UPDATE courses
  SET enrollment_count = enrollment_count + 1
  WHERE id = course_uuid;
  
  -- Create initial progress records for all modules
  INSERT INTO student_progress (enrollment_id, module_id, completion_status)
  SELECT enrollment_id, id, 'not_started'
  FROM modules
  WHERE course_id = course_uuid;
  
  RETURN enrollment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete module
CREATE OR REPLACE FUNCTION complete_module(
  enrollment_uuid UUID,
  module_uuid UUID,
  time_spent_param INTEGER DEFAULT 0
)
RETURNS BOOLEAN AS $$
DECLARE
  student_uuid UUID;
  course_uuid UUID;
  new_progress INTEGER;
BEGIN
  -- Get student and course info
  SELECT se.student_id, se.course_id INTO student_uuid, course_uuid
  FROM student_enrollments se
  WHERE se.id = enrollment_uuid;
  
  -- Update module progress
  UPDATE student_progress
  SET 
    completion_status = 'completed',
    completed_at = NOW(),
    time_spent = time_spent_param,
    updated_at = NOW()
  WHERE enrollment_id = enrollment_uuid AND module_id = module_uuid;
  
  -- Calculate new course progress
  new_progress := calculate_course_progress(student_uuid, course_uuid);
  
  -- Update enrollment progress
  UPDATE student_enrollments
  SET 
    progress_percentage = new_progress,
    completed_at = CASE WHEN new_progress = 100 THEN NOW() ELSE completed_at END,
    enrollment_status = CASE WHEN new_progress = 100 THEN 'completed' ELSE enrollment_status END,
    updated_at = NOW()
  WHERE id = enrollment_uuid;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record quiz attempt
CREATE OR REPLACE FUNCTION record_quiz_attempt(
  student_uuid UUID,
  quiz_uuid UUID,
  score_param DECIMAL(5,2),
  total_questions_param INTEGER,
  correct_answers_param INTEGER,
  time_taken_param INTEGER,
  answers_param JSONB
)
RETURNS UUID AS $$
DECLARE
  attempt_id UUID;
  attempt_num INTEGER;
  passing_score_val INTEGER;
  passed_val BOOLEAN;
BEGIN
  -- Get passing score for quiz
  SELECT passing_score INTO passing_score_val
  FROM quizzes
  WHERE id = quiz_uuid;
  
  -- Determine if passed
  passed_val := score_param >= passing_score_val;
  
  -- Get next attempt number
  SELECT COALESCE(MAX(attempt_number), 0) + 1 INTO attempt_num
  FROM quiz_attempts
  WHERE student_id = student_uuid AND quiz_id = quiz_uuid;
  
  -- Record attempt
  INSERT INTO quiz_attempts (
    student_id,
    quiz_id,
    attempt_number,
    score,
    total_questions,
    correct_answers,
    time_taken,
    passed,
    answers
  ) VALUES (
    student_uuid,
    quiz_uuid,
    attempt_num,
    score_param,
    total_questions_param,
    correct_answers_param,
    time_taken_param,
    passed_val,
    answers_param
  ) RETURNING id INTO attempt_id;
  
  RETURN attempt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get learning analytics for student
CREATE OR REPLACE FUNCTION get_learning_analytics_summary(
  student_uuid UUID,
  course_uuid UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  total_time INTEGER;
  modules_completed INTEGER;
  quizzes_passed INTEGER;
  avg_score DECIMAL(5,2);
  active_courses INTEGER;
  completed_courses INTEGER;
BEGIN
  -- Get time spent
  SELECT COALESCE(SUM(sp.time_spent), 0) INTO total_time
  FROM student_progress sp
  JOIN student_enrollments se ON sp.enrollment_id = se.id
  WHERE se.student_id = student_uuid
    AND (course_uuid IS NULL OR se.course_id = course_uuid);
  
  -- Get modules completed
  SELECT COUNT(*) INTO modules_completed
  FROM student_progress sp
  JOIN student_enrollments se ON sp.enrollment_id = se.id
  WHERE se.student_id = student_uuid
    AND sp.completion_status = 'completed'
    AND (course_uuid IS NULL OR se.course_id = course_uuid);
  
  -- Get quizzes passed
  SELECT COUNT(*) INTO quizzes_passed
  FROM quiz_attempts qa
  JOIN quizzes q ON qa.quiz_id = q.id
  JOIN modules m ON q.module_id = m.id
  WHERE qa.student_id = student_uuid
    AND qa.passed = true
    AND (course_uuid IS NULL OR m.course_id = course_uuid);
  
  -- Get average quiz score
  SELECT COALESCE(AVG(qa.score), 0) INTO avg_score
  FROM quiz_attempts qa
  JOIN quizzes q ON qa.quiz_id = q.id
  JOIN modules m ON q.module_id = m.id
  WHERE qa.student_id = student_uuid
    AND (course_uuid IS NULL OR m.course_id = course_uuid);
  
  -- Get course counts (if not filtering by specific course)
  IF course_uuid IS NULL THEN
    SELECT 
      COUNT(CASE WHEN enrollment_status = 'active' THEN 1 END),
      COUNT(CASE WHEN enrollment_status = 'completed' THEN 1 END)
    INTO active_courses, completed_courses
    FROM student_enrollments
    WHERE student_id = student_uuid;
  ELSE
    active_courses := 0;
    completed_courses := 0;
  END IF;
  
  -- Build result
  result := jsonb_build_object(
    'total_time_spent', total_time,
    'modules_completed', modules_completed,
    'quizzes_passed', quizzes_passed,
    'average_quiz_score', avg_score,
    'active_courses', active_courses,
    'completed_courses', completed_courses
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Apply updated_at triggers
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_enrollments_updated_at BEFORE UPDATE ON student_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON student_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_resources_updated_at BEFORE UPDATE ON learning_resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_analytics_updated_at BEFORE UPDATE ON learning_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainer_analytics_updated_at BEFORE UPDATE ON trainer_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE courses IS 'Training courses with trainer assignment and publishing status';
COMMENT ON TABLE modules IS 'Course modules with content and video resources';
COMMENT ON TABLE quizzes IS 'Module quizzes with scoring and attempt limits';
COMMENT ON TABLE quiz_questions IS 'Individual quiz questions with multiple choice support';
COMMENT ON TABLE student_enrollments IS 'Student course enrollments with progress tracking';
COMMENT ON TABLE student_progress IS 'Module-level progress tracking for students';
COMMENT ON TABLE quiz_attempts IS 'Quiz attempt records with scoring and timing';
COMMENT ON TABLE learning_resources IS 'Additional course resources and downloads';
COMMENT ON TABLE learning_analytics IS 'Student learning analytics and engagement metrics';
COMMENT ON TABLE trainer_analytics IS 'Trainer performance and course analytics';

COMMENT ON COLUMN courses.estimated_duration IS 'Estimated course duration in minutes';
COMMENT ON COLUMN modules.order_index IS 'Module order within course (1, 2, 3, etc.)';
COMMENT ON COLUMN quizzes.passing_score IS 'Minimum score required to pass (0-100)';
COMMENT ON COLUMN quiz_attempts.answers IS 'JSON object containing student answers';
COMMENT ON COLUMN student_progress.time_spent IS 'Time spent on module in seconds';
