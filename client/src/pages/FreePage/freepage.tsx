
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/authcontext'
import { PhoneCall, Gift, Loader2, CheckCircle, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/shadcn/ui/card'
import { Button } from '../../components/shadcn/ui/button'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function FreeNumberBanner() {
  const navigate = useNavigate();
  const [eligible, setEligible] = useState<boolean | null>(null)
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { currentUser } = useAuth()
  const {t,i18n} = useTranslation()

  const checkEligibility = async (uid: String) => {
    try {
      const ipResponse = await axios.get('https://api.ipify.org?format=json')
      const userIp = ipResponse.data.ip
      const response = await axios.get(`https://smsapp-backend.vercel.app/api/check-free-number?uid=${uid}&ip=${userIp}`)
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
      const response = await axios.post('https://smsapp-backend.vercel.app/api/claim-free-number', {
        uid: currentUser?.uid,
        
        userIp: userIp,
      })
      setMessage(response.data.message)
      setLoading(false)
      const id = response.data?.number?.id ?? null;

      // navigate(`/sms?id=${id}`);
      navigate(`/${i18n.language}/${t("urls.sms")}?id=${id}`)
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
                <CardTitle className="text-2xl font-bold">{t("free.Free Phone Number")}</CardTitle>
                <CardDescription className="text-sm text-blue-100">{t("free.Claim your exclusive bonus now!")}</CardDescription>
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
                  {t("free.Claim Now")} 
                </Button>
              )
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}
