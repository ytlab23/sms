import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom';

export  default function Footer() {
  return (
    <footer className="bg-gray-900 border bg-white dark:bg-boxdark">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">SMS App</h3>
            <p className="text-gray-300">Your trusted partner for secure and reliable phone number verification services.</p>
            <div className="flex space-x-4">
              <NavLink to="/" className="hover:text-blue-400 transition-colors" aria-label="Facebook">
                <Facebook />
              </NavLink>
              <NavLink to="/" className="hover:text-blue-400 transition-colors" aria-label="Twitter">
                <Twitter />
              </NavLink>
              <NavLink to="/" className="hover:text-blue-400 transition-colors" aria-label="Instagram">
                <Instagram />
              </NavLink>
              <NavLink to="/" className="hover:text-blue-400 transition-colors" aria-label="NavLinkedIn">
                <Linkedin />
              </NavLink>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><NavLink to="/" className="hover:text-blue-400 transition-colors">Home</NavLink></li>
              <li><NavLink to="/" className="hover:text-blue-400 transition-colors">About Us</NavLink></li>
              <li><NavLink to="/" className="hover:text-blue-400 transition-colors">Services</NavLink></li>
              <li><NavLink to="/" className="hover:text-blue-400 transition-colors">Pricing</NavLink></li>
              <li><NavLink to="/" className="hover:text-blue-400 transition-colors">Contact</NavLink></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><NavLink to="/" className="hover:text-blue-400 transition-colors">SMS Verification</NavLink></li>
              <li><NavLink to="/" className="hover:text-blue-400 transition-colors">Virtual Numbers</NavLink></li>
              <li><NavLink to="/" className="hover:text-blue-400 transition-colors">API Integration</NavLink></li>
              <li><NavLink to="/" className="hover:text-blue-400 transition-colors">Bulk Verification</NavLink></li>
              <li><NavLink to="/" className="hover:text-blue-400 transition-colors">Enterprise Solutions</NavLink></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
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
          <p>&copy; {new Date().getFullYear()} SMSVerify. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <NavLink to="/" className="hover:text-blue-400 transition-colors">Privacy Policy</NavLink>
            <NavLink to="/" className="hover:text-blue-400 transition-colors">Terms of Service</NavLink>
          </div>
        </div>
      </div>
    </footer>
  )
}