import type { AppProps } from 'next/app'

import { Authorization } from 'context/Authorization'
import Layout from 'layout/Layout'

import 'styles/init.scss'
import 'helpers/i18n'

export default function App({ Component, pageProps }: AppProps) {
        return (
                <Authorization>
                        <Layout>
                                <Component {...pageProps} />
                        </Layout>
                </Authorization>
        )
}