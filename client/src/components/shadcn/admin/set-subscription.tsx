



import React, { useState, useEffect } from "react"
import { db } from "../../../firebase/config"
import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore"
import { Button } from "./../ui/button"
import { Input } from "./../ui/input"
import { Label } from "./../ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "./../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./../ui/select"
import { Textarea } from "./../ui/textarea"
import { useToast } from "./../ui/use-toast"
import { Loader2, Plus, Trash2, Save } from "lucide-react"
import { ScrollArea } from "./../ui/scroll-area"

interface Country {
  code: string
  name: string
  iso: string
}

interface PlanPrice {
  [countryCode: string]: number
}

interface PlanFeature {
  text: string
}

interface Plan {
  id: string
  name: {
    [lang: string]: string
  }
  description: {
    [lang: string]: string
  }
  duration: number
  prices: PlanPrice
  features: {
    [lang: string]: PlanFeature[]
  }
  discount: number
  popular: boolean
}

const languages = ["en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ar"]

const languageNames = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  ru: "Русский",
  zh: "中文",
  ja: "日本語",
  ar: "العربية",
}

const defaultPlans: Plan[] = [
  {
    id: "7-days",
    name: { en: "7 Days" },
    description: { en: "Perfect for quick projects" },
    duration: 7,
    prices: { US: 9.99 },
    features: languages.reduce(
      (acc, lang) => ({
        ...acc,
        [lang]: [{ text: "100 SMS verifications" }, { text: "24/7 support" }, { text: "API access" }],
      }),
      {},
    ),
    discount: 0,
    popular: false,
  },
  {
    id: "30-days",
    name: { en: "30 Days" },
    description: { en: "Great for monthly needs" },
    duration: 30,
    prices: { US: 29.99 },
    features: languages.reduce(
      (acc, lang) => ({
        ...acc,
        [lang]: [
          { text: "500 SMS verifications" },
          { text: "Priority support" },
          { text: "API access" },
          { text: "Analytics dashboard" },
        ],
      }),
      {},
    ),
    discount: 0,
    popular: true,
  },
  {
    id: "90-days",
    name: { en: "90 Days" },
    description: { en: "Ideal for quarterly planning" },
    duration: 90,
    prices: { US: 79.99 },
    features: languages.reduce(
      (acc, lang) => ({
        ...acc,
        [lang]: [
          { text: "2000 SMS verifications" },
          { text: "Priority support" },
          { text: "API access" },
          { text: "Analytics dashboard" },
          { text: "Custom integration" },
        ],
      }),
      {},
    ),
    discount: 0,
    popular: false,
  },
  {
    id: "1-year",
    name: { en: "1 Year" },
    description: { en: "Best value for long-term use" },
    duration: 365,
    prices: { US: 249.99 },
    features: languages.reduce(
      (acc, lang) => ({
        ...acc,
        [lang]: [
          { text: "10000 SMS verifications" },
          { text: "24/7 priority support" },
          { text: "API access" },
          { text: "Advanced analytics" },
          { text: "Custom integration" },
          { text: "Dedicated account manager" },
        ],
      }),
      {},
    ),
    discount: 0,
    popular: false,
  },
]

export default function AdminSubscriptionPlans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch countries
        const countriesQuery = query(collection(db, "countries"), where("included", "==", true))
        const countriesSnapshot = await getDocs(countriesQuery)
        const countriesData = countriesSnapshot.docs.map((doc) => ({
          code: doc.id,
          name: doc.data().name,
          iso: doc.data().iso,
        }))
        setCountries(countriesData)

        // Fetch plans
        const plansSnapshot = await getDocs(collection(db, "subscription_plans"))
        let plansData = plansSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Plan[]

        // If no plans exist, use default plans
        if (plansData.length === 0) {
          plansData = defaultPlans
          for (const plan of plansData) {
            await setDoc(doc(db, "subscription_plans", plan.id), plan)
          }
        }

        // Ensure all languages have the same number of features
        plansData = plansData.map((plan) => {
          const maxFeatures = Math.max(...Object.values(plan.features).map((features) => features.length))
          const updatedFeatures = languages.reduce(
            (acc, lang) => {
              acc[lang] = Array(maxFeatures)
                .fill(null)
                .map((_, index) => plan.features[lang]?.[index] || { text: "" })
              return acc
            },
            {} as { [key: string]: PlanFeature[] },
          )
          return { ...plan, features: updatedFeatures }
        })

        setPlans(plansData)
        setSelectedPlan(plansData[0].id)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handlePlanChange = (planId: string, field: string, value: any, lang?: string) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              [field]: lang && typeof plan[field as keyof Plan] === 'object'
                ? { ...(plan[field as keyof Plan] as Record<string, any>), [lang]: value }
                : value,
            }
          : plan,
      ),
    )
  }

  const handlePriceChange = (planId: string, countryCode: string, price: number) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) =>
        plan.id === planId ? { ...plan, prices: { ...plan.prices, [countryCode]: price } } : plan,
      ),
    )
  }

  const handleFeatureChange = (planId: string, index: number, value: string) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              features: Object.fromEntries(
                Object.entries(plan.features).map(([lang, features]) => [
                  lang,
                  features.map((feature, i) => (i === index ? { ...feature, text: value } : feature)),
                ]),
              ),
            }
          : plan,
      ),
    )
  }

  const addFeature = (planId: string) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              features: Object.fromEntries(
                Object.entries(plan.features).map(([lang, features]) => [lang, [...features, { text: "" }]]),
              ),
            }
          : plan,
      ),
    )
  }

  const removeFeature = (planId: string, index: number) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              features: Object.fromEntries(
                Object.entries(plan.features).map(([lang, features]) => [lang, features.filter((_, i) => i !== index)]),
              ),
            }
          : plan,
      ),
    )
  }

  const savePlans = async () => {
    setLoading(true)
    try {
      for (const plan of plans) {
        await setDoc(doc(db, "subscription_plans", plan.id), plan)
      }
      toast({
        
        title: "Success",
        description: "Plans saved successfully!",
        variant: "success",

      })
    } catch (error) {
      console.error("Error saving plans:", error)
      toast({
        title: "Error",
        description: "Failed to save plans. Please try again.",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const currentPlan = plans.find((plan) => plan.id === selectedPlan)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Subscription Plans Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Edit Subscription Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="plan-select">Select Plan</Label>
              <Select value={selectedPlan || ""} onValueChange={setSelectedPlan}>
                <SelectTrigger id="plan-select">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent className="bg-slate-100">
                  {plans && plans.length > 0 ? (
                    plans.map((plan) => (
                      <SelectItem className="hover:text-blue-600" key={plan.id} value={plan.id}>
                        {plan.name.en}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-plans">No plans available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="language-select">Select Language</Label>
              <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
                <SelectTrigger id="language-select">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent className="bg-slate-100">
                  {languages.map((lang) => (
                    <SelectItem className="hover:text-blue-600" key={lang} value={lang}>
                      {languageNames[lang as keyof typeof languageNames]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {currentPlan && (
              <>
                <div>
                  <Label htmlFor={`name-${currentPlan.id}`}>Name</Label>
                  <Input
                    id={`name-${currentPlan.id}`}
                    value={currentPlan.name[currentLanguage] || ""}
                    onChange={(e) => handlePlanChange(currentPlan.id, "name", e.target.value, currentLanguage)}
                  />
                </div>
                <div>
                  <Label htmlFor={`description-${currentPlan.id}`}>Description</Label>
                  <Textarea
                    id={`description-${currentPlan.id}`}
                    value={currentPlan.description[currentLanguage] || ""}
                    onChange={(e) => handlePlanChange(currentPlan.id, "description", e.target.value, currentLanguage)}
                  />
                </div>
                <div>
                  <Label htmlFor={`duration-${currentPlan.id}`}>Duration (days)</Label>
                  <Input
                    id={`duration-${currentPlan.id}`}
                    type="number"
                    value={currentPlan.duration}
                    onChange={(e) => handlePlanChange(currentPlan.id, "duration", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor={`discount-${currentPlan.id}`}>Discount (%)</Label>
                  <Input
                    id={`discount-${currentPlan.id}`}
                    type="number"
                    value={currentPlan.discount}
                    onChange={(e) => handlePlanChange(currentPlan.id, "discount", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`popular-${currentPlan.id}`}
                    checked={currentPlan.popular}
                    onChange={(e) => handlePlanChange(currentPlan.id, "popular", e.target.checked)}
                  />
                  <Label htmlFor={`popular-${currentPlan.id}`}>Popular Plan</Label>
                </div>
                <div>
                  <Label>Prices</Label>
                  <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                    {countries.map((country) => (
                      <div key={country.code} className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center w-full">
<img
  src={`https://flagcdn.com/w20/${country.iso.toLowerCase()}.png`}
  alt={`Flag of ${country.name}`}
  className="mr-2"
  width={20}
  height={20}
/>
                          <span className="flex-grow">{country.name}</span>
                          <Input
                            type="number"
                            value={currentPlan.prices[country.code] || ""}
                            onChange={(e) =>
                              handlePriceChange(currentPlan.id, country.code, Number.parseFloat(e.target.value))
                            }
                            className="w-24"
                          />
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
                <div>
                  <Label>Features</Label>
                  {currentPlan.features[currentLanguage]?.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 mt-2">
                      <Input
                        value={feature.text}
                        onChange={(e) => handleFeatureChange(currentPlan.id, index, e.target.value)}
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeFeature(currentPlan.id, index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addFeature(currentPlan.id)} className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="mt-6">
        <Button onClick={savePlans} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Plans
        </Button>
      </div>
    </div>
  )
}

