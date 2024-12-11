
import React, { useState, useEffect } from 'react'
import { collection, getDocs, setDoc, doc } from 'firebase/firestore'

import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { db } from '../../firebase/config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Button } from './ui/button'


export default function AdminSetup() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAndSetupCollections()
  }, [])

  const checkAndSetupCollections = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await setupCountries()
      await setupServices()
      setIsSetupComplete(true)
    } catch (err) {
      setError('An error occurred during setup. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const setupCountries = async () => {
    const countriesRef = collection(db, 'countries')
    const snapshot = await getDocs(countriesRef)
    if (snapshot.empty) {
      const response = await fetch('https://smsapp-backend.vercel.app/api/countries')
      const data = await response.json()
      const countries = Object.entries(data).map(([key, value]: [string, any]) => ({
        name: value.text_en,
        iso: Object.keys(value.iso)[0],
        prefix: Object.keys(value.prefix)[0],
        included: false,
      }))
      for (const country of countries) {
        await setDoc(doc(countriesRef, country.name), country)
      }
    } else {
    }
  }

  const setupServices = async () => {
    const servicesRef = collection(db, 'services')
    const snapshot = await getDocs(servicesRef)
    if (snapshot.empty) {
      const response = await fetch('https://smsapp-backend.vercel.app/api/get-services?country=any')
      const data = await response.json()
      const services = Object.entries(data).map(([key, value]: [string, any]) => ({
        name: key,
        category: value.Category,
        quantity: value.Qty,
        price: 0.7,
        main: false,
        isIncluded: false,
      }))
      for (const service of services) {
        await setDoc(doc(servicesRef, service.name), service)
      }
    } else {
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-primary">Admin Setup</CardTitle>
        <CardDescription className="text-center text-lg">
          Initialize and manage your application's core data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-6 bg-secondary/10 rounded-lg">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <span className="mt-4 text-xl font-semibold">Setting up collections...</span>
          </div>
        ) : isSetupComplete ? (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <AlertTitle className="text-xl font-semibold text-green-800">Setup Complete</AlertTitle>
            <AlertDescription className="text-lg text-green-700">
              Countries and services have been set up successfully!
            </AlertDescription>
          </Alert>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-6 w-6" />
            <AlertTitle className="text-xl font-semibold">Setup Failed</AlertTitle>
            <AlertDescription className="text-lg">{error}</AlertDescription>
            <Button onClick={checkAndSetupCollections} className="mt-4" size="lg">
              Retry Setup
            </Button>
          </Alert>
        ) : null}

        <div className="space-y-4 text-lg">
          <h3 className="text-2xl font-semibold text-primary">Additional Admin Capabilities:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Manage and update country information</li>
            <li>Add and select main  services</li>
            <li>Adjust pricing for services  per country</li>
            <li>Add,Edit and Delete Internal pages</li>
            <li>Choose Free Service</li>
          </ul>
          <p className="italic text-muted-foreground">
            Access these features through sidebar
          </p>
        </div>
      </CardContent>
    </Card>
  )
}