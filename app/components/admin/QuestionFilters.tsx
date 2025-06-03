'use client';

interface Filters {
  search: string;
  category: string;
  difficulty: string;
  createdBy: string;
}

interface QuestionFiltersProps {
  filters: Filters;
  categories: string[];
  creators: Array<{ id: string; name: string }>;
  onFilterChange: (filters: Partial<Filters>) => void;
  onClearFilters: () => void;
  totalQuestions: number;
  filteredQuestions: number;
}

export default function QuestionFilters({
  filters,
  categories,
  creators,
  onFilterChange,
  onClearFilters,
  totalQuestions,
  filteredQuestions,
}: QuestionFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left side - Filters */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
          {/* Search */}
          <div className="flex-1 min-w-0">
            <label htmlFor="search" className="sr-only">
              Search questions
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                placeholder="Search by question text or category..."
                value={filters.search}
                onChange={(e) => onFilterChange({ search: e.target.value })}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 text-gray-800 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="min-w-0">
            <label htmlFor="category" className="sr-only">
              Filter by category
            </label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="min-w-0">
            <label htmlFor="difficulty" className="sr-only">
              Filter by difficulty
            </label>
            <select
              id="difficulty"
              value={filters.difficulty}
              onChange={(e) => onFilterChange({ difficulty: e.target.value })}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          {/* Creator Filter */}
          <div className="min-w-0">
            <label htmlFor="createdBy" className="sr-only">
              Filter by creator
            </label>
            <select
              id="createdBy"
              value={filters.createdBy}
              onChange={(e) => onFilterChange({ createdBy: e.target.value })}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Creators</option>
              {creators.map((creator) => (
                <option key={creator.id} value={creator.name}>
                  {creator.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right side - Clear filters and results count */}
        <div className="flex items-center space-x-4">
          {/* Results count */}
          <div className="text-sm text-gray-600">
            {filteredQuestions === totalQuestions ? (
              <span>Showing all {totalQuestions} questions</span>
            ) : (
              <span>
                Showing {filteredQuestions} of {totalQuestions} questions
              </span>
            )}
          </div>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Search: "{filters.search}"
              <button
                onClick={() => onFilterChange({ search: '' })}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Category: {filters.category}
              <button
                onClick={() => onFilterChange({ category: '' })}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-600 focus:outline-none"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {filters.difficulty && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Difficulty: {filters.difficulty}
              <button
                onClick={() => onFilterChange({ difficulty: '' })}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-yellow-400 hover:bg-yellow-200 hover:text-yellow-600 focus:outline-none"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {filters.createdBy && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Creator: {filters.createdBy}
              <button
                onClick={() => onFilterChange({ createdBy: '' })}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-600 focus:outline-none"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
