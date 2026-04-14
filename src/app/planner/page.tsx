'use client';

import PageContainer from '@/components/layout/PageContainer';
import StepWizard from '@/components/planner/StepWizard';

export default function PlannerPage() {
  return (
    <PageContainer title="行程规划">
      <p className="text-ink/60 mb-6">
        AI智能生成详细旅行计划，三餐美食推荐精确到店。
      </p>
      <StepWizard />
    </PageContainer>
  );
}
