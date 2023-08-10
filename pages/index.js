import React from "react";
import Login from "../Component/Login";
// import {getSession} from 'next-auth/react'
import Head from "next/head";
import axios from "axios";

const login = () => {
  return (
    <div>
      <Login />
    </div>
  );
};
export default login;

// export async function getServerSideProps(context) {
//   var config = {
//     method: "post",
//     url: "http://3.109.75.65:4001/api/v1/auth/walletcheck",
//     data,
//   };
//   await axios(config).then(function (response) {
//     res.status(200).json({ data: response.data });
//   });
// }
