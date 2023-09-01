import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useUser } from "store/use-user"

const MainPage: NextPage = () => {
    const { push } = useRouter()

    const isSpeaker = useUser((state) => state.is_speaker)

    useEffect(() => {
        console.log("isSpeaker: ", isSpeaker)
        if (isSpeaker === true) {
            push("/archive", undefined)
        }
        if (isSpeaker === false) {
            push("/teachers", undefined)
        }
    }, [isSpeaker])

    return <></>
}

export default MainPage