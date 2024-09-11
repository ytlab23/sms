import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../images/logo/logo-placeholder.svg';
import Buttons from '../../pages/UiElements/Buttons';
import SelectGroupOne from '../Forms/SelectGroup/SelectGroupOne';
import SelectGroupTwo from '../Forms/SelectGroup/SelectGroupTwo';
import MultiSelect from '../Forms/MultiSelect';
import { ChooseService } from '../shadcn/chooseservice';

interface ActionSidebarProps {
  actionSidebarOpen: boolean;
  setActionSidebarOpen: (arg: boolean) => void;
}

const ActionSidebar = ({
  actionSidebarOpen,
  setActionSidebarOpen,
}: ActionSidebarProps) => {
  const actionLocation = useLocation();
  const { pathname } = actionLocation;

  const trigger = useRef<any>(null);
  const actionSidebar = useRef<any>(null);
  

    
  return (
    <aside
      ref={actionSidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-white dark:bg-boxdark   lg:static lg:translate-x-0 lg:w-125 ${
        actionSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:rounded-none lg:shadow-none rounded-lg shadow-lg ${
        window.innerWidth < 1024 ? 'bg-white p-4' : ''
      }`}
    >
      {/* <!-- ASIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img className="h-12" src={Logo} alt="Logo" />
          {/* <h1 className='font-bold text-xl '>SMS VERIFICATION</h1> */}
        </NavLink>
      </div>
      {/* <!-- ASIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear p-6">
        <div className="h-auto">
          <ChooseService></ChooseService>
          {/* <MultiSelect id='singleselect2'></MultiSelect> */}
        </div>

        {/* <!-- Action Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default ActionSidebar;
