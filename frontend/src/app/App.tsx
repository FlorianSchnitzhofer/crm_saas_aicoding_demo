import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/app/components/Layout/Sidebar";
import { TopBar } from "@/app/components/Layout/TopBar";
import { PipelineView } from "@/app/components/Pipeline/PipelineView";
import { DealsView } from "@/app/components/Views/DealsView";
import { ContactsView } from "@/app/components/Views/ContactsView";
import { ActivitiesView } from "@/app/components/Views/ActivitiesView";
import { InsightsView } from "@/app/components/Views/InsightsView";
import { SettingsView } from "@/app/components/Views/SettingsView";

export default function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex bg-gray-50">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={
              <>
                <TopBar title="Pipeline" />
                <PipelineView />
              </>
            } />
            <Route path="/deals" element={
              <>
                <TopBar title="All Deals" />
                <DealsView />
              </>
            } />
            <Route path="/contacts" element={
              <>
                <TopBar title="Contacts" />
                <ContactsView />
              </>
            } />
            <Route path="/activities" element={
              <>
                <TopBar title="Activities" />
                <ActivitiesView />
              </>
            } />
            <Route path="/insights" element={
              <>
                <TopBar title="Insights" />
                <InsightsView />
              </>
            } />
            <Route path="/settings" element={
              <>
                <TopBar title="Settings" />
                <SettingsView />
              </>
            } />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
