// import { useEffect, useState } from 'react';
// import { Route, Routes, useLocation, Navigate } from 'react-router-dom';

// import Loader from './common/Loader';
// import PageTitle from './components/PageTitle';
// import SignIn from './pages/Authentication/SignIn';
// import SignUp from './pages/Authentication/SignUp';
// import Calendar from './pages/Calendar';
// import Chart from './pages/Chart';
// import MainPage from './pages/MainPage/MainPage';
// import FormElements from './pages/Form/FormElements';
// import FormLayout from './pages/Form/FormLayout';
// import Profile from './pages/Profile';
// import Settings from './pages/Settings';
// import Tables from './pages/Tables';
// import Alerts from './pages/UiElements/Alerts';
// import Buttons from './pages/UiElements/Buttons';
// import DefaultLayout from './layout/DefaultLayout';
// import { FaqSection } from './components/shadcn/faqsection';
// import Faq from './pages/Faq/Faq';
// import { AuthProvider } from './contexts/authcontext';
// import ProtectedRoute from './contexts/ProtectedRoute';
// import HowToBuy from './pages/HowToBuy/HowToBuy';
// import OrdersPage from './pages/Orders/OrdersPage';
// import PaymentForm from './pages/payment/paymentform';

// function App() {
//   const [loading, setLoading] = useState<boolean>(true);
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   useEffect(() => {
//     setTimeout(() => setLoading(false), 1000);
//   }, []);

//   return loading ? (
//     <Loader />
//   ) : (
//     <AuthProvider>
//       <DefaultLayout>
//         <Routes>
//           <Route
//             index
//             element={
//               <>
//                 <PageTitle title="Home | SMSVerify" />
//                 <MainPage />
//               </>
//             }
//           />
//           <Route
//             path="/pay"
//             element={
//               <>
//                 <PageTitle title="Pay | SMSVerify" />
//                 <PaymentForm userId={''} userEmail={''}></PaymentForm>
//               </>
//             }
//           />

//           <Route
//             path="/faq"
//             element={
//               <>
//                 <PageTitle title="Faq | SMSVerify" />
//                 <Faq></Faq>
//               </>
//             }
//           />

//           <Route
//             path="/settings"
//             element={
//               <ProtectedRoute>
//                 <>
//                   <PageTitle title="Settings | SMSVerify" />
//                   <Settings />
//                 </>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/orders"
//             element={
//               <ProtectedRoute>
//                 <>
//                   <PageTitle title="Your Orders | SMSVerify" />
//                   <OrdersPage></OrdersPage>
//                 </>
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/auth/signin"
//             element={
//               <>
//                 <PageTitle title="Signin | SMSVerify" />
//                 <SignIn />
//               </>
//             }
//           />
//           <Route
//             path="/auth/signup"
//             element={
//               <>
//                 <PageTitle title="Signup | SMSVerify" />
//                 <SignUp />
//               </>
//             }
//           />
//           <Route
//             path="/howtobuy"
//             element={
//               <>
//                 <PageTitle title="How to Buy | SMSVerify" />
//                 <HowToBuy></HowToBuy>
//               </>
//             }
//           />
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </DefaultLayout>
//     </AuthProvider>
//   );
// }

// export default App;
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
      <DefaultLayout>
        <Routes>
          <Route
            index
            element={
              <>
                <PageTitle title="Home | SMSVerify" />
                <MainPage />
              </>
            }
          />
          <Route
            path="/pay"
            element={
              <Elements stripe={stripePromise}>
                {/* Wrap the PaymentForm in the <Elements> provider */}
                <>
                  <PageTitle title="Pay | SMSVerify" />
                  <PaymentForm ></PaymentForm>
                </>
              </Elements>
            }
          />

          <Route
            path="/faq"
            element={
              <>
                <PageTitle title="Faq | SMSVerify" />
                <Faq />
              </>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <>
                  <PageTitle title="Settings | SMSVerify" />
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
                  <PageTitle title="Your Orders | SMSVerify" />
                  <OrdersPage />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/auth/signin"
            element={
              <>
                <PageTitle title="Signin | SMSVerify" />
                <SignIn />
              </>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <>
                <PageTitle title="Signup | SMSVerify" />
                <SignUp />
              </>
            }
          />
          <Route
            path="/howtobuy"
            element={
              <>
                <PageTitle title="How to Buy | SMSVerify" />
                <HowToBuy />
              </>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </DefaultLayout>
    </AuthProvider>
  );
}

export default App;
