import React from "react";
import Home from "./home";
import { getQuests } from "../../utils/requests";
import { ClipLoader } from "react-spinners";
import styled from "styled-components";
import Loader from "../login/Loader";
import { UserInfoProps } from "./home.types";

const HomeProxyWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const HomeProxyHelper: React.FC<UserInfoProps> = ({ userInfo }) => {
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
    return (
      <HomeProxyWrapper>
        <ClipLoader color={"#123abc"} size={150} />
      </HomeProxyWrapper>
    );
  }
  if (!quests || quests.length === 0) {
    return <div>No quests found</div>;
  }
  return <Home userInfo={userInfo} quests={quests} />;
};

const HomeProxy = () => {
  return <Loader component={HomeProxyHelper}/>
};

export default HomeProxy;
