import { useState } from 'react';
import { useStatesData } from '../hooks/useCensusData';
import { 
  Card, 
  Table, 
  TableHead, 
  TableRow, 
  TableHeaderCell, 
  TableBody, 
  TableCell, 
  Text, 
  Badge,
  TextInput
} from '@tremor/react';
import { Search, Building2 } from 'lucide-react';

export default function StatesExplorer() {
  const { data: states, loading } = useStatesData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStates = states.filter(s => 
    s.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="lg:ml-64 p-10 text-slate-500 italic">Processing Regional Data...</div>;

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <Badge color="amber" className="mb-3">Regional Analytics</Badge>
          <h1 className="text-5xl font-black text-[#1A1A1A] uppercase tracking-tighter leading-none">States Registry</h1>
          <p className="text-slate-500 text-lg mt-2">Comprehensive demographic audit by State & Union Territory.</p>
        </div>
        <div className="relative w-80">
          <TextInput
            icon={Search}
            placeholder="Search state name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white border-none shadow-xl shadow-stone-900/5 rounded-2xl py-3"
          />
        </div>
      </div>

      <Card className="p-0 border-none shadow-2xl shadow-stone-900/10 rounded-[3rem] overflow-hidden">
        <Table>
          <TableHead className="bg-[#FDFCF8] border-b border-slate-100">
            <TableRow>
              <TableHeaderCell className="text-slate-400 font-black uppercase text-[10px] tracking-widest p-6">Entity</TableHeaderCell>
              <TableHeaderCell className="text-slate-400 font-black uppercase text-[10px] tracking-widest p-6">Population</TableHeaderCell>
              <TableHeaderCell className="text-slate-400 font-black uppercase text-[10px] tracking-widest p-6">Literacy</TableHeaderCell>
              <TableHeaderCell className="text-slate-400 font-black uppercase text-[10px] tracking-widest p-6">Sex Ratio</TableHeaderCell>
              <TableHeaderCell className="text-slate-400 font-black uppercase text-[10px] tracking-widest p-6">Urbanization</TableHeaderCell>
              <TableHeaderCell className="text-slate-400 font-black uppercase text-[10px] tracking-widest p-6 text-right">Profile</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody className="bg-white">
            {filteredStates.map((item) => (
              <TableRow key={item.state} className="hover:bg-[#F5F0E6]/30 transition-colors border-b border-slate-50 last:border-0">
                <TableCell className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-[#F5F0E6] rounded-xl flex items-center justify-center">
                      <Building2 size={16} className="text-[#8B4513]" />
                    </div>
                    <Text className="font-black text-[#1A1A1A] text-lg tracking-tight uppercase">{item.state}</Text>
                  </div>
                </TableCell>
                <TableCell className="p-6">
                  <Text className="text-[#1A1A1A] font-bold tabular-nums">{item.population.toLocaleString()}</Text>
                </TableCell>
                <TableCell className="p-6">
                  <Text className="text-[#1A1A1A] font-bold tabular-nums">{item.literacy}%</Text>
                </TableCell>
                <TableCell className="p-6">
                  <Text className="text-[#8B4513] font-black tabular-nums">{item.sex_ratio}</Text>
                </TableCell>
                <TableCell className="p-6">
                  <Text className="text-[#1A1A1A] font-bold tabular-nums">{item.urban_percentage}%</Text>
                </TableCell>
                <TableCell className="p-6 text-right">
                  <Badge color={item.literacy > 75 ? "orange" : "stone"} className="rounded-full px-4">
                    {item.literacy > 75 ? "High Literacy" : "Standard"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredStates.length === 0 && (
          <div className="p-20 text-center text-slate-400 italic">No states matching your search.</div>
        )}
      </Card>
    </div>
  );
}
