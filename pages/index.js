import React from "react";
import Main from "./main";
import Head from "next/head";

function index() {
  return (
    <div>
      <Head>
        <title>DeBox</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Main />
    </div>
  );
}

export default index;
