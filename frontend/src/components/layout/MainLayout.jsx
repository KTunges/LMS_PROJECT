import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './MainLayout.css';

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`main-layout ${sidebarCollapsed ? 'main-layout--collapsed' : ''}`}>
      <Sidebar isOpen={!sidebarCollapsed} onClose={() => setSidebarCollapsed(true)} />
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className="main-layout__content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
