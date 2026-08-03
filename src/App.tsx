import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AppShell } from './components/layout/AppShell';
import { Splash } from './pages/Splash';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { DesignerDashboard } from './pages/DesignerDashboard';
import { CreateCharacter } from './pages/CreateCharacter';
import { CharacterEditor } from './pages/CharacterEditor';
import { CharacterLibrary } from './pages/CharacterLibrary';
import { Viewer } from './pages/Viewer';
import { ExportCenter } from './pages/ExportCenter';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Help } from './pages/Help';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { CharacterTemplates } from './pages/admin/CharacterTemplates';
import { Reports } from './pages/admin/Reports';
import { ActivityLogs } from './pages/admin/ActivityLogs';
import { AdminSettings } from './pages/admin/AdminSettings';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/app" element={<AppShell />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DesignerDashboard />} />
            <Route path="create" element={<CreateCharacter />} />
            <Route path="editor" element={<CharacterEditor />} />
            <Route path="editor/:id" element={<CharacterEditor />} />
            <Route path="library" element={<CharacterLibrary />} />
            <Route path="viewer" element={<Viewer />} />
            <Route path="export" element={<ExportCenter />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
          </Route>

          <Route path="/admin" element={<AppShell />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="templates" element={<CharacterTemplates />} />
            <Route path="reports" element={<Reports />} />
            <Route path="logs" element={<ActivityLogs />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>);

}