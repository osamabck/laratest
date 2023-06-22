import React, { useState, useEffect } from "react";
import "../../../scss/pages/dashboardpage.scss";
import Layout from "../../components/layout";
import { Table } from "antd";

export default function AgeSum() {
    const [users, setUsers] = useState([]);
    const [ageMin, setAgeMin] = useState(0);
    const [ageMax, setAgeMax] = useState(100);
    const [total, setTotal] = useState(0);

    let fetching = false;

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Age",
            dataIndex: "age",
            key: "age",
        },
        {
            title: "Birth date",
            dataIndex: "birth_date",
            key: "birth_date",
        },
    ];

    const fetchUsers = async () => {
        if (typeof ageMin != "number") return;
        if (typeof ageMax != "number") return;
        if (fetching) return;
        fetching = true;
        await fetch("/api/admin/users/agerange", {
            method: "POST",
            headers: {
                "x-csrf-token":
                    document.querySelector('meta[name="token"]').content,
                "content-type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ ageMin, ageMax }),
        })
            .then((r) => r.json())
            .then((r) => {
                if (r.success) {
                    setUsers(r.data.users.map((u) => ({ ...u, key: u.id })));
                    setTotal(r.data.users.length);
                } else {
                    // failed to fetch data
                }
            })
            .catch((err) => console.error(err))
            .finally(() => (fetching = false));
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchUsers(), 500);
        return () => clearTimeout(timer);
    }, [ageMin, ageMax]);

    return (
        <Layout>
            <main className="dashboard_page">
                <div className="navigation">
                    <div className="input_group">
                        <label htmlFor="search">Minimum Age</label>
                        <input
                            type="number"
                            name="search"
                            id="seacrh"
                            placeholder="Age..."
                            value={ageMin}
                            onChange={(e) =>
                                setAgeMin(e.currentTarget.valueAsNumber)
                            }
                        />
                    </div>
                    <div className="input_group">
                        <label htmlFor="search">Maxmimum Age</label>
                        <input
                            type="number"
                            name="search"
                            id="seacrh"
                            placeholder="Age..."
                            value={ageMax}
                            onChange={(e) =>
                                setAgeMax(e.currentTarget.valueAsNumber)
                            }
                        />
                    </div>
                </div>
                <span>Total users within the range: {total}</span>
                <Table
                    columns={columns}
                    dataSource={users}
                    className="users_table"
                    pagination={false}
                />
            </main>
        </Layout>
    );
}
