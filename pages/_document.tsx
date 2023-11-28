import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document"
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs"

const MyDocument = () => {
    return (
        <Html lang="kz">
            <Head>
                <link rel="icon" href="/images/speanat-icon.png" />
                <meta name="viewport" content="initial-scale=1.0, user-scalable=no, maximum-scale=1" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
    const cache = createCache()
    const originalRenderPage = ctx.renderPage
    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) => (props) =>
                (
                    <StyleProvider cache={cache}>
                        <App {...props} />
                    </StyleProvider>
                ),
        })

    const initialProps = await Document.getInitialProps(ctx)
    const style = extractStyle(cache, true)
    return {
        ...initialProps,
        styles: (
            <>
                {initialProps.styles}
                <style dangerouslySetInnerHTML={{ __html: style }} />
            </>
        ),
    }
}

export default MyDocument
