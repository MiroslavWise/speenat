import { NextPage } from "next"

import { TERMS } from "components/terms/list-terms"
import ItemTerms from "components/terms/ItemTerm"

const Terms: NextPage = () => {
    return (
        <>
            <div className="wrapper terms-list">
                {TERMS.map((item, index) => (
                    <ItemTerms key={item?.path} {...item} index={index} />
                ))}
            </div>
        </>
    )
}

export default Terms

export const getStaticProps = () => {
    return {
        props: {},
    }
}
