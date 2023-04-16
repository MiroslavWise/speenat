import { NextPage } from "next";

import { Typography } from "antd";

import ListInvited from "components/invited/ListInvited";
import { Divider } from "antd";



const Invited: NextPage = () => {

        return (
                <div className="wrapper invited">
                        <div className="link-invited">
                                <p>Ваша ссылка для приглашения: </p>
                                <Typography.Paragraph copyable className="link">LINK</Typography.Paragraph>
                        </div>
                        <Divider />
                        <ListInvited />
                </div>
        )
}

export default Invited