import { Card, Grid, Text, Metric, Flex, Badge } from '@tremor/react';
import { useCensusOverview, useStatesData } from '../hooks/useCensusData';
import { useRealTimeData } from '../hooks/useRealTimeData';
import ChartCard from '../components/ChartCard';
import { Users, BookOpen, Heart, Home, Activity, UserPlus, UserMinus } from 'lucide-react';

export default function Dashboard() {
  const { data: overview, loading: overviewLoading } = useCensusOverview();
  const { data: states, loading: statesLoading } = useStatesData();
  const { liveData, isConnected } = useRealTimeData();

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr';
    if (num >= 100000) return (num / 100000).toFixed(2) + ' L';
    return num.toLocaleString();
  };

  const baseKpis = [
    { title: 'Total Population', value: formatNumber(liveData?.total_population || overview?.total_population), icon: Users, accent: '#8B4513' },
    { title: 'Literacy Rate', value: ((liveData?.avg_literacy_rate || overview?.avg_literacy_rate) || 0) + '%', icon: BookOpen, accent: '#C2410C' },
    { title: 'Sex Ratio', value: (liveData?.sex_ratio || overview?.sex_ratio) || 0, icon: Heart, accent: '#BE123C' },
    { title: 'Total States', value: '35', icon: Home, accent: '#B45309' },
  ];

  const liveKpis = isConnected ? [
    { title: 'Live Births (Today)', value: formatNumber(liveData?.live_births_today), icon: UserPlus, accent: '#10B981' },
    { title: 'Live Deaths (Today)', value: formatNumber(liveData?.live_deaths_today), icon: UserMinus, accent: '#EF4444' },
  ] : [];

  const kpis = [...baseKpis, ...liveKpis];

  const topStatesOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: [...states].sort((a, b) => b.population - a.population).slice(0, 10).map(s => s.state),
      axisLabel: { rotate: 45, color: '#64748B' }
    },
    yAxis: { 
      type: 'value',
      axisLabel: { color: '#64748B', formatter: (v) => formatNumber(v) },
      splitLine: { lineStyle: { color: '#E2E8F0', type: 'dashed' } }
    },
    series: [{
      data: [...states].sort((a, b) => b.population - a.population).slice(0, 10).map(s => s.population),
      type: 'bar',
      itemStyle: { color: '#8B4513', borderRadius: [8, 8, 0, 0] }
    }]
  };

  const urbanRuralOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['50%', '80%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 20, borderColor: '#FDFCF8', borderWidth: 5 },
      label: { show: false },
      data: [
        { value: 31.16, name: 'Urban', itemStyle: { color: '#C2410C' } },
        { value: 68.84, name: 'Rural', itemStyle: { color: '#F5F0E6' } }
      ]
    }]
  };

  if (overviewLoading || statesLoading) {
    return <div className="lg:ml-64 p-10 text-slate-500 italic">Assembling Insights...</div>;
  }

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto">
      <header className="mb-12">
        <Flex justifyContent="start" className="gap-2 mb-3">
          <Badge color={isConnected ? "emerald" : "amber"}>
            {isConnected ? "Live Population Clock" : "Primary Census Abstract"}
          </Badge>
          <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            {isConnected ? "Real-Time Estimate" : "2011 Dataset"}
          </Text>
          {isConnected && <Activity size={14} className="text-emerald-500 animate-pulse" />}
        </Flex>
        <h1 className="text-5xl font-black text-[#1A1A1A] tracking-tighter uppercase"></h1>
        <p className="text-slate-500 text-lg mt-2">Comprehensive demographic analysis of the Indian population.</p>
      </header>

      <Grid numItemsSm={2} numItemsLg={3} className="gap-8 mb-12">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="hover:scale-[1.03] transition-all duration-500 border-none shadow-xl shadow-stone-900/5">
            <Flex alignItems="start">
              <div>
                <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-2">{kpi.title}</Text>
                <Metric className="text-[#1A1A1A] font-black text-3xl">{kpi.value}</Metric>
              </div>
              <div 
                className="p-3 rounded-2xl" 
                style={{ backgroundColor: `${kpi.accent}15` }}
              >
                <kpi.icon size={26} style={{ color: kpi.accent }} />
              </div>
            </Flex>
          </Card>
        ))}
      </Grid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ChartCard title="Top 10 Populated States" option={topStatesOption} className="h-[450px]" />
        </div>
        <div className="lg:col-span-1">
          <Card className="h-full border-none shadow-xl shadow-stone-900/5">
            <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-6">Urban vs Rural Distribution</Text>
            <div className="h-[300px]">
              <ChartCard option={urbanRuralOption} hideTitle className="h-full" />
            </div>
            <div className="mt-8 space-y-4">
              <Flex>
                <Flex justifyContent="start" className="gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#C2410C]" />
                  <Text className="text-[#1A1A1A] font-bold">Urban</Text>
                </Flex>
                <Text className="font-black text-[#1A1A1A]">31.16%</Text>
              </Flex>
              <Flex>
                <Flex justifyContent="start" className="gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#F5F0E6] border border-slate-200" />
                  <Text className="text-[#1A1A1A] font-bold">Rural</Text>
                </Flex>
                <Text className="font-black text-[#1A1A1A]">68.84%</Text>
              </Flex>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
