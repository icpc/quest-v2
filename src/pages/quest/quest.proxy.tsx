import React from "react";
import {
  checkUserAuthentication,
  localStorageGetItemWithExpiry,
} from "../../utils/helper";
import Quest from "./quest";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestSubmissions } from "../../utils/requests";
import { QuestSubmissions } from "./quest.types";
import { ClipLoader } from "react-spinners";

const QuestProxy = () => {
  const { questId } = useParams();
  const isAuthenticated = checkUserAuthentication();
  const userInfo = React.useMemo(
    () => localStorageGetItemWithExpiry("userInfo") || "{}",
    []
  );
  const navigate = useNavigate();
  const [isQuestsSubmissionsLoading, setIsQuestsSubmissionsLoading] =
    React.useState(true);
  const [questSubmissions, setQuestSubmissions] =
    React.useState<QuestSubmissions | null>({} as QuestSubmissions);
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/quest/login");
    }
  }, [isAuthenticated, navigate]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!userInfo) {
    return null;
  }

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
        <ClipLoader color={"#123abc"} size={150} />
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
export default QuestProxy;
