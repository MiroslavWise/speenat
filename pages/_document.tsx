import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
        return (
                <Html lang="kz">
                        <Head>
                                <link rel="icon" href="/images/speanat-icon.png"/>
                                <meta name="viewport" content="initial-scale=1.0, user-scalable=no, maximum-scale=1" />
                        </Head>
                        <body>
                                <Main />
                                <NextScript />
                        </body>
                </Html>
        )
}