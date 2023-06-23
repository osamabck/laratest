import React, { useState, useEffect, useContext } from "react";
import "../../../scss/pages/dashboardpage.scss";
import Layout from "../../components/layout";
import { Table } from "antd";
import LoaderContext from "../../other/Loader.js";

export default function AgeSum() {
    const [users, setUsers] = useState([]);
    const [age, setAge] = useState("");
    const { setLoading } = useContext(LoaderContext);

    let fetching = false;

    const columns = [
        {
            title: "ID #1",
            dataIndex: "id1",
            key: "id1",
        },
        {
            title: "Name #1",
            dataIndex: "name1",
            key: "name1",
        },
        {
            title: "Age #1",
            dataIndex: "age1",
            key: "age1",
        },
        {
            title: "Birth date #1",
            dataIndex: "birth_date1",
            key: "birth_date1",
        },
        {
            title: "ID #2",
            dataIndex: "id2",
            key: "id2",
        },
        {
            title: "Name #2",
            dataIndex: "name2",
            key: "name2",
        },
        {
            title: "Age #2",
            dataIndex: "age2",
            key: "age2",
        },
        {
            title: "Birth date #2",
            dataIndex: "birth_date2",
            key: "birth_date2",
        },
    ];

    const fetchUsers = async () => {
        if (typeof age != "number") return;
        if (fetching) return;
        fetching = true;
        setLoading(true);
        await fetch("/api/admin/users/agesum", {
            method: "POST",
            headers: {
                "x-csrf-token":
                    document.querySelector('meta[name="token"]').content,
                "content-type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ age }),
        })
            .then((r) => r.json())
            .then((r) => {
                if (r.success) {
                    setUsers(
                        r.data.users.map((u) => ({
                            ...u,
                            key: `${u.id1}-${u.id2}`,
                        }))
                    );
                } else {
                    // failed to fetch data
                }
            })
            .catch((err) => console.error(err))
            .finally(() => {
                setLoading(false);
                fetching = false;
            });
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchUsers(), 500);
        return () => clearTimeout(timer);
    }, [age]);

    return (
        <Layout>
            <main className="dashboard_page">
                <div className="navigation">
                    <div className="input_group">
                        <label htmlFor="search">Age</label>
                        <input
                            type="number"
                            name="search"
                            id="seacrh"
                            placeholder="Age..."
                            value={age}
                            onChange={(e) =>
                                setAge(e.currentTarget.valueAsNumber)
                            }
                        />
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={users}
                    pagination={false}
                    className="users_table"
                />
            </main>
        </Layout>
    );
}
