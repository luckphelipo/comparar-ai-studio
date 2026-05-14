import { motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { Zap } from 'lucide-react';
import CreditosChart from '../components/dashboard/CreditosChart';
import JobsStatus from '../components/dashboard/JobsStatus';
import UltimasAnalises from '../components/dashboard/UltimasAnalises';
import { useFunnel } from '@/lib/FunnelContext';

const RecentProjects = lazy(() => import('../components/dashboard/RecentProjects'));
const ActivityChart = lazy(() => import('../components/dashboard/ActivityChart'));
const QuickActions = lazy(() => import('../components/dashboard/QuickActions'));
const FunnelIntelligence = lazy(() => import('../components/dashboard/FunnelIntelligence'));

export default function Dashboard() {
  const { config, funnel } = useFunnel();
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Créditos */}
      <CreditosChart />

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <JobsStatus />
        <UltimasAnalises />
      </div>

      {/* Main Content Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Chart + Projects */}
          <div className="lg:col-span-2 space-y-6">
            <Suspense fallback={<div className="h-80 bg-card rounded-xl animate-pulse" />}>
              <ActivityChart />
            </Suspense>
            <Suspense fallback={<div className="h-96 bg-card rounded-xl animate-pulse" />}>
              <RecentProjects />
            </Suspense>
          </div>

          {/* Right — Quick Actions + Funnel Intel */}
          <div className="space-y-6">
            <Suspense fallback={<div className="h-64 bg-card rounded-xl animate-pulse" />}>
              <FunnelIntelligence />
            </Suspense>
            <Suspense fallback={<div className="h-48 bg-card rounded-xl animate-pulse" />}>
              <QuickActions />
            </Suspense>
          </div>
       </div>
    </div>
  );
}