import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  UserPlus,
  LogIn,
  Globe,
  Phone,
  CreditCard,
  MessageSquare,
  CheckCircle,
  ShieldCheck,
} from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

export default function Component() {
  const {t,i18n} = useTranslation();
  const steps = [
    {
      icon: <UserPlus className="h-6 w-6" />,
      title: t("how.Sign Up"),
      description: t("how.Click on the 'Sign Up' button to create your account."),
    },
    {
      icon: <LogIn className="h-6 w-6" />,
      title:t('how.Log In'),
      description:
        t('how.After signing up, log in to your account using your credentials.'),
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: t('how.Select Country'),
      description:
        t('how.Navigate to the phone number selection section. Choose the country where you need a temporary phone number.'),
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: t('how.Choose a Service'),
      description:
        t('how.Select the specific service or platform (e.g., WhatsApp, Facebook) for which you need the number.'),
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: t('how.Purchase a Number'),
      description:
        t('how.Browse the available numbers and select one. Proceed to payment and complete the purchase.'),
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: t('how.Receive SMS'),
      description:
        t('how.Use the purchased number to receive SMS verification codes. Check your account dashboard for incoming messages.'),
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: t('how.Verify'),
      description:
        t('how.Enter the received verification code on the platform you are signing up for.'),
    },
  ];

  const tips = [
    {
      icon: <ShieldCheck className="h-5 w-5 text-green-500" />,
      text: t('how.Our service is verified and reliable. Issues like unavailable numbers or failed verifications are extremely rare.'),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        {t('how.How to Buy a Temporary Phone Number for SMS App')}
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <Card
            key={index}
            className="transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-whiten rounded-full w-8 h-8 flex items-center justify-center">
                  {index + 1}
                </span>
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="text-green-500"> {step.icon}</div>
                <p>{step.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-green-500" />
            {t('how.Service Assurance')}  
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                {tip.icon}
                <span>{tip.text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {/* <div className="mt-8 text-center text-white">
        <Button size="lg">{t('how.Get Started Now')}</Button>
      </div> */}
      <div className="mt-12 text-center">
        <NavLink to={`/${i18n.language}/${t("urls.ourservices")}`} className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors">
          {t("how.Get Started Now")}
        </NavLink>
      </div>
    </div>
  );
}
