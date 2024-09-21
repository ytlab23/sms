// import React from 'react';
// import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
// import { useAuth } from '../contexts/authcontext'; // Assuming you're using useAuth hook

// const Settings = () => {
//   const { currentUser } = useAuth(); // Access the current authenticated user

//   return (
//     <>
//       <div className="mx-auto max-w-270">
//         <Breadcrumb pageName="Settings" />

//         <div className="grid gap-8 mr-20 ml-20">
//           <div className="col-span-5 xl:col-span-3">
//             <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
//               <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
//                 <h3 className="font-medium text-black dark:text-white">
//                   Account Information
//                 </h3>
//               </div>
//               <div className="p-7">
//                 <form action="#">
//                   {/* Email Address */}
//                   <div className="mb-5.5">
//                     <label
//                       className="mb-3 block text-sm font-medium text-black dark:text-white"
//                       htmlFor="emailAddress"
//                     >
//                       Email Address
//                     </label>
//                     <input
//                       className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                       type="email"
//                       name="emailAddress"
//                       id="emailAddress"
//                       value={currentUser?.email || ''}
//                       disabled
//                     />
//                   </div>

//                   {/* Username */}
//                   <div className="mb-5.5">
//                     <label
//                       className="mb-3 block text-sm font-medium text-black dark:text-white"
//                       htmlFor="Username"
//                     >
//                       Username
//                     </label>
//                     <input
//                       className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                       type="text"
//                       name="Username"
//                       id="Username"
//                       value={currentUser?.displayName || ''}
//                       disabled
//                     />
//                   </div>

//                   <div className="flex justify-end gap-4.5">

//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Settings;
// import React, { useEffect, useState } from 'react';
// import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
// import { useAuth } from '../contexts/authcontext'; // Assuming you're using useAuth hook
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { db, auth } from '../firebase/config'; // Assuming firebase setup
// import { sendPasswordResetEmail } from 'firebase/auth';

// const Settings = () => {
//   const { currentUser } = useAuth(); // Access the current authenticated user
//   const [username, setUsername] = useState('');
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [newPassword, setNewPassword] = useState('');

//   useEffect(() => {
//     // Fetch username from Firestore if the user authenticated via email/password
//     const fetchUsername = async () => {
//       if (!currentUser) return;

//       if (currentUser.providerData.some((provider) => provider.providerId === 'password')) {
//         // Email/password sign-in, fetch username from Firestore
//         const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
//         if (userDoc.exists()) {
//           setUsername(userDoc.data().username);
//         } else {
//           setMessage('User information not found');
//         }
//       } else {
//         // Google sign-in, use the displayName
//         setUsername(currentUser.displayName ?? '');
//       }
//     };

//     fetchUsername();
//   }, [currentUser]);

//   const handlePasswordReset = async () => {
//     if (!currentUser) return;

//     setLoading(true);
//     setMessage('');

//     try {
//       if (currentUser.providerData.some((provider) => provider.providerId === 'password')) {
//         // Reset password for email/password authenticated users
//         if (currentUser.email) {
//           await sendPasswordResetEmail(auth, currentUser.email);
//         } else {
//           setMessage('Email not found. Cannot send password reset email.');
//         }
//         setMessage('Password reset email sent. Please check your inbox.');
//       } else {
//         // Google users can't reset password here
//         setMessage('You signed in with Google. Please manage your password through your Google account.');
//       }
//     } catch (error) {
//       console.error('Error resetting password:', error);
//       setMessage('Failed to send password reset email. Please try again later.');
//     }

//     setLoading(false);
//   };

//   return (
//     <>
//       <div className="mx-auto max-w-270">
//         <Breadcrumb pageName="Settings" />

//         <div className="grid gap-8 mr-20 ml-20">
//           <div className="col-span-5 xl:col-span-3">
//             <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
//               <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
//                 <h3 className="font-medium text-black dark:text-white">Account Information</h3>
//               </div>
//               <div className="p-7">
//                 <form>
//                   {/* Email Address */}
//                   <div className="mb-5.5">
//                     <label
//                       className="mb-3 block text-sm font-medium text-black dark:text-white"
//                       htmlFor="emailAddress"
//                     >
//                       Email Address
//                     </label>
//                     <input
//                       className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                       type="email"
//                       name="emailAddress"
//                       id="emailAddress"
//                       value={currentUser?.email || ''}
//                       disabled
//                     />
//                   </div>

//                   {/* Username */}
//                   <div className="mb-5.5">
//                     <label
//                       className="mb-3 block text-sm font-medium text-black dark:text-white"
//                       htmlFor="username"
//                     >
//                       Username
//                     </label>
//                     <input
//                       className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                       type="text"
//                       name="username"
//                       id="username"
//                       value={username || ''}
//                       disabled
//                     />
//                   </div>

//                   {/* Password Reset */}
//                   <div className="mb-5.5">
//                     <label
//                       className="mb-3 block text-sm font-medium text-black dark:text-white"
//                       htmlFor="newPassword"
//                     >
//                       Reset Password
//                     </label>
//                     <input
//                       className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                       type="password"
//                       name="newPassword"
//                       id="newPassword"
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                       disabled={currentUser?.providerData.some((provider) => provider.providerId !== 'password')}
//                     />
//                     <button
//                       type="button"
//                       className="mt-4 py-2 px-6 bg-primary text-white rounded"
//                       onClick={handlePasswordReset}
//                       disabled={loading}
//                     >
//                       {loading ? 'Processing...' : 'Reset Password'}
//                     </button>
//                   </div>

//                   {message && <p className="text-red-500">{message}</p>}
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Settings;
import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { useAuth } from '../contexts/authcontext'; // Assuming you're using useAuth hook
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config'; // Assuming firebase setup
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';

const Settings = () => {
  const { currentUser } = useAuth(); // Access the current authenticated user
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      if (!currentUser) return;

      if (
        currentUser.providerData.some(
          (provider) => provider.providerId === 'password',
        )
      ) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        } else {
          setMessage('User information not found');
        }
      } else {
        setUsername(currentUser.displayName ?? '');
      }
    };

    fetchUsername();
  }, [currentUser]);

  const handlePasswordReset = async () => {
    if (!currentUser) return;

    setLoading(true);
    setMessage('');

    // Basic validation for password fields
    if (newPassword !== confirmNewPassword) {
      setMessage('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Re-authenticate user with old password
      if (currentUser.email) {
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          oldPassword,
        );
        await reauthenticateWithCredential(currentUser, credential);
      } else {
        throw new Error('Email not found. Cannot reauthenticate.');
      }
      // await reauthenticateWithCredential(currentUser, credential);

      // If re-authentication succeeds, update the password
      await updatePassword(currentUser, newPassword);

      setMessage('Password has been updated successfully.');
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Failed to reset password. Please try again.');
    }

    setLoading(false);
  };

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />

        <div className="grid gap-8 mr-20 ml-20">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Account Information
                </h3>
              </div>
              <div className="p-7">
                <form>
                  {/* Email Address */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Email Address
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="email"
                      name="emailAddress"
                      id="emailAddress"
                      value={currentUser?.email || ''}
                      disabled
                    />
                  </div>

                  {/* Username */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="username"
                    >
                      Username
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="username"
                      id="username"
                      value={username || ''}
                      disabled
                    />
                  </div>

                  {/* Old Password */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="oldPassword"
                    >
                      Old Password
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="password"
                      name="oldPassword"
                      id="oldPassword"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </div>

                  {/* New Password */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="newPassword"
                    >
                      New Password
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  {/* Confirm New Password */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="confirmNewPassword"
                    >
                      Confirm New Password
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="password"
                      name="confirmNewPassword"
                      id="confirmNewPassword"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    className="mt-4 py-2 px-6 bg-primary text-white rounded"
                    onClick={handlePasswordReset}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Reset Password'}
                  </button>

                  {message && <p className="text-red-500 mt-4">{message}</p>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
