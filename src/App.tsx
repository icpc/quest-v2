import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/login/login";
import QuestProxy from "./pages/quest/quest.proxy";
import HomeProxy from "./pages/home/home.proxy";
import Leaderboard from "./pages/leaderboard/leaderboard.proxy";
import DrawerAppBar from "./components/header/header";
import { Toolbar } from "@mui/material";
import Admin from "./pages/adminTable/admin";

const App = () => {
  return (
    <HashRouter>
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
          <Route path="/login" element={<SignIn />} />
          <Route path="/home" element={<HomeProxy />} />
          <Route
            path="/quest-details/:questId"
              element={<QuestProxy />}
          />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route
            path="/leaderboard/:pageNumber"
            element={<Leaderboard />}
          />
          <Route
            path="/admin/submissionsTable"
            element={<Admin />}
          />
          <Route path="*" element={<SignIn />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
