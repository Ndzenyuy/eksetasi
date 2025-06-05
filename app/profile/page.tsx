'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProfileForm from "@/app/components/profile/ProfileForm";
import StatsCard from "@/app/components/profile/StatsCard";
import RecentExams from "@/app/components/profile/RecentExams";

interface UserProfile {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  statistics: {
    totalExamsTaken: number;
    totalExamsPassed: number;
    passRate: number;
    averageScore: number;
    totalTimeSpent: number;
  };
  recentResults: Array<{
    id: string;
    examId: string;
    examTitle: string;
    score: number;
    grade: string;
    passed: boolean;
    submittedAt: string;
  }>;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleProfileUpdate = (updatedUser: {
    name?: string;
    email?: string;
  }) => {
    if (profile) {
      setProfile({
        ...profile,
        user: { ...profile.user, ...updatedUser },
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Profile not found
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account settings and view your exam history
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/profile/history"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                View Full History
              </Link>
              <Link
                href="/dashboard"
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Form */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Account Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update your personal information
                </p>
              </div>
              <div className="px-6 py-4">
                <ProfileForm
                  user={profile.user}
                  onUpdate={handleProfileUpdate}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Statistics and Recent Exams */}
          <div className="lg:col-span-2 space-y-8">
            {/* Statistics Cards */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Your Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  title="Exams Taken"
                  value={profile.statistics.totalExamsTaken}
                  icon="📝"
                  color="blue"
                />
                <StatsCard
                  title="Exams Passed"
                  value={profile.statistics.totalExamsPassed}
                  icon="✅"
                  color="green"
                />
                <StatsCard
                  title="Pass Rate"
                  value={`${profile.statistics.passRate}%`}
                  icon="📊"
                  color="purple"
                />
                <StatsCard
                  title="Average Score"
                  value={`${profile.statistics.averageScore}%`}
                  icon="🎯"
                  color="orange"
                />
              </div>
            </div>

            {/* Recent Exams */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Recent Exam Results
                </h2>
                <Link
                  href="/profile/history"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All →
                </Link>
              </div>
              <RecentExams results={profile.recentResults} />
            </div>

            {/* Account Details */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Account Details
                </h2>
              </div>
              <div className="px-6 py-4">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {profile.user.email}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">
                      {profile.user.role.toLowerCase()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Member Since
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(profile.user.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Total Study Time
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {Math.floor(profile.statistics.totalTimeSpent / 60)}h{" "}
                      {profile.statistics.totalTimeSpent % 60}m
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
