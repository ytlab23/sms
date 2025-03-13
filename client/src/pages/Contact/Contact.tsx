import type React from 'react';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send, User, MessageSquare } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/shadcn/ui/card';
import { Button } from '../../components/shadcn/ui/button';
import { Input } from '../../components/shadcn/ui/input';
import { Textarea } from '../../components/shadcn/ui/textarea';
import { useToast } from '../../components/shadcn/ui/use-toast';
import { z } from 'zod';
import emailjs from '@emailjs/browser';
import { FaqSection } from '../../components/shadcn/faqsection';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z
    .string()
    .min(5, { message: 'Subject must be at least 5 characters' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters' }),
});

export function Contact() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const formValues = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    // Validate form data
    try {
      formSchema.parse(formValues);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }
    }

    // Send email using EmailJS
    try {
      // Your EmailJS credentials from environment variables
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration is missing');
      }

      await emailjs.send(serviceId, templateId, formValues, publicKey);

      toast({
        title: t('contact.Success'),
        description: t('contact.Your message has been sent successfully!'),
        variant: 'success',
      });

      // Reset form
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      toast({
        title: t('contact.Error'),
        description: t('contact.Failed to send message. Please try again.'),
        variant: 'destructive',
      });
      console.error('Email sending failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('contact.Contact Us')}
        </h1>
        <p className="text-xl max-w-2xl mx-auto text-muted-foreground">
          {t(
            'contact.Have questions or need assistance? Reach out to our team.',
          )}
        </p>
      </div>

      {/* Contact Form - Full width and more attractive */}
      <Card className="shadow-xl border-t-4 border-t-blue-500 dark:border-t-blue-400 mb-12 max-w-3xl mx-auto">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl text-center">
            {t('contact.Send us a Message')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  <label htmlFor="name" className="text-sm font-medium">
                    {t('contact.Your Name')}
                  </label>
                </div>
                <Input
                  id="name"
                  name="name"
                  placeholder={t('contact.Enter your name')}
                  className={`${
                    errors.name ? 'border-red-500' : ''
                  } h-12 rounded-md`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <label htmlFor="email" className="text-sm font-medium">
                    {t('contact.Your Email')}
                  </label>
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('contact.Enter your email')}
                  className={`${
                    errors.email ? 'border-red-500' : ''
                  } h-12 rounded-md`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <label htmlFor="subject" className="text-sm font-medium">
                  {t('contact.Subject')}
                </label>
              </div>
              <Input
                id="subject"
                name="subject"
                placeholder={t('contact.Enter subject')}
                className={`${
                  errors.subject ? 'border-red-500' : ''
                } h-12 rounded-md`}
              />
              {errors.subject && (
                <p className="text-sm text-red-500">{errors.subject}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <label htmlFor="message" className="text-sm font-medium">
                  {t('contact.Message')}
                </label>
              </div>
              <Textarea
                id="message"
                name="message"
                rows={5}
                placeholder={t('contact.Type your message here')}
                className={`${
                  errors.message ? 'border-red-500' : ''
                } rounded-md resize-none`}
              />
              {errors.message && (
                <p className="text-sm text-red-500">{errors.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-md transition-all duration-300 transform hover:scale-[1.02]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t('contact.Sending...')}
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  <Send className="h-5 w-5" />
                  {t('contact.Send Message')}
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contact Information Cards - Now below the form */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <ContactInfoCard
          icon={<Mail className="w-10 h-10 text-blue-500" />}
          title={t('contact.Email')}
          info="support@smsapp.com"
        />
        <ContactInfoCard
          icon={<Phone className="w-10 h-10 text-green-500" />}
          title={t('contact.Phone')}
          info="+1 (555) 123-4567"
        />
        <ContactInfoCard
          icon={<MapPin className="w-10 h-10 text-purple-500" />}
          title={t('contact.Address')}
          info="123 Verification St, Digital City, 10001"
        />
      </div>
      <FaqSection />
    </div>
  );
}

interface ContactInfoCardProps {
  icon: React.ReactNode;
  title: string;
  info: string;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
  icon,
  title,
  info,
}) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-[1.03] border-t-2 border-t-primary">
      <CardContent className="flex flex-col items-center text-center p-6">
        <div className="p-3 rounded-full bg-primary/10 mb-4">{icon}</div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground">{info}</p>
      </CardContent>
    </Card>
  );
};

export default Contact;
