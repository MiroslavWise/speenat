import { Divider } from "antd/lib"
import { NextPage } from "next"

const Voluntary: NextPage = () => {
    return (
        <div className="wrapper terms show-animate">
            <p className="title">
                Информированное добровольное согласие на виды учебных занятий, включенные в Перечень определенных видов
                учебных услуг, на которые граждане дают информированное добровольное согласие при выборе спикера и
                обучающей организации для получения знаний.
            </p>
            <Divider />
            <p>
                Я, студент, зарегистрированный на сервисе speenat.kz, подтверждаю достоверность данных, которые ввел при
                регистрации на сервисе speenat.kz и даю информированное добровольное согласие на виды медицинских
                консультаций, включенные в Перечень определенных видов учебных занятий и услуг, на которые граждане дают
                информированное добровольное согласие при выборе спикера (или преподавателя) учебной организации для
                получения знаний, (далее -Перечень), для получения знанийТОО «ITB Company» а также других клиник,
                перечисленных на веб-странице speenat.kz.
            </p>
        </div>
    )
}

export default Voluntary

export const getStaticProps = () => {
    return {
        props: {},
    }
}
