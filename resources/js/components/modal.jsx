import React from "react";
import { BsX } from "react-icons/bs";
import "../../scss/components/modal.scss";

export default function Modal(props) {
    return (
        <div
            className="overlay"
            style={{ display: props.visible ? "flex" : "none" }}
        >
            <div className="modal">
                <button className="close" onClick={() => props.hide()}>
                    <BsX />
                </button>
                {props.children}
            </div>
        </div>
    );
}
