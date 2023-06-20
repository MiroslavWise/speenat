import { type FC, useEffect } from 'react'

interface IProps {
        visible?: boolean,
        doHangup: () => void,
        isDoctor?: boolean,
        time: any,
        setTime: any
}

export const TimerSession: FC<IProps> = ({ visible, doHangup, time, setTime, isDoctor }) => {
        let minute = (Math.floor(time / 60)).toString().padStart(2, "0")
        let second = (+time - +minute * 60).toString().padStart(2, "0")
        useEffect(() => {
                if (time < 1) {
                        doHangup()
                }
        }, [time])

        useEffect(() => {
                const interval = () => setInterval(() => {
                        setTime((time: number) => time - 1)
                }, 1000)

                if (visible) interval()

                return () => clearInterval(interval())
        }, [visible])

        return (
                <>
                        {
                                time < 20 * 60 - 5 && time > 20 * 59 && !isDoctor
                                &&
                                <p className={`${time - 20 * 59 < 3 && 'red_timer'}`}>Если вас устраивает качество связи, то через {time - 20 * 59} секунд начнётся списание денег</p>
                        }
                        <span className={`${time < 60 && 'red_timer'}`} style={{ alignSelf: 'center' }}>
                                {minute}:{second}
                        </span>
                </>
        )
}