import { deleteProfile } from "api/api-user"
import Link from "next/link"
import { useRouter } from "next/router"
import { useAuth } from "store/use-auth"

export default function DeleteAccount() {
    const out = useAuth(({ out }) => out)
    const router = useRouter()

    async function handleDelete() {
        deleteProfile().finally(() => {
            if (out) {
                out()
            }
            router.push("/")
        })
    }

    return (
        <div className="wrapper-delete-account">
            <section>
                <h3>Вы действительно хотите удалить аккаунт?</h3>
                <button onClick={handleDelete}>Да</button>
                <Link href={{ pathname: "/profile" }}>Нет</Link>
            </section>
        </div>
    )
}
