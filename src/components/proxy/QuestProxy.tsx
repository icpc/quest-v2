import React from "react";
import Quest from "../Quest";
import {useParams} from "react-router-dom";
import {getQuestSubmissions} from "../../utils/requests";
import {UserInfoProps, QuestSubmissions} from "../../types/types";
import Loader, {LoaderComponent} from "./Loader";

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
        return <LoaderComponent />
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
