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
      "https://icpcquestapi.azurewebsites.net/api/submit-quest",
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
      "https://icpcquestapi.azurewebsites.net/api/login",
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
      "https://icpcquestapi.azurewebsites.net/api/get-quests",
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
  try {
    const response = await fetch(
      `https://icpcquestapi.azurewebsites.net/api/get-quest-submissions`,
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

export const getLeaderboard = async (pageNumber: any, userInfo: any) => {
  try {
    if (!userInfo?.token) return null;
    if (!pageNumber) pageNumber = 1;
    const response = await fetch(
      `https://icpcquestapi.azurewebsites.net/api/get-rank?page=${pageNumber}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
          "page-size": "10",
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
