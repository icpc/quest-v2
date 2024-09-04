import React from "react";

const Rules = () => {
    return (
        <div style={{
            margin: '10%'
          }}>
          <h1>Rules</h1>
          <p>Every day between September 15 and September 19 visit <a href="https://news.icpc.global/quest">https://news.icpc.global/quest</a> for a set of new daily quests! </p>
          <p>
            Each quest belongs to one of the 7 categories: 
            <ul>
              <li>culture</li>
              <li>networking</li>
              <li>person hunt</li>
              <li>photo hunt</li>
              <li>social media</li>
              <li>solve</li>
              <li> misc.</li>
             </ul>
            Each quest requires a solution of one of the three formats: 
            <ul>
              <li>text (type your answer here)</li>
              <li>photo (upload a picture)</li>
              <li>video (please, try keeping it short ;) ).</li>
            </ul>
          </p>
          <p>At the end of each day, 30 daily prized will be awarded Quest participant with highest score of that day. They will be able to pick up their prizes at EXPO Alumni Lounge. In case of a tiebreak, Daily Prizes will be distributed among highest scoring participants on first-come first-served basis.</p>
          <br/>
          <p>During the World Finals contest the Quest Grand Prize raffle will take place among Quest participants with total highest score. </p>
        </div>
    );
}

export default Rules;