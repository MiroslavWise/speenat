import { useDeleteAccount } from "store/use-delete-account"

export const DeleteAccount = () => {
    const visible = useDeleteAccount(({ visible }) => visible)

    return <div className="-wrapper-modal-" data-visible={visible}></div>
}
