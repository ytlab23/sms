import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function useChangeLanguageAndPath() {
  const navigate = useNavigate()
  const { i18n } = useTranslation()

  const changeLanguageAndPath = (lang: string) => {
    // Change the language in i18n
    i18n.changeLanguage(lang)
    console.log("lang", lang)

    // Get the current URL path without language prefix
    const currentPath = window.location.pathname.replace(/^\/(en|es|pt|fr|de|it|ru|zh|ja|ar)/, '')

    // Construct the new path with the language prefix
    const newPath = `/${lang}${currentPath}`
    console.log("newkkkPath", newPath)

    // Navigate to the new URL with the language prefix
    navigate(newPath, { replace: true })
  }

  return changeLanguageAndPath
}
