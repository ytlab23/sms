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

  useEffect(() => {
    fetch('https://5sim.net/v1/guest/countries', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTYzOTM4OTYsImlhdCI6MTcyNDg1Nzg5NiwicmF5IjoiNjYxODEyYTM5OGQyZWFlNjY2MThkZGRlZGQ4ODUxODMiLCJzdWIiOjI2OTcyODN9.LjwOqrC_mmKS_BnVSSv4KFiBvcd11EJYBsZpjTkoh4P8vYQYgJdQ7T8dO7q8bYkZdr5pcpBxKIRMO8IhFoxaMOgHZWIzEA7Mafb6LJWyq-FsE5BM8MoNfLpfh_vHxp1iGNX2zt4Nv99Qix0lY3GvwdiiKhOu31U_9TrXD0W0EOydXDnMgeqtht8hMjfxx9uv87AGTr9up7d51S6t1flOHA92a3R9rHJI6BLttZskixQQamCPUIskD3C-gvvk0ujvLZMc8Gh94j00hcwLPMt0f6gjH7RBsyGztg0KrrBcRchJklp7C7Y1n7HXaDtW5CE9dtt9Hn0l2MLvymN0tKYQDg',
      },
    }).then((response) => {
      console.log(response);
    });
  }, []);
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
