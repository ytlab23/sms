
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Edit, PlusCircle, DollarSign, Globe2, Globe } from 'lucide-react';
import Logo from '../../../public/smsapp.svg';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const pagesNavItems = [
    { name: 'Setup', href: '/admin382013453sms/setup', icon: DollarSign },
    { name: 'Add Page', href: '/admin382013453sms/add', icon: PlusCircle },
    { name: 'Edit Page', href: '/admin382013453sms/edit', icon: Edit },
  ];
  const pricingNavItems = [
    { name: 'Add Country', href: '/admin382013453sms/edit-country', icon: PlusCircle },
    { name: 'Edit Plans', href: '/admin382013453sms/edit-plans', icon: Edit },
    { name: 'Country-Service Pricing', href: '/admin382013453sms/country-service-pricing', icon: Globe },
    { name: 'Edit Services', href: '/admin382013453sms/edit-services', icon: DollarSign },
    { name: 'Rent Pricing', href: '/admin382013453sms/set-rent-pricing', icon: Globe2 },
  ];

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <div className="flex items-center justify-between gap-2">
          <NavLink to="/" className="flex items-center gap-2">
            <img className="h-8" src={Logo} alt="Logo" />
            <h1 className="font-bold text-3xl text-blue-600">SmsApp</h1>
          </NavLink>
        </div>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden text-whiten"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6 text-whiten">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              PAGES MENU
            </h3>
            <ul className="mt-4 mb-5.5 border-b lg:flex flex-col gap-2 pl-6">
              {pagesNavItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    onClick={() => {
                      setSidebarOpen(false);
                    }}
                    to={item.href}
                    className={`group relative flex items-center gap-2 mb-2 rounded-md px-4 py-2 font-medium transition-all duration-300 ease-in-out
                      ${
                        pathname === item.href
                          ? 'text-blue-600 bg-blue-100 dark:bg-boxdark-2'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-boxdark-2'
                      }`}
                  >
                    <item.icon className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:scale-110" />
                    <span className="relative ">
                      {item.name}
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform origin-left scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              PRICING MENU
            </h3>
            <ul className="mt-4 mb-5.5 border-b lg:flex flex-col gap-2 pl-6">
              {pricingNavItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    onClick={() => {
                      setSidebarOpen(false);
                    }}
                    to={item.href}
                    className={`group relative flex items-center gap-2 mb-2 rounded-md px-4 py-2 font-medium transition-all duration-300 ease-in-out
                      ${
                        pathname === item.href
                          ? 'text-blue-600 bg-blue-100 dark:bg-boxdark-2'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-boxdark-2'
                      }`}
                  >
                    <item.icon className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:scale-110" />
                    <span className="relative ">
                      {item.name}
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform origin-left scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default AdminSidebar;
