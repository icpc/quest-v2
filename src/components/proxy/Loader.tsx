import React, {ComponentType} from "react";
import {checkUserAuthentication, localStorageGetItemWithExpiry} from "../../utils/helper";
import {useNavigate} from "react-router-dom";

interface LoaderProps {
    component: ComponentType<any>;
}

const Loader: React.FC<LoaderProps> = ({component: Component}) => {
    const isAuthenticated = checkUserAuthentication();
    const userInfo = React.useMemo(() => localStorageGetItemWithExpiry("userInfo") || "{}", []);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    if (!userInfo) {
        return null;
    }

    return <Component userInfo={userInfo}/>
};

export default Loader;