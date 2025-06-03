'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  type: 'user_registered' | 'question_created' | 'exam_created' | 'exam_taken' | 'user_login';
  description: string;
  user: {
    name: string;
    email: string;
  };
  timestamp: string;
  metadata?: {
    examTitle?: string;
    questionText?: string;
    score?: number;
  };
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch('/api/admin/activity');
      if (!response.ok) {
        throw new Error('Failed to fetch activity');
      }
      const data = await response.json();
      setActivities(data.activities || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered':
        return '👤';
      case 'question_created':
        return '❓';
      case 'exam_created':
        return '📝';
      case 'exam_taken':
        return '🎯';
      case 'user_login':
        return '🔐';
      default:
        return '📋';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_registered':
        return 'bg-green-100 text-green-800';
      case 'question_created':
        return 'bg-blue-100 text-blue-800';
      case 'exam_created':
        return 'bg-purple-100 text-purple-800';
      case 'exam_taken':
        return 'bg-orange-100 text-orange-800';
      case 'user_login':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return time.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="text-center">
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchRecentActivity}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          <button
            onClick={fetchRecentActivity}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Refresh
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Latest system activities and user actions
        </p>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    <span className="text-lg">{getActivityIcon(activity.type)}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    by {activity.user.name} ({activity.user.email})
                  </p>
                  {activity.metadata && (
                    <div className="mt-2 text-xs text-gray-600">
                      {activity.metadata.examTitle && (
                        <span className="inline-block bg-gray-100 px-2 py-1 rounded mr-2">
                          📝 {activity.metadata.examTitle}
                        </span>
                      )}
                      {activity.metadata.score !== undefined && (
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                          🎯 Score: {activity.metadata.score}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center">
            <div className="text-gray-400 text-4xl mb-4">📋</div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              No Recent Activity
            </h4>
            <p className="text-sm text-gray-500">
              System activity will appear here as users interact with the platform.
            </p>
          </div>
        )}
      </div>
      
      {activities.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <Link
            href="/admin/activity"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Activity →
          </Link>
        </div>
      )}
    </div>
  );
}
