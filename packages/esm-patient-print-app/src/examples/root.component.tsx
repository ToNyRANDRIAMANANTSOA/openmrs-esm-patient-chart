import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PatientPrintApp from './patient-print-app.component';

const Root: React.FC = () => (
  <BrowserRouter basename={window.getOpenmrsSpaBase()}>
    <Routes>
      <Route path="patient-print-app" element={<PatientPrintApp />} />
    </Routes>
  </BrowserRouter>
);

export default Root;
