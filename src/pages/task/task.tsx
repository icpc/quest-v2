import React, { useState, useEffect } from "react";
import { checkUserAuthentication } from "../../utils/helper";
import { useNavigate, useParams } from "react-router-dom";
import { submitTask } from "../../utils/requests";

const Task = () => {
  const { taskId } = useParams();
  const isAuthenticated = checkUserAuthentication(); // Implement this function to check if the user is authenticated
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [submission, setSubmission] = useState({
    text: "",
    file: null,
    userId: 1,
    questId: 1,
  });
  const [submitTaskStatus, setSubmitTaskStatus] = useState("");

  const handleInputChange = (event: { target: { value: any } }) => {
    setSubmission({ ...submission, text: event.target.value });
  };

  const handleFileChange = (event: any) => {
    setSubmission({ ...submission, file: event.target.files[0] });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setSubmitTaskStatus("Submitting task");
    const newSubmit = await submitTask(submission);
    if (newSubmit) {
      setSubmitTaskStatus("Task submitted successfully");
    } else {
      setSubmitTaskStatus("Error submitting task");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      // fetch(`/api/tasks/${taskId}`)
      //   .then((response) => response.json())
      //   .then((data) => setTask(data))
      //   .catch((error) => console.error("Error:", error));
      setTask({ name: `Task ${taskId}` });
    }
  }, [isAuthenticated, navigate, taskId]);

  if (!isAuthenticated) {
    return null;
  }

  return task ? (
    <div>
      <div>
        Hello from Task {taskId}: {task?.name}
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          Text:
          <input
            type="text"
            value={submission.text}
            onChange={handleInputChange}
          />
        </label>
        <label>
          File:
          <input type="file" onChange={handleFileChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
      <br></br>
      <div>{submitTaskStatus}</div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Task;
