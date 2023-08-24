import { FC } from "react";
import Image from "next/image";

import ContainerSingAndRegister from "components/auth/ContainerSingAndRegister";
import { LanguagesOpenButton } from "components/auth/components/LanguagesOpenButton";
import { Welcome } from "./Welcome";

const SignInComponent: FC = () => {

        return (
                <>
                        <div className="__wrapper-sign__">
                                <header className="header-sing">
                                        <Image
                                                src="/images/speanat.png"
                                                alt="logo"
                                                width={168.7}
                                                height={70}
                                        />
                                </header>
                                <ContainerSingAndRegister />
                                <LanguagesOpenButton />
                                <Welcome />
                        </div>
                </>
        )
}

export default SignInComponent

{/* <h1>Добро пожаловать в нашу семью <span>SPENAT</span></h1>
<p>Станьте лучшей версией себя</p> */}