interface LoadImageProps {
    src: string
    width: number | string
    quality?: number
}

/**
 *
 * @param {LoadImageProps} props
 * @returns {string}
 */
export default function loadImage({ src, width, quality }: LoadImageProps): string {
    return src
}
