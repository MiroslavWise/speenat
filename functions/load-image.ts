interface IProps{
        src: string
        width: any
        quality?: any
}

export default function loadImage ({ src, width, quality }: IProps) {
        return `${src}`
}