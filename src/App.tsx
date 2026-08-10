/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LanguageProvider } from './contexts/LanguageContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { SubscriptionGuard } from './components/layout/SubscriptionGuard';

// Lazily import pages for better performance
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Booking = React.lazy(() => import('./pages/Booking'));
const Auth = React.lazy(() => import('./pages/Auth'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const PersonalityDNA = React.lazy(() => import('./pages/PersonalityDNA'));
const AICoach = React.lazy(() => import('./pages/AICoach'));
const GrowthJourney = React.lazy(() => import('./pages/GrowthJourney'));
const GrowthLab = React.lazy(() => import('./pages/GrowthLab'));
const EmotionalIQ = React.lazy(() => import('./pages/EmotionalIQ'));
const SocialIntelligence = React.lazy(() => import('./pages/SocialIntelligence'));
const NeuralTests = React.lazy(() => import('./pages/NeuralTests'));
const Library = React.lazy(() => import('./pages/Library'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Profile = React.lazy(() => import('./pages/Profile'));
const ToxicityShield = React.lazy(() => import('./pages/ToxicityShield'));
const CognitiveLoad = React.lazy(() => import('./pages/CognitiveLoad'));
const SystemCrisis = React.lazy(() => import('./pages/SystemCrisis'));
const HabitForge = React.lazy(() => import('./pages/HabitForge'));
const GrowthVelocity = React.lazy(() => import('./pages/GrowthVelocity'));
const ArchetypeAnalysis = React.lazy(() => import('./pages/ArchetypeAnalysis'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const SuperAdminDashboard = React.lazy(() => import('./pages/SuperAdminDashboard'));
const Billing = React.lazy(() => import('./pages/Billing'));
const UnauthorizedPage = React.lazy(() => import('./pages/UnauthorizedPage'));
const AdminLoginPage = React.lazy(() => import('./pages/AdminLoginPage'));
const SuperAdminLoginPage = React.lazy(() => import('./pages/SuperAdminLoginPage'));

function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-bg-dark flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/" />;

  return <DashboardLayout>{children}</DashboardLayout>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-bg-dark flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/admin-login" />;
  if (user.role !== 'admin' && user.role !== 'super_admin') {
    return <Navigate to="/admin-login" />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-bg-dark flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/super-login" />;
  if (user.role !== 'super_admin') {
    return <Navigate to="/super-login" />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <React.Suspense fallback={<div className="min-h-screen bg-bg-dark flex items-center justify-center text-white">Loading HumanOS...</div>}>
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/super-login" element={<SuperAdminLoginPage />} />
            <Route path="/super_login" element={<Navigate to="/super-login" replace />} />
            
            <Route path="/dashboard" element={
              <AuthenticatedRoute>
                <Dashboard />
              </AuthenticatedRoute>
            } />
            
            <Route path="/dna" element={
              <AuthenticatedRoute>
                <SubscriptionGuard>
                  <PersonalityDNA />
                </SubscriptionGuard>
              </AuthenticatedRoute>
            } />

            <Route path="/growth-lab" element={
              <AuthenticatedRoute>
                <SubscriptionGuard>
                  <GrowthLab />
                </SubscriptionGuard>
              </AuthenticatedRoute>
            } />

            <Route path="/emotional-iq" element={
              <AuthenticatedRoute>
                <SubscriptionGuard>
                  <EmotionalIQ />
                </SubscriptionGuard>
              </AuthenticatedRoute>
            } />

            <Route path="/social-iq" element={
              <AuthenticatedRoute>
                <SubscriptionGuard>
                  <SocialIntelligence />
                </SubscriptionGuard>
              </AuthenticatedRoute>
            } />

            <Route path="/tests" element={
              <AuthenticatedRoute>
                <SubscriptionGuard>
                  <NeuralTests />
                </SubscriptionGuard>
              </AuthenticatedRoute>
            } />
            
            <Route path="/coach" element={
              <AuthenticatedRoute>
                <SubscriptionGuard>
                  <AICoach />
                </SubscriptionGuard>
              </AuthenticatedRoute>
            } />
            
            <Route path="/journey" element={
              <AuthenticatedRoute>
                <SubscriptionGuard>
                  <GrowthJourney />
                </SubscriptionGuard>
              </AuthenticatedRoute>
            } />

            <Route path="/library" element={
              <AuthenticatedRoute>
                <SubscriptionGuard>
                  <Library />
                </SubscriptionGuard>
              </AuthenticatedRoute>
            } />

            <Route path="/settings" element={
              <AuthenticatedRoute>
                <Settings />
              </AuthenticatedRoute>
            } />

            <Route path="/profile" element={
              <AuthenticatedRoute>
                <Profile />
              </AuthenticatedRoute>
            } />
            
            <Route path="/toxicity" element={
              <AuthenticatedRoute>
                <SubscriptionGuard>
                  <ToxicityShield />
                </SubscriptionGuard>
              </AuthenticatedRoute>
            } />

            <Route path="/cognitive-load" element={
              <AuthenticatedRoute>
                <SubscriptionGuard>
                  <CognitiveLoad />
                </SubscriptionGuard>
              </AuthenticatedRoute>
            } />

            <Route path="/crisis" element={
              <AuthenticatedRoute>
                <SystemCrisis />
              </AuthenticatedRoute>
            } />

            <Route path="/habits" element={
              <AuthenticatedRoute>
                <HabitForge />
              </AuthenticatedRoute>
            } />

            <Route path="/velocity" element={
              <AuthenticatedRoute>
                <SubscriptionGuard>
                  <GrowthVelocity />
                </SubscriptionGuard>
              </AuthenticatedRoute>
            } />

            <Route path="/archetype" element={
              <AuthenticatedRoute>
                <SubscriptionGuard>
                  <ArchetypeAnalysis />
                </SubscriptionGuard>
              </AuthenticatedRoute>
            } />
            <Route path="/billing" element={
              <AuthenticatedRoute>
                <Billing />
              </AuthenticatedRoute>
            } />

            <Route path="/booking" element={
              <AuthenticatedRoute>
                <SubscriptionGuard>
                  <Booking />
                </SubscriptionGuard>
              </AuthenticatedRoute>
            } />

            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />

            <Route path="/super-admin" element={
              <SuperAdminRoute>
                <SuperAdminDashboard />
              </SuperAdminRoute>
            } />

            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </AuthProvider>
  </LanguageProvider>
  );
}

