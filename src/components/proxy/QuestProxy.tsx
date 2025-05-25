import React from "react";
import { useParams } from "react-router";

import { QuestWithSubmissions } from "../../types/types";
import { getQuestWithSubmissions } from "../../utils/requests";
import QuestComponent from "../Quest";

import Loader, { LoaderComponent } from "./Loader";

const QuestProxyHelper: React.FC = () => {
  const params = useParams();
  const questId = params.questId;
  const [isQuestsSubmissionsLoading, setIsQuestsSubmissionsLoading] =
    React.useState(true);
  const [questWithSubmissions, setQuestWithSubmissions] =
    React.useState<QuestWithSubmissions | null>(null);

  const loadQuests = React.useCallback(() => {
    setIsQuestsSubmissionsLoading(true);
    if (!questId) {
      return;
    }
    getQuestWithSubmissions(questId).then((response) => {
      setQuestWithSubmissions(response);
      setIsQuestsSubmissionsLoading(false);
    });
  }, [questId]);

  React.useEffect(() => {
    loadQuests();
  }, [loadQuests]);

  if (isQuestsSubmissionsLoading) {
    return <LoaderComponent />;
  }
  if (!questWithSubmissions) {
    return <div>This quest not found</div>;
  }
  return (
    <QuestComponent
      quest={questWithSubmissions.quest}
      submissions={questWithSubmissions.submissions}
      onSubmit={loadQuests}
    />
  );
};

const QuestProxy = () => {
  return <Loader component={QuestProxyHelper} />;
};

export default QuestProxy;
