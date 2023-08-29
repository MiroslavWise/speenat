import { useEffect, useRef } from 'react';

const usePlaySound = () => {
    const audiosWeWantToUnlock = useRef<HTMLAudioElement[]>([])

    useEffect(() => {
        audiosWeWantToUnlock.current?.push(new Audio('./sound/nothing.wav'))

        const isTouched = () => {
            if (audiosWeWantToUnlock != null) {
                for (const audio of audiosWeWantToUnlock.current) {
                    audio.play()
                    audio.pause()
                    audio.currentTime = 0
                }
                audiosWeWantToUnlock.current = []
            }
        }

        window?.addEventListener('touchstart', isTouched, false)

        const nothing = new Audio('./sound/nothing.wav')

        nothing
            .play()
            .then(() => {
                console.log('Audio is playing')
            })
            .catch(() => {})
        return () => {
            window?.removeEventListener('touchstart', isTouched)
        }
    }, [])


    const playSoundSwitchStatus = () => {
        const onlineStatusSound = new Audio('./sound/new_message_tone.mp3')

        onlineStatusSound
            .play()
            .then(() => {
                console.log('playSoundSwitchStatus')
            })
            .catch(() => {})

        console.log('Sound 111111111111')
    }

    const incomingDoctorCall = () => {
        const callSound = new Audio("./sound/zvuk-skayp-skype-call-calling-23010.wav")

        callSound
            .play()
            .then(() => {
                console.log('incomingDoctorCall play')
            })
            .catch(() => {})
    }


    return {playSoundSwitchStatus, incomingDoctorCall}
};

export default usePlaySound;