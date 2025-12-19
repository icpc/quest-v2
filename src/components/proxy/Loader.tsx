import React, { ComponentType } from "react";
import { useNavigate } from "react-router";
import { ClipLoader } from "react-spinners";

import { UserInfo } from "@/types/types";
import { checkAuth, getUserInfo } from "@/utils/requests";

interface LoaderProps {
  component: ComponentType<{ userInfo: UserInfo }>;
}

export const LoaderComponent = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <ClipLoader color={"#123abc"} size={150} />
    </div>
  );
};

export function Loader({ component: Component }: LoaderProps) {
  const isAuthenticated = checkAuth();
  const userInfo = getUserInfo();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!userInfo) {
    return null;
  }

  return <Component userInfo={userInfo} />;
}

export default Loader;
