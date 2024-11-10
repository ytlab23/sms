import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';

import { loadStripe } from '@stripe/stripe-js';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';

import MainPage from './pages/MainPage/MainPage';

import Settings from './pages/Settings';

import DefaultLayout from './layout/DefaultLayout';
import { FaqSection } from './components/shadcn/faqsection';
import Faq from './pages/Faq/Faq';
import { AuthProvider } from './contexts/authcontext';
import ProtectedRoute from './contexts/ProtectedRoute';
import HowToBuy from './pages/HowToBuy/HowToBuy';
import OrdersPage from './pages/Orders/OrdersPage';
import PaymentForm from './pages/payment/paymentform';
import Sms from './components/shadcn/sms';
import SmsPage from './pages/sms/smspage';
import AdminPage from './pages/admin/AdminPage';
import AdminProtectedRoute from './contexts/AdminProtectedRoute';
import StatsPage from './pages/statistics/statistics';
import FreeNumberPage from './pages/FreePage/freepage';
import PaymentFailure from './components/shadcn/payment-failure';
import PaymentSuccess from './components/shadcn/payment-success';
import InternalPagesShowcase from './components/shadcn/our-services';
import InternalPage from './components/shadcn/services';
import AdminInternalPageCreator from './components/shadcn/internalpagecreator';
import AdminLayout from './layout/AdminLayout';
import InternalPagesList from './components/shadcn/edit-delete-pages';
import AddCountries from './components/shadcn/admin/add-country';
import CountryServicePrices from './components/shadcn/admin/set-country-service-price';
import ServicesMenu from './components/shadcn/admin/services';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from './components/shadcn/ui/card';
import { ScrollArea } from './components/shadcn/ui/scrollarea';
import NotFound from './components/shadcn/404';
import { Divide } from 'lucide-react';
import useChangeLanguageAndPath from './i18n/language-setter';
import { useTranslation } from 'react-i18next';
// Load your Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function App() {
  const {t,i18n} = useTranslation();
  const navigate = useNavigate();
  const faqPath = `/:lang?/${t('urls.faq')}`;
  const faqTitle = `${t('app.Faq')}`;
  const payPath = `/:lang?/${t('urls.pay')}`;
  const payTitle = `${t('app.Pay')}`;
  const statPath = `/:lang?/${t('urls.statistics')}`;
  const statTitle = `${t('app.Statistics')}`;
  const ourServicesPath = `/:lang?/${t('urls.ourservices')}`;
  const ourServicesTitle = `${t('app.Our Services')}`;
  const settingsPath = `/:lang?/${t('urls.settings')}`;
  const settingsTitle = `${t('app.Account Settings')}`; 
  const ordersPath = `/:lang?/${t('urls.orders')}`;
  const ordersTitle = `${t('app.Your Orders')}`;
  const signInPath = `/:lang?/${t('urls.auth/signin')}`;
  const signInTitle = `${t('app.Sign In')}`;
  const signUpPath = `/:lang?/${t('urls.auth/signup')}`;
  const signUpTitle = `${t('app.Sign Up')}`;
  const HowToBuyPath = `/:lang?/${t('urls.howtobuy')}`;
  const HowToBuyTitle = `${t('app.How to Buy')}`;
  const smsPath = `/:lang?/${t('urls.sms')}`;
  const smsTitle = `${t('app.Your SMS')}`;
  
  useEffect(() => {
    const currentLanguage = i18n.language; // This gets the current language from i18n

    if (currentLanguage) {
      // Wait until the language is set and then update the URL
      const url = `/${currentLanguage}${window.location.pathname.replace(/^\/[a-z]{2}/, '')}`;
      // Ensure that the URL is updated without triggering an infinite redirect
      if (window.location.pathname !== url) {
        console.log("url", url)
        navigate(url); // Update the URL to reflect the correct language
      }
    }
  }, []); // This effect runs whenever i18n.language changes


  // Example language switcher
  const changeLanguageAndPath = useChangeLanguageAndPath();

  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <AuthProvider>
      <Routes>
        <Route element={<DefaultLayout children={undefined} />}>
          <Route
            path="/:lang?"
            element={
              <>
                <PageTitle title="Home | SMSApp" />
                <MainPage />
              </>
            }
          />
          <Route
            path={payPath}
            element={
              <Elements stripe={stripePromise}>
                <ProtectedRoute>
                  <div>
                    <PageTitle title={`${payTitle}  | SMSApp`} />
                    <PaymentForm />
                  </div>
                </ProtectedRoute>
              </Elements>
            }
          />
              {/* <Route path={faqPath} element={<Faq />} /> */}

          <Route
            path={faqPath}
            element={
              <>
                <PageTitle title={`${faqTitle} | SMS App`} />
                <Faq />
              </>
            }
          />
          <Route
            path={statPath}
            element={
              <>
                <PageTitle title={`${statTitle} | SMS App`} />
                <StatsPage />
              </>
            }
          />
          <Route
            path="/:lang?/paymentfailure"
            element={
              <>
                <ProtectedRoute>
                  <>
                    <PageTitle title="Payment Failure | SMS App" />
                    <PaymentFailure />
                  </>
                </ProtectedRoute>
              </>
            }
          />
          <Route
            path="/:lang?/paymentsuccess"
            element={
              <>
                <ProtectedRoute>
                  <>
                    <PageTitle title="Payment Success | SMS App" />
                    <PaymentSuccess />
                  </>
                </ProtectedRoute>
              </>
            }
          />
          <Route
            path={ourServicesPath}
            element={
              <>
                <PageTitle title={`${ourServicesTitle} | SMS App`} />
                <InternalPagesShowcase />
              </>
            }
          />
          {/* <Route
            path="/internalpages"
            element={
              <>
                <PageTitle title="InternalPage | SMS App" />
                <InternalPage />
              </>
            }
          /> */}

          {/* <Route
            path="/internalpagesadmin"
            element={
              <>
                <PageTitle title="InternalPage Admin | SMS App" />
                <AdminInternalPageCreator />
              </>
            }
          /> */}
          {/* <Route
            path="/freenumber"
            element={
              <>
                <PageTitle title="Free Number | SMS App" />
                <FreeNumberPage />
              </>
            }
          /> */}
          <Route
            path={settingsPath}
            element={
              <ProtectedRoute>
                <>
                  <PageTitle title={`${settingsTitle} | SMS App`} />
                  <Settings />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path={ordersPath}
            element={
              <ProtectedRoute>
                <>
                  <PageTitle title={`${ordersTitle} | SMS App`} />
                  <OrdersPage />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path={signInPath}
            element={
              <>
                <PageTitle title={`${signInTitle} | SMS App`} />
                <SignIn />
              </>
            }
          />
          <Route
            path={signUpPath}
            element={
              <>
                <PageTitle title={`${signUpTitle} | SMS App`} />
                <SignUp />
              </>
            }
          />
          <Route
            path={HowToBuyPath}
            element={
              <>
                <PageTitle title={`${HowToBuyTitle} | SMS App`} />
                <HowToBuy />
              </>
            }
          />
          <Route
            path={smsPath}
            element={
              <ProtectedRoute>
                <>
                  <PageTitle title={`${smsTitle} | SMS App`} />
                  <SmsPage />
                </>
              </ProtectedRoute>
            }
          />
          <Route path="/:slug" element={
            <>
            <PageTitle title="Service | SMS App" />
            <InternalPage />
            </>
            } />
        </Route>
        <Route
          element={
            <AdminLayout
              children={
                <AdminProtectedRoute>
                  <></>
                </AdminProtectedRoute>
              }
            />
          }
        >
          {/* <Route
            path="/admin382013453sms"
            element={
              <AdminProtectedRoute>
                <>
                  <PageTitle title="Admin | SMS App" />
                  <div className="mx-7">
                    <Card className="bg-white/10 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-white/20 backdrop-blur-lg">
                      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6">
                        <CardTitle className="text-2xl font-bold">
                          Create  Internal Pages
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                          <AdminInternalPageCreator></AdminInternalPageCreator>
                      </CardContent>
                    </Card>
                  </div>
                </>
              </AdminProtectedRoute>
            }
          /> */}
          <Route
            path="/admin382013453sms/setup"
            element={
              <AdminProtectedRoute>
                <>
                  <PageTitle title="Admin | SMS App" />
                  <div className="mx-7">
                    <Card className="bg-white/10 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-white/20 backdrop-blur-lg">
                      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6">
                        <CardTitle className="text-2xl font-bold">
                          Admin Setup
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <AdminPage />
                      </CardContent>
                    </Card>
                  </div>
                </>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin382013453sms/edit/:slug"
            element={
              <AdminProtectedRoute>
                <>
                  <PageTitle title="Admin Edit | SMS App" />
                  {/* <InternalPagesList></InternalPagesList> */}
                  <div className="mx-7">
                    <Card className="bg-white/10 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-white/20 backdrop-blur-lg">
                      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6">
                        <CardTitle className="text-2xl font-bold">
                          Update Internal Pages
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        {/* <ScrollArea className="h-[calc(100vh-300px)]"> */}
                        <AdminInternalPageCreator></AdminInternalPageCreator>
                        {/* </ScrollArea> */}
                      </CardContent>
                    </Card>
                  </div>
                </>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin382013453sms/edit"
            element={
              <AdminProtectedRoute>
                <>
                  <PageTitle title="Admin Edit | SMS App" />

                  <div className="mx-7">
                    <Card className="bg-white/10 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-white/20 backdrop-blur-lg">
                      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6">
                        <CardTitle className="text-2xl font-bold">
                          Manage Internal Pages
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        {/* <ScrollArea className="h-[calc(100vh-300px)]"> */}
                        <InternalPagesList></InternalPagesList>{' '}
                        {/* </ScrollArea> */}
                      </CardContent>
                    </Card>
                  </div>
                </>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin382013453sms/add"
            element={
              <AdminProtectedRoute>
                <>
                  <PageTitle title="Admin Edit | SMS App" />{' '}
                  <div className="mx-7">
                    <Card className="bg-white/10 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-white/20 backdrop-blur-lg">
                      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6">
                        <CardTitle className="text-2xl font-bold">
                          Create Internal Pages
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <AdminInternalPageCreator></AdminInternalPageCreator>
                      </CardContent>
                    </Card>
                  </div>
                </>
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin382013453sms/edit-country"
            element={
              <AdminProtectedRoute>
                <>
                  <PageTitle title="Edit Country | SMS App" />{' '}
                  <div className="mx-7">
                    <Card className="bg-white/10 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-white/20 backdrop-blur-lg">
                      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6">
                        <CardTitle className="text-2xl font-bold">
                          Manage Countries
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        {/* <ScrollArea className="h-[calc(100vh-250px)]"> */}
                        <AddCountries
                          key={`add-countries-${refreshKey}`}
                          onCountryChange={handleRefresh}
                        />
                        {/* </ScrollArea> */}
                      </CardContent>
                    </Card>
                  </div>
                </>
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin382013453sms/country-service-pricing"
            element={
              <AdminProtectedRoute>
                <>
                  <PageTitle title="Country Service Pricing | SMS App" />
                  <div className="mx-7">
                    <Card className="bg-white/10 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-white/20 backdrop-blur-lg">
                      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6">
                        <CardTitle className="text-2xl font-bold">
                          Country Service Pricing
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        {/* <ScrollArea className="h-[calc(100vh-250px)]"> */}
                        <CountryServicePrices
                          key={`country-service-prices-${refreshKey}`}
                        />
                        {/* </ScrollArea> */}
                      </CardContent>
                    </Card>
                  </div>
                </>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin382013453sms/edit-services"
            element={
              <AdminProtectedRoute>
                <>
                  <PageTitle title="Edit Services | SMS App" />{' '}
                  <div className="mx-7">
                    <Card className="bg-white/10 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-white/20 backdrop-blur-lg">
                      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6">
                        <CardTitle className="text-2xl font-bold">
                          Manage Services
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        {/* <ScrollArea className="h-[calc(100vh-250px)]"> */}
                        <ServicesMenu
                          key={`services-menu-${refreshKey}`}
                        />{' '}
                        {/* </ScrollArea> */}
                      </CardContent>
                    </Card>
                  </div>
                </>
              </AdminProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/:lang?/404"
          element={
            <div>
              <PageTitle title="404 | SMS App" />
              <NotFound />
            </div>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
