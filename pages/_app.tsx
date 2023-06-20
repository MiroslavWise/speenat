import type { AppProps } from 'next/app'
import Script from 'next/script'
import {
        QueryClient,
        QueryClientProvider,
} from 'react-query'

import { Authorization } from 'context/Authorization'
import { AntdLanguageProvider } from 'context/LanguageContext'
import Layout from 'layout/Layout'

import 'styles/init.scss'
import 'helpers/i18n'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
        return (
                <AntdLanguageProvider>
                        <QueryClientProvider client={queryClient}>
                                <Authorization>
                                        <Layout>
                                                <Component {...pageProps} />
                                        </Layout>
                                </Authorization>
                        </QueryClientProvider>
                </AntdLanguageProvider>
        )
}