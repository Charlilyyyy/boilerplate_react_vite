import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense, useState } from 'react'
import FullScreenLoader from './components/FullScreenLoader'
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from './components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute'

const Home = lazy(() => import('@/pages/Home'))
const Subscription = lazy(() => import('@/pages/Subscription'))
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Payment = lazy(() => import('@/pages/Payment'));

export default function App(){
  const [isLoggedIn] = useState<boolean>(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout showNavbar={!isLoggedIn}>
          <Suspense fallback={<FullScreenLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/payment" element={<Payment />} />
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}