import { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";





const Page_404: NextPage = () => {
        const { push } = useRouter()

        useEffect(() => {
                const timeOut = setTimeout(() => {
                        push('/', undefined)
                }, 2 * 1000)

                return () => clearTimeout(timeOut)
        })

        return (
                <div className="flex-row __wrapper-error__">
                </div>
        )
}

export default Page_404