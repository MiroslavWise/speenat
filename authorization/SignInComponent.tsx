import { FC } from "react"
import Image from "next/image"

import { Welcome } from "./Welcome"
import ContainerSingAndRegister from "components/auth/ContainerSingAndRegister"

const SignInComponent: FC = () => {
    return (
        <div className="__wrapper-sign__">
            <header className="header-sing">
                <Image src="/images/speanat.png" alt="logo" width={168.7} height={70} />
            </header>
            <ContainerSingAndRegister />
            <Welcome />
        </div>
    )
}

export default SignInComponent
