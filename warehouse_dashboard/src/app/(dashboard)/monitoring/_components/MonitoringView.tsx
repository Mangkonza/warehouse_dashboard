'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ProjectMonitoringTab from './ProjectMonitoringTab';

export function MonitoringView() {
  const router = useRouter();

  return (
    <div>
      <ProjectMonitoringTab
        goBack={() => router.push('/overview')}
        onNavigateToManage={() => router.push('/manage')}
      />
    </div>
  );
}
