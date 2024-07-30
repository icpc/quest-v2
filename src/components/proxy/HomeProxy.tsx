import React from "react";
import Home from "../Home";
import {getQuests} from "../../utils/requests";
import Loader, {LoaderComponent} from "./Loader";
import {UserInfoProps} from "../../types/types";

const HomeProxyHelper: React.FC<UserInfoProps> = ({userInfo}) => {
    const [quests, setQuests] = React.useState([]);
    const [isQuestsLoading, setIsQuestsLoading] = React.useState(true);

    React.useEffect(() => {
        if (userInfo) {
            getQuests(userInfo).then((response) => {
                setQuests(response?.quests);
                setIsQuestsLoading(false);
            });
        }
    }, [userInfo]);

    if (isQuestsLoading) {
        return <LoaderComponent />
    }
    if (!quests || quests.length === 0) {
        return <div>No quests found</div>;
    }
    return <Home userInfo={userInfo} quests={quests}/>;
};

const HomeProxy = () => {
    return <Loader component={HomeProxyHelper}/>
};

export default HomeProxy;
