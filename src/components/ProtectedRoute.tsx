import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import FullScreenLoader from './FullScreenLoader'

export default function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { token, isLoading } = useAuth()

  if (isLoading) {
    return <FullScreenLoader />
  }

  if (!token) {
    return <Navigate to="/" replace />
  }

  return children
} 