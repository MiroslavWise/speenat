import type { TPriceOffer } from "types/store/search"

import styles from "./style.module.scss"
import { cx } from "functions/cx"
import { useProfiles } from "store/use-profiles"
import { shallow } from "zustand/shallow"
import { useTranslation } from "react-i18next"

const BUTTONS: { value: TPriceOffer }[] = [
    {
        value: "economy",
    },
    {
        value: "business",
    },
    {
        value: "premium",
    },
    {
        value: "vip",
    },
]

export function PriceOffer() {
    const { t } = useTranslation()
    const { usePriceOffer, priceOffer } = useProfiles((state) => state, shallow)

    return (
        <ul className={styles.wrapper}>
            {BUTTONS.map((item) => (
                <li
                    key={`${item.value}_offer_price`}
                    className={cx(item?.value === priceOffer && styles.active)}
                    onClick={() => {
                        usePriceOffer(item.value)
                    }}
                >
                    <span>{t(item.value!)!.toUpperCase()}</span>
                </li>
            ))}
        </ul>
    )
}
