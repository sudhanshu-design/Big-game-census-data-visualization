import { Badge, Text, Flex } from '@tremor/react';
import { ShieldCheck, Activity } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-[#F5F0E6]/80 backdrop-blur-md border-b border-slate-100 lg:ml-60">
      <div className="px-8 py-4 flex items-center justify-between">
        <Flex justifyContent="start" className="gap-6">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest hidden md:block">System Online • India Census 2011</Text>
          </div>
        </Flex>
        
        <div className="flex items-center gap-4">
          <Flex className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm gap-3">
             <Activity size={14} className="text-emerald-500" />
             <Text className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-widest">Live Network Status</Text>
             <Badge color="emerald" size="xs" className="rounded-full">Stable</Badge>
          </Flex>
          <div className="h-10 w-10 rounded-2xl bg-[#FDFCF8] flex items-center justify-center border border-slate-100 shadow-sm">
             <ShieldCheck size={20} className="text-[#8B4513]" />
          </div>
        </div>
      </div>
    </header>
  );
}
