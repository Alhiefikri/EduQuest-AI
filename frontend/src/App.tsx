import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
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

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: 'soal', element: <DaftarSoal /> },
        { path: 'soal/generate', element: <GenerateSoal /> },
        { path: 'soal/edit/:id', element: <EditSoal /> },
        { path: 'soal/preview/:id', element: <PreviewWord /> },
        { path: 'modul', element: <ModulAjar /> },
        { path: 'template', element: <TemplateWord /> },
        { path: 'settings', element: <Settings /> },
        { path: 'support', element: <Support /> },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
)

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  )
}
