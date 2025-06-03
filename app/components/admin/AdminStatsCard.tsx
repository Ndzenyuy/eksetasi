'use client';

interface AdminStatsCardProps {
  title: string;
  value: number;
  change: number;
  changeLabel: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow';
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    text: 'text-blue-900',
    border: 'border-blue-200',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    text: 'text-green-900',
    border: 'border-green-200',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    text: 'text-purple-900',
    border: 'border-purple-200',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    text: 'text-orange-900',
    border: 'border-orange-200',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    text: 'text-red-900',
    border: 'border-red-200',
  },
  yellow: {
    bg: 'bg-yellow-50',
    icon: 'text-yellow-600',
    text: 'text-yellow-900',
    border: 'border-yellow-200',
  },
};

export default function AdminStatsCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  color,
}: AdminStatsCardProps) {
  const colors = colorClasses[color];

  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg border ${colors.border}`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
              <span className={`text-xl ${colors.icon}`}>{icon}</span>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className={`text-2xl font-semibold ${colors.text}`}>
                  {value.toLocaleString()}
                </div>
              </dd>
              {change > 0 && (
                <dd className="mt-1 flex items-baseline text-sm">
                  <div className="flex items-baseline text-green-600">
                    <svg
                      className="self-center flex-shrink-0 h-4 w-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414 6.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="sr-only">Increased by</span>
                    <span className="ml-1 font-medium">+{change}</span>
                  </div>
                  <span className="ml-2 text-gray-500">{changeLabel}</span>
                </dd>
              )}
              {change === 0 && (
                <dd className="mt-1 text-sm text-gray-500">
                  No change this week
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
