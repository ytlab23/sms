import { useEffect, useState } from 'react';
import {
  Route,
  Routes,
  useLocation,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';

import { loadStripe } from '@stripe/stripe-js';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Contact from './pages/Contact/Contact';

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
import { Divide, Subscript } from 'lucide-react';
import useChangeLanguageAndPath from './i18n/language-setter';
import { useTranslation } from 'react-i18next';
import Subscription from './pages/subscription/subscriptionPage';
import AdminSubscriptionPlans from './components/shadcn/admin/set-subscription';
import TempNumberLandingPage from './components/shadcn/TempNumberLandingPage';
import RentNumberPricing from './components/shadcn/admin/set-renting-price';
import RentNumber from './components/shadcn/buy-service/rentNumber';
// Load your Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function App() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const faqPath = `/:lang?/faq`;
  const faqTitle = `${t('app.Faq')}`;
  const payPath = `/:lang?/pay`;
  const payTitle = `${t('app.Pay')}`;
  const statPath = `/:lang?/statistics`;
  const statTitle = `${t('app.Statistics')}`;
  const ourServicesPath = `/:lang?/ourservices`;
  const ourServicesTitle = `${t('app.Our Services')}`;
  const settingsPath = `/:lang?/settings`;
  const settingsTitle = `${t('app.Account Settings')}`;
  const ordersPath = `/:lang?/orders`;
  const ordersTitle = `${t('app.Your Orders')}`;
  const signInPath = `/:lang?/auth/signin`;
  const signInTitle = `${t('app.Sign In')}`;
  const signUpPath = `/:lang?/auth/signup`;
  const signUpTitle = `${t('app.Sign Up')}`;
  const HowToBuyPath = `/:lang?/howtobuy`;
  const HowToBuyTitle = `${t('app.How to Buy')}`;
  const smsPath = `/:lang?/sms`;
  const smsTitle = `${t('app.Your SMS')}`;

  const temporySms = '/:lang?/temporary-sms';
  const temporySmsTitle = `${t('app.Buy Temporary SMS')}`;

  const subscriptionPath = `/:lang?/subscription-plans`;
  const subscriptionTitle = `${t('app.Subscription')}`;
  const rentingPath = `/:lang?/rent-number`;
  const rentingTitle = `${t('app.Rent Number')}`;

  const adminSetupPath = `/admin382013453sms/setup`;
  const contactPath = `/:lang?/contact`;
  const contactTitle = `${t('app.Contact Us')}`;

  // useEffect(() => {
  //   const currentLanguage = i18n.language;
  //   const pathLanguage = location.pathname.split('/')[1];

  //   // Check if the path language is different from the current language
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

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
                <PageTitle title="Home | SMSApp" lang={i18n.language} />
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
                    <PageTitle
                      title={`${payTitle}  | SMSApp`}
                      lang={i18n.language}
                    />
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
                <PageTitle
                  title={`${faqTitle} | SMS App`}
                  lang={i18n.language}
                />
                <Faq />
              </>
            }
          />
          <Route
            path={temporySms}
            element={
              <>
                <PageTitle
                  title={`${temporySmsTitle} | SMS App`}
                  lang={i18n.language}
                />
                <TempNumberLandingPage></TempNumberLandingPage>
              </>
            }
          />
          <Route
            path={subscriptionPath}
            element={
              <>
                <PageTitle
                  title={`${subscriptionTitle} | SMS App`}
                  lang={i18n.language}
                />
                <Subscription />
              </>
            }
          />
          <Route
            path={rentingPath}
            element={
              <>
                <PageTitle
                  title={`${rentingTitle} | SMS App`}
                  lang={i18n.language}
                />
                <RentNumber></RentNumber>
              </>
            }
          />
          <Route
            path={statPath}
            element={
              <>
                <PageTitle
                  title={`${statTitle} | SMS App`}
                  lang={i18n.language}
                />
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
                    <PageTitle
                      title="Payment Failure | SMS App"
                      lang={i18n.language}
                    />
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
                    <PageTitle
                      title="Payment Success | SMS App"
                      lang={i18n.language}
                    />
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
                <PageTitle
                  title={`${ourServicesTitle} | SMS App`}
                  lang={i18n.language}
                />
                <InternalPagesShowcase />
              </>
            }
          />

          <Route
            path={settingsPath}
            element={
              <ProtectedRoute>
                <>
                  <PageTitle
                    title={`${settingsTitle} | SMS App`}
                    lang={i18n.language}
                  />
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
                  <PageTitle
                    title={`${ordersTitle} | SMS App`}
                    lang={i18n.language}
                  />
                  <OrdersPage />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path={signInPath}
            element={
              <>
                <PageTitle
                  title={`${signInTitle} | SMS App`}
                  lang={i18n.language}
                />
                <SignIn />
              </>
            }
          />
          <Route
            path={signUpPath}
            element={
              <>
                <PageTitle
                  title={`${signUpTitle} | SMS App`}
                  lang={i18n.language}
                />
                <SignUp />
              </>
            }
          />
          <Route
            path={HowToBuyPath}
            element={
              <>
                <PageTitle
                  title={`${HowToBuyTitle} | SMS App`}
                  lang={i18n.language}
                />
                <HowToBuy />
              </>
            }
          />
          <Route
            path={smsPath}
            element={
              <ProtectedRoute>
                <>
                  <PageTitle
                    title={`${smsTitle} | SMS App`}
                    lang={i18n.language}
                  />
                  <SmsPage />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path={contactPath}
            element={
              <>
                <PageTitle
                  title={`${contactTitle} | SMS App`}
                  lang={i18n.language}
                />
                <Contact />
              </>
            }
          />
          <Route
            path="/:lang?/:slug"
            element={
              <>
                <PageTitle title="Service | SMS App" lang={i18n.language} />
                <InternalPage />
              </>
            }
          />
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
          <Route
            path={adminSetupPath}
            element={
              <AdminProtectedRoute>
                <>
                  <PageTitle title="Admin | SMS App" lang={i18n.language} />
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
                  <PageTitle
                    title="Admin Edit | SMS App"
                    lang={i18n.language}
                  />
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
                  <PageTitle
                    title="Admin Edit | SMS App"
                    lang={i18n.language}
                  />

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
                  <PageTitle
                    title="Admin Edit | SMS App"
                    lang={i18n.language}
                  />{' '}
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
                  <PageTitle
                    title="Edit Country | SMS App"
                    lang={i18n.language}
                  />{' '}
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
                  <PageTitle
                    title="Country Service Pricing | SMS App"
                    lang={i18n.language}
                  />
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
                  <PageTitle
                    title="Edit Services | SMS App"
                    lang={i18n.language}
                  />{' '}
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
          <Route
            path="/admin382013453sms/edit-plans"
            element={
              <AdminProtectedRoute>
                <>
                  <PageTitle
                    title="Edit Plans | SMS App"
                    lang={i18n.language}
                  />{' '}
                  <div className="mx-7">
                    <Card className="bg-white/10 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-white/20 backdrop-blur-lg">
                      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6">
                        <CardTitle className="text-2xl font-bold">
                          Manage Plans
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        {/* <ScrollArea className="h-[calc(100vh-250px)]"> */}
                        {/* <ServicesMenu
                          key={`services-menu-${refreshKey}`}
                        />{' '} */}
                        <AdminSubscriptionPlans></AdminSubscriptionPlans>
                        {/* </ScrollArea> */}
                      </CardContent>
                    </Card>
                  </div>
                </>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin382013453sms/set-rent-pricing"
            element={
              <AdminProtectedRoute>
                <>
                  <PageTitle
                    title="Edit Plans | SMS App"
                    lang={i18n.language}
                  />{' '}
                  <div className="mx-7">
                    <Card className="bg-white/10 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-white/20 backdrop-blur-lg">
                      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6">
                        <CardTitle className="text-2xl font-bold">
                          Manage Plans
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        {/* <ScrollArea className="h-[calc(100vh-250px)]"> */}
                        {/* <ServicesMenu
                          key={`services-menu-${refreshKey}`}
                        />{' '} */}
                        <RentNumberPricing></RentNumberPricing>
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
              <PageTitle title="404 | SMS App" lang={i18n.language} />
              <NotFound />
            </div>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
