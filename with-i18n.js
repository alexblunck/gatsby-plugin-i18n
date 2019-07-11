import React from 'react'
import get from 'lodash.get'
import { navigate } from 'gatsby'

import { I18nContextConsumer } from './i18n-context'

const translate = i18n => id => {
    return get(i18n.translations, id) || id
}

const changeLocale = i18n => locale => {
    const path = i18n.originalPagePath
    const isDefault = locale === i18n.defaultLocale
    const isIndex = path === '/'

    let link

    if (isIndex) {
        link = isDefault ? '/' : `/${locale}`
    } else {
        link = isDefault ? path : `/${locale}${path}`
    }

    window.localStorage.setItem('gatsby-plugin-i18n-locale', locale)
    navigate(link)
}

export const withI18n = Component => {
    const WrappedComponent = props => {
        return (
            <I18nContextConsumer>
                {i18n => (
                    <Component
                        {...props}
                        i18n={i18n}
                        locale={i18n.locale}
                        t={translate(i18n)}
                        changeLocale={changeLocale(i18n)}
                    />
                )}
            </I18nContextConsumer>
        )
    }

    return WrappedComponent
}
