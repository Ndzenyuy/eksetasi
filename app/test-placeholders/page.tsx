'use client';

export default function TestPlaceholders() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Placeholder Visibility Test</h1>
          
          <div className="space-y-6">
            {/* Standard Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Standard Input (with placeholder-gray-400 and text-gray-800)
              </label>
              <input
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Type here - placeholder should be gray-400, text should be gray-800"
              />
            </div>

            {/* Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Textarea (with placeholder-gray-400 and text-gray-800)
              </label>
              <textarea
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Type here - both placeholder and typed text should be clearly legible"
              />
            </div>

            {/* Input without explicit placeholder class (should inherit from global CSS) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input without explicit placeholder class (global CSS should apply)
              </label>
              <input
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="This should be visible due to global CSS rules"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Input
              </label>
              <input
                type="email"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email address"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Input
              </label>
              <input
                type="password"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Input
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search by question text or category..."
                />
              </div>
            </div>

            {/* Color Reference */}
            <div className="mt-8 p-4 bg-white border border-gray-200 rounded-md">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Color Reference</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-400 rounded border border-gray-300"></div>
                  <span className="font-medium">gray-400 (rgb(156 163 175)) - Target placeholder color</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-500 rounded border border-gray-300"></div>
                  <span>gray-500 (rgb(107 114 128)) - Too dark for placeholders</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-300 rounded border border-gray-300"></div>
                  <span>gray-300 (rgb(209 213 219)) - Too light for placeholders</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-8 p-4 bg-blue-50 rounded-md">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Testing Instructions</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• All placeholder texts should be clearly visible in a medium gray color</li>
                <li>• Placeholders should not be too light (hard to read) or too dark (distracting)</li>
                <li>• When you focus on an input, the placeholder should remain visible but slightly faded</li>
                <li>• All inputs should have consistent placeholder styling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
