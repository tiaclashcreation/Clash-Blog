import React from 'react';
import { Outlet } from 'react-router-dom';

const AppWrapper: React.FC = () => {
  return (
    <div className="app-wrapper">
      <Outlet />
    </div>
  );
};

export default AppWrapper; 