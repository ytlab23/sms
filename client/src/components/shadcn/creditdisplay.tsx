import { Wallet } from "lucide-react"
import { Card, CardContent } from "./ui/card"

interface CreditDisplayProps {
  credit: number
}

export function  CreditDisplay({ credit = 0 }: CreditDisplayProps) {
  const formattedCredit = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(credit)

  return (
    <Card className="w-full dark:bg-boxdark-2 max-w-[200px] mx-auto transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
      <CardContent className="flex items-center p-1.5">
        <div className="mr-2 p-0.5 bg-green-100 rounded-full">
          <Wallet className="h-3 w-3 text-green-600" aria-hidden="true" />
        </div>
        <div className="flex items-baseline">
          <p className="text-[10px] font-medium text-gray-500 mr-1">Credit:</p>
          <p className="text-xs font-semibold text-gray-900">{formattedCredit}</p>
        </div>
      </CardContent>
    </Card>
  )
}