import { Phone, Shield, Globe, Zap, CreditCard, Clock, Users, ThumbsUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function Features() {
  const {t,i18n} = useTranslation();
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">{t("home.Welcome to SMSApp")}</h1>
      
      <p className="text-xl text-center mb-12">{t("home.Your trusted partner for secure and reliable phone number verification services.")}
        
      </p>
      
      <div className="grid md:grid-cols-2 gap-8">
        <ServiceCard 
          icon={<Phone className="w-12 h-12 text-blue-500" />}
          title= {t("home.Virtual Phone Numbers")}
          description={t("home.Access temporary phone numbers from over 190 countries for your verification needs.")}
        />
        <ServiceCard 
          icon={<Shield className="w-12 h-12 text-green-500" />}
          title={t("home.Secure Verification")}
          description={t("home.Protect your privacy with our anonymous verification process for various online platforms.")}
        />
        <ServiceCard 
          icon={<Globe className="w-12 h-12 text-purple-500" />}
          title={t("home.Global Coverage")}
          description={t("home.Verify accounts on popular services like WhatsApp, Telegram, Google, and more.")}
        />
        <ServiceCard 
          icon={<Zap className="w-12 h-12 text-yellow-500" />}
          title={t("home.Instant Activation")}
          description={t("home.Get your virtual number instantly and complete verifications in minutes.")}
        />
      </div>
      
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">{t("home.Why Choose Us?")}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Feature
            icon={<CreditCard className="w-10 h-10 text-blue-500" />}
            title={t("home.Affordable Rates")}
            description={t("home.Competitive pricing with various payment options to suit your needs.")}
          />
          <Feature
            icon={<Clock className="w-10 h-10 text-green-500" />}
            title={t("home.24/7 Support")}
            description={t("Our dedicated team is always ready to assist you, anytime, anywhere.")}
          />
          <Feature
            icon={<Users className="w-10 h-10 text-purple-500" />}
            title={t("home.User-Friendly")}
            description={t("home.Intuitive interface designed for seamless user experience.")}
          />
          <Feature
            icon={<ThumbsUp className="w-10 h-10 text-yellow-500" />}
            title={t("home.Guaranteed Success")}
            description={t("home.Successful verifications or your money back, guaranteed.")}
          />
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <Link to={`/${i18n.language}/${t("urls.ourservices")}`} className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors">
          {t("home.Get Started Now")}
        </Link>
      </div>
    </div>
  )
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow dark:hover:shadow-4 dark:shadow-lg dark:shadow-white">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-semibold ml-4">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow dark:hover:shadow-4 dark:shadow-lg dark:shadow-white">
      <CardHeader className="flex flex-col items-center text-center">
        <div className="p-3 rounded-full bg-primary/10 mb-2">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}