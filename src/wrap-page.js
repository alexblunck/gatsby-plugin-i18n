const React = require('react')
const PropTypes = require('prop-types')
const browserLang = require('browser-lang').default

const { removeTrailingSlash } = require('./helpers')
const { I18nContextProvider } = require('./i18n-context')

const wrapPageElement = ({ element, props }) => {
    const { i18n } = props.pageContext

    let isRedirect = false

    if (typeof window !== 'undefined') {
        let detected = window.localStorage.getItem('gatsby-plugin-i18n-locale')

        // Detect browser locale
        if (!detected && i18n.options.redirectToBrowserLocale) {
            detected = browserLang({
                languages: i18n.locales,
                fallback: i18n.locale
            })
        }

        // Make sure detected locale is supported
        if (!i18n.locales.includes(detected)) {
            detected = i18n.locale
        }

        const currentPath = removeTrailingSlash(window.location.pathname)
        const path = i18n.originalPagePath
        const isDefault = detected === i18n.defaultLocale
        const isIndex = path === '/'

        let redirectPath

        if (isIndex) {
            redirectPath = isDefault ? '/' : `/${detected}`
        } else {
            redirectPath = isDefault ? path : `/${detected}${path}`
        }

        // Redirect only to detected locale if original locale is the default locale
        if (i18n.locale === i18n.defaultLocale) {
            window.localStorage.setItem('gatsby-plugin-i18n-locale', detected)

            if (redirectPath !== currentPath) {
                isRedirect = true
                window.location.replace(redirectPath)
            }
        }
        // If not redirecting cache original locale
        else {
            window.localStorage.setItem(
                'gatsby-plugin-i18n-locale',
                i18n.locale
            )
        }
    }

    // Don't render page when redirecting to prevent content flash
    return (
        <I18nContextProvider value={i18n}>
            {isRedirect ? null : element}
        </I18nContextProvider>
    )
}

wrapPageElement.propTypes = {
    element: PropTypes.element,
    props: PropTypes.object,
    pageContext: PropTypes.object
}

module.exports = wrapPageElement
