import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { HomePage } from '@/pages/public/HomePage';
import { LookupPage } from '@/pages/public/LookupPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/lookup" element={<LookupPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
