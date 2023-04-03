import type { AppProps } from 'next/app'

import { Authorization } from 'context/Authorization'

import 'styles/init.scss'

export default function App({ Component, pageProps }: AppProps) {
        return (
                <Authorization>
                        <Component {...pageProps} />
                </Authorization>
        )
}