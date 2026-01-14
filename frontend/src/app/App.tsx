import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/app/components/Layout/Sidebar";
import { TopBar } from "@/app/components/Layout/TopBar";
import { PipelineView } from "@/app/components/Pipeline/PipelineView";
import { DealsView } from "@/app/components/Views/DealsView";
import { ContactsView } from "@/app/components/Views/ContactsView";
import { ActivitiesView } from "@/app/components/Views/ActivitiesView";
import { InsightsView } from "@/app/components/Views/InsightsView";
import { SettingsView } from "@/app/components/Views/SettingsView";
import { LoginPage } from "@/app/components/Auth/LoginPage";
import { LoadingState } from "@/app/components/Common/LoadingState";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div className="h-screen flex bg-gray-50">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar title="Pipeline" />
                <PipelineView />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/deals"
        element={
          <ProtectedRoute>
            <div className="h-screen flex bg-gray-50">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar title="All Deals" />
                <DealsView />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/contacts"
        element={
          <ProtectedRoute>
            <div className="h-screen flex bg-gray-50">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar title="Contacts" />
                <ContactsView />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/activities"
        element={
          <ProtectedRoute>
            <div className="h-screen flex bg-gray-50">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar title="Activities" />
                <ActivitiesView />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <div className="h-screen flex bg-gray-50">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar title="Insights" />
                <InsightsView />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <div className="h-screen flex bg-gray-50">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar title="Settings" />
                <SettingsView />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
