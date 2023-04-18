import type { AppProps } from 'next/app'
import {
        QueryClient,
        QueryClientProvider,
} from 'react-query'

import { Authorization } from 'context/Authorization'
import Layout from 'layout/Layout'

import 'styles/init.scss'
import 'helpers/i18n'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
        return (
                <QueryClientProvider client={queryClient}>
                        <Authorization>
                                <Layout>
                                        <Component {...pageProps} />
                                </Layout>
                        </Authorization>
                </QueryClientProvider>
        )
}