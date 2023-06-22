import { Link } from "@inertiajs/react";
import React, { useContext } from "react";
import "../../scss/components/sidebar.scss";
import {
    BsCalculatorFill,
    BsCalendarFill,
    BsClockFill,
    BsDoorOpenFill,
    BsFillDoorClosedFill,
    BsHouseFill,
    BsPeopleFill,
} from "react-icons/bs";
import AuthContext from "../other/Auth.js";

export default function Sidebar() {
    const { auth, setAuth } = useContext(AuthContext);
    return (
        <div className="sidebar">
            <nav>
                <Link href="/">
                    <BsHouseFill />
                    <span>Home</span>
                </Link>
                {auth.loggedin ? (
                    <>
                        <Link href="/admin/dashboard">
                            <BsCalculatorFill />
                            <span>Dashboard</span>
                        </Link>
                        <Link href="/admin/users">
                            <BsPeopleFill />
                            <span>Users</span>
                        </Link>
                        <Link href="/admin/agesum">
                            <BsClockFill />
                            <span>Age sum</span>
                        </Link>
                        <Link href="/admin/agerange">
                            <BsCalendarFill />
                            <span>Age range</span>
                        </Link>
                        <Link
                            href="/logout"
                            onClick={(e) => {
                                localStorage.clear();
                                setAuth({ loggedin: false, name: null });
                            }}
                        >
                            <BsDoorOpenFill />
                            <span>Logout</span>
                        </Link>
                    </>
                ) : (
                    <Link href="/admin/login">
                        <BsFillDoorClosedFill />
                        <span>Admin login</span>
                    </Link>
                )}
            </nav>
        </div>
    );
}
