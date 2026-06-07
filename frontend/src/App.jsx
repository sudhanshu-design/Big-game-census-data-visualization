import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import StatesExplorer from './pages/StatesExplorer';
import TrendsPage from './pages/TrendsPage';
import ComparisonPage from './pages/ComparisonPage';
import DistrictDeepDive from './pages/DistrictDeepDive';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F5F0E6]">
        <Sidebar />
        <div className="flex flex-col flex-1 lg:ml-60">
          <Navbar />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/states" element={<StatesExplorer />} />
              <Route path="/trends" element={<TrendsPage />} />
              <Route path="/compare" element={<ComparisonPage />} />
              <Route path="/districts" element={<DistrictDeepDive />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
