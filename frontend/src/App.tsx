import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Dashboard } from '@/pages/Dashboard'
import { Tickets } from '@/pages/Tickets'
import { TicketDetail } from '@/pages/TicketDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="tickets/:id" element={<TicketDetail />} />
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h3 className="text-lg font-bold text-foreground">Page under construction</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  This route is part of the scaffolding and will be implemented soon.
                </p>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
