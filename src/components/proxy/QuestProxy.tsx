import React from "react";
import { useParams } from "react-router-dom";

import { QuestWithSubmissions } from "../../types/types";
import { getQuestWithSubmissions } from "../../utils/requests";
import QuestComponent from "../Quest";

import Loader, { LoaderComponent } from "./Loader";

const QuestProxyHelper: React.FC = () => {
  const { questId } = useParams();
  const [isQuestsSubmissionsLoading, setIsQuestsSubmissionsLoading] =
    React.useState(true);
  const [questWithSubmissions, setQuestWithSubmissions] =
    React.useState<QuestWithSubmissions | null>(null);

  const load_quests = React.useCallback(() => {
    setIsQuestsSubmissionsLoading(true);
    if (!questId) {
      return;
    }
    getQuestWithSubmissions(questId as string).then((response) => {
      setQuestWithSubmissions(response);
      setIsQuestsSubmissionsLoading(false);
    });
  }, [questId]);

  React.useEffect(() => {
    load_quests();
  }, [load_quests]);

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
      onSubmit={load_quests}
    />
  );
};

const QuestProxy = () => {
  return <Loader component={QuestProxyHelper} />;
};

export default QuestProxy;
