
import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { useAuth } from '../contexts/authcontext'; 
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config'; 
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const {t} = useTranslation();
  const { currentUser } = useAuth(); 
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

    if (newPassword !== confirmNewPassword) {
      setMessage('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      if (currentUser.email) {
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          oldPassword,
        );
        await reauthenticateWithCredential(currentUser, credential);
      } else {
        throw new Error('Email not found. Cannot reauthenticate.');
      }
     
      await updatePassword(currentUser, newPassword);

      setMessage('Password has been updated successfully.');
    } catch (error) {
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
              {t("setting.Account Information")}    
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
                    {t("setting.Email Address")}  
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
                    {t("setting.Username")}  
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
                    {t("setting.Old Password")}  
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
                   {t("setting.New Password")}   
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
                    {t("setting.Confirm New Password")}  
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
                    {loading ? t("setting.Processing...") : t("setting.Reset Password")}
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
