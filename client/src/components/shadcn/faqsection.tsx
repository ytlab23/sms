import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: "How does SMS verification work?",
    answer: "SMS verification works by providing you with a temporary phone number. When you need to verify an account, you use this number to receive the verification code. Once you receive the code, you enter it into the service you're trying to verify, completing the process."
  },
  {
    question: "Is this service legal?",
    answer: "Yes, our service is completely legal. We provide virtual phone numbers for legitimate verification purposes. However, it's the user's responsibility to comply with the terms of service of the platforms they're verifying for."
  },
  {
    question: "How long can I use a virtual number?",
    answer: "The duration depends on the package you choose. Typically, you can use a number for the time it takes to receive and enter the verification code, which is usually a matter of minutes. Some packages may offer extended usage times."
  },
  {
    question: "What if I don't receive the verification code?",
    answer: "If you don't receive the verification code within a few minutes, you can request a new code from the service you're verifying with. If issues persist, our 24/7 customer support team is available to assist you."
  },
  {
    question: "Which payment methods do you accept?",
    answer: "We accept a wide range of payment methods including credit cards, PayPal, and various cryptocurrencies. Check our payment page for a full list of accepted payment methods."
  }
]

export  function FaqSection() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border  border-gray-200 rounded-lg overflow-hidden">
      <button
        className="flex dark:bg-boxdark justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg  font-semibold">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-4 font-satoshi bg-gray-50 text-gray-700 text-lg leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}