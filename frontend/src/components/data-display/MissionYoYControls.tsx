'use client';

import React from 'react';

export interface MissionYoYControlsProps {
  missionKey?: 'research' | 'academic' | 'publications' | 'service' | 'ip';
  missionTitle?: string;
  allItemsRaw?: any[];
  activeDepartment?: string;
  primaryMetricLabel?: string;
  secondaryMetricLabel?: string;
  hasBudgetMetric?: boolean;
  defaultBaseYear?: string;
  defaultTargetYear?: string;
  subCategoryExtractor?: (item: any) => string;
}

export function MissionYoYControls(_props: MissionYoYControlsProps) {
  return null;
}
