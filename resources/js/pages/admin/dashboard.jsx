import React, { useContext, useEffect, useState } from "react";
import { Card } from "antd";
import Layout from "../../components/layout";
import "../../../scss/pages/dashboardpage.scss";
import LoaderContext from "../../other/loader";

export default function Dashboard() {
    const [usersCount, setUsersCount] = useState(0);
    const { setLoading } = useContext(LoaderContext);

    const fetchUserCount = async () => {
        setLoading(true);
        await fetch("/api/admin/dashboard/info", {
            method: "POST",
            headers: {
                "x-csrf-token":
                    document.querySelector('meta[name="token"]').content,
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((r) => r.json())
            .then((r) => {
                if (r.success) {
                    setUsersCount(r.data.userscount);
                } else {
                    // failed to fetch users count;
                }
            })
            .catch((err) => console.error(err))
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUserCount();
    }, []);

    return (
        <Layout>
            <main className="dashboard_page">
                <Card
                    title="Total users count"
                    style={{ backgroundColor: "#fafafa" }}
                >
                    <p>{usersCount}</p>
                </Card>
            </main>
        </Layout>
    );
}
