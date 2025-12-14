import React from "react";

import { QuestSummary } from "../../types/types";
import { getQuestsWithSubmissionStats } from "../../utils/requests";
import Home from "../Home";

import Loader, { LoaderComponent } from "./Loader";

const HomeProxyHelper: React.FC = () => {
  const [quests, setQuests] = React.useState<QuestSummary[]>([]);
  const [isQuestsLoading, setIsQuestsLoading] = React.useState(true);

  React.useEffect(() => {
    getQuestsWithSubmissionStats().then((response) => {
      setQuests(response);
      setIsQuestsLoading(false);
    });
  }, []);

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
  return <Home quests={quests} />;
};

const HomeProxy = () => {
  return <Loader component={HomeProxyHelper} />;
};

export default HomeProxy;
