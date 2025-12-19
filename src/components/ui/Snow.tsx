"use client";

import Snowfall from "react-snowfall";

export default function Snow() {
    return (
        <Snowfall
            snowflakeCount={50}
            color="#ffffffff"
            style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
        />
    );
}