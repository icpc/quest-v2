import React from "react";
import {
  checkUserAuthentication,
  localStorageGetItemWithExpiry,
} from "../../utils/helper";
import Home from "./home";
import { useNavigate } from "react-router-dom";
import { getQuests } from "../../utils/requests";

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
      navigate("/login");
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
    return <div>Loading...</div>;
  }
  return <Home userInfo={userInfo} quests={quests} />;
};
export default HomeProxy;
