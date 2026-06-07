import ReactECharts from 'echarts-for-react';
import { Card, Title } from '@tremor/react';
import { twMerge } from 'tailwind-merge';

export default function ChartCard({ title, option, className = "h-[400px]", hideTitle = false }) {
  return (
    <Card className={twMerge("p-8 border-none shadow-xl shadow-stone-900/5", className)}>
      {!hideTitle && (
        <Title className="text-[#1A1A1A] font-black text-xl uppercase tracking-tighter mb-8 border-b border-slate-100 pb-4">
          {title}
        </Title>
      )}
      <div className="w-full h-[calc(100%-60px)]">
        <ReactECharts 
          option={option} 
          style={{ height: '100%', width: '100%' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    </Card>
  );
}
