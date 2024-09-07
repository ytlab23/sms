// import { Link, NavLink ,useLocation} from 'react-router-dom';
// import DropdownMessage from './DropdownMessage';
// import DropdownNotification from './DropdownNotification';
// import DropdownUser from './DropdownUser';
// import LogoIcon from '../../images/logo/logo-placeholder.svg';
// import DarkModeSwitcher from './DarkModeSwitcher';
// import { Button } from '../shadcn/ui/button';
// import { Home, HelpCircle, UserPlus, LogIn } from 'lucide-react'

// const Header = (props: {
//   sidebarOpen: string | boolean | undefined;
//   setSidebarOpen: (arg0: boolean) => void;
// }) => {
//   const navItems = [
//     { name: 'HOME', href: '/', icon: Home },
//     { name: 'FAQ', href: '/faq', icon: HelpCircle },
//     { name: 'SIGN UP', href: '/auth/signup', icon: UserPlus },
//     { name: 'LOGIN', href: '/auth/signin', icon: LogIn },
//   ]
//   const location = useLocation();
//   const currentPath = location.pathname;
//   return (
//     <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
//       <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
//         <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
//           {/* <!-- Hamburger Toggle BTN --> */}
//           <button
//             aria-controls="sidebar"
//             onClick={(e) => {
//               e.stopPropagation();
//               props.setSidebarOpen(!props.sidebarOpen);
//             }}
//             className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
//           >
//             <span className="relative block h-5.5 w-5.5 cursor-pointer">
//               <span className="du-block absolute right-0 h-full w-full">
//                 <span
//                   className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
//                     !props.sidebarOpen && '!w-full delay-300'
//                   }`}
//                 ></span>
//                 <span
//                   className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
//                     !props.sidebarOpen && 'delay-400 !w-full'
//                   }`}
//                 ></span>
//                 <span
//                   className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
//                     !props.sidebarOpen && '!w-full delay-500'
//                   }`}
//                 ></span>
//               </span>
//               <span className="absolute right-0 h-full w-full rotate-45">
//                 <span
//                   className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
//                     !props.sidebarOpen && '!h-0 !delay-[0]'
//                   }`}
//                 ></span>
//                 <span
//                   className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
//                     !props.sidebarOpen && '!h-0 !delay-200'
//                   }`}
//                 ></span>
//               </span>
//             </span>
//           </button>
//           {/* <!-- Hamburger Toggle BTN --> */}

//           <Link className="block flex-shrink-0 lg:hidden" to="/">
//             <img className='h-6' src={LogoIcon} alt="Logo" />
//           </Link>
//         </div>

//         <div className="hidden sm:block">
       
//         </div>
       
//         <ul className="mt-4 mb-5.5 hidden lg:flex gap-2 pl-6">
//       {navItems.map((item) => (
//         <li key={item.name}>
//           <NavLink
//             to={item.href}
//             className={`group relative flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-all duration-300 ease-in-out
//               ${currentPath === item.href
//                 ? 'text-blue-600 bg-blue-100 dark:bg-boxdark-2'
//                 : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-boxdark-2'
//               }`}
//           >
//             <item.icon className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:scale-110" />
//             <span className="relative">
//               {item.name}
//               <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform origin-left scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
//             </span>
//           </NavLink>
//         </li>
//       ))}
//     </ul>
//         <div className="flex items-center gap-3 2xsm:gap-7">
//           <ul className="flex items-center align-middle gap-2 2xsm:gap-4">
//             {/* <!-- Dark Mode Toggler --> */}

//             <DarkModeSwitcher />
            
//           </ul>

//           {/* <!-- User Area --> */}
//           <DropdownUser />
//           {/* <!-- User Area --> */}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import { Link, NavLink, useLocation,useNavigate } from 'react-router-dom';
import DropdownUser from './DropdownUser';
import LogoIcon from '../../images/logo/logo-placeholder.svg';
import DarkModeSwitcher from './DarkModeSwitcher';
import { Button } from '../shadcn/ui/button';
import { Home, HelpCircle, UserPlus, LogIn, ShoppingBag, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/authContext';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const { currentUser } = useAuth(); // Get the current user from AuthContext
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate(); 
  // Navigation items visible to all users
  const commonNavItems = [
    { name: 'HOME', href: '/', icon: Home },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
    { name: 'HOW TO BUY', href: '/howtobuy', icon: BookOpen }, // New common navigation item
  ];

  // Navigation items for unauthenticated users
  const guestNavItems = [
    { name: 'SIGN UP', href: '/auth/signup', icon: UserPlus },
    { name: 'LOGIN', href: '/auth/signin', icon: LogIn },
  ];

  // Navigation items for authenticated users
  const authNavItems = [
    { name: 'YOUR ORDERS', href: '/orders', icon: ShoppingBag }, // New authenticated navigation item
  ];

  // Combine navigation items based on user authentication status
  const navItems = currentUser ? [...commonNavItems, ...authNavItems] : [...commonNavItems, ...guestNavItems];

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* Hamburger Toggle BTN */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!w-full delay-300'
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && 'delay-400 !w-full'
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!w-full delay-500'
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!h-0 !delay-[0]'
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!h-0 !delay-200'
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* Hamburger Toggle BTN */}

          <Link className="block flex-shrink-0 lg:hidden" to="/">
            <img className="h-6" src={LogoIcon} alt="Logo" />
          </Link>
        </div>

        <ul className="mt-4 mb-5.5 hidden lg:flex gap-2 pl-6">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={`group relative flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-all duration-300 ease-in-out
              ${
                currentPath === item.href
                  ? 'text-blue-600 bg-blue-100 dark:bg-boxdark-2'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-boxdark-2'
              }`}
              >
                <item.icon className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:scale-110" />
                <span className="relative">
                  {item.name}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform origin-left scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
                </span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center align-middle gap-2 2xsm:gap-4">
            {/* Dark Mode Toggler */}
            <DarkModeSwitcher />
          </ul>

          {/* Show user dropdown only if logged in */}
          {currentUser && <DropdownUser />}
        </div>
      </div>
    </header>
  );
};

export default Header;
