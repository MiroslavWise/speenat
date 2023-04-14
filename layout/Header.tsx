import { FC } from "react"
import { useRouter } from "next/router"
import { isMobile } from "react-device-detect"
import LeftArrow from "./components/header/LeftArrow"
import NameCategory from "./components/header/NameCategory"
import MenuDots from "./components/header/RightMenuDots"





const Header: FC = () => {
        const { asPath } = useRouter()

        return (
                isMobile
                        ? (
                                <header className="header">
                                        <LeftArrow />
                                        <NameCategory />
                                        <MenuDots />
                                </header>
                        ) : null
        )
}

export default Header