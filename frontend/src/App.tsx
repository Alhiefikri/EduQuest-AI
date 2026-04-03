import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import GenerateSoal from './pages/GenerateSoal';
import DaftarSoal from './pages/DaftarSoal';
import EditSoal from './pages/EditSoal';
import PreviewWord from './pages/PreviewWord';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="soal" element={<DaftarSoal />} />
          <Route path="soal/generate" element={<GenerateSoal />} />
          <Route path="soal/edit/:id" element={<EditSoal />} />
          <Route path="soal/preview/:id" element={<PreviewWord />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
