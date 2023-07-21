import { NextPage } from "next";

import ListArchive from "components/archive/ListArchive";

import { useDocumentTitle } from "hooks/useDocumentTitle";

const Archive: NextPage = () => {
        useDocumentTitle("Архив")
        return <ListArchive />
}

export default Archive