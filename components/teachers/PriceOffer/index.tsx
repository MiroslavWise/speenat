import { useTranslation } from "react-i18next"

import type { TPriceOffer } from "types/store/search"

import { cx } from "functions/cx"
import { useProfiles } from "store/use-profiles"

import styles from "./style.module.scss"

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
    const priceOffer = useProfiles(({ priceOffer }) => priceOffer)
    const usePriceOffer = useProfiles(({ usePriceOffer }) => usePriceOffer)

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
