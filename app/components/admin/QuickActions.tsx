'use client';

import Link from 'next/link';

interface Permissions {
  canManageUsers: boolean;
  canManageQuestions: boolean;
  canManageExams: boolean;
  canViewAnalytics: boolean;
  canDeleteContent: boolean;
  canModerateContent: boolean;
}

interface QuickActionsProps {
  permissions: Permissions;
}

interface ActionItem {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
  permission?: keyof Permissions;
}

export default function QuickActions({ permissions }: QuickActionsProps) {
  const actions: ActionItem[] = [
    {
      title: 'Create Question',
      description: 'Add a new question to the question bank',
      href: '/admin/questions/create',
      icon: '❓',
      color: 'bg-blue-600 hover:bg-blue-700',
      permission: 'canManageQuestions',
    },
    {
      title: 'Create Exam',
      description: 'Build a new exam from existing questions',
      href: '/admin/exams/create',
      icon: '📝',
      color: 'bg-green-600 hover:bg-green-700',
      permission: 'canManageExams',
    },
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      href: '/admin/users',
      icon: '👥',
      color: 'bg-purple-600 hover:bg-purple-700',
      permission: 'canManageUsers',
    },
    {
      title: 'View Analytics',
      description: 'Check system performance and statistics',
      href: '/admin/analytics',
      icon: '📊',
      color: 'bg-orange-600 hover:bg-orange-700',
      permission: 'canViewAnalytics',
    },
    {
      title: 'Question Bank',
      description: 'Browse and edit existing questions',
      href: '/admin/questions',
      icon: '📚',
      color: 'bg-indigo-600 hover:bg-indigo-700',
      permission: 'canManageQuestions',
    },
    {
      title: 'Exam Library',
      description: 'Manage existing exams and settings',
      href: '/admin/exams',
      icon: '📋',
      color: 'bg-teal-600 hover:bg-teal-700',
      permission: 'canManageExams',
    },
  ];

  // Filter actions based on permissions
  const availableActions = actions.filter(action => {
    if (!action.permission) return true;
    return permissions[action.permission];
  });

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        <p className="mt-1 text-sm text-gray-500">
          Common administrative tasks
        </p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {availableActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group relative rounded-lg p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <span className="text-lg">{action.icon}</span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                    {action.title}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    {action.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {availableActions.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">🔒</div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              No Actions Available
            </h4>
            <p className="text-sm text-gray-500">
              You don&apos;t have permission to perform any administrative
              actions.
            </p>
          </div>
        )}

        {/* Additional Help Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Need Help?</h4>
          <div className="space-y-2">
            <Link
              href="/admin/help"
              className="block text-sm text-blue-600 hover:text-blue-800"
            >
              📖 Admin Documentation
            </Link>
            <Link
              href="/admin/support"
              className="block text-sm text-blue-600 hover:text-blue-800"
            >
              💬 Contact Support
            </Link>
            <Link
              href="/admin/changelog"
              className="block text-sm text-blue-600 hover:text-blue-800"
            >
              📝 What&apos;s New
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
