import { FC } from "react";

import style from './style.module.scss'

const Loader: FC = () => {
        
        return (
                <div className={style.container}>
                        <div className={style.Loader} />
                </div>

        )
}

export default Loader