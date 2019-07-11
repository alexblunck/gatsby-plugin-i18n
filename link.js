import React from 'react'
import { Link as GatsbyLink } from 'gatsby'

import { I18nContextConsumer } from './i18n-context'

const Link = ({ to, children, ...rest }) => {
    return (
        <I18nContextConsumer>
            {i18n => {
                const isDefault = i18n.locale === i18n.defaultLocale
                const isIndex = to === '/'

                let link

                if (isIndex) {
                    link = isDefault ? '/' : `/${i18n.locale}`
                } else {
                    link = isDefault ? to : `/${i18n.locale}${to}`
                }

                return (
                    <GatsbyLink {...rest} to={link}>
                        {children}
                    </GatsbyLink>
                )
            }}
        </I18nContextConsumer>
    )
}

export default Link
