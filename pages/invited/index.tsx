import { NextPage } from "next";

import { Typography } from "antd";

import ListInvited from "components/invited/ListInvited";
import { Divider } from "antd";
import { useUser } from "store/use-user";



const Invited: NextPage = () => {
        // const link = useUser(state => state.user?.profile)

        return (
                <div className="wrapper invited">
                        <div className="link-invited">
                                <p>Ваша ссылка для приглашения: </p>
                                <Typography.Paragraph copyable className="link">{ "" }</Typography.Paragraph>
                        </div>
                        
                        <ListInvited />
                </div>
        )
}

export default Invited