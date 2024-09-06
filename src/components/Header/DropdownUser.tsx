import { useState } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import UserOne from '../../images/user/user-01.png';
import { CreditDisplay } from '../shadcn/creditdisplay';
import { Settings, LogOut, ChevronRight } from 'lucide-react'
const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="">
       <CreditDisplay credit={0}></CreditDisplay>   
        </span>

        <span className="h-12 w-12 rounded-full bg-gray dark:bg-boxdark-2">
          {/* <img src={UserOne} alt="User" /> */}
        </span>

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* <!-- Dropdown Start --> */}
      {dropdownOpen && (
       <div className="absolute right-0 mt-4 w-64 flex flex-col rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-102">
       <ul className="flex flex-col border-b border-gray-200 dark:border-gray-700">
         <li>
           <Link
             to="/settings"
             className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-300 ease-in-out hover:bg-blue-50  dark:hover:bg-boxdark-2 group"
             onClick={() => setDropdownOpen(false)}
             onMouseEnter={() => setHoveredItem('settings')}
             onMouseLeave={() => setHoveredItem(null)}
           >
             <Settings className={`w-5 h-5 transition-colors duration-300 ${hoveredItem === 'settings' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
             <span className="flex-grow">Account Settings</span>
             <ChevronRight className={`w-5 h-5 transition-all duration-300 ${hoveredItem === 'settings' ? 'opacity-100 translate-x-0 text-blue-600 dark:text-blue-400' : 'opacity-0 -translate-x-2 text-gray-400'}`} />
           </Link>
         </li>
       </ul>
       <button
         className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-300 ease-in-out hover:bg-red-50 dark:hover:bg-red-900/30 group w-full text-left"
         onClick={() => setDropdownOpen(false)}
         onMouseEnter={() => setHoveredItem('logout')}
         onMouseLeave={() => setHoveredItem(null)}
       >
         <LogOut className={`w-5 h-5 transition-colors duration-300 ${hoveredItem === 'logout' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`} />
         <span className="flex-grow">Log Out</span>
         <ChevronRight className={`w-5 h-5 transition-all duration-300 ${hoveredItem === 'logout' ? 'opacity-100 translate-x-0 text-red-600 dark:text-red-400' : 'opacity-0 -translate-x-2 text-gray-400'}`} />
       </button>
     </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
