export const submitTask = async (submission: any) => {
    try {
         if (!submission.file  ) {
            return null;
         }
         const formData = new FormData();
    formData.append("file", submission.file); 

    formData.append("userId", "1");
    formData.append("questId", submission.taskId ?? "1");

    const response = await fetch("https://icpcquest.azurewebsites.net/api/UploadFile", {
            method: "POST",
            body: formData, // Use formData as the body, not JSON.stringify(submission)
          });        
        return response;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
  };