import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function PaymentSuccess() {
    const { t,i18n } = useTranslation()
    return (
        <div className=" bg-gradient-to-b  flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-green-200">
                <CardHeader>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        className="flex justify-center"
                    >
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    </motion.div>
                    <CardTitle className="text-2xl font-bold text-center mt-4">{t("payment.Payment Successful!")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-gray-600">
                    {t("payment.Thank you for your Topup. Your payment has been processed successfully.")}
                        
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link to={`/${i18n.language}/`}>
                        <Button className="w-full text-white">
                        {t("payment.Return to Home")} 
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
