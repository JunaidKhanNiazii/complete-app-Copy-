/**
 * Workout-related TypeScript types
 */

export interface Exercise {
  name: string;
  reps: number;
  time: string;
}

export interface Workout {
  id: string;
  userId: number;
  username: string;
  date: string;
  sessionId: string;
  startTime: string;
  endTime: string;
  durationSec: number;
  totalDuration: string;
  totalReps: number;
  exercises: Exercise[];
  recordedAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalExercises: number;
  totalSets: number;
  totalReps: number;
  workoutsByDate: {
    [date: string]: {
      count: number;
      exercises: number;
      sets: number;
      reps: number;
    };
  };
  exerciseFrequency: {
    [exerciseName: string]: number;
  };
}

export interface DashboardStats {
  totalMembers: number;
  activeToday: number;
  totalWorkouts: number;
  recentMembers: number;
}

export interface AnalyticsData {
  dailyData: {
    date: string;
    workouts: number;
    activeUsers: number;
  }[];
  topExercises: {
    name: string;
    count: number;
    totalReps: number;
  }[];
  period: number;
}
