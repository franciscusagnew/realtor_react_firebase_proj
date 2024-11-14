import React from "react";
import { Navigate, Outlet } from "react-router";
import {useAuthStatus} from "../hooks/useAuthStatus";
import Spinner from "./Spinner";

export default function PrivateRoute() {
    // const loggedIn = false;
    const { loggedIn, loading } = useAuthStatus();

    if (loading) {
        // return <h3>Loading...</h3>
        return <Spinner />
    }

    return loggedIn ? <Outlet/> : <Navigate to="/sign-in"/>;
}
