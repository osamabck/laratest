import React from "react";
import "../../scss/components/layout.scss";
import Header from "./header";
import Footer from "./footer";
import Sidebar from "./sidebar";
import Loader from "./loader";

export default function Layout(props) {
    return (
        <div className="layout">
            <Header />
            <div className="content">
                <Sidebar />
                {props.children}
            </div>
            <Footer />
            <Loader />
        </div>
    );
}
