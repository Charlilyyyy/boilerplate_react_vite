import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import FullScreenLoader from './components/FullScreenLoader'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from '@/components/ProtectedRoute'

const Home = lazy(() => import('@/pages/Home'))
const Subscription = lazy(() => import('@/pages/Subscription'))
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Payment = lazy(() => import('@/pages/Payment'));

export default function App(){
  return (
    <AuthProvider>
    <BrowserRouter>
      <div className="w-full">
        
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/subscription">Subscription</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Suspense fallback={<FullScreenLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
    </AuthProvider>
  )
}