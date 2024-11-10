import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

export  default function Footer() {
  const {t,i18n} = useTranslation();
  return (
    <footer className="bg-gray-900 border bg-white dark:bg-boxdark">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">SMS App</h3>
            <p className="text-gray-300">{t("footer.Your trusted partner for secure and reliable phone number verification services.")}</p>
            <div className="flex space-x-4">
              <NavLink to={`${i18n.language}/`} className="hover:text-blue-400 transition-colors" aria-label="Facebook">
                <Facebook />
              </NavLink>
              <NavLink to={`${i18n.language}/`} className="hover:text-blue-400 transition-colors" aria-label="Twitter">
                <Twitter />
              </NavLink>
              <NavLink to={`${i18n.language}/`} className="hover:text-blue-400 transition-colors" aria-label="Instagram">
                <Instagram />
              </NavLink>
              <NavLink to={`${i18n.language}/`} className="hover:text-blue-400 transition-colors" aria-label="NavLinkedIn">
                <Linkedin />
              </NavLink>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.Quick Links")}</h4>
            <ul className="space-y-2">
              <li><NavLink to={`${i18n.language}/`} className="hover:text-blue-400 transition-colors">{t("footer.Home")}</NavLink></li>
              <li><NavLink to={`${i18n.language}/`} className="hover:text-blue-400 transition-colors">{t("footer.About Us")}</NavLink></li>
              <li><NavLink to={`${i18n.language}/`} className="hover:text-blue-400 transition-colors">{t("footer.Services")}</NavLink></li>
              <li><NavLink to={`${i18n.language}/`} className="hover:text-blue-400 transition-colors">{t("footer.Pricing")}</NavLink></li>
              <li><NavLink to={`${i18n.language}/`} className="hover:text-blue-400 transition-colors">{t("footer.Contact")}</NavLink></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.Services")}</h4>
            <ul className="space-y-2">
              <li><NavLink to={`${i18n.language}/`} className="hover:text-blue-400 transition-colors">{t("footer.SMS Verification")}</NavLink></li>
              <li><NavLink to={`${i18n.language}/`} className="hover:text-blue-400 transition-colors">{t("footer.Virtual Numbers")}</NavLink></li>
              <li><NavLink to={`${i18n.language}/`} className="hover:text-blue-400 transition-colors">{t("footer.API Integration")}</NavLink></li>
              <li><NavLink to={`${i18n.language}/`} className="hover:text-blue-400 transition-colors">{t("footer.Bulk Verification")}</NavLink></li>
              <li><NavLink to={`${i18n.language}/`} className="hover:text-blue-400 transition-colors">{t("footer.Enterprise Solutions")}</NavLink></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.Contact Us")}</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                <a href="mailto:info@smsverify.com" className="hover:text-blue-400 transition-colors">info@smsverify.com</a>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                <a href="tel:+1234567890" className="hover:text-blue-400 transition-colors">+1 (234) 567-890</a>
              </li>
              <li className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                <span>123 Verification St, Secure City, 12345</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()}{t("footer.SMSApp. All rights reserved.")}</p>
          <div className="mt-2 space-x-4">
            <NavLink to={`${i18n.language}/`} className="hover:text-blue-400 transition-colors">{t("footer.Privacy Policy")}</NavLink>
            <NavLink to={`${i18n.language}/`} className="hover:text-blue-400 transition-colors">{t("footer.Terms of Service")}</NavLink>
          </div>
        </div>
      </div>
    </footer>
  )
}