
// import React, { useState, useEffect } from "react"
// import { useTranslation } from "react-i18next"
// import { Check, Clock, Calendar, CalendarDays, CalendarCheck } from "lucide-react"
// import { Button } from "./ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
// import { db } from "../../firebase/config"
// import { collection, getDocs, query, where } from "firebase/firestore"

// interface Country {
//   code: string
//   name: string
//   iso: string
// }

// interface PlanPrice {
//   [countryCode: string]: number
// }

// interface PlanFeature {
//   text: string
//   included: boolean
// }

// interface Plan {
//   id: string
//   name: {
//     [lang: string]: string
//   }
//   description: {
//     [lang: string]: string
//   }
//   duration: number
//   prices: PlanPrice
//   features: {
//     [lang: string]: PlanFeature[]
//   }
//   discount: number
//   popular: boolean
// }

// const icons = {
//   7: Clock,
//   30: Calendar,
//   90: CalendarDays,
//   365: CalendarCheck,
// }

// export default function SubscriptionPlansDisplay() {
//   const [plans, setPlans] = useState<Plan[]>([])
//   const [countries, setCountries] = useState<Country[]>([])
//   const [selectedCountry, setSelectedCountry] = useState<string>("")
//   const [loading, setLoading] = useState(true)
//   const { t, i18n } = useTranslation()

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch countries
//         const countriesQuery = query(collection(db, "countries"), where("included", "==", true))
//         const countriesSnapshot = await getDocs(countriesQuery)
//         const countriesData = countriesSnapshot.docs.map((doc) => ({
//           code: doc.id,
//           name: doc.data().name,
//           iso: doc.data().iso,
//         }))
//         setCountries(countriesData)
//         setSelectedCountry(countriesData[0]?.code || "")

//         // Fetch plans
//         const plansSnapshot = await getDocs(collection(db, "subscription_plans"))
//         const plansData = plansSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as Plan[]

//         const sortOrder = [7, 30, 90, 365]
//         plansData.sort((a, b) => sortOrder.indexOf(a.duration) - sortOrder.indexOf(b.duration))

//         setPlans(plansData)

//         setLoading(false)
//       } catch (error) {
//         console.error("Error fetching data:", error)
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   const getPrice = (plan: Plan) => {
//     const price = plan.prices[selectedCountry] || Object.values(plan.prices)[0] || 0
//     const discountedPrice = price * (1 - plan.discount / 100)
//     return discountedPrice.toFixed(2)
//   }

//   const getPlanName = (plan: Plan) => {
//     switch (plan.duration) {
//       case 7:
//         return t("subscriptionPlans.weekly")
//       case 30:
//         return t("subscriptionPlans.monthly")
//       case 90:
//         return t("subscriptionPlans.quarterly")
//       case 365:
//         return t("subscriptionPlans.yearly")
//       default:
//         return t("subscriptionPlans.custom", { days: plan.duration })
//     }
//   }

//   if (loading) {
//     return <div>{t("common.loading")}</div>
//   }

//   return (
//     <div className="bg-gradient-to-b min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center">
//           <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{t("subscriptionPlans.title")}</h2>
//           <p className="mt-4 text-xl text-gray-600">{t("subscriptionPlans.subtitle")}</p>
//         </div>
//         <div className="mt-8 flex justify-center">
//           <Select value={selectedCountry} onValueChange={setSelectedCountry}>
//             <SelectTrigger className="w-[200px]">
//               <SelectValue placeholder={t("subscriptionPlans.selectCountry")} />
//             </SelectTrigger>
//             <SelectContent>
//               {countries.map((country) => (
//                 <SelectItem key={country.code} value={country.code}>
//                   <div className="flex items-center">
//                     <img
//                       src={`https://flagcdn.com/w20/${country.iso.toLowerCase()}.png`}
//                       alt={`Flag of ${country.name}`}
//                       className="mr-2"
//                       width={20}
//                       height={20}
//                     />
//                     {country.name}
//                   </div>
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div className="mt-12 px-16 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-2">
//           {plans.map((plan) => {
//             const Icon = icons[plan.duration as keyof typeof icons] || Clock
//             return (
//               <Card
//                 key={plan.id}
//                 className={`flex bg-blue-100 hover:bg-blue-50 flex-col justify-between rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-blue-500 hover:border-2 ${
//                   plan.popular ? "border-blue-500 border-2 hover:bg-blue-50 scale-105" : ""
//                 }`}
//               >
//                 <CardHeader className="flex flex-col items-center">
//                   <div className="p-3 bg-blue-100 rounded-full mb-4">
//                     <Icon className="w-8 h-8 text-blue-600" />
//                   </div>
//                   <CardTitle className="text-2xl font-semibold">{plan.name[i18n.language] || plan.name.en}</CardTitle>
//                   <CardDescription>{plan.description[i18n.language] || plan.description.en}</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-center">
//                     <span className="text-3xl font-extrabold">${getPrice(plan)}</span>
//                     <span className="text-base font-medium text-gray-500">/{getPlanName(plan)}</span>
//                     {plan.discount > 0 && (
//                       <span className="ml-2 text-sm font-medium text-red-500">-{plan.discount}%</span>
//                     )}
//                   </div>
//                   <ul className="mt-6 space-y-2">
//                     {(plan.features[i18n.language] || plan.features.en).map((feature, index) => (
//                       <li key={index} className="flex items-start">
//                         <div className="flex-shrink-0">
//                           <Check className={`h-5 w-5 ${feature.included ? "text-blue-500" : "text-gray-300"}`} />
//                         </div>
//                         <p className="ml-3 text-base text-gray-700">{feature.text}</p>
//                       </li>
//                     ))}
//                   </ul>
//                 </CardContent>
//                 <CardFooter>
//                   <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300">
//                     {plan.popular ? t("subscriptionPlans.getStarted") : t("subscriptionPlans.choosePlan")}
//                   </Button>
//                 </CardFooter>
//                 {plan.popular && (
//                   <div className="absolute top-0 right-0  -mt-3 -mr-3 px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full transform rotate-12 shadow-lg">
//                     {t("subscriptionPlans.popular")}
//                   </div>
//                 )}
//               </Card>
//             )
//           })}
//         </div>
//       </div>
//     </div>
//   )
// }

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Check, Clock, Calendar, CalendarDays, CalendarCheck } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { db } from "../../firebase/config"
import { collection, getDocs, query, where } from "firebase/firestore"

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
  included: boolean
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

const icons = {
  7: Clock,
  30: Calendar,
  90: CalendarDays,
  365: CalendarCheck,
}

export default function SubscriptionPlansDisplay() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const { t, i18n } = useTranslation()

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
        setSelectedCountry(countriesData[0]?.code || "")

        // Fetch plans
        const plansSnapshot = await getDocs(collection(db, "subscription_plans"))
        const plansData = plansSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Plan[]

        const sortOrder = [7, 30, 90, 365]
        plansData.sort((a, b) => sortOrder.indexOf(a.duration) - sortOrder.indexOf(b.duration))

        setPlans(plansData)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getPrice = (plan: Plan) => {
    const originalPrice = plan.prices[selectedCountry] || Object.values(plan.prices)[0] || 0
    const discountedPrice = originalPrice * (1 - plan.discount / 100)
    return {
      original: originalPrice.toFixed(2),
      discounted: discountedPrice.toFixed(2),
    }
  }

  const getPlanName = (plan: Plan) => {
    switch (plan.duration) {
      case 7:
        return t("subscriptionPlans.weekly")
      case 30:
        return t("subscriptionPlans.monthly")
      case 90:
        return t("subscriptionPlans.quarterly")
      case 365:
        return t("subscriptionPlans.yearly")
      default:
        return t("subscriptionPlans.custom", { days: plan.duration })
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{t("subscriptionPlans.title")}</h2>
          <p className="mt-4 text-xl text-gray-600">{t("subscriptionPlans.subtitle")}</p>
        </div>
        <div className="mt-8 flex justify-center items-center space-x-4">
          <label htmlFor="country-select" className="text-xl  font-bold text-blue-600">
            {t("subscriptionPlans.chooseCountry")}
          </label>
          <Select
            value={selectedCountry}
            onValueChange={setSelectedCountry}
            aria-label={t("subscriptionPlans.chooseCountry")}
          >
            <SelectTrigger id="country-select" className="w-[200px]">
              <SelectValue placeholder={t("subscriptionPlans.selectCountry")} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {countries.map((country) => (
                <SelectItem
                  key={country.code}
                  value={country.code}
                  className="hover:bg-blue-100 transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <img
                      src={`https://flagcdn.com/w20/${country.iso.toLowerCase()}.png`}
                      alt={`Flag of ${country.name}`}
                      className="mr-2"
                      width={20}
                      height={20}
                    />
                    {country.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-12 px-16   space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-2">
          {plans.map((plan) => {
            const Icon = icons[plan.duration as keyof typeof icons] || Clock
            return (
              <Card
                key={plan.id}
                className={`flex bg-blue-100 hover:bg-blue-50 flex-col justify-between rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-blue-500 hover:border-2 ${
                  plan.popular ? "border-blue-500 border-2 hover:bg-blue-50 scale-105" : ""
                }`}
              >
                <CardHeader className="flex flex-col items-center">
                  <div className="p-3 bg-blue-100 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-semibold">{plan.name[i18n.language] || plan.name.en}</CardTitle>
                  <CardDescription>{plan.description[i18n.language] || plan.description.en}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="mb-2">
                      <span className="text-3xl font-extrabold">${getPrice(plan).discounted}</span>
                      <span className="text-base font-medium text-gray-500">/{getPlanName(plan)}</span>
                    </div>
                    {plan.discount > 0 && (
                      <div className="text-sm">
                        <span className="line-through text-gray-500">${getPrice(plan).original}</span>
                        <span className="ml-2 font-medium text-red-500">Save {plan.discount}%</span>
                      </div>
                    )}
                  </div>
                  <ul className="mt-6 space-y-2">
                    {(plan.features[i18n.language] || plan.features.en).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className={`h-5 w-5 ${feature.included ? "text-blue-500" : "text-gray-300"}`} />
                        </div>
                        <p className="ml-3 text-base text-gray-700">{feature.text}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300">
                    {plan.popular ? t("subscriptionPlans.getStarted") : t("subscriptionPlans.choosePlan")}
                  </Button>
                </CardFooter>
                {plan.popular && (
                  <div className="absolute top-0 right-0 -mt-3 -mr-3 px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full transform rotate-12 shadow-lg ">
                    {t("subscriptionPlans.popular")}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

