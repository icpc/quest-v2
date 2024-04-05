import React from "react";
import {
  checkUserAuthentication,
  localStorageGetItemWithExpiry,
} from "../../utils/helper";
import Task from "./task";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestSubmissions } from "../../utils/requests";
import { QuestSubmissions } from "./task.types";

const TaskProxy = () => {
  const { questId } = useParams();
  const isAuthenticated = checkUserAuthentication();
  const userInfo = React.useMemo(
    () => localStorageGetItemWithExpiry("userInfo") || "{}",
    []
  );
  const navigate = useNavigate();
  const [isQuestsSubmissionsLoading, setIsQuestsSubmissionsLoading] =
    React.useState(true);
  const [questSubmissions, setQuestSubmissions] = React.useState<
    QuestSubmissions[]
  >([]);
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  React.useEffect(() => {
    if (userInfo) {
      getQuestSubmissions(questId, userInfo).then((response) => {
        if (response) {
          setQuestSubmissions(response);
          setIsQuestsSubmissionsLoading(false);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!userInfo) {
    return null;
  }

  if (isQuestsSubmissionsLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Task
      userInfo={userInfo}
      questSubmissions={questSubmissions}
      questId={questId}
    />
  );
};
export default TaskProxy;
