import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import SignIn from "./pages/login/login";
import Task from "./pages/task/task";

const App = () => {
  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route index path="/" element={<SignIn />} />
          <Route index path="/login" element={<SignIn />} />
          <Route index path="/home" element={<Home />} />
          <Route index path="/task/:taskId" element={<Task />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
