

// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { useAuth } from '../../contexts/authcontext'
// import { PhoneCall, Gift, Loader2, CheckCircle, Sparkles } from "lucide-react"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/shadcn/ui/card'
// import { Button } from '../../components/shadcn/ui/button'

// export default function FreeNumberCard() {
//   const [eligible, setEligible] = useState<boolean | null>(null)
//   const [message, setMessage] = useState<string>('')
//   const [loading, setLoading] = useState<boolean>(true)
//   const [error, setError] = useState<string | null>(null)
//   const { currentUser } = useAuth()

//   const checkEligibility = async (uid: String) => {
//     try {
//       const ipResponse = await axios.get('https://api.ipify.org?format=json')
//       const userIp = ipResponse.data.ip
//       const response = await axios.get(`https://smsverify-server.vercel.app/api/check-free-number?uid=${uid}&ip=${userIp}`)
//       const { eligible, message } = response.data
//       console.log(uid, "uid11",eligible, "eligible",message, "message");
//       setEligible(eligible)
//       setMessage(message)
//       setLoading(false)
//     } catch (error) {
//       setError('Failed to check eligibility')
//       setLoading(false)
//     }
//   }

//   const claimFreeNumber = async () => {
//     try {
//       setLoading(true)
//       const ipResponse = await axios.get('https://api.ipify.org?format=json')
//       const userIp = ipResponse.data.ip
//       console.log(currentUser?.uid, "uid");
//       const response = await axios.post('https://smsverify-server.vercel.app/api/claim-free-number', {
//         uid: currentUser?.uid,
//         country: 'russia',
//         product: 'telegram',
//         userIp: userIp,
//       })
//       setMessage(response.data.message)
//       setLoading(false)
//     } catch (error) {
//       console.error('Error claiming free number:', error)
//       setError('Failed to claim free number')
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     // console.log(currentUser?.uid, "uid8");
//     if (currentUser?.uid) {
//       checkEligibility(currentUser.uid);
//     } else {
//       // setError('User ID is not available');
//       setLoading(false);
//     }
//   }, [currentUser?.uid])

//   return (<>
//     {eligible  &&(<Card className="w-full max-w-md overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
//       <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 opacity-20 rounded-full -translate-y-1/2 translate-x-1/2" />
//       <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-300 opacity-20 rounded-full translate-y-1/2 -translate-x-1/2" />
//       <CardHeader className="text-center relative z-10 pb-2">
//         <CardTitle className="text-4xl font-bold mb-2 flex items-center justify-center">
//           <PhoneCall className="mr-2 text-yellow-300 animate-pulse" />
//           Free Phone Number
//         </CardTitle>
//         <CardDescription className="text-lg text-blue-100">Claim your exclusive bonus now!</CardDescription>
//       </CardHeader>
//       <CardContent className="relative z-10">
//         {loading ? (
//           <div className="flex justify-center items-center h-32">
//             <Loader2 className="h-8 w-8 animate-spin text-yellow-300" />
//           </div>
//         ) : error ? (
//           <p className="text-red-300 text-center font-semibold">{error}</p>
//         ) : (
//           <div className="text-center space-y-4">
//             <p className={`text-xl font-semibold ${eligible ? 'text-green-300' : 'text-yellow-300'}`}>
//               {message}
//             </p>
//             {eligible && (
//               <div className="animate-bounce">
//                 <Gift className="h-16 w-16 mx-auto text-yellow-300 mb-2" />
//                 <p className="text-lg text-blue-100">Your free number is waiting!</p>
//               </div>
//             )}
//             <div className="grid grid-cols-2 gap-4 mt-6">
//               <div className="flex items-center bg-blue-400 bg-opacity-30 p-3 rounded-lg">
//                 <CheckCircle className="h-5 w-5 text-green-300 mr-2 flex-shrink-0" />
//                 <span className="text-sm">Choose your number</span>
//               </div>
//               <div className="flex items-center bg-blue-400 bg-opacity-30 p-3 rounded-lg">
//                 <CheckCircle className="h-5 w-5 text-green-300 mr-2 flex-shrink-0" />
//                 <span className="text-sm">Unlimited texts</span>
//               </div>
//               <div className="flex items-center bg-blue-400 bg-opacity-30 p-3 rounded-lg">
//                 <CheckCircle className="h-5 w-5 text-green-300 mr-2 flex-shrink-0" />
//                 <span className="text-sm">No hidden fees</span>
//               </div>
//               <div className="flex items-center bg-blue-400 bg-opacity-30 p-3 rounded-lg">
//                 <CheckCircle className="h-5 w-5 text-green-300 mr-2 flex-shrink-0" />
//                 <span className="text-sm">24/7 support</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </CardContent>
//       <CardFooter className="flex justify-center relative z-10 pt-2">
//         {eligible && !loading && (
//           <Button 
//             onClick={claimFreeNumber} 
//             className="w-full max-w-xs text-lg font-semibold bg-yellow-400 hover:bg-yellow-500 text-blue-900 transition-all duration-300 transform hover:scale-105"
//             size="lg"
//           >
//             <Sparkles className="mr-2 h-5 w-5" />
//             Claim Your Free Number
//           </Button>
//         )}
//       </CardFooter>
//     </Card>)}</>
//   )
// }
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/authcontext'
import { PhoneCall, Gift, Loader2, CheckCircle, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/shadcn/ui/card'
import { Button } from '../../components/shadcn/ui/button'

export default function FreeNumberBanner() {
  const [eligible, setEligible] = useState<boolean | null>(null)
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { currentUser } = useAuth()

  const checkEligibility = async (uid: String) => {
    try {
      const ipResponse = await axios.get('https://api.ipify.org?format=json')
      const userIp = ipResponse.data.ip
      const response = await axios.get(`https://smsverify-server.vercel.app/api/check-free-number?uid=${uid}&ip=${userIp}`)
      const { eligible, message } = response.data
      setEligible(eligible)
      setMessage(message)
      setLoading(false)
    } catch (error) {
      setError('Failed to check eligibility')
      setLoading(false)
    }
  }

  const claimFreeNumber = async () => {
    try {
      setLoading(true)
      const ipResponse = await axios.get('https://api.ipify.org?format=json')
      const userIp = ipResponse.data.ip
      const response = await axios.post('https://smsverify-server.vercel.app/api/claim-free-number', {
        uid: currentUser?.uid,
        country: 'russia',
        product: 'telegram',
        userIp: userIp,
      })
      setMessage(response.data.message)
      setLoading(false)
    } catch (error) {
      setError('Failed to claim free number')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser?.uid) {
      checkEligibility(currentUser.uid);
    } else {
      setLoading(false);
    }
  }, [currentUser?.uid])

  return (
    <>
      {eligible !== null && (
        <Card className="w-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg banner">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <PhoneCall className="text-yellow-300 h-8 w-8" />
              <div>
                <CardTitle className="text-2xl font-bold">Free Phone Number</CardTitle>
                <CardDescription className="text-sm text-blue-100">{message || "Claim your exclusive bonus now!"}</CardDescription>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-yellow-300" />
              </div>
            ) : error ? (
              <p className="text-red-300 text-center font-semibold">{error}</p>
            ) : (
              eligible && (
                <Button 
                  onClick={claimFreeNumber} 
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 transition-all duration-300 transform hover:scale-105 text-sm font-semibold"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Claim Now
                </Button>
              )
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}
