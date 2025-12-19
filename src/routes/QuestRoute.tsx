import React from "react";
import { useParams } from "react-router";

import Loader, { LoaderComponent } from "@/components/Loader";
import QuestComponent from "@/features/quests/Quest";
import { getQuestWithSubmissions } from "@/utils/requests";
import { QuestWithSubmissions } from "@/types/types";

function QuestRouteContent() {
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
}

function QuestRoute() {
  return <Loader component={QuestRouteContent} />;
}

export default QuestRoute;
