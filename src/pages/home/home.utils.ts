import { QuestsDays } from "./home.types";

export const aggregateQuestsByDate = (quests: any): QuestsDays[] => {
  if (!quests) return [] as QuestsDays[];
  const questsDaysDic: any = {};
  quests.forEach((quest: any) => {
    const date = quest?.date?.split("T")[0];
    if (!questsDaysDic[date]) {
      questsDaysDic[date] = [];
    }
    questsDaysDic[date].push({
      id: quest.id,
      name: quest.name,
      type: quest.type,
      description: quest.description,
      status: quest.status,
      totalAc: quest?.totalAc,
    });
  });
  const daysQuestsArray = Object.keys(questsDaysDic).map((key) => ({
    date: key,
    detailsQuests: questsDaysDic[key],
  }));
  console.log(daysQuestsArray);

  return daysQuestsArray;
};
