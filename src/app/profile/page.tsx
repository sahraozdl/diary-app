'use client'
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="p-4 mt-20">
        <h1 className="text-2xl font-bold">ProfilePage</h1>
      </div>
    </ProtectedRoute>
  );
}
