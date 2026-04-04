import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import GenerateSoal from './pages/GenerateSoal'
import DaftarSoal from './pages/DaftarSoal'
import EditSoal from './pages/EditSoal'
import PreviewWord from './pages/PreviewWord'
import ModulAjar from './pages/ModulAjar'
import TemplateWord from './pages/TemplateWord'
import Settings from './pages/Settings'
import Support from './pages/Support'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="soal" element={<DaftarSoal />} />
            <Route path="soal/generate" element={<GenerateSoal />} />
            <Route path="soal/edit/:id" element={<EditSoal />} />
            <Route path="soal/preview/:id" element={<PreviewWord />} />
            <Route path="modul" element={<ModulAjar />} />
            <Route path="template" element={<TemplateWord />} />
            <Route path="settings" element={<Settings />} />
            <Route path="support" element={<Support />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
