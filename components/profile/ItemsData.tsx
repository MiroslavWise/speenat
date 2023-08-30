import { FC } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { useUser } from "store/use-user";
import { useAuth } from "store/use-auth";

const ItemsData: FC = () => {
    const { t } = useTranslation();
    const { push } = useRouter();
    const out = useAuth((state) => state.out);
    const user = useUser((state) => state.user);

    const handlePageInvite = () => push("/invited", undefined);
    const handlePageStaff = () => push("/analytics", undefined);
    const handlePageAccountant = () => push(`/accountant`, undefined);

    return (
        <>
            <li>
                <div className="icon">
                    <Image
                        src="/svg/terms/mail.svg"
                        alt="wallet"
                        width={18}
                        height={18}
                    />
                </div>
                <p>{user?.profile?.user?.email}</p>
            </li>
            <li>
                <div className="icon">
                    <Image
                        src="/svg/terms/wallet.svg"
                        alt="wallet"
                        width={18}
                        height={18}
                    />
                </div>
                <p>
                    {Number(user?.profile?.balance?.current_balance)?.toFixed(
                        2,
                    )}
                </p>
            </li>
        </>
    );
};

export default ItemsData;
