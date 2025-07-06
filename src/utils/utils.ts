interface WithDate {
  date: string;
}

export const aggregateQuestsByDate = <T extends WithDate>(quests: T[]) => {
  if (!quests) return [];

  return Object.entries(
    quests.reduce(
      (acc, quest) => {
        const date = quest.date.split("T")[0];
        return {
          ...acc,
          [date]: [...(acc[date] || []), quest],
        };
      },
      {} as Record<string, T[]>,
    ),
  ).map(([date, detailsQuests]) => ({
    date,
    detailsQuests,
  }));
};
