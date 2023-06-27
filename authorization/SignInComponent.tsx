import { FC } from "react";

import ContainerSingAndRegister from "components/auth/ContainerSingAndRegister";

const SignInComponent: FC = () => {

        return (
                <div className="__wrapper-sign__">
                        <header className="header-sing">
                                <h1>speenat</h1>
                                {/* <h4>Самый быстрый способ проконсультироваться с преподавателем</h4> */}
                        </header>
                        <ContainerSingAndRegister />
                </div>
        )
}

export default SignInComponent