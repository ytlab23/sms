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
// Load your Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

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
          <Route
        path="/services/:slug"
        element={<InternalPage />}
      />
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
          <Route
            path="/admin382013453sms"
            element={
              <AdminProtectedRoute>
                <>
                  <PageTitle title="Admin | SMS App" />
                  <AdminInternalPageCreator></AdminInternalPageCreator>
                </>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin382013453sms/set-pricing"
            element={
              <AdminProtectedRoute>
                <>
                  <PageTitle title="Admin | SMS App" />
                  <AdminPage />
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
                  <InternalPagesList></InternalPagesList>
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
                  <AdminInternalPageCreator></AdminInternalPageCreator>
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
