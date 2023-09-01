import { NextPage } from "next"

import ListArchive from "components/archive/ListArchive"

import { useDocumentTitle } from "hooks/useDocumentTitle"

const Archive: NextPage = () => {
    useDocumentTitle("SessionArchive")
    return <ListArchive />
}

export default Archive
