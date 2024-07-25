import React from "react";
import Quest from "../Quest";
import {useParams} from "react-router-dom";
import {getQuestSubmissions} from "../../utils/requests";
import {ClipLoader} from "react-spinners";
import {UserInfoProps, QuestSubmissions} from "../../types/types";
import Loader from "./Loader";

const QuestProxyHelper: React.FC<UserInfoProps> = ({userInfo}) => {
    const {questId} = useParams();
    const [isQuestsSubmissionsLoading, setIsQuestsSubmissionsLoading] =
        React.useState(true);
    const [questSubmissions, setQuestSubmissions] =
        React.useState<QuestSubmissions | null>({} as QuestSubmissions);

    React.useEffect(() => {
        if (userInfo) {
            getQuestSubmissions(questId, userInfo).then((response) => {
                if (response) {
                    setQuestSubmissions(response);
                    setIsQuestsSubmissionsLoading(false);
                } else {
                    setQuestSubmissions(null);
                    setIsQuestsSubmissionsLoading(false);
                }
            });
        }
    }, [questId, userInfo]);

    if (isQuestsSubmissionsLoading) {
        return (
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <ClipLoader color={"#123abc"} size={150}/>
            </div>
        );
    }
    if (!questSubmissions || !questSubmissions.id) {
        return <div>This quest not found</div>;
    }
    return (
        <Quest
            userInfo={userInfo}
            questSubmissions={questSubmissions}
            questId={questId}
        />
    );
};

const QuestProxy = () => {
    return <Loader component={QuestProxyHelper}/>;
};

export default QuestProxy;
