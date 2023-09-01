import { useEffect, useRef } from "react"

const usePlaySound = () => {
    const audiosWeWantToUnlock = useRef<HTMLAudioElement[]>([])
    const audioCtx = new AudioContext()

    useEffect(() => {
        audiosWeWantToUnlock.current?.push(new Audio("./sound/nothing.wav"))

        const isTouched = () => {
            if (audiosWeWantToUnlock != null) {
                for (const audio of audiosWeWantToUnlock.current) {
                    const source = audioCtx.createMediaElementSource(audio)
                    source.connect(audioCtx.destination)
                    audio.play()
                    audio.pause()
                    audio.currentTime = 0
                }
                audiosWeWantToUnlock.current = []
            }
        }

        window?.addEventListener("touchstart", isTouched, false)

        const nothing = new Audio("./sound/nothing.wav")

        nothing
            .play()
            .then(() => {
                console.log("Audio is playing")
            })
            .catch(() => {})
        return () => {
            window?.removeEventListener("touchstart", isTouched)
        }
    }, [])

    const playSoundSwitchStatus = () => {
        const onlineStatusSound = "./sound/new_message_tone.mp3"

        audiosWeWantToUnlock.current?.push(new Audio(onlineStatusSound))

        if (audiosWeWantToUnlock != null) {
            for (const audio of audiosWeWantToUnlock.current) {
                const source = audioCtx.createMediaElementSource(audio)
                source.connect(audioCtx.destination)
                audio.play()
                // audio.pause()
                // audio.currentTime = 0
            }
            audiosWeWantToUnlock.current = []
        }
        console.log("Sound 111111111111")
    }

    const incomingDoctorCall = () => {
        const callSound = "./sound/zvuk-skayp-skype-call-calling-23010.wav"
        audiosWeWantToUnlock.current?.push(new Audio(callSound))

        if (audiosWeWantToUnlock != null) {
            for (const audio of audiosWeWantToUnlock.current) {
                const source = audioCtx.createMediaElementSource(audio)
                source.connect(audioCtx.destination)
                audio.play()
                // audio.pause()
                // audio.currentTime = 0
            }
            audiosWeWantToUnlock.current = []
        }
    }

    return { playSoundSwitchStatus, incomingDoctorCall }
}

export default usePlaySound
