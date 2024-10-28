import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "./ui/button"
import { AlertCircle } from 'lucide-react'
import Logo from '../../../public/smsapp.svg'

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        {/* Placeholder for your logo */}
        <div className=" mx-auto  rounded-full flex items-center justify-center mb-8">
        <Link to="/" className="flex items-center gap-2">
          <img className="h-18" src={Logo} alt="Logo" />
          <h1 className="font-bold text-4xl text-blue-600">SmsApp</h1>
        </Link>
        </div>

        <AlertCircle className="w-16 h-16 mx-auto text-primary" />
        <h1 className="text-4xl font-bold text-primary">404 - Page Not Found</h1>
        <p className="text-xl text-muted-foreground">
          Oops! We couldn't find the page you're looking for.
        </p>
        <p className="text-muted-foreground">
          The page may have been moved, deleted, or never existed.
        </p>
        <div className="pt-6 text-white">
          <Button asChild size="lg">
            <Link to="/">
              Return to Home
            </Link>
          </Button>
        </div>
        {/* <p className="text-sm text-muted-foreground pt-8">
          If you believe this is an error, please contact our support team.
        </p> */}
      </div>
    </div>
  );
};

export default NotFound;