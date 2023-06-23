import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import "../scss/main.scss";
import React, { useState } from "react";
import AuthContext from "./other/Auth.js";
import LoaderContext from "./other/loader";

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./pages/**/*.jsx", { eager: true });
        return pages[`./pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <Wrapper auth={props.initialPage.props.auth}>
                <App {...props} />
            </Wrapper>
        );
    },
});

function Wrapper(props) {
    const [auth, setAuth] = useState(props.auth);
    const [loading, setLoading] = useState(false);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            <LoaderContext.Provider value={{ loading, setLoading }}>
                {props.children}
            </LoaderContext.Provider>
        </AuthContext.Provider>
    );
}
