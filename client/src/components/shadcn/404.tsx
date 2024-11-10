import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "./ui/button"
import { AlertCircle } from 'lucide-react'
import Logo from '../../../public/smsapp.svg'
import { useTranslation } from 'react-i18next';

const NotFound: React.FC = () => {
  const {t,i18n} = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        
        <div className=" mx-auto  rounded-full flex items-center justify-center mb-8">
        <Link to={ `${i18n.language}/`} className="flex items-center gap-2">
          <img className="h-18" src={Logo} alt="Logo" />
          <h1 className="font-bold text-4xl text-blue-600">SmsApp</h1>
        </Link>
        </div>

        <AlertCircle className="w-16 h-16 mx-auto text-primary" />
        <h1 className="text-4xl font-bold text-primary">{t("404.404 - Page Not Found")}</h1>
        <p className="text-xl text-muted-foreground">
          {t("404.Oops! We couldn't find the page you're looking for.")}
        </p>
        <p className="text-muted-foreground">
      {t("404.The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.")}
        </p>
        <div className="pt-6 text-white">
          <Button asChild size="lg">
            <Link to={ `/${i18n.language}/`}>
              {t("404.Go back to Home")}
            </Link>
          </Button>
        </div>
       
      </div>
    </div>
  );
};

export default NotFound;