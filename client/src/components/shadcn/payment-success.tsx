import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Link } from 'react-router-dom'

export default function PaymentSuccess() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        className="flex justify-center"
                    >
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    </motion.div>
                    <CardTitle className="text-2xl font-bold text-center mt-4">Payment Successful!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-gray-600">
                        Thank you for your purchase. Your payment has been processed successfully.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link to="/dashboard">
                        <Button className="w-full">
                            Return to Dashboard
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
