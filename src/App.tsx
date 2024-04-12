import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/login/login";
import QuestProxy from "./pages/quest/quest.proxy";
import HomeProxy from "./pages/home/home.proxy";
import Leaderboard from "./pages/leaderboard/leaderboard.proxy";
import DrawerAppBar from "./componetns/header/header";
import { Toolbar } from "@mui/material";
import Admin from "./pages/adminTable/admin";

const App = () => {
  return (
    <BrowserRouter>
      <div
        className="container"
        style={{
          backgroundColor: "#f8fbfd",
        }}
      >
        <DrawerAppBar />
        <Toolbar />
        <Routes>
          <Route index path="/" element={<SignIn />} />
          <Route index path="/login" element={<SignIn />} />
          <Route index path="/home" element={<HomeProxy />} />
          <Route index path="/quest/:questId" element={<QuestProxy />} />
          <Route
            index
            path="/leaderboard/:pageNumber"
            element={<Leaderboard />}
          />
          <Route index path="/leaderboard" element={<Leaderboard />} />
          <Route index path="/admin/submissionsTable" element={<Admin />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
