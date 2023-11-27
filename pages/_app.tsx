import type { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from "react-query"
import { ToastContainer } from "react-toastify"

import { Authorization } from "context/Authorization"
import { AntdLanguageProvider } from "context/LanguageContext"
import Layout from "layout/Layout"

import "styles/init.scss"
import "plyr-react/plyr.css"
import "helpers/i18n"
import "react-toastify/dist/ReactToastify.min.css"

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AntdLanguageProvider>
            <QueryClientProvider client={queryClient}>
                <Authorization>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                    <ToastContainer />
                </Authorization>
            </QueryClientProvider>
        </AntdLanguageProvider>
    )
}
