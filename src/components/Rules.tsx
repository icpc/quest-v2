import React from "react";

const Rules = () => {
  return (
    <div
      style={{
        margin: "10%",
      }}
    >
      <h1>Rules</h1>
      <p>
        Every day between August 31 and September 4 visit{" "}
        <a href="https://news.icpc.global/quest">
          https://news.icpc.global/quest
        </a>{" "}
        for a set of new daily quests!{" "}
      </p>
      <p>
        Each quest belongs to one of the 7 categories:
        <ul>
          <li>culture</li>
          <li>networking</li>
          <li>person hunt</li>
          <li>photo hunt</li>
          <li>social media</li>
          <li>solve</li>
          <li>misc.</li>
        </ul>
        Each quest requires a solution of one of the three formats:
        <ul>
          <li>text (type your answer here)</li>
          <li>photo (upload a picture)</li>
          <li>video (please, try keeping it short ;) ).</li>
        </ul>
      </p>
      <p>
        Every day, top 10 participants will receive daily souvenirs! Solve as many quests as possible to compete for the grand Quest prizes!
      </p>
      <br />
      <p>The winners will be notified via email address.</p>
      <br />
      <p>
        Contact email address:{" "}
        <a href="mailto:live+quest@icpc.global">live+quest@icpc.global</a>{" "}
      </p>
    </div>
  );
};

export default Rules;
