import React, { ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import styled from "styled-components";

import { checkAuth, getUserInfo } from "../../utils/requests";

interface LoaderProps {
  component: ComponentType<any>;
}

const LoaderComponentWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const LoaderComponent = () => {
  return (
    <LoaderComponentWrapper>
      <ClipLoader color={"#123abc"} size={150} />
    </LoaderComponentWrapper>
  );
};

export const Loader: React.FC<LoaderProps> = ({ component: Component }) => {
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
};

export default Loader;
