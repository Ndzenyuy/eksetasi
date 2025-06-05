'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserTable from '@/app/components/admin/UserTable';
import UserFilters from '@/app/components/admin/UserFilters';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  createdAt: string;
  updatedAt: string;
  _count: {
    createdQuestions: number;
    createdExams: number;
    attempts: number;
  };
}

interface Filters {
  search: string;
  role: string;
  dateRange: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    role: '',
    dateRange: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        if (response.status === 403) {
          router.push("/dashboard");
          return;
        }
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const applyFilters = useCallback(() => {
    let filtered = [...users];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Role filter
    if (filters.role) {
      filtered = filtered.filter((user) => user.role === filters.role);
    }

    // Date range filter
    if (filters.dateRange) {
      const now = new Date();
      let startDate: Date;

      switch (filters.dateRange) {
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "quarter":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }

      filtered = filtered.filter(
        (user) => new Date(user.createdAt) >= startDate
      );
    }

    setFilteredUsers(filtered);
  }, [users, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      role: '',
      dateRange: '',
    });
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      // Update user in state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole as 'ADMIN' | 'TEACHER' | 'STUDENT' } : user
      ));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone and will remove all their data.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Remove user from state
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user');
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
            onClick={fetchUsers}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
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
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage user accounts and permissions
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/admin"
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Back to Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{users.length}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => u.role === 'ADMIN').length}
            </div>
            <div className="text-sm text-gray-600">Admins</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'TEACHER').length}
            </div>
            <div className="text-sm text-gray-600">Teachers</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.role === 'STUDENT').length}
            </div>
            <div className="text-sm text-gray-600">Students</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <UserFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            totalUsers={users.length}
            filteredUsers={filteredUsers.length}
          />
        </div>

        {/* Users Table */}
        <UserTable
          users={filteredUsers}
          onUpdateUserRole={handleUpdateUserRole}
          onDeleteUser={handleDeleteUser}
        />
      </div>
    </div>
  );
}
