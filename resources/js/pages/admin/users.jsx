import React, { useState, useEffect, useContext } from "react";
import "../../../scss/pages/dashboardpage.scss";
import Modal from "../../components/modal";
import { BsArrowLeftShort, BsArrowRightShort, BsTrash3 } from "react-icons/bs";
import { DatePicker } from "antd";
import { Input } from "antd";
import Layout from "../../components/layout";
import { Space, Table } from "antd";
import LoaderContext from "../../other/loader";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [skip, setSkip] = useState(0);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(false);
    const [samePassword, setSamePassword] = useState(true);
    const [name, setName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const { setLoading } = useContext(LoaderContext);

    let more = true;
    let fetching = false;
    let deleting = false;
    let adding = false;

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
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Birth date",
            dataIndex: "birth_date",
            key: "birth_date",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => deleteUser(record.id)}>Delete</a>
                </Space>
            ),
        },
    ];

    const fetchUsers = async () => {
        if (fetching) return;
        if (!more) return;
        fetching = true;
        setLoading(true);
        await fetch("/api/admin/users/list", {
            method: "POST",
            headers: {
                "x-csrf-token":
                    document.querySelector('meta[name="token"]').content,
                "content-type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ skip, search }),
        })
            .then((r) => r.json())
            .then((r) => {
                if (r.success) {
                    setUsers(r.data.users.map((u) => ({ ...u, key: u.id })));
                    setTotal(r.data.total);
                    more = r.data.more;
                } else {
                    // failed to fetch data
                }
            })
            .catch((err) => console.error(err))
            .finally(() => {
                fetching = false;
                setLoading(false);
            });
    };

    const deleteUser = async (user) => {
        if (deleting) return;
        deleting = true;
        setLoading(true);
        await fetch("/api/admin/users/delete", {
            method: "POST",
            headers: {
                "x-csrf-token":
                    document.querySelector('meta[name="token"]').content,
                "content-type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ user }),
        })
            .then((r) => r.json())
            .then(async (r) => {
                if (r.success) {
                    fetchUsers();
                } else {
                    // failed to delete user
                }
            })
            .catch((err) => console.error(err))
            .finally(() => {
                deleting = false;
                setLoading(false);
            });
    };

    const addUser = async () => {
        if (name == "" || email == "" || birthDate == "" || password == "")
            return;
        if (password !== confirmPassword) return;
        if (adding) return;
        adding = true;
        setLoading(true);
        await fetch("/api/admin/users/add", {
            method: "POST",
            headers: {
                "x-csrf-token":
                    document.querySelector('meta[name="token"]').content,
                "content-type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                name,
                email,
                password,
                birthDate,
            }),
        })
            .then((r) => r.json())
            .then((r) => {
                if (r.success) {
                    setName("");
                    setPassword("");
                    setConfirmPassword("");
                    setEmail("");
                    setModal(false);
                    fetchUsers();
                } else {
                    // failed to add user
                }
            })
            .catch((err) => console.error(err))
            .finally(() => {
                fetching = false;
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, [skip]);

    useEffect(() => {
        more = true;
        const timer = setTimeout(() => fetchUsers(), 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (password != confirmPassword) {
            setSamePassword(false);
        } else {
            setSamePassword(true);
        }
    }, [password, confirmPassword]);

    return (
        <Layout>
            <main className="dashboard_page">
                <button onClick={() => setModal(true)}>Create new user</button>
                <div className="navigation">
                    <div className="input_group">
                        <label htmlFor="search">Search users</label>
                        <input
                            type="text"
                            name="search"
                            id="seacrh"
                            placeholder="search..."
                            value={search}
                            onChange={(e) => setSearch(e.currentTarget.value)}
                        />
                    </div>
                    <div className="pagination">
                        <button
                            onClick={() => {
                                if (skip == 0) return;
                                if (skip < 15) setSkip(0);
                                else setSkip(skip - 15);
                            }}
                        >
                            <BsArrowLeftShort />
                            <span>Prev</span>
                        </button>
                        <span>
                            {skip + 15} out of {total}
                        </span>
                        <button
                            onClick={() => {
                                if (skip + 15 >= total) return;
                                setSkip(skip + 15);
                            }}
                        >
                            <span>Next</span>
                            <BsArrowRightShort />
                        </button>
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={users}
                    pagination={false}
                    className="users_table"
                />
            </main>
            <Modal visible={modal} hide={() => setModal(false)}>
                <div className="input_group">
                    <label htmlFor="name">Name</label>
                    <Input
                        size="large"
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.currentTarget.value)}
                    />
                </div>
                <div className="input_group">
                    <label htmlFor="email">Email</label>
                    <Input
                        size="large"
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                    />
                </div>
                <div className="input_group">
                    <label htmlFor="password">Password</label>
                    <Input
                        size="large"
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        status={
                            !samePassword && confirmPassword != ""
                                ? "error"
                                : ""
                        }
                        onChange={(e) => setPassword(e.currentTarget.value)}
                    />
                </div>
                <div className="input_group">
                    <label htmlFor="confirm_password">Confirm Password</label>
                    <Input
                        size="large"
                        type="password"
                        name="confirm_password"
                        id="confirm_password"
                        value={confirmPassword}
                        status={
                            !samePassword && confirmPassword != ""
                                ? "error"
                                : ""
                        }
                        onChange={(e) =>
                            setConfirmPassword(e.currentTarget.value)
                        }
                    />
                </div>
                <div className="input_group">
                    <label htmlFor="birth_date">Birth Date</label>
                    <DatePicker
                        size="large"
                        name="birth_date"
                        id="birth_date"
                        value={birthDate}
                        disabledDate={(d) => !d || d.isAfter(Date.now())}
                        format={"YYYY-MM-DD"}
                        onChange={(e) => setBirthDate(e)}
                    />
                </div>
                <button onClick={addUser}>Add User</button>
            </Modal>
        </Layout>
    );
}
