import { Link } from "@inertiajs/react";
import React, { useContext } from "react";
import "../../scss/components/header.scss";
import AuthContext from "../other/Auth";

export default function Header() {
    const { auth } = useContext(AuthContext);
    return (
        <header className="header">
            <Link href="/">Laratest</Link>
            {auth.loggedin ? <span>Hello, {auth.name}!</span> : <></>}
        </header>
    );
}
