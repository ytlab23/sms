

import React, { useState, ReactNode } from 'react';

import { Toaster } from '../components/shadcn/ui/toaster';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/Sidebar/admin-sidebar';

const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <div className="block ">
        {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
        
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}></AdminSidebar>
        </div>
        {/* <!-- ===== Sidebar End ===== --> */}
       

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          {/* <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
          {/* <!-- ===== Header End ===== --> */}
          {/* <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}></AdminHeader> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {/* <ActionSidebar actionSidebarOpen={false} setActionSidebarOpen={function (arg: boolean): void {
          throw new Error('Function not implemented.');
        } }></ActionSidebar> */}
        
             
            </div>
           
            <Outlet />

          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
<Toaster></Toaster>
      </div> 
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default AdminLayout;
