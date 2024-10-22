import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';

import { loadStripe } from '@stripe/stripe-js';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import MainPage from './pages/MainPage/MainPage';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import { FaqSection } from './components/shadcn/faqsection';
import Faq from './pages/Faq/Faq';
import { AuthProvider } from './contexts/authcontext';
import ProtectedRoute from './contexts/ProtectedRoute';
import HowToBuy from './pages/HowToBuy/HowToBuy';
import OrdersPage from './pages/Orders/OrdersPage';
import PaymentForm from './pages/payment/paymentform';
import TryTo from './pages/payment/trytobuy';
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
// Load your Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function App() {
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
            index
            element={
              <>
                <PageTitle title="Home | SMS App" />
                <MainPage />
              </>
            }
          />
          <Route
            path="/pay"
            element={
              <Elements stripe={stripePromise}>
                <ProtectedRoute>
                  <div>
                    <PageTitle title="Pay | SMS App" />
                    <PaymentForm />
                  </div>
                </ProtectedRoute>
              </Elements>
            }
          />
          <Route
            path="/faq"
            element={
              <>
                <PageTitle title="Faq | SMS App" />
                <Faq />
              </>
            }
          />
          <Route
            path="/statistics"
            element={
              <>
                <PageTitle title="Statistics | SMS App" />
                <StatsPage />
              </>
            }
          />
          <Route
            path="/paymentfailure"
            element={
              <>
                <PageTitle title="Payment Failure | SMS App" />
                <PaymentFailure />
              </>
            }
          />
          <Route
            path="/paymentsuccess"
            element={
              <>
                <PageTitle title="Payment Success | SMS App" />
                <PaymentSuccess />
              </>
            }
          />
          <Route
            path="/ourservices"
            element={
              <>
                <PageTitle title="Our Services | SMS App" />
                <InternalPagesShowcase />
              </>
            }
          />
          <Route
            path="/internalpages"
            element={
              <>
                <PageTitle title="InternalPage | SMS App" />
                <InternalPage />
              </>
            }
          />
          <Route path="/services/:slug" element={<InternalPage />} />
          <Route
            path="/internalpagesadmin"
            element={
              <>
                <PageTitle title="InternalPage Admin | SMS App" />
                <AdminInternalPageCreator />
              </>
            }
          />
          <Route
            path="/freenumber"
            element={
              <>
                <PageTitle title="Free Number | SMS App" />
                <FreeNumberPage />
              </>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <>
                  <PageTitle title="Settings | SMS App" />
                  <Settings />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <>
                  <PageTitle title="Your Orders | SMS App" />
                  <OrdersPage />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth/signin"
            element={
              <>
                <PageTitle title="Signin | SMS App" />
                <SignIn />
              </>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <>
                <PageTitle title="Signup | SMS App" />
                <SignUp />
              </>
            }
          />
          <Route
            path="/howtobuy"
            element={
              <>
                <PageTitle title="How to Buy | SMS App" />
                <HowToBuy />
              </>
            }
          />
          <Route
            path="/sms"
            element={
              <ProtectedRoute>
                <>
                  <PageTitle title="SMS | SMS App" />
                  <SmsPage />
                </>
              </ProtectedRoute>
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
                          <ServicesMenu key={`services-menu-${refreshKey}`} />{' '}
                        {/* </ScrollArea> */}
                      </CardContent>
                    </Card>
                  </div>
                </>
              </AdminProtectedRoute>
            }
          />
        </Route>

        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
