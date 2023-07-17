import { NextPage } from "next";
import { useDocumentTitle } from "hooks/useDocumentTitle";

const SafePay: NextPage = () => {
        useDocumentTitle("Безопасность онлайн-платежей")

        return (
                <div className="wrapper terms show-animate">
                        <p className="title">
                                Безопасность онлайн-платежей
                        </p>
                        <p className="sub-title">
                                Платежи. Оплата банковской картой онлайн
                        </p>
                        <p>
                                Наш сайт подключен к интернет-эквайрингу, и вы можете оплатить услугу банковской картой Visa или MasterCard. После подтверждения выбранного товара либо услуги откроется защищенное окно с платежной страницей платежной системы Pitech, где вам необходимо ввести данные вашей банковской карты. Для дополнительной аутентификации держателя карты используется протокол 3-D Secure. Если ваш банк-эмитент поддерживает данную технологию, вы будете перенаправлены на его сервер для прохождения дополнительной идентификации. Информацию о правилах и методах дополнительной идентификации уточняйте в банке, выдавшем вам банковскую карту.
                        </p>
                        <p>
                        Услуга онлайн-оплаты осуществляется в соответствии с правилами международных платежных систем Visa и MasterCard на принципах соблюдения конфиденциальности и безопасности совершения платежа, для этого используются самые актуальные методы проверки, шифрования и передачи данных по закрытым каналам связи. Ввод данных банковской карты осуществляется в защищенном окне на платежной странице Pitech.
                        </p>
                        <p>
                        В поля на платежной странице требуется ввести номер карты, имя владельца карты, срок действия карты, трёхзначный код безопасности (CVV2 для VISA или CVC2 для MasterCard). Все необходимые данные отображены на поверхности банковской карты.
                        </p>
                        <p>
                                CVV2/ CVC2 — это трёхзначный код безопасности, находящийся на оборотной стороне карты.
                        </p>
                        <p>
                                Далее в том же окне откроется страница вашего банка-эмитента для ввода 3-D Secure кода. В случае если у вас не настроен статичный 3-D Secure, он будет отправлен на ваш номер телефона посредством SMS. Если 3-D Secure код вам не пришел, следует обратиться в ваш банк-эмитент.
                        </p>
                        <p>
                                3-D Secure — это самая современная технология обеспечения безопасности платежей по картам в сети интернет. Позволяет однозначно идентифицировать подлинность держателя карты, осуществляющего операцию, и максимально снизить риск мошеннических операций по карте.
                        </p>
                        <p className="sub-title">Гарантии безопасности</p>
                        <p>
                                Платежная система Pitech защищает и обрабатывает данные вашей банковской карты по стандарту безопасности PCI DSS 3.2.1. Передача информации в платежный шлюз происходит с применением технологии шифрования SSL. Дальнейшая передача информации происходит по закрытым банковским сетям, имеющим наивысший уровень надежности. Pitech не передает данные вашей карты нам и иным третьим лицам. Для дополнительной аутентификации держателя карты используется протокол 3-D Secure.
                        </p>
                        <p>
                                В случае если у вас есть вопросы по совершенному платежу, вы можете обратиться в службу поддержки клиентов платежного сервиса по электронной почте <b>support@pitech.kz</b>.
                        </p>
                        <p className="sub-title">Безопасность онлайн-платежей</p>
                        <p>
                                Предоставляемая вами персональная информация (имя, адрес, телефон, e-mail, номер кредитной карты) является конфиденциальной и не подлежит разглашению. Данные вашей кредитной карты передаются только в зашифрованном виде и не сохраняются на нашем web-сервере.
                        </p>
                        <p>
                                Безопасность обработки интернет-платежей гарантирует ТОО «Pitech». Все операции с платежными картами происходят в соответствии с требованиями VISA International, MasterCard и других платежных систем. При передаче информации используются специализированные технологии безопасности карточных онлайн-платежей, обработка данных ведется на безопасном высокотехнологичном сервере процессинговой компании.
                        </p>
                        <p>
                                Оплата платежными картами безопасна, потому что:
                        </p>
                        <p className="left">
                                Система авторизации гарантирует покупателю, что платежные реквизиты его платежной карты (номер, срок действия, CVV2/CVC2) не попадут в руки мошенников, так как эти данные не хранятся на сервере авторизации и не могут быть похищены.
                        </p>
                        <p className="left">
                                Покупатель вводит свои платежные данные непосредственно в системе авторизации Pitech, а не на сайте интернет-магазина, следовательно, платежные реквизиты карты покупателя не будут доступны третьим лицам.
                        </p>
                        <p className="sub-title">Конфиденциальность</p>
                        <p className="sub-title"><b>1. Определения</b></p>
                        <p>
                                Интернет-магазин <a href="https://speenat.kz/">https://speenat.kz/</a> (далее – <a href="https://speenat.kz/">URL</a>, «мы») серьезно относится к вопросу
                                конфиденциальности информации своих клиентов и посетителей сайта <a href="https://speenat.kz/">https://speenat.kz/</a> (далее – «вы», «посетители сайта»). Персонифицированной
                                мы называем информацию, содержащую персональные данные (например: ФИО, логин или название компании) посетителя сайта, а также информацию о
                                действиях, совершаемых вами на сайте <a href="https://speenat.kz/">URL</a>. (например: заказ посетителя сайта с его контактной информацией). Анонимными мы называем данные, по
                                которым невозможно однозначно идентифицировать конкретного посетителя сайта (например: статистика посещаемости сайта).
                        </p>
                        <p className="sub-title"><b>2. Использование информации</b></p>
                        <p>
                                Мы используем персонифицированную информацию конкретного посетителя сайта исключительно для обеспечения ему качественного оказания услуг и их учета.
                                Мы не раскрываем персонифицированные данные одних посетителей сайта <a href="https://speenat.kz/">URL</a> другим посетителям сайта. Мы никогда не публикуем
                                персонифицированную информацию в открытом доступе и не передаем ее третьим лицам. Исключением являются лишь ситуации, когда предоставление
                                такой информации уполномоченным государственным органам предписано действующим законодательством Республики Казахстан. Мы публикуем и
                                распространяем только отчеты, построенные на основании собранных анонимных данных. При этом отчеты не содержат информацию, по которой было
                                бы возможным идентифицировать персонифицированные данные пользователей услуг. Мы также используем анонимные данные для внутреннего
                                анализа, целью которого является развитие продуктов и услуг <a href="https://speenat.kz/">URL</a>.
                        </p>
                        <p className="sub-title"><b>3. Ограничение ответственности</b></p>
                        <p>
                                Мы делаем все возможное для соблюдения настоящей политики конфиденциальности, однако мы не можем гарантировать сохранность
                                информации в случае воздействия факторов, находящихся вне нашего влияния, результатом действия которых станет раскрытие
                                информации. Сайт <a href="https://speenat.kz/">URL</a> и вся размещенная на нем информация представлены по принципу «как есть» без каких-либо
                                гарантий. Мы не несем ответственности за неблагоприятные последствия, а также за любые убытки, причиненные вследствие ограничения
                                доступа к сайту <a href="https://speenat.kz/">URL</a> или вследствие посещения сайта и использования размещенной на нем информации.
                        </p>
                        <p className="sub-title"><b>4. Контакты</b></p>
                        <p>
                                По вопросам, касающимся настоящей политики, просьба обращаться по адресу <b>info@speenat.kz</b>
                        </p>
                        <p className="sub-title"><b>Юридическое лицо</b></p>
                        <p>TОО "ITB Company"</p>
                        {/* <p>БИН 200740013018</p> */}
                        <p>Время работы: Ежедневно с 8:00 до 17:30 по времени города Нур-Султан</p>
                        <p>Юридический адрес: <a href="https://goo.gl/maps/CVgebxJbkpwTZwuQ7" target="_blank">г. Астана, ул. Кунаева 12/1, офис 305 БЦ "На водно-зеленом бульваре"</a></p>
                </div>
        )
}

export default SafePay

export const getStaticProps = () => {
        return {
                props: {
                        
                }
        }
}