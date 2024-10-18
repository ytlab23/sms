
import { motion } from 'framer-motion'
import { XCircle, RefreshCcw, ArrowLeft } from 'lucide-react'
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Link } from 'react-router-dom'

export default function PaymentFailure() {
  const handleRetry = () => {
    // In a real application, you would implement the logic to retry the payment
    console.log('Retrying payment...')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="flex justify-center"
          >
            <XCircle className="w-16 h-16 text-red-500" />
          </motion.div>
          <CardTitle className="text-2xl font-bold text-center mt-4">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-4">
            We're sorry, but your payment could not be processed at this time. Please try again or contact support if the problem persists.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={handleRetry}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry Payment
          </Button>
          <Link to="/dashboard" className="w-full">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}