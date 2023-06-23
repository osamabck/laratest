import React, { useState, useContext } from "react";
import "../../../scss/pages/login.scss";
import AuthContext from "../../other/Auth";
import { router } from "@inertiajs/react";
import Layout from "../../components/layout";
import LoaderContext from "../../other/loader";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setAuth } = useContext(AuthContext);
    const { setLoading } = useContext(LoaderContext);

    const login = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (email == "" || password == "") return;
        await fetch("/admin/login", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "x-csrf-token":
                    document.querySelector('meta[name="token"]').content,
            },
            body: JSON.stringify({ email, password }),
        })
            .then((r) => r.json())
            .then((r) => {
                if (r.success) {
                    setAuth({
                        name: r.data.name,
                        loggedin: true,
                    });
                    localStorage.setItem("token", r.data.token);
                    router.get("/admin/dashboard");
                } else {
                    // can't login
                }
            })
            .catch((err) => console.error(err))
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Layout>
            <main className="login_page">
                <form onSubmit={login}>
                    <div className="input_group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
                        />
                    </div>
                    <div className="input_group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                        />
                    </div>
                    <button>Login</button>
                </form>
            </main>
        </Layout>
    );
}
