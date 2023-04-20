import { NextPage } from "next";





const ServiceRule: NextPage = () => {

        return (
                <div className="wrapper terms show-animate">
                        <p className="title">Правила пользования ресурсом</p>
                        <p>Правила пользования ресурсом Consudoc.online для пациентов:</p>
                        <p className="left">Пройдите регистрацию</p>
                        <p className="left">Войдите в профиль студента</p>
                        <p className="left" >Зайдите в раздел «Найти спикера» - «Параметры поиска»</p>
                        <p className="left">Выберите длительность консультации, определите диапазон цен и нажмите на поиск спикера</p>
                        <p className="left">Из предоставленного списка выберите подходящего учебного специалиста</p>
                        <p className="left">Пополните электронный счет <span style={{ color: 'gray' }}>(личные данные вашей платежной карты не хранятся в нашем сервисе)</span></p>
                        <p className="left">Позвоните спикеру</p>
                        <p className="left">По завершению консультации не забудьте оставить отзыв <span style={{ color: 'gray' }}>(для нас важно ваше мнение)</span></p>
                        <br />
                        <p>Правила пользования ресурсом speenat.kz для спикера:</p>
                        <p className="left">Пройдите регистрацию, заполните профессиональные данные</p>
                        <p className="left">Определите цену оказываемых занятий</p>
                        <p className="left">Включите галочку «Онлайн» и ожидайте студента</p>
                </div>
        )
}

export default ServiceRule

export const getStaticProps = () => {
        return {
                props: {
                        
                }
        }
}