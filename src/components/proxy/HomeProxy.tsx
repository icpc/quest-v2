import React from "react";
import Home from "../Home";
import { getQuests } from "../../utils/requests";
import Loader, { LoaderComponent } from "./Loader";
import { UserInfoProps } from "../../types/types";

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
    return <LoaderComponent />;
  }
  if (!quests || quests.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
          backgroundColor: "#f8f9fa",
          color: "#343a40",
          fontFamily: "Arial, sans-serif",
          fontSize: "1.5rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "20px",
        }}
      >
        <p>🚀 Quests will be available soon!</p>
      </div>
    );
  }
  return <Home userInfo={userInfo} quests={quests} />;
};

const HomeProxy = () => {
  return <Loader component={HomeProxyHelper} />;
};

export default HomeProxy;
