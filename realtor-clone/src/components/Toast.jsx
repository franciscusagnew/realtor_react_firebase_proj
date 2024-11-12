import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React from 'react'

export default function Toast() {
    const notify = () => toast("Wow so easy!");
    return (
        <div>
            <button onClick={notify}>Notify!</button>
            <ToastContainer />
        </div>
    );
}
