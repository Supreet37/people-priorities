import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import { CitizenLogin, CitizenRegister } from './pages/auth/CitizenLogin'; 
import MPLogin from './pages/auth/MPLogin';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import SubmitComplaint from './pages/citizen/SubmitComplaint';
import MyComplaints from './pages/citizen/MyComplaints';
import SchemesView from './pages/citizen/SchemesView';
import MPOverview from './pages/mp/MPOverview';
import MPHeatmap from './pages/mp/MPHeatmap';
import MPSubmissions from './pages/mp/MPSubmissions';
import MPRankings from './pages/mp/MPRankings';
import MPSchemesManager from './pages/mp/MPSchemesManager';
import MPReports from './pages/mp/MPReports';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login/citizen" element={<CitizenLogin />} />
          <Route path="/register" element={<CitizenRegister />} />
          <Route path="/login/mp" element={<MPLogin />} />
          
          {/* Citizen Routes */}
          <Route element={<ProtectedRoute role="citizen" />}>
            <Route path="/citizen" element={<CitizenDashboard />} />
            <Route path="/citizen/submit" element={<SubmitComplaint />} />
            <Route path="/citizen/my-complaints" element={<MyComplaints />} />
            <Route path="/citizen/schemes" element={<SchemesView />} />
          </Route>
          
          {/* MP Routes */}
          <Route element={<ProtectedRoute role="mp" />}>
            <Route path="/mp/dashboard" element={<MPOverview />} />
            <Route path="/mp/map" element={<MPHeatmap />} />
            <Route path="/mp/submissions" element={<MPSubmissions />} />
            <Route path="/mp/rankings" element={<MPRankings />} />
            <Route path="/mp/schemes" element={<MPSchemesManager />} />
            <Route path="/mp/reports" element={<MPReports />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
