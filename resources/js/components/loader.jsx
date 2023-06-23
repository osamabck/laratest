import React, { useContext } from "react";
import "../../scss/components/loader.scss";
import LoaderContext from "../other/Loader.js";

export default function Loader() {
    const { loading } = useContext(LoaderContext);
    return (
        <div className="overlay" style={{ display: loading ? "flex" : "none" }}>
            <div className="loader"></div>
            <span>Loading... Please wait!</span>
        </div>
    );
}
