import React from "react";
import {
  checkUserAuthentication,
  localStorageGetItemWithExpiry,
} from "../../utils/helper";
import Home from "./home";
import { useNavigate } from "react-router-dom";
import { getQuests } from "../../utils/requests";
import { ClipLoader } from "react-spinners";

const HomeProxy = () => {
  const isAuthenticated = checkUserAuthentication();
  const userInfo = React.useMemo(
    () => localStorageGetItemWithExpiry("userInfo") || "{}",
    []
  );
  const navigate = useNavigate();
  const [quests, setQuests] = React.useState([]);
  const [isQuestsLoading, setIsQuestsLoading] = React.useState(true);
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("quest/login");
    }
  }, [isAuthenticated, navigate]);

  React.useEffect(() => {
    if (userInfo) {
      getQuests(userInfo).then((response) => {
        setQuests(response?.quests);
        setIsQuestsLoading(false);
      });
    }
  }, [userInfo]);

  if (!userInfo) {
    return null;
  }

  if (isQuestsLoading) {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <ClipLoader color={"#123abc"} size={150} />
      </div>
    );
  }
  if (!quests || quests.length === 0) {
    return <div>No quests found</div>;
  }
  console.log(quests);
  return <Home userInfo={userInfo} quests={quests} />;
};
export default HomeProxy;
