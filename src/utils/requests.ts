export const submitTask = async (submission: any, userInfo: any) => {
  try {
    if (!submission.questId || !userInfo?.token) {
      return null;
    }
    const formData = new FormData();
    if (submission.type === "text") {
      if (!submission.text || submission.text === "") {
        return null;
      }
      formData.append("answer", submission.text);
    } else {
      formData.append("answer", submission.file);
    }
    formData.append("questId", submission.questId ?? "1");
    const response = await fetch(
      "https://icpcquest.azurewebsites.net/api/submit-quest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
        body: formData,
      }
    );
    if (response.status === 200) {
      return response.json();
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const login = async (user: any) => {
  try {
    const response = await fetch(
      "https://icpcquest.azurewebsites.net/api/login",
      {
        method: "POST",
        body: JSON.stringify(user),
      }
    ).then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const getQuests = async (userInfo: any) => {
  try {
    const response = await fetch(
      "https://icpcquest.azurewebsites.net/api/get-quests",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      }
    ).then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const getQuestSubmissions = async (questId: any, userInfo: any) => {
  /*
     mock response to be 
     {
       questId : 1,
       questName: "Quest 1"
       questDate : "2021-10-10T10:00:00",
       questType : "VIDEO",
       questDescription : "Create a video",
       questStatus : "PENDING",
       "submissions": [
        {
          id : 1,
          value : "35de78e9-357d-4b87-8f3a-d9dc0672825b.mp4",
          uploadTime : "2021-10-10T10:00:00",
          status : "PENDING",
          submissionType : "VIDEO"
        },
        {
          id : 2,
          value : "35de78e9-357d-4b87-8f3a-d9dc0672825b.mp4",
          uploadTime : "2021-10-10T10:00:00",
          status : "PENDING",
          submissionType : "VIDEO"
        },
        {
          id : 3,
          value : "35de78e9-357d-4b87-8f3a-d9dc0672825b.mp4",
          uploadTime : "2021-10-10T10:00:00",
          status : "PENDING",
          submissionType : "VIDEO"
        },
        {
          id : 4,
          value : "35de78e9-357d-4b87-8f3a-d9dc0672825b.mp4",
          uploadTime : "2021-10-10T10:00:00",
          status : "PENDING",
          submissionType : "VIDEO"
        },
        {
          id : 5,
          value : "35de78e9-357d-4b87-8f3a-d9dc0672825b.mp4",
          uploadTime : "2021-10-10T10:00:00",
          status : "PENDING",
          submissionType : "VIDEO"
        }
       ]
     }
  */

  // const mockResponseGetQuestSubmissions = {
  //   questId: 1,
  //   questName: "Quest 1",
  //   questDate: "2021-10-10T10:00:00",
  //   questType: "TEXT",
  //   questDescription: "Find this unique arabic hexagonal pattern ",
  //   questStatus: "PENDING",
  //   submissions: [
  //     {
  //       id: 1,
  //       value: "01591dbc-a659-4b16-8391-2ad5dcd42509.jpeg",
  //       uploadTime: "2021-10-10T10:00:00",
  //       status: "PENDING",
  //       submissionType: "image",
  //     },
  //     {
  //       id: 2,
  //       value: "3-8d80f8ef-5773-4d44-9256-ddf4c8600c5e.mp4",
  //       uploadTime: "2021-10-10T10:00:00",
  //       status: "PENDING",
  //       submissionType: "video",
  //     },
  //     {
  //       id: 3,
  //       value: "Tourist is the best competitive programmer",
  //       uploadTime: "2021-10-10T10:00:00",
  //       status: "PENDING",
  //       submissionType: "text",
  //     },
  //   ],
  // };

  // return mockResponseGetQuestSubmissions;

  try {
    const response = await fetch(
      `https://icpcquest.azurewebsites.net/api/get-quest-submissions`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
          questId: questId,
        },
      }
    ).then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
