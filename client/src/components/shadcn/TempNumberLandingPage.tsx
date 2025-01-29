// import React from "react"
// import { motion } from "framer-motion"
// import { useTranslation } from "react-i18next"
// // import { Features } from "Features"
// // import { FaqSection } from "../components/FaqSection"
// // import { ChooseService } from "../components/ChooseService"
// // import { Button } from "/ui/Button"
// import { ArrowRight, Shield, Globe, Zap } from "lucide-react"
// import { Button } from "./ui/button"
// import { ChooseService } from "./chooseservice"
// import { CountrySelector } from "./buy-service/country-selector"

// export default function TempNumberLandingPage() {
//   const { t } = useTranslation()

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
//       <header className="container mx-auto px-4 py-16 text-center">
//         <motion.h1
//           className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           {t("landing.title")}
//         </motion.h1>
//         <motion.p
//           className="text-xl mb-8 text-gray-600"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           {t("landing.subtitle")}
//         </motion.p>
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//         >
//           <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
//             {t("landing.getStarted")}
//             <ArrowRight className="ml-2 h-5 w-5" />
//           </Button>
//         </motion.div>
//       </header>

//       <section className="container mx-auto px-4 py-16">
//         <h2 className="text-3xl font-bold mb-8 text-center">{t("landing.howItWorks")}</h2>
//         <div className="grid md:grid-cols-3 gap-8">
//           {[
//             { icon: <Shield className="h-12 w-12 text-blue-600" />, title: t("landing.secure") },
//             { icon: <Globe className="h-12 w-12 text-green-600" />, title: t("landing.global") },
//             { icon: <Zap className="h-12 w-12 text-yellow-600" />, title: t("landing.instant") },
//           ].map((item, index) => (
//             <motion.div
//               key={index}
//               className="bg-white p-6 rounded-lg shadow-lg text-center"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 * index }}
//             >
//               {item.icon}
//               <h3 className="text-xl font-semibold mt-4 mb-2">{item.title}</h3>
//               <p className="text-gray-600">{t(`landing.feature${index + 1}`)}</p>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       <section className="bg-gray-50 py-16">
//         <div className="container w-full min-w-full mx-auto px-4">
//           <h2 className="text-3xl  font-bold mb-8 text-center">{t("landing.chooseService")}</h2>
//           <ChooseService isSide={false} />
//         </div>
//       </section>

    

//       <footer className="bg-gray-800 text-white py-8">
//         <div className="container mx-auto px-4 text-center">
//           <p>&copy; 2023 Temp Number Service. {t("landing.allRightsReserved")}</p>
//         </div>
//       </footer>
//     </div>
//   )
// }

import React from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { ArrowRight, Shield, Globe, Zap, CheckCircle, Phone } from "lucide-react"
import { Button } from "./ui/button"
import { ChooseService } from "./chooseservice"
import { CountrySelector } from "./buy-service/country-selector"
import { Link } from "react-router-dom"

export default function TempNumberLandingPage() {
  const { t,i18n } = useTranslation()

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <div className="min-h-screen  bg-whiten dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Section */}
      <header className="container mx-auto px-6  text-center">
        <motion.h1
          className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {t("landing.title")}
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-10 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {t("landing.subtitle")}
        </motion.p>
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        > */}
          {/* <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t("landing.getStarted")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button> */}
        {/* </motion.div> */}
      </header>

      {/* Choose Service Section */}
      <section className="container mx-auto px-6 ">
        {/* <motion.h2 className="text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white" {...fadeInUp}>
          {t("landing.chooseService")}
        </motion.h2> */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <ChooseService isSide={false} />
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="container mt-6 mx-auto px-6 py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl shadow-inner">
        <motion.h2 className="text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white" {...fadeInUp}>
          {t("landing.howItWorks")}
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              icon: <Shield className="h-16 w-16 text-blue-600 dark:text-blue-400" />,
              title: t("landing.secure"),
              color: "blue",
            },
            {
              icon: <Globe className="h-16 w-16 text-green-600 dark:text-green-400" />,
              title: t("landing.global"),
              color: "green",
            },
            {
              icon: <Zap className="h-16 w-16 text-yellow-600 dark:text-yellow-400" />,
              title: t("landing.instant"),
              color: "yellow",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className={`bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 * index }}
            >
              <div className={`inline-block p-4 rounded-full bg-${item.color}-100 dark:bg-${item.color}-900 mb-6`}>
                {item.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4 dark:text-white">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t(`landing.feature${index + 1}`)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.h2 className="text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white" {...fadeInUp}>
          {t("landing.features")}
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-12">
          {[
            { color: "blue", title: "landing.featureA.title", description: "landing.featureA.description" },
            { color: "green", title: "landing.featureB.title", description: "landing.featureB.description" },
            { color: "yellow", title: "landing.featureC.title", description: "landing.featureC.description" },
            { color: "purple", title: "landing.featureD.title", description: "landing.featureD.description" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className={`flex items-start bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-l-4 border-${feature.color}-500 hover:shadow-xl transition-all duration-300`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 * index }}
            >
              <CheckCircle className={`h-12 w-12 text-${feature.color}-500 mr-6 mt-1 flex-shrink-0`} />
              <div>
                <h3 className="text-2xl font-semibold mb-4 dark:text-white">{t(feature.title)}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t(feature.description)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container mx-auto px-6 py-24 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white text-center rounded-3xl shadow-2xl">
        <motion.h2
          className="text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {t("landing.joinUs")}
        </motion.h2>
        <motion.p
          className="text-2xl mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {t("landing.callToAction")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        ><Link  to={`/${i18n.language}/subscription-plans`}>
          <Button
            size="lg"
            className="bg-white hover:scale-105 hover:bg-blue-100 text-blue-600 hover:bg-gray-100 text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t("landing.getStartedNow")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button></Link>
        </motion.div>
      </section>
    </div>
  )
}


