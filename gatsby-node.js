const { removeTrailingSlash } = require('./helpers')

exports.onCreatePage = ({ page, actions }, pluginOptions) => {
    const { createPage, deletePage } = actions

    // Plugin options
    const {
        locales = ['en'],
        defaultLocale = 'en',
        translationsPath = '.'
    } = pluginOptions

    // Delete automatically created page
    deletePage(page)

    locales.forEach(locale => {
        // If page.context has i18nOverrideLocale property set, only create
        // page for that locale
        if (
            page.context.i18nOverrideLocale &&
            page.context.i18nOverrideLocale !== locale
        ) {
            return
        }

        const isDefault = locale === defaultLocale
        const originalPagePath = removeTrailingSlash(page.path)
        const isIndex = originalPagePath === '/'

        let path

        if (isIndex) {
            path = isDefault ? '/' : `/${locale}`
        } else {
            path = isDefault
                ? originalPagePath
                : `/${locale}${originalPagePath}`
        }

        createPage({
            ...page,
            path,
            context: {
                ...page.context,
                i18n: {
                    defaultLocale,
                    locales,
                    locale,
                    translations: require(`${translationsPath}/${locale}.json`),
                    originalPagePath
                }
            }
        })
    })
}
