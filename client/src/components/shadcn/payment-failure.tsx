
import { motion } from 'framer-motion'
import { XCircle, RefreshCcw, ArrowLeft } from 'lucide-react'
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function PaymentFailure() {
  const handleRetry = () => {
  }
  const {t} = useTranslation();

  return (
    <div className="  flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-b from-red-50 to-red-100">
        <CardHeader>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="flex justify-center"
          >
            <XCircle className="w-16 h-16 text-red-500" />
          </motion.div>
          <CardTitle className="text-2xl font-bold text-center mt-4">{t("payment.Payment Failed")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-4">
          {t("payment.We're sorry, but your payment could not be processed at this time. Please try again or contact support if the problem persists.")}
            
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          
          <Link to="/" className="w-full">
            <Button  className="w-full text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("payment.Return to Home")}  
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}