

// import * as React from "react"
// import { NavLink } from "react-router-dom"
// import { useTranslation } from "react-i18next"
// import { ChevronDown, Server, PhoneCall, CreditCard } from "lucide-react"

// export function ServiceDropdown() {
//   const { t, i18n } = useTranslation()
//   const [isOpen, setIsOpen] = React.useState(false)
//   const dropdownRef = React.useRef<HTMLDivElement>(null)

//   React.useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [])

//   const handleMouseEnter = () => setIsOpen(true)
//   const handleClick = () => setIsOpen(!isOpen)

//   return (
//     <div ref={dropdownRef} className="relative" onMouseEnter={handleMouseEnter}>
//       <button
//         onClick={handleClick}
//         className="group relative flex items-center gap-1 px-4 py-2 font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-boxdark-2 rounded-md transition-all duration-300 ease-in-out"
//         aria-expanded={isOpen}
//         aria-haspopup="true"
//       >
//         <Server className="mr-2 text-blue-600 w-4 h-4 transition-transform duration-300 ease-in-out group-hover:scale-110" />
//         {t("header.SERVICES")}
//         <ChevronDown className="h-4 w-4 text-blue-600" />
//         <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform origin-left scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
//       </button>
//       {isOpen && (
//         <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[1000]">
//           <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
//             <NavLink
//               to={`/${i18n.language}/ourservices`}
//               className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
//               role="menuitem"
//             >
//               <Server className="mr-2 h-4 w-4 text-blue-600" />
//               {t("header.OUR_SERVICES")}
//             </NavLink>
//             <NavLink
//               to={`/${i18n.language}/buy-temp-number`}
//               className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
//               role="menuitem"
//             >
//               <PhoneCall className="mr-2 h-4 w-4 text-blue-600" />
//               {t("header.BUY_TEMP_NUMBER")}
//             </NavLink>
//             <NavLink
//               to={`/${i18n.language}/subscription-plans`}
//               className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
//               role="menuitem"
//             >
//               <CreditCard className="mr-2 h-4 w-4 text-blue-600" />
//               {t("header.SUBSCRIPTION_PLANS")}
//             </NavLink>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
import * as React from "react"
import { NavLink } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ChevronDown, Server, PhoneCall, CreditCard } from "lucide-react"

export function ServiceDropdown() {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleMouseEnter = () => setIsOpen(true)
  const handleClick = () => setIsOpen(!isOpen)
  const handleItemClick = () => setIsOpen(false)

  return (
    <div ref={dropdownRef} className="relative" onMouseEnter={handleMouseEnter}>
      <button
        onClick={handleClick}
        className="group relative flex items-center gap-1 px-4 py-2 font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-boxdark-2 rounded-md transition-all duration-300 ease-in-out"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Server className="mr-2 text-blue-600 w-4 h-4 transition-transform duration-300 ease-in-out group-hover:scale-110" />
        {t("header.SERVICES")}
        <ChevronDown className="h-4 w-4 text-blue-600" />
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform origin-left scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[1000]">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <NavLink
              to={`/${i18n.language}/ourservices`}
              className="flex items-center  px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              role="menuitem"
              onClick={handleItemClick}
            >
              <Server className="mr-2 h-4 w-4 text-blue-600" />
              {t("header.OUR_SERVICES")}
            </NavLink>
            <NavLink
              to={`/${i18n.language}/temporary-sms`}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              role="menuitem"
              onClick={handleItemClick}
            >
              <PhoneCall className="mr-2 h-4 w-4 text-blue-600" />
              {t("header.BUY_TEMP_NUMBER")}
            </NavLink>
            <NavLink
              to={`/${i18n.language}/rent-number`}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              role="menuitem"
              onClick={handleItemClick}
            >
              <PhoneCall className="mr-2 h-4 w-4 text-blue-600" />
              {t("header.RENT_NUMBER")}
            </NavLink>
            <NavLink
              to={`/${i18n.language}/subscription-plans`}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              role="menuitem"
              onClick={handleItemClick}
            >
              <CreditCard className="mr-2 h-4 w-4 text-blue-600" />
              {t("header.SUBSCRIPTION_PLANS")}
            </NavLink>
          </div>
        </div>
      )}
    </div>
  )
}


