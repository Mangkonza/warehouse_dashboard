'use client';

import React from 'react';
import { DataManagementRoot } from './data-management/DataManagementRoot';

interface DataManageProps {
  goBack: () => void;
}

export default function DataManage({ goBack }: DataManageProps) {
  return <DataManagementRoot goBack={goBack} />;
}