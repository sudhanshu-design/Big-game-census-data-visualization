import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  Grid, 
  Title, 
  Text, 
  TextInput,
  Flex,
  Badge,
  Metric,
  List,
  ListItem,
  Divider
} from '@tremor/react';
import { Search, MapPin, Users, BookOpen, Warehouse } from 'lucide-react';
import ExportButton from '../components/ExportButton';

const API_BASE_URL = 'http://localhost:8000/api';

export default function DistrictDeepDive() {
  const [allDistricts, setAllDistricts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [districtData, setDistrictData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDistricts = async () => {
      const cached = localStorage.getItem('census_districts');
      if (cached) setAllDistricts(JSON.parse(cached));
      try {
        const response = await axios.get(`${API_BASE_URL}/states/districts/all`);
        setAllDistricts(response.data);
        localStorage.setItem('census_districts', JSON.stringify(response.data));
      } catch (err) {
        console.error("Error fetching districts:", err);
      }
    };
    fetchDistricts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchDetails = async (code) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/states/districts/${code}`);
      setDistrictData(response.data);
    } catch (err) {
      console.error("Error fetching district details:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuggestions = debouncedSearch.length > 2 
    ? allDistricts.filter(d => d.district_name.toLowerCase().includes(debouncedSearch.toLowerCase())).slice(0, 5)
    : [];

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-[#1A1A1A] tracking-tighter uppercase">District Analysis</h1>
        <p className="text-slate-500 text-lg mt-2">Granular socio-economic profiling for any Indian district.</p>
      </div>

      <div className="mb-16 relative max-w-3xl">
        <TextInput 
          icon={Search} 
          placeholder="Search for a district (e.g. Pune, Bangalore, Jaipur)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white rounded-2xl shadow-xl shadow-stone-900/5 py-4 text-lg border-none"
        />
        {filteredSuggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-3 bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {filteredSuggestions.map(d => (
              <div 
                key={d.district_code} 
                className="p-5 hover:bg-[#F5F0E6] cursor-pointer border-b border-slate-50 last:border-0 flex justify-between items-center transition-colors"
                onClick={() => {
                  setSearchTerm(''); // Clear box for fresh search
                  setDebouncedSearch(''); 
                  fetchDetails(d.district_code);
                }}
              >
                <div>
                  <Text className="text-[#1A1A1A] font-bold text-lg">{d.district_name}</Text>
                  <Text className="text-xs text-slate-400 font-medium uppercase tracking-widest">{d.state_name}</Text>
                </div>
                <Badge color="amber">View Data</Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-32 text-center text-slate-400 italic text-xl">Extracting Deep-Dive Metrics...</div>
      ) : districtData ? (
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
          <Card className="border-none shadow-2xl shadow-stone-900/10 p-10 mb-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div className="flex-1">
                <Flex justifyContent="start" className="gap-2 mb-4">
                  <MapPin className="text-[#8B4513] h-5 w-5" />
                  <Text className="text-[#8B4513] font-black uppercase tracking-[0.2em] text-xs">{districtData.state_name}</Text>
                </Flex>
                <Title className="text-7xl font-black text-[#1A1A1A] tracking-tighter uppercase leading-none">{districtData.district_name}</Title>
                <div className="mt-6 flex items-center gap-6">
                  <Badge color="stone">Code: {districtData.district_code}</Badge>
                  <Badge color="orange">Primary Census Abstract</Badge>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <ExportButton 
                  data={districtData} 
                  filename={`district_${districtData.district_name}.csv`} 
                  label="Download Report" 
                />
                <button 
                  onClick={() => { setDistrictData(null); setSearchTerm(''); }}
                  className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-[#8B4513] transition-colors shadow-sm"
                >
                  New Search
                </button>
                <div 
                  className="p-6 w-52 rounded-3xl shadow-sm border border-slate-100"
                  style={{ backgroundColor: '#F5F0E6' }}
                >
                  <Text className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Total Population</Text>
                  <Metric className="text-[#1A1A1A] text-3xl font-black">{districtData.population.toLocaleString()}</Metric>
                </div>
                <div 
                  className="p-6 w-52 rounded-3xl shadow-xl shadow-amber-900/20"
                  style={{ backgroundColor: '#8B4513' }}
                >
                  <Text className="text-[10px] text-white/70 uppercase font-black tracking-widest mb-2">Literacy Rate</Text>
                  <Metric className="text-white text-3xl font-black">{Number(districtData.literacy_rate).toFixed(2)}%</Metric>
                </div>
              </div>
            </header>

            <Divider className="my-12 opacity-50" />

            <Grid numItemsLg={3} className="gap-12">
              <div>
                <Title className="text-[#1A1A1A] font-black flex items-center gap-3 mb-8 text-xl uppercase tracking-tight">
                  <Users className="h-6 w-6 text-[#8B4513]" /> Demographics
                </Title>
                <List className="space-y-4">
                  <ListItem className="border-slate-100">
                    <span className="text-slate-500 font-bold">Male Population</span>
                    <span className="text-[#1A1A1A] font-black">{districtData.male.toLocaleString()}</span>
                  </ListItem>
                  <ListItem className="border-slate-100">
                    <span className="text-slate-500 font-bold">Female Population</span>
                    <span className="text-[#1A1A1A] font-black">{districtData.female.toLocaleString()}</span>
                  </ListItem>
                  <ListItem className="border-slate-100">
                    <span className="text-slate-500 font-bold">Sex Ratio</span>
                    <span className="text-[#8B4513] font-black text-lg">{Number(districtData.sex_ratio).toFixed(1)}</span>
                  </ListItem>
                </List>
              </div>

              <div>
                <Title className="text-[#1A1A1A] font-black flex items-center gap-3 mb-8 text-xl uppercase tracking-tight">
                  <BookOpen className="h-6 w-6 text-[#C2410C]" /> Socio-Economic
                </Title>
                <List className="space-y-4">
                  <ListItem className="border-slate-100">
                    <span className="text-slate-500 font-bold">Literates</span>
                    <span className="text-[#1A1A1A] font-black">{districtData.literate.toLocaleString()}</span>
                  </ListItem>
                  <ListItem className="border-slate-100">
                    <span className="text-slate-500 font-bold">SC Population</span>
                    <span className="text-[#1A1A1A] font-black">{districtData.sc_population.toLocaleString()}</span>
                  </ListItem>
                  <ListItem className="border-slate-100">
                    <span className="text-slate-500 font-bold">ST Population</span>
                    <span className="text-[#1A1A1A] font-black">{districtData.st_population.toLocaleString()}</span>
                  </ListItem>
                </List>
              </div>

              <div>
                <Title className="text-[#1A1A1A] font-black flex items-center gap-3 mb-8 text-xl uppercase tracking-tight">
                  <Warehouse className="h-6 w-6 text-[#B45309]" /> Infrastructure
                </Title>
                <List className="space-y-4">
                  <ListItem className="border-slate-100">
                    <span className="text-slate-500 font-bold">Urban Percentage</span>
                    <span className="text-[#1A1A1A] font-black">{Number(districtData.urban_percentage).toFixed(2)}%</span>
                  </ListItem>
                  <ListItem className="border-slate-100">
                    <span className="text-slate-500 font-bold">Working Force</span>
                    <span className="text-[#1A1A1A] font-black">{districtData.workers.toLocaleString()}</span>
                  </ListItem>
                  <ListItem className="border-slate-100">
                    <span className="text-slate-500 font-bold">Non-Workers</span>
                    <span className="text-[#1A1A1A] font-black">{districtData.non_workers.toLocaleString()}</span>
                  </ListItem>
                </List>
              </div>
            </Grid>
          </Card>
        </div>
      ) : (
        <div className="p-40 flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-[3rem] bg-white/50">
           <div className="h-24 w-24 bg-[#F5F0E6] rounded-full flex items-center justify-center mb-8">
             <Search size={48} className="text-[#8B4513] opacity-40" />
           </div>
           <Title className="text-stone-400 font-black uppercase tracking-widest text-2xl">Search any District</Title>
           <Text className="text-stone-300 font-medium text-lg mt-2">Historical 2011 Census Insights at your fingertips</Text>
        </div>
      )}
    </div>
  );
}
