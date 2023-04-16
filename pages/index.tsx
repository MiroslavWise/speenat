import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";




const MainPage: NextPage = () => {
        const { push } = useRouter()

        useEffect(() => {
                push('/teachers')
        }, [])

        return (
                <>
                </>
        )
}

export default MainPage