import { useEffect } from "react"
import { useRouter } from "next/router"

// import { apiOrder } from "api/api-order"

import styles from "./style.module.scss"

export default function IdNumberOrder() {
    const { query, push } = useRouter()

    // useEffect(() => {
    // if () {
    // apiOrder()
    //     }
    // }, [query])

    useEffect(() => {
        push(`/pay-data`)
    }, [])

    return <section className={styles.wrapper}></section>
}
