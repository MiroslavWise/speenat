import React, {useEffect, useState} from 'react';
import useSound from "use-sound";

const usePlaySound = () => {

    const [fileName, setFileName] = useState('')
    let audiosWeWantToUnlock: HTMLAudioElement[] | null = []

    const [play, soundEnabled] = useSound(fileName, {
        volume: 0.9
    })

    useEffect(() => {

        console.log(audiosWeWantToUnlock)

        // audiosWeWantToUnlock.push(new Audio('./sound/nothing.wav'))
        audiosWeWantToUnlock?.push(new Audio('./sound/nothing.wav'))
        // audiosWeWantToUnlock.push(new Audio('./sound/537061_7117640-lq.mp3'))

        const isTouched = () => {
            if (audiosWeWantToUnlock != null) {
                for (const audio of audiosWeWantToUnlock) {
                    audio.play()
                    audio.pause()
                    audio.currentTime = 0
                }
                audiosWeWantToUnlock = null
            }
        }

        window?.addEventListener('touchstart', isTouched, false)

        // const nothing = new Audio('./sound/nothing.wav')
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