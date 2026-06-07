import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Card, Text, Select, SelectItem, Flex, Badge } from '@tremor/react';

const API_BASE_URL = 'http://localhost:8000/api';

export default function MapPage() {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState('Literacy_Rate');

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/geojson/`);
        setGeoData(response.data);
      } catch (err) {
        console.error("Error fetching GeoJSON:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGeoJSON();
  }, []);

  const getColor = (d) => {
    if (metric === 'Literacy_Rate') {
      return d > 85 ? '#8B4513' :
             d > 75 ? '#A0522D' :
             d > 65 ? '#CD853F' :
             d > 55 ? '#DEB887' :
             d > 45 ? '#F5DEB3' :
                      '#FFF8DC';
    } else {
      return d > 1000000 ? '#C2410C' :
             d > 500000  ? '#EA580C' :
             d > 200000  ? '#F97316' :
             d > 100000  ? '#FB923C' :
             d > 50000   ? '#FDBA74' :
                           '#FFEDD5';
    }
  };

  const style = (feature) => {
    const val = feature.properties[metric];
    return {
      fillColor: getColor(val),
      weight: 0.5,
      opacity: 1,
      color: '#F5F0E6',
      fillOpacity: 0.8
    };
  };

  const onEachFeature = (feature, layer) => {
    const props = feature.properties;
    layer.bindPopup(`
      <div class="p-4 min-w-[200px] font-sans">
        <h3 class="font-black text-xl uppercase tracking-tighter text-[#1A1A1A] mb-1">${props['District name'] || 'Unknown'}</h3>
        <p class="text-xs text-[#8B4513] font-bold uppercase tracking-widest mb-3">${props['State name'] || ''}</p>
        <div class="space-y-2 border-t border-slate-100 pt-3">
          <div class="flex justify-between">
            <span class="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Population</span> 
            <span class="text-[#1A1A1A] font-black">${props.Population ? props.Population.toLocaleString() : 'N/A'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Literacy</span> 
            <span class="text-[#1A1A1A] font-black">${props.Literacy_Rate ? props.Literacy_Rate.toFixed(1) + '%' : 'N/A'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Sex Ratio</span> 
            <span class="text-[#1A1A1A] font-black">${props.Sex_Ratio || 'N/A'}</span>
          </div>
        </div>
      </div>
    `);

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 2,
          color: '#8B4513',
          fillOpacity: 0.9
        });
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 0.5,
          color: '#F5F0E6',
          fillOpacity: 0.8
        });
      }
    });
  };

  if (loading) return <div className="lg:ml-64 p-10 text-slate-500 italic">Assembling Geospatial Map...</div>;

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <Badge color="amber" className="mb-3">Geospatial Engine</Badge>
          <h1 className="text-5xl font-black text-[#1A1A1A] uppercase tracking-tighter leading-none">Choropleth Map</h1>
          <p className="text-slate-500 text-lg mt-2">Interactive district-level demographic distribution</p>
        </div>
        <div className="w-80 relative z-50">
          <Text className="mb-3 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Select Visual Metric</Text>
          <Select value={metric} onValueChange={setMetric} className="bg-white rounded-2xl border-none shadow-xl shadow-stone-900/5">
            <SelectItem value="Literacy_Rate">Literacy Rate (%)</SelectItem>
            <SelectItem value="Population">Population Count</SelectItem>
          </Select>
        </div>
      </div>

      <Card className="p-0 overflow-hidden h-[70vh] relative z-0 border-none shadow-2xl shadow-stone-900/10 rounded-[3rem]">
        <MapContainer 
          center={[20.5937, 78.9629]} 
          zoom={5} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {geoData && (
            <GeoJSON 
              data={geoData} 
              style={style} 
              onEachFeature={onEachFeature} 
            />
          )}
        </MapContainer>
      </Card>

      <div className="mt-8">
        <Card className="w-auto inline-flex p-6 border-none shadow-xl shadow-stone-900/5 rounded-3xl">
          <div className="mr-8">
            <Text className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-3">Color Legend: {metric.replace('_', ' ')}</Text>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <div 
                  key={i} 
                  className="w-10 h-3 rounded-full" 
                  style={{ backgroundColor: getColor(metric === 'Literacy_Rate' ? (40 + i*10) : (40000 + i*200000)) }}
                />
              ))}
            </div>
            <Flex className="mt-2 px-1">
              <Text className="text-[10px] text-slate-400 font-bold">LOW</Text>
              <Text className="text-[10px] text-slate-400 font-bold">HIGH</Text>
            </Flex>
          </div>
        </Card>
      </div>
    </div>
  );
}
