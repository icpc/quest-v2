import React, { createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/login/login";
import TaskProxy from "./pages/task/task.proxy";
import HomeProxy from "./pages/home/home.proxy";
import DrawerAppBar from "./componetns/header/header";
import { Toolbar } from "@mui/material";

const App = () => {
  return (
    <BrowserRouter>
      <div className="container">
        <DrawerAppBar />
        <Toolbar />
        <Routes>
          <Route index path="/" element={<SignIn />} />
          <Route index path="/login" element={<SignIn />} />
          <Route index path="/home" element={<HomeProxy />} />
          <Route index path="/task/:questId" element={<TaskProxy />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
