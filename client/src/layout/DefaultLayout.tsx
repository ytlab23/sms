import React, { useState, ReactNode } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';
import { Input } from '../components/shadcn/ui/input';
import { Button } from '../components/shadcn/ui/button';
import { ChooseService } from '../components/shadcn/chooseservice';
import ActionSidebar from '../components/ActionSideBar';
import Footer from '../components/shadcn/footer';
import { Toaster } from '../components/shadcn/ui/toaster';
import { Outlet } from 'react-router-dom';
import FreeNumberBanner from '../pages/FreePage/freepage';

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <div className="block lg:hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /></div>
        {/* <!-- ===== Sidebar End ===== --> */}
        <ActionSidebar actionSidebarOpen={false} setActionSidebarOpen={function (arg: boolean): void {
          throw new Error('Function not implemented.');
        } }></ActionSidebar>

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <FreeNumberBanner></FreeNumberBanner>
            {/* <ActionSidebar actionSidebarOpen={false} setActionSidebarOpen={function (arg: boolean): void {
          throw new Error('Function not implemented.');
        } }></ActionSidebar> */}
        
        <Outlet />
            </div>
           <Footer></Footer>

          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
{/* <Toaster></Toaster> */}
      </div> 
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default DefaultLayout;
