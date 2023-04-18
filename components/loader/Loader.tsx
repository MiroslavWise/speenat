import { FC } from "react"

import style from './style.module.scss'

const Loader: FC = () => {

        return (
                <div className={style.container}>
                        <div className={style['spinner-block']}>
                                <div className={style['spinner-3']}></div>
                        </div>
                </div>
        )
}

export const LoaderMin: FC = () => (
        <div style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
        }}
                className="show_opacity_loader"
        >
                <div className={style['spinner-block']}>
                        <div className={style['spinner-3']}></div>
                </div>
        </div>
)

export default Loader