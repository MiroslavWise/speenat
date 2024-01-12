/** @type {import('next').NextConfig} */
const path = require("path")

const nextConfig = {
    images: {
        domains: [process.env.NEXT_PUBLIC_IMAGE],
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
    },
    webpack(config, options) {
        const { isServer } = options
        config.module.rules.push({
            test: /\.(ogg|mp3|wav|mpe?g)$/i,
            exclude: config.exclude,
            use: [
                {
                    loader: require.resolve("url-loader"),
                    options: {
                        limit: config.inlineImageLimit,
                        fallback: require.resolve("file-loader"),
                        outputPath: `${isServer ? "../" : ""}static/images/`,
                        name: "[name]-[hash].[ext]",
                        esModule: config.esModule || false,
                    },
                },
            ],
            experimental: {
                esmExternals: true,
            },
        })
        return config
    },
}

module.exports = nextConfig
