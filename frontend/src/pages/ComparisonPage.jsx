import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  Grid, 
  Title, 
  Text, 
  Select, 
  SelectItem, 
  Table, 
  TableRow, 
  TableBody, 
  TableCell,
  Badge,
  ProgressBar
} from '@tremor/react';
import { GitCompare, ArrowRightLeft } from 'lucide-react';
import ExportButton from '../components/ExportButton';

const API_BASE_URL = 'http://localhost:8000/api';

const ComparisonRow = ({ label, valA, valB, suffix = '' }) => {
  const maxVal = Math.max(valA, valB);
  return (
    <TableRow className="border-b border-slate-100">
      <TableCell>
        <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{label}</Text>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <Text className="text-[#1A1A1A] font-black">{valA.toLocaleString()}{suffix}</Text>
            {valA > valB && <Badge color="amber" size="xs">Higher</Badge>}
          </div>
          <ProgressBar value={(valA / maxVal) * 100} color="orange" className="mt-2" />
        </div>
      </TableCell>
      <TableCell className="text-center px-4">
        <ArrowRightLeft className="text-slate-300 inline-block h-4 w-4" />
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <Text className="text-[#1A1A1A] font-black">{valB.toLocaleString()}{suffix}</Text>
            {valB > valA && <Badge color="amber" size="xs">Higher</Badge>}
          </div>
          <ProgressBar value={(valB / maxVal) * 100} color="stone" className="mt-2" />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default function ComparisonPage() {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entityA, setEntityA] = useState('');
  const [entityB, setEntityB] = useState('');

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/states/`);
        setStates(response.data);
        if (response.data.length >= 2) {
          setEntityA(response.data[0].state);
          setEntityB(response.data[1].state);
        }
      } catch (err) {
        console.error("Error fetching states:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStates();
  }, []);

  const dataA = states.find(s => s.state === entityA);
  const dataB = states.find(s => s.state === entityB);

  if (loading) return <div className="lg:ml-64 p-10 text-slate-500 italic">Benchmarking States...</div>;

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto">
      <div className="mb-12">
        <Badge color="stone" className="mb-3">Comparative Analytics</Badge>
        <h1 className="text-5xl font-black text-[#1A1A1A] uppercase tracking-tighter leading-none">State Benchmarking</h1>
        <p className="text-slate-500 text-lg mt-2">Side-by-side demographic performance metrics.</p>
      </div>

      <Grid numItemsLg={2} className="gap-8 mb-12">
        <Card className="border-none shadow-xl shadow-stone-900/5 p-6">
          <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-3">Target Entity A</Text>
          <Select value={entityA} onValueChange={setEntityA} className="bg-white border-none shadow-sm rounded-xl">
            {states.map(s => <SelectItem key={s.state} value={s.state}>{s.state}</SelectItem>)}
          </Select>
        </Card>
        <Card className="border-none shadow-xl shadow-stone-900/5 p-6">
          <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-3">Target Entity B</Text>
          <Select value={entityB} onValueChange={setEntityB} className="bg-white border-none shadow-sm rounded-xl">
            {states.map(s => <SelectItem key={s.state} value={s.state}>{s.state}</SelectItem>)}
          </Select>
        </Card>
      </Grid>

      {dataA && dataB && (
        <Card className="p-0 overflow-hidden shadow-2xl shadow-stone-900/10 border-none rounded-[3rem]">
          <div className="grid grid-cols-3 bg-[#FDFCF8] border-b border-slate-100 p-10 items-center">
            <div className="text-left">
              <Badge color="orange" className="mb-3">ENTITY A</Badge>
              <Title className="text-[#1A1A1A] text-4xl font-black uppercase tracking-tighter">{dataA.state}</Title>
            </div>
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-3xl bg-[#F5F0E6] flex items-center justify-center border border-slate-100 shadow-inner">
                <GitCompare className="text-[#8B4513] h-8 w-8" />
              </div>
            </div>
            <div className="text-right">
              <Badge color="stone" className="mb-3">ENTITY B</Badge>
              <Title className="text-[#1A1A1A] text-4xl font-black uppercase tracking-tighter">{dataB.state}</Title>
            </div>
          </div>

          <div className="flex justify-end px-10 pt-6">
            <ExportButton 
              data={[dataA, dataB]} 
              filename={`comparison_${dataA.state}_vs_${dataB.state}.csv`} 
              label="Export Comparison Data" 
            />
          </div>

          <Table className="px-10 py-6">
            <TableBody>
              <ComparisonRow label="Population" valA={dataA.population} valB={dataB.population} />
              <ComparisonRow label="Literacy Rate" valA={dataA.literacy} valB={dataB.literacy} suffix="%" />
              <ComparisonRow label="Sex Ratio" valA={dataA.sex_ratio} valB={dataB.sex_ratio} />
              <ComparisonRow label="Urban Pop %" valA={dataA.urban_percentage} valB={dataB.urban_percentage} suffix="%" />
            </TableBody>
          </Table>

          <div className="p-8 bg-[#F5F0E6]/30 border-t border-slate-100 text-center">
            <Text className="text-slate-400 italic text-sm">
              Cross-referenced comparison using primary census metrics.
            </Text>
          </div>
        </Card>
      )}
    </div>
  );
}
