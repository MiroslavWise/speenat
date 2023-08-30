import { FC, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import styles from "../../styles/left-arrow.module.scss";
import { cx } from "functions/cx";

const LeftArrow: FC = () => {
    const { back, asPath } = useRouter();

    const active: boolean | undefined = useMemo(() => {
        const array: string[] = ["/profile", "/chat", "/pay-data", "/archive", "/teachers", "/spec",]

        return array.includes(asPath)
    }, [asPath])

    return (
        <Image
            className={cx(styles.containerLeftAOrHide, active && styles.notActive)}
            onClick={back}
            src="/svg/arrow-circle-left.svg"
            alt="arrow-circle-left"
            width={34}
            height={34}
        />
    );
};

export default LeftArrow;
