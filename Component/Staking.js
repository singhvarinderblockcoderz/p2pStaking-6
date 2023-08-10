import React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import $ from "jquery";
import Link from "next/link";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useAccount, useDisconnect, useContractWrite } from "wagmi";
import ContractInterface from "../createStaking.json";
import ContractInterface1 from "../stakingApprove.json";
import ContractInterface2 from "../stake&Withdraw.json";
console.log(ContractInterface, "contract for create new staking");
import { parseEther } from "viem";
import { Modal, Button, Table, Tooltip } from "@nextui-org/react";
import { ethers } from "ethers";

// let stakeId;
let userAddress;
let tokenAddress = "0x45d12b59b965880c9F8A38eFdBA3075631e70Caf";
export default function Direct() {
  const dataFetchedRef = useRef(false);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);

  const [id, setId] = useState("");
  const [contractAddress, setContractAddress] = useState();
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState();
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [total, setTotal] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [roi, setRoi] = useState();
  const [totalStaking, setTotalStaking] = useState();
  const [totalData, setTotalData] = useState();
  const [stakingDetails, setStakingDetails] = useState();
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState(0);
  const [length, setLength] = useState(null);
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const prefix = address?.substring(0, 4);
  const suffix = address?.substring(address.length - 4);
  const maskedStr = `${prefix}${"*****"}${suffix}`;
  const [newData, setNewData] = useState();
  const [stakeId, setStakeId] = useState();
  const [tx, setTx] = useState(false);
  const [unlocked, setUnlocked] = useState();
  const [dash, setDash] = useState([]);
  userAddress = maskedStr;

  async function jQueryFunction() {
    $(document).on("click", "ul li", function () {
      $(this).addClass("active").siblings().removeClass("active");
    });
  }

  useEffect(() => {
    jQueryFunction();
  }, []);

  const handleDisconnect = async () => {
    window.location.href = "/";
    window.localStorage.clear();
    disconnect();
  };

  const { write: write } = useContractWrite({
    mode: "args",
    address: "0x22265226e4111158c2728e1ccaefe2fbdd38140e",
    abi: ContractInterface,
    functionName: "startNewStaking",
    overrides: {
      gasLimit: 8000000,
    },
    args: [
      duration,
      roi,
      parseEther(`${min}`),
      parseEther(`${max}`),
      parseEther(`${total}`),
      new Date(startDate)?.getTime() / 1000,
      new Date(endDate)?.getTime() / 1000,
    ],
    onError(error) {
      console.log(error, "error");
      setOpen(false);
    },
    async onSuccess(data) {
      setOpen(true);
      setShow(false);
      console.log(data, "data");
      let tx = await data.wait();
      console.log(tx, "tx");
      setOpen(false);
      getData();
    },
  });

  async function getData() {
    try {
      let res = await axios.post("/api/getData");
      const response = res.data;
      console.log(response, "to get response from api");
      setAdded(added + 1);
      setTotalData(response?.data?.data?.data);
      const endDates = response?.data?.data?.data;
      const updatedTimeLefts = endDates.map((item) =>
        calculateTimeLeft(item.startDate)
      );
      setTimeLefts(updatedTimeLefts);
      setTotalStaking((response?.data?.data?.data).length);
    } catch (err) {
      console.log(err, "err");
      setOpen(false);
    }
  }
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getData();
  }, [added]);
    useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getData();
  }, []);

  const { write: Approval } = useContractWrite({
    mode: "args",
    address: "0x45d12b59b965880c9F8A38eFdBA3075631e70Caf",
    abi: ContractInterface1,
    functionName: "approve",
    overrides: {
      gasLimit: 8000000,
    },
    args: [contractAddress, parseEther(`${amount}`)],
    onError(error) {
      console.log(error, "error");
      setOpen(false);
    },
    async onSuccess(data) {
      setOpen(true);
      let tx = await data.wait();
      console.log(tx, "tx");
      Stake();
    },
  });

  const { write: Stake } = useContractWrite({
    mode: "args",
    address: contractAddress,
    abi: ContractInterface2,
    functionName: "Stake",
    overrides: {
      gasLimit: 8000000,
    },
    args: [parseEther(`${id}`), parseEther(`${amount}`)],
    onError(error) {
      console.log(error, "error");
      setOpen(false);
    },
    async onSuccess(data) {
      setOpen(true);
      let tx = await data.wait();
      console.log(tx, "tx");
      if (tx.status == 1) {
        setOpen(false);
        return;
      }
      if(tx.status == 0) {
        setOpen(false)
        setShow2(true);
        return; 
      }
    },
  });
  
  async function testFn(e) {
    e.preventDefault();
    setOpen(true);
    let arr2 = [];
    let res = await axios.post("/api/getData");
    const response = res.data;
    console.log(response, "response staking heee");
    const testData = response.data.data.data?.map(async (item) => {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc-mumbai.maticvigil.com"
      );
      let daiContract;
      let getStakingId;
      try {
        console.log(item?.contractAddress);
        daiContract = new ethers.Contract(
          item.contractAddress,
          ContractInterface2,
          provider
          );
        getStakingId = await daiContract.getUserStakingIds(address);
        console.log(getStakingId.toString(), "to get id");
        const idToPass = getStakingId.toString();
        var sId = idToPass.split(",");
        console.log("SID", sId);
        setOpen(true)
     
        for (let i = 0; i < sId.length; i++) {
          console.log("GETING SID", sId[i]);
          const getStakingDetails = await daiContract.getUserStakings(sId[i]);
          console.log(getStakingDetails, "to get data1 data");
          const data1 = getStakingDetails[5]?.toString();
          console.log(data1, "data1");
          const data2 = data1 * 1000;
          console.log(data2, "data2");
          const data3 = new Date(data2);
          console.log(data3, "data3");
          const data4 = new Date(data3);
          data4.setMinutes(data3.getMinutes() + Number(item?.duration));
          console.log(data4, "data4");
          const data = {
            stakingId: getStakingDetails[0]?.toString(),
            userId: getStakingDetails[1]?.toString(),
            totalTokens: getStakingDetails[2]?.toString(),
            rateOfInterest: getStakingDetails[3]?.toString(),
            withdrawAt: getStakingDetails[4]?.toString(),
            createdAt: getStakingDetails[5]?.toString(),
            contractAddress: item?.contractAddress,
            duration: item?.duration,
            startDate: item?.startDate,
            withdrawDate: data4,
            roi: item?.rateOfInterest,
          };
          arr2.push(data);
        }
                
        setNewData(arr2);
        setLength(arr2?.length)
     setTimeout(() => {
       setOpen(false)
     }, 2000);
   
      } catch (error) {
        console.log("hello");
        setOpen(false);
        return;
      }
    });
  }

  console.log(newData,'newData is here')


  async function getIdForStake(item) {
    console.log(roi, "roi");
    console.log(item, "id of stake");
    setContractAddress(item?.contractAddress);
    setId(item?.id);
    Approval();
    return;
  }

  const { write: Withdraw } = useContractWrite({
    mode: "args",
    address: contractAddress,
    abi: ContractInterface2,
    functionName: "withdraw",
    overrides: {
      gasLimit: 8000000,
    },
    args: [stakeId],

    onError(error) {
      console.log(error, "error");
      setOpen(false);
      setTx(false);
    },
    async onSuccess(data) {
      setOpen(true);
      console.log(data, "data");
      var args = [stakeId];
      console.log(args);
      let tx = await data.wait();
      console.log(tx, "tx");
      if (tx.status == 1) {
        setOpen(false);
        setTx(true);
        setShow3(true)
        return;
      }
      if (tx.status == 0) {
        setOpen(false);
        setShow1(true);
        return;
      }
    },
  });

  async function getId(item) {
    console.log(item?.stakingId,"stakingId")
    console.log(item?.contractAddress, "to get the id to withdraw");
      setStakeId(item?.stakingId)
      setContractAddress(item?.contractAddress);
      Withdraw();
  }
  

  async function okSubmitHanlder(){
    setShow3(false)
    window.location.reload(false)
  }

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <section class="dashboard" id="stake-dashimp">
        <div class="dashboard-left">
          <div class="dash-navhead">
            <a class="dashnav-a" href="index.html">
              {" "}
              <img src="/p2p.help_logo-01.svg" />
            </a>
          </div>
          <div class="dash-navmid">
            <ul>
              <li>
                <a href="/dashboard">
                  {" "}
                  <svg
                    id="Dashboard"
                    xmlns="http://www.w3.org/2000/svg"
                    width="23.992"
                    height="24"
                    viewBox="0 0 23.992 24"
                  >
                    <g
                      id="Group_17237"
                      data-name="Group 17237"
                      transform="translate(0 0)"
                    >
                      <path
                        id="Path_10905"
                        data-name="Path 10905"
                        d="M5.449,2.1q1.093,0,2.184.014A2.063,2.063,0,0,1,9.7,4.179c.02,1.4.022,2.869,0,4.356a2.047,2.047,0,0,1-2.087,2.073q-1.067.011-2.135.011-1.091,0-2.179-.011a2.063,2.063,0,0,1-2.1-2.113c0-.319,0-.638,0-.958h.023v-1.2c0-.264,0-.528-.011-.792A14.443,14.443,0,0,1,1.235,3.99a2.01,2.01,0,0,1,2.04-1.878Q4.362,2.1,5.449,2.1m0-1.2q-1.1,0-2.191.014A3.21,3.21,0,0,0,.039,3.888C-.03,4.7.027,5.52.027,6.337H.006c0,.722-.006,1.446,0,2.169a3.269,3.269,0,0,0,3.283,3.3q1.1.011,2.191.011,1.073,0,2.148-.011A3.256,3.256,0,0,0,10.9,8.551q.031-2.194,0-4.391A3.251,3.251,0,0,0,7.649.912Q6.549.9,5.449.9"
                        transform="translate(0.001 -0.898)"
                        fill="#ccd0db"
                      />
                      <path
                        id="Path_10906"
                        data-name="Path 10906"
                        d="M16.431,2.1q1.037,0,2.072.01A2.045,2.045,0,0,1,20.6,4.178c.022,1.392.023,2.817,0,4.355a2.047,2.047,0,0,1-2.084,2.076q-1.06.011-2.119.011-1.1,0-2.195-.011A2.063,2.063,0,0,1,12.1,8.5c0-.319,0-.638,0-.958h.023v-1.2c0-.263-.006-.527-.012-.791a14.755,14.755,0,0,1,.019-1.555A2.027,2.027,0,0,1,14.21,2.11Q15.32,2.1,16.431,2.1m0-1.2Q15.317.9,14.2.91a3.218,3.218,0,0,0-3.269,2.981c-.07.81-.012,1.632-.012,2.448H10.9c0,.724-.006,1.447,0,2.169a3.269,3.269,0,0,0,3.285,3.3q1.1.011,2.207.011,1.066,0,2.132-.011A3.256,3.256,0,0,0,21.8,8.549q.031-2.194,0-4.391A3.254,3.254,0,0,0,18.515.912Q17.473.9,16.431.9"
                        transform="translate(2.179 -0.897)"
                        fill="#ccd0db"
                      />
                      <path
                        id="Path_10907"
                        data-name="Path 10907"
                        d="M5.455,13q1.08,0,2.16.011a2.061,2.061,0,0,1,2.091,2.1c0,.32.006.642.006.962H9.686v1.188c0,.266.006.533.012.8a15.2,15.2,0,0,1-.019,1.578A2.005,2.005,0,0,1,7.636,21.5q-1.1.014-2.2.016-1.078,0-2.156-.016a2.069,2.069,0,0,1-2.07-2.089c-.013-1.426-.013-2.877,0-4.317A2.049,2.049,0,0,1,3.3,13.007Q4.378,13,5.455,13m0-1.2q-1.084,0-2.167.011A3.259,3.259,0,0,0,.01,15.085q-.02,2.169,0,4.339A3.258,3.258,0,0,0,3.263,22.7q1.085.014,2.173.016,1.109,0,2.216-.016a3.211,3.211,0,0,0,3.223-2.973c.067-.82.011-1.649.011-2.474h.023c0-.722.008-1.446,0-2.169a3.266,3.266,0,0,0-3.279-3.278Q6.542,11.8,5.455,11.8"
                        transform="translate(0 1.281)"
                        fill="#ccd0db"
                      />
                      <path
                        id="Path_10908"
                        data-name="Path 10908"
                        d="M16.37,13q1.066,0,2.13.01a2.065,2.065,0,0,1,2.1,2.108c0,.323,0,.644,0,.967h-.024V17.27c0,.263.006.526.011.79a15.172,15.172,0,0,1-.018,1.559A2.009,2.009,0,0,1,18.54,21.5q-1.111.018-2.221.018-1.078,0-2.156-.018A2.047,2.047,0,0,1,12.1,19.4q-.016-2.147,0-4.295a2.058,2.058,0,0,1,2.1-2.1Q15.289,13,16.37,13m0-1.2q-1.087,0-2.173.008A3.264,3.264,0,0,0,10.9,15.1q-.018,2.156,0,4.314A3.257,3.257,0,0,0,14.142,22.7q1.089.018,2.177.018,1.12,0,2.239-.018a3.209,3.209,0,0,0,3.212-2.983c.068-.811.012-1.632.012-2.448h.02c0-.722.008-1.446,0-2.169a3.268,3.268,0,0,0-3.291-3.293q-1.069-.011-2.139-.01"
                        transform="translate(2.179 1.281)"
                        fill="#ccd0db"
                      />
                    </g>
                  </svg>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/mainGenealogy">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23.903"
                    height="24"
                    viewBox="0 0 23.903 24"
                  >
                    <path
                      id="Path_10932"
                      data-name="Path 10932"
                      d="M35.243,1h-.008a5.161,5.161,0,0,0-5.08,4.362,4.965,4.965,0,0,0,.731,3.5,5.138,5.138,0,0,0,3.636,2.37l.1.017v9.247l-1.81-1.408.05-.091a5.138,5.138,0,0,0-8.381-5.882,5.117,5.117,0,0,0,.07,6.678,5,5,0,0,0,3.118,1.7,5.58,5.58,0,0,0,.783.057,5.129,5.129,0,0,0,3.556-1.462l.075-.069.56.434c.625.487,1.245.968,1.864,1.453a.348.348,0,0,1,.13.247c0,.4,0,.794,0,1.2v.476H33.06c-.276,0-.553,0-.829,0a.588.588,0,0,0-.258,1.13.778.778,0,0,1,.075.046h6.344a.125.125,0,0,1,.028-.019.6.6,0,0,0-.284-1.158H35.82V23.3c0-.362,0-.71.008-1.058a.546.546,0,0,1,.185-.379c.585-.465,1.177-.925,1.768-1.384l.358-.278c.039-.03.081-.057.121-.084l.131-.086.07.065a5.257,5.257,0,0,0,3.607,1.444,5.075,5.075,0,0,0,3.589-1.478A5.134,5.134,0,1,0,37.6,18.995l.05.091L35.828,20.5V11.243l.1-.016a5.112,5.112,0,0,0,3.4-2.006,5.02,5.02,0,0,0,.984-3.836A5.13,5.13,0,0,0,35.243,1m-.012,9.091a3.956,3.956,0,0,1,0-7.913h.007a3.963,3.963,0,0,1,3.944,3.975,3.961,3.961,0,0,1-3.956,3.938m6.815,10.275a3.956,3.956,0,0,1,.01-7.913h.011a3.963,3.963,0,0,1,3.939,3.978,3.962,3.962,0,0,1-3.958,3.935Zm-13.636,0a3.956,3.956,0,0,1,.008-7.913h.011a3.963,3.963,0,0,1,3.941,3.978,3.962,3.962,0,0,1-3.958,3.935Z"
                      transform="translate(-23.277 -1.001)"
                      fill="#ccd0db"
                    />
                  </svg>{" "}
                  Genealogy
                </a>
              </li>
              <li>
                <div
                  class="accordion accordion-flush"
                  id="accordionFlushExample"
                >
                  <div class="accordion-item">
                    <h2 class="accordion-header reward-header">
                      <button
                        class="accordion-button collapsed dash_drop"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseOne"
                        aria-expanded="false"
                        aria-controls="flush-collapseOne"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24.001"
                          viewBox="0 0 24 24.001"
                        >
                          <g
                            id="Group_17236"
                            data-name="Group 17236"
                            transform="translate(-1254.228 2273.334)"
                          >
                            <path
                              id="Path_10918"
                              data-name="Path 10918"
                              d="M54.336,18.591c.105-.644.232-1.4.351-2.157.215-1.357.318-1-.6-1.951q-.668-.691-1.349-1.37a1.5,1.5,0,0,1,.924-2.613c.83-.112,1.659-.253,2.489-.369a.636.636,0,0,0,.529-.4c.389-.834.793-1.66,1.18-2.494a1.4,1.4,0,0,1,2.62,0c.383.826.786,1.643,1.169,2.469a.671.671,0,0,0,.569.425c.885.122,1.767.265,2.648.405a1.37,1.37,0,0,1,1.158.973,1.414,1.414,0,0,1-.334,1.5q-.945.989-1.92,1.949a.8.8,0,0,0-.243.78q.241,1.359.454,2.723a1.428,1.428,0,0,1-.594,1.474,1.359,1.359,0,0,1-1.554.036c-.772-.429-1.553-.844-2.323-1.277a.628.628,0,0,0-.683,0c-.794.446-1.591.887-2.4,1.312a1.426,1.426,0,0,1-2.089-1.424m.924.068c-.014.5.357.741.761.523.794-.427,1.588-.855,2.375-1.3a1.464,1.464,0,0,1,1.541,0c.763.427,1.535.841,2.3,1.264.2.11.393.2.605.047a.587.587,0,0,0,.217-.627c-.149-.9-.29-1.8-.451-2.7a1.611,1.611,0,0,1,.473-1.529c.63-.622,1.244-1.26,1.867-1.889a.6.6,0,0,0,.2-.656.561.561,0,0,0-.522-.365c-.847-.128-1.693-.268-2.543-.382a1.5,1.5,0,0,1-1.251-.906c-.389-.833-.79-1.661-1.181-2.494-.1-.219-.232-.4-.5-.39s-.372.182-.469.39c-.39.834-.791,1.661-1.18,2.5a1.493,1.493,0,0,1-1.224.9c-.858.119-1.714.254-2.57.383-.357.054-.566.228-.545.522a.87.87,0,0,0,.223.493c.622.656,1.26,1.3,1.9,1.936a1.545,1.545,0,0,1,.454,1.384c-.035.25-.083.5-.125.748-.121.729-.242,1.459-.354,2.146"
                              transform="translate(1207.058 -2275.178)"
                              fill="#ccd0db"
                            />
                            <path
                              id="Path_10919"
                              data-name="Path 10919"
                              d="M60.634,4.666a11.889,11.889,0,0,1,11.432,9.6,11.662,11.662,0,0,1-.965,7.654c-.211.437-.507.583-.842.423s-.393-.478-.183-.922a10.855,10.855,0,0,0-16-13.631c-.091.065-.178.135-.274.192a.568.568,0,0,1-.8-.139.537.537,0,0,1,.156-.79,20.01,20.01,0,0,1,1.937-1.181,11.869,11.869,0,0,1,5.54-1.2"
                              transform="translate(1205.902 -2278)"
                              fill="#ccd0db"
                            />
                            <path
                              id="Path_10920"
                              data-name="Path 10920"
                              d="M62.131,26.052A12.017,12.017,0,0,1,51.448,8.768c.132-.271.309-.473.638-.442a.575.575,0,0,1,.418.888,11.418,11.418,0,0,0-.943,2.81A10.836,10.836,0,0,0,59.61,24.576a10.674,10.674,0,0,0,8.914-1.692,1.526,1.526,0,0,1,.5-.247.486.486,0,0,1,.555.281.527.527,0,0,1-.06.624,1.377,1.377,0,0,1-.252.216,12.361,12.361,0,0,1-7.131,2.294"
                              transform="translate(1204 -2275.389)"
                              fill="#ccd0db"
                            />
                          </g>
                        </svg>{" "}
                        Rewards
                      </button>
                    </h2>
                    <div
                      id="flush-collapseOne"
                      class="accordion-collapse collapse"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body reward-body">
                        <ul>
                          <li>
                            <Link href="/direct" class="reward-a">
                              Direct
                            </Link>
                          </li>
                          <li>
                            <Link href="/level" class="reward-a">
                              Level
                            </Link>
                          </li>
                          <li>
                            <Link href="/matching" class="reward-a">
                              Matching
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div
                  class="accordion accordion-flush"
                  id="accordionFlushExample"
                >
                  <div class="accordion-item">
                    <h2 class="accordion-header stake-header">
                      <button
                        class="accordion-button  stake-dropdown"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseTwo"
                        aria-expanded="false"
                        aria-controls="flush-collapseTwo"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22.772"
                          height="25.148"
                          viewBox="0 0 22.772 25.148"
                        >
                          <g
                            id="Group_17235"
                            data-name="Group 17235"
                            transform="translate(-1275.37 2278.598)"
                          >
                            <path
                              id="Path_10922"
                              data-name="Path 10922"
                              d="M85.45,21.143c.133.826.263,1.635.4,2.473.488,0,.967.008,1.445-.008.064,0,.15-.1.182-.169.713-1.6,1.433-3.205,2.118-4.822a2.172,2.172,0,0,1,.9-1.062,6.342,6.342,0,0,0,1.735-1.382,4.873,4.873,0,0,0,.946-1.886,3.757,3.757,0,0,0,.067-.832c.008-.609,0-1.217,0-1.849-.157-.011-.3-.016-.446-.033a2.213,2.213,0,0,1-1.57-.937A3.6,3.6,0,0,0,89.41,9.222c-.342-.105-.428-.385-.252-.738.389-.779.785-1.556,1.177-2.334.047-.093.089-.188.173-.368-.334.033-.612.053-.889.087-.109.014-.214.069-.323.08a.418.418,0,0,1-.482-.34.415.415,0,0,1,.239-.527,3,3,0,0,1,2.3.016c.262.107.311.4.151.72Q90.912,7,90.312,8.177c-.05.1-.1.2-.156.328.107.061.2.118.3.172a4.436,4.436,0,0,1,1.414,1.329,1.52,1.52,0,0,0,1.6.627c.48-.074.665.093.666.61,0,.7-.032,1.4.007,2.091a5,5,0,0,1-1.046,3.2,5.956,5.956,0,0,1-1.972,1.709,1.8,1.8,0,0,0-.791.917c-.712,1.689-1.465,3.359-2.2,5.039a.532.532,0,0,1-.545.356c-.658-.009-1.314,0-1.972,0-.394,0-.528-.125-.593-.53-.137-.857-.276-1.714-.419-2.6a9.689,9.689,0,0,1-4.69,0c-.094.568-.187,1.128-.28,1.688-.053.324-.1.648-.16.971-.062.346-.2.471-.522.472-.695,0-1.388,0-2.083,0a.51.51,0,0,1-.481-.279,58.18,58.18,0,0,1-3.518-6.907,7.834,7.834,0,0,1-.091-5.716c.036-.1.072-.2.113-.312-.166-.107-.336-.2-.491-.32a2.259,2.259,0,0,1-.982-2.351A2.205,2.205,0,0,1,73.18,6.914a2.106,2.106,0,0,1,.526-.024.449.449,0,0,1,.422.479.46.46,0,0,1-.433.444,2.665,2.665,0,0,0-.493.053,1.281,1.281,0,0,0-.55,2.151,5.873,5.873,0,0,0,.638.5A9.043,9.043,0,0,1,76.284,7.77a.449.449,0,0,1,.678.12c.146.256.056.5-.25.69-.032.02-.067.035-.1.058-.577.449-1.184.863-1.723,1.359a5.631,5.631,0,0,0-1.7,3.91,7.3,7.3,0,0,0,.685,3.57c.918,2.053,1.973,4.027,3.082,5.97.041.072.128.159.2.161.49.014.979.008,1.488.008.108-.664.218-1.31.319-1.958.08-.516.076-.516-.37-.76a2.251,2.251,0,0,1-.242-.142.465.465,0,0,1-.144-.634.415.415,0,0,1,.581-.164,6.868,6.868,0,0,0,3.814.8,6.194,6.194,0,0,0,3.068-.781.426.426,0,0,1,.628.152.471.471,0,0,1-.205.66c-.2.12-.408.226-.638.353"
                              transform="translate(1204 -2278)"
                              fill="#fff"
                            />
                            <path
                              id="Path_10923"
                              data-name="Path 10923"
                              d="M78.288,10.318a5.5,5.5,0,1,1,6.947,0c.284.117.57.221.84.352a.451.451,0,0,1-.365.824,9.818,9.818,0,0,0-3.916-.655,11.6,11.6,0,0,0-3.142.348c-.283.077-.556.194-.833.3a.456.456,0,0,1-.608-.206.442.442,0,0,1,.234-.618c.272-.129.557-.23.843-.345M81.74,1.451c-.2.02-.4.036-.6.062a4.563,4.563,0,0,0-1.73,8.453.648.648,0,0,0,.373.082,18.1,18.1,0,0,1,3.88-.006.831.831,0,0,0,.476-.112,4.58,4.58,0,0,0-2.4-8.478"
                              transform="translate(1204.797 -2279.048)"
                              fill="#fff"
                              stroke="#1d2025"
                              stroke-width="0.2"
                            />
                            <path
                              id="Path_10924"
                              data-name="Path 10924"
                              d="M86.257,10.18a.369.369,0,1,1-.365.372.371.371,0,0,1,.365-.372"
                              transform="translate(1207.022 -2276)"
                              fill="#fff"
                            />
                            <path
                              id="Path_10925"
                              data-name="Path 10925"
                              d="M83.514,3.9a1.42,1.42,0,0,0-.74-.738,1.31,1.31,0,0,0-.54-.112H79.4V6.366h-.413v.609H79.4v.572h1.187V6.975h.453V6.366h-.453V4.178A.249.249,0,0,1,80.66,4a.227.227,0,0,1,.174-.073h1.111a.512.512,0,1,1,0,1.024h-.329a.371.371,0,0,0-.187.035.5.5,0,0,0-.13.159l-.357.7h1.294a1.31,1.31,0,0,0,.54-.112,1.407,1.407,0,0,0,.74-.743,1.351,1.351,0,0,0,.11-.546,1.315,1.315,0,0,0-.11-.541"
                              transform="translate(1205.448 -2278.302)"
                              fill="#fff"
                            />
                          </g>
                        </svg>{" "}
                        Stake
                      </button>
                    </h2>
                    <div
                      id="flush-collapseTwo"
                      class="accordion-collapse show"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div
                        class="accordion-body stake-body"
                        id="accordion-active"
                      >
                        <ul>
                          <li className="active">
                            <Link
                              href="/stakingDashboard"
                              class="stake-a active"
                            >
                              stacking
                            </Link>
                          </li>
                          {/* <li>
                          <Link href="/stakingMatching" class="stake-a">
                            stacking Match
                          </Link>
                        </li> */}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              {/* <li>
              <a href="/ewallet">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="21.805"
                  viewBox="0 0 24 21.805"
                >
                  <g
                    id="Group_17240"
                    data-name="Group 17240"
                    transform="translate(-131.5 -291.1)"
                  >
                    <path
                      id="Path_10935"
                      data-name="Path 10935"
                      d="M26,16.92a3,3,0,0,0-2.4-2.94V12.12a3,3,0,0,0-3-3h-.952L14.32,3.792a3,3,0,0,0-4.242,0L4.724,9.149A2.993,2.993,0,0,0,2,12.12v9.6a3,3,0,0,0,3,3H20.6a3,3,0,0,0,3-3V19.86A3,3,0,0,0,26,16.92ZM10.928,4.642a1.8,1.8,0,0,1,2.545,0L17.952,9.12H6.448ZM20.6,23.52H5a1.8,1.8,0,0,1-1.8-1.8v-9.6A1.8,1.8,0,0,1,5,10.32H20.6a1.8,1.8,0,0,1,1.8,1.8v1.8H20.6a3,3,0,1,0,0,6h1.8v1.8a1.8,1.8,0,0,1-1.8,1.8Zm2.4-4.8H20.6a1.8,1.8,0,0,1,0-3.6H23a1.8,1.8,0,0,1,0,3.6Z"
                      transform="translate(129.5 288.185)"
                      fill="#ccd0db"
                    />
                    <path
                      id="Path_10939"
                      data-name="Path 10939"
                      d="M132.238,12.161a2.221,2.221,0,0,0-1.151-1.151,2.069,2.069,0,0,0-.844-.174h-4.409v5.17h-.644v.95h.644v.89h1.85v-.89h.7v-.95h-.7V12.6a.394.394,0,0,1,.106-.278.354.354,0,0,1,.271-.113h1.73a.8.8,0,1,1,0,1.595h-.511a.59.59,0,0,0-.294.053.8.8,0,0,0-.2.248l-.557,1.084h2.016a2.05,2.05,0,0,0,.844-.174,2.2,2.2,0,0,0,1.151-1.158A2.119,2.119,0,0,0,132.41,13a2.063,2.063,0,0,0-.173-.842"
                      transform="translate(11.09 290.766)"
                      fill="#ccd0db"
                    />
                  </g>
                </svg>
                E - Wallet
              </a>
            </li> */}
            </ul>
          </div>
          <div class="dash-navmid2">
            <ul>
              <li>
                <div
                  class="accordion accordion-flush"
                  id="accordionFlushExample"
                >
                  <div class="accordion-item">
                    <h2 class="accordion-header sett_header">
                      <Link href="/personalInfo">
                        <button
                          class="accordion-button collapsed sett-dropdown"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseThree"
                          aria-expanded="false"
                          aria-controls="flush-collapseThree"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="23.819"
                            height="25.2"
                            viewBox="0 0 23.819 25.2"
                          >
                            <path
                              id="Path_10931"
                              data-name="Path 10931"
                              d="M99.848,20.873a2.477,2.477,0,0,0-1.206.3,1.82,1.82,0,0,1-2.515-.552,11.906,11.906,0,0,1-1.553-2.692,1.817,1.817,0,0,1,.775-2.458,2.507,2.507,0,0,0,.392-3.986,3.28,3.28,0,0,0-.466-.343,1.816,1.816,0,0,1-.737-2.335,12.132,12.132,0,0,1,1.624-2.818,1.816,1.816,0,0,1,2.426-.536A2.5,2.5,0,0,0,101.67,5a2.455,2.455,0,0,0,.686-1.658A1.806,1.806,0,0,1,104,1.456a10.917,10.917,0,0,1,3.325,0,1.8,1.8,0,0,1,1.616,1.859,2.5,2.5,0,0,0,1.712,2.341,2.468,2.468,0,0,0,2.033-.191,1.828,1.828,0,0,1,2.389.444,11.9,11.9,0,0,1,1.7,2.94,1.807,1.807,0,0,1-.794,2.315,2.5,2.5,0,0,0-.66,3.749,3.027,3.027,0,0,0,.672.581,1.824,1.824,0,0,1,.752,2.389,12.081,12.081,0,0,1-1.558,2.718,1.822,1.822,0,0,1-2.53.572,2.5,2.5,0,0,0-3.582,1.421,2.694,2.694,0,0,0-.127.709,1.822,1.822,0,0,1-1.682,1.9,11,11,0,0,1-3.278,0,1.8,1.8,0,0,1-1.627-1.874A2.507,2.507,0,0,0,99.848,20.873Zm9.36-7.43a3.563,3.563,0,1,0-3.684,3.451A3.566,3.566,0,0,0,109.208,13.443Z"
                              transform="translate(-93.737 -0.729)"
                              fill="none"
                              stroke="#ccd0db"
                              stroke-width="1.2"
                            />
                          </svg>{" "}
                          Settings
                        </button>
                      </Link>
                    </h2>
                    <div
                      id="flush-collapseThree"
                      class="accordion-collapse collapse"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body set-body">
                        <ul className="dots">
                          <li>
                            <Link href="/personalInfo" class="sett_a">
                              Personal
                              Information0x45d12b59b965880c9F8A38eFdBA3075631e70Caf
                            </Link>
                          </li>
                          <li>
                            <Link href="/twoFactor" class="sett_a">
                              Account Security
                            </Link>
                          </li>
                          {/* <li>
                          <Link href="/walletChange" class="sett_a">
                            wallet Change
                          </Link>
                        </li> */}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <button
                  style={{
                    border: "none",
                    color: "white",
                    backgroundColor: "transparent",
                  }}
                  class="disconnect-btn"
                  onClick={handleDisconnect}
                >
                  {" "}
                  <img
                    src="/unlink1.png"
                    atl=""
                    style={{ marginRight: "12px" }}
                  />{" "}
                  Disconnect
                </button>
              </li>
            </ul>
          </div>
          <div class="dash-navbottom">
            <a href="">
              {" "}
              <p>
                <img src="/dash-btn.png" atl="" />
              </p>{" "}
              <span>{userAddress}</span>
            </a>
          </div>
        </div>
        <div class="dashboard-right">
          <div class="reward-p2p" id="something-stake">
            <div class="something">
              <Link href="/dashboard">
                <img src="/backArrow.png" alt="" />
              </Link>
              <span>Staking</span>
            </div>
            <div class="stake-start">
              Start staking{" "}
              <span>
                <img src="/arrowLeft.png" />
              </span>
            </div>
          </div>
          <div class="container-fluid">
            <div class="stacking-head">
              <h2>Staking</h2>
              {/* <a href="" class="stakeing-ha">
                BuyP2pBIt <img class="stakeing-ha" onClick={()=>setShow(true)}src="/arrowLeft.png" atl="" />
              </a> */}
              <h6
                onClick={() => setShow(true)}
                style={{
                  display: "flex",
                  float: "right",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                BuyP2pBit
                <span>
                  <img
                    style={{ height: "20px", width: "20px" }}
                    src="/arrowLeft.png"
                    alt=""
                  />
                </span>
              </h6>
            </div>

            <div class="stacking-tabs">
              <div class="velle">
                <ul
                  class="nav nav-pills mb-3 stacktabs-upper"
                  id="pills-tab"
                  role="tablist"
                >
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link active"
                      id="pills-home-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-home"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
                      aria-selected="true"
                    >
                      Current
                    </button>
                  </li>

                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link"
                      id="pills-profile-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-profile"
                      type="button"
                      role="tab"
                      aria-controls="pills-profile"
                      aria-selected="false"
                      onClick={(e) => testFn(e)}
                    >
                      Earlier
                    </button>
                  </li>
                </ul>
                {/* <div class="velle-show">
                <ul>
                  <li>Show Only</li>
                  <li>
                    <span class="orange"></span>
                    <span class="green"></span>
                    <span class="grey"></span>
                  </li>
                </ul>
              </div> */}
              </div>

              {/* current Tab */}
              <div class="tab-content" id="pills-tabContent">
                <div
                  class="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                  tabindex="0"
                >
                  {totalStaking === 0 ? (
                    <div class="current-box">
                      <img src="/smartt.png" alt="" />
                      <h6>No Stakes are Live !</h6>
                      <p>Stake your tokens now and get high APY at low risk.</p>
                      <a href="" class="king-a">
                        Start Staking <img src="img/right-arrows.png" alt="" />
                      </a>
                    </div>
                  ) : (
                    <div class="stacking-cards" id="stacking-cards1">
                      {totalData?.map((item, id) => {
                        return (
                          <>
                          {new Date().toLocaleString()>= new Date(item?.startDate*1000).toLocaleString() ?
                          <div class="stake-card1">
                          <div class="scard-head">ABC Staking</div>
                          <p class="live">Live</p>
                          <div class="scard-table">
                            <ul>
                              <li>
                                <span>APR:</span>
                                <span>
                                  {item?.rateOfInterest}%{" "}
                                  <img src="img/calculator@2x.png" alt="" />
                                </span>
                              </li>
                              <li>
                                <span>Local Duration:</span>
                                <span>{item?.duration}months</span>
                              </li>
                            </ul>
                          </div>

                          <div class="stake-stake">
                            <div class="input-group mb-3">
                              <input
                                // style={{color:"white"}}
                                type="text"
                                class="form-control"
                                placeholder="0.0"
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                                onChange={(e) => setAmount(e.target.value)}
                              />

                              <span
                                style={{ cursor: "pointer" }}
                                class="input-group-text"
                                id="basic-addon2"
                                onClick={() => getIdForStake(item)}
                              >
                                Stake
                              </span>
                            </div>
                          </div>
                          <div class="stak-min">
                            <p>
                              Min. {min} P2PBIT - Max. {max} P2PBIT Stakes
                              are allowed per user total Data
                            </p>
                          </div>
                          <div class="scard-accordian">
                            <div class="accordion" id="accordionExample">
                              <div class="accordion-item">
                                <h2 class="accordion-header">
                                  <button
                                    class="accordion-button more-details"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapsetwo"
                                    aria-expanded="true"
                                    aria-controls="collapsetwo"
                                  >
                                    <span>More Details</span>
                                  </button>
                                </h2>
                                <div
                                  id="collapsetwo"
                                  class="accordion-collapse collapse show"
                                  data-bs-parent="#accordionExample"
                                >
                                  <div class="accordion-body">
                                    <ul>
                                      <li>
                                        <span>APR:</span>
                                        <span>{item?.rateOfInterest}%</span>
                                      </li>
                                      <li>
                                        <span>Locl Duration:</span>
                                        <span>{item?.duration} months</span>
                                      </li>
                                    </ul>
                                    <ul class="stacking-contract">
                                      <li>
                                        <span className="linkhref">
                                          <Link
                                            target="_blank"
                                            href={`https://mumbai.polygonscan.com/address/${tokenAddress}`}
                                          >
                                            {tokenAddress?.slice(0, 5) +
                                              "****" +
                                              tokenAddress?.slice(-5)}
                                          </Link>
                                        </span>

                                        <span className="linkhref">
                                          <Link
                                            target="_blank"
                                            href={`https://mumbai.polygonscan.com/address/${item?.contractAddress}`}
                                          >
                                            {item?.contractAddress?.slice(
                                              0,
                                              5
                                            ) +
                                              "****" +
                                              item?.contractAddress?.slice(
                                                -5
                                              )}
                                          </Link>
                                        </span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        :null}
                            


                            {new Date().toLocaleString() <
                            new Date(
                              item?.startDate * 1000
                            ).toLocaleString() ? (
                              <div class="stake-card1">
                                <div class="scard-head">UVX Staking</div>
                                <p class="upcoming">Unlocked</p>
                                <div class="scard-table">
                                  <ul>
                                    <li>
                                      <span>APR:</span>
                                      <span>
                                        {item?.rateOfInterest}%{" "}
                                        <img
                                          src="img/calculator@2x.png"
                                          alt=""
                                        />
                                      </span>
                                    </li>
                                    <li>
                                      <span>Local Duration:</span>
                                      <span>{item?.duration} months</span>
                                    </li>
                                  </ul>
                                </div>
                                <div class="stak-min">
                                  <p>
                                    Min. {min} P2PBIT - Max. {max} P2PBIT Stakes
                                    are allowed per user
                                  </p>
                                </div>
                                <div class="scard-timing">
                                  <ul>
                                    <>
                                      <li>
                                        {/* <strong>{timeLefts[id]?.days}</strong> */}
                                        <span>Days</span>
                                      </li>
                                      <li>
                                        {/* <strong>{timeLefts[id]?.hours}</strong> */}
                                        <span>Hours</span>
                                      </li>
                                      <li>
                                        <strong>
                                          {/* {timeLefts[id]?.minutes} */}
                                        </strong>
                                        <span>Min</span>
                                      </li>
                                      <li>
                                        <strong>
                                          {/* {timeLefts[id]?.seconds} */}
                                        </strong>
                                        <span>Sec</span>
                                      </li>
                                    </>
                                  </ul>

                                  <p>
                                    {new Date(
                                      item?.endDate * 1000
                                    )?.toLocaleString()}
                                    (GMT)
                                  </p>
                                </div>
                                <div class="scard-accordian">
                                  <div class="accordion" id="accordionExample">
                                    <div class="accordion-item">
                                      <h2 class="accordion-header">
                                        <button
                                          class="accordion-button more-details"
                                          type="button"
                                          data-bs-toggle="collapse"
                                          data-bs-target="#collapseOne"
                                          aria-expanded="true"
                                          aria-controls="collapseOne"
                                        >
                                          <span>More Details</span>
                                        </button>
                                      </h2>
                                      <div
                                        id="collapseOne"
                                        class="accordion-collapse collapse show"
                                        data-bs-parent="#accordionExample"
                                      >
                                        <div class="accordion-body">
                                          <ul>
                                            <li>
                                              <span>Locked on:</span>
                                              <span>
                                                {new Date(
                                                  item?.startDate * 1000
                                                )?.toLocaleString()}{" "}
                                                (GMT)
                                              </span>
                                            </li>
                                            <li>
                                              <span>UnLocked on:</span>
                                              <span>
                                                {new Date(
                                                  item?.endDate * 1000
                                                )?.toLocaleString()}{" "}(GMT)
                                              </span>
                                            </li>
                                          </ul>
                                          <ul class="stacking-contract">
                                            <li>
                                              <span className="linkhref">
                                                <Link
                                                  target="_blank"
                                                  href={`https://mumbai.polygonscan.com/address/${tokenAddress}`}
                                                >
                                                  {tokenAddress?.slice(0, 5) +
                                                    "****" +
                                                    tokenAddress?.slice(-5)}
                                                </Link>
                                              </span>

                                              <span className="linkhref">
                                                <Link
                                                  target="_blank"
                                                  href={`https://mumbai.polygonscan.com/address/${item?.contractAddress}`}
                                                >
                                                  {item?.contractAddress?.slice(
                                                    0,
                                                    5
                                                  ) +
                                                    "****" +
                                                    item?.contractAddress?.slice(
                                                      -5
                                                    )}
                                                </Link>
                                              </span>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div
                  class="tab-pane fade  "
                  id="pills-profile"
                  role="tabpanel"
                  aria-labelledby="pills-profile-tab"
                  tabindex="0"
                >
                  {length === 0 || !length ? (
                    <div class="current-box">
                      <img src="/smartt.png" alt="" />
                      <h6>No Stakes are Live !</h6>
                      <p>Stake your tokens now and get high APY at low risk.</p>
                      <a href="" class="king-a">
                        Start Stacking <img src="img/right-arrows.png" alt="" />
                      </a>
                    </div>
                  ) : (
                    <div class="stacking-cards">
                    
                      {newData?.map((item, id) => {
                       console.log(Number(ethers.utils.formatEther(item?.totalTokens)) + Number(ethers.utils.formatEther(item?.rateOfInterest)),"ii")
                        return (
                          <div class="stake-card1">
                            {new Date().toLocaleString() <
                              new Date(item.withdrawDate).toLocaleString() && (
                              <>
                                <div class="scard-head">ABC staking</div>
                                <p class="going">On Going</p>
                              </>
                            )}

                            {new Date().toLocaleString() >
                              new Date(item.withdrawDate).toLocaleString() && (
                              <>
                                <div class="scard-head">UVX stacking</div>
                                <p class="unlocked">Unlocked</p>
                              </>
                            )}

                            <div class="scard-table">
                              <ul>
                                <li>
                                  <span>Ultimate Value:</span>
                                  <span>
                                   
                                    {
                                      Number(ethers.utils.formatEther(
                                        item?.totalTokens
                                      )
                                    ) + Number(ethers.utils.formatEther(item?.rateOfInterest)) }
                                  </span>
                                </li>
                                <li>
                                  <span>Staked Tokens:</span>
                                  <span>
                                    {Math.floor(ethers.utils.formatEther(
                                      item?.totalTokens)
                                    )}
                                  </span>
                                </li>
                                <li>
                                  <span>APR:</span>
                                  <span>{item?.roi}%</span>
                                </li>
                              </ul>
                            </div>

                            {new Date().toLocaleString() <
                              new Date(item.withdrawDate).toLocaleString() && (
                              <>
                                <div class="scard-timing">
                                  <ul>
                                    <li>
                                      {/* <strong>{dash[id].days}</strong> */}
                                      <span>Days</span>
                                    </li>
                                    <li>
                                      {/* <strong>{dash[id].hours}</strong> */}
                                      <span>Hours</span>
                                    </li>
                                    <li>
                                      {/* <strong>{dash[id].minutes}</strong> */}
                                      <span>Min</span>
                                    </li>
                                    <li>
                                      {/* <strong>{dash[id].seconds}</strong> */}
                                      <span>Sec</span>
                                    </li>
                                  </ul>
                                  <p>
                                    {new Date(
                                      item?.withdrawDate
                                    ).toLocaleString()}{" "}
                                    (GMT)
                                  </p>
                                </div>
                              </>
                            )}

                            {new Date().toLocaleString() >
                              new Date(item.withdrawDate).toLocaleString() && (
                              <>
                                <div class="scard-timing" id="claim-stack">
                                  <button
                                    className="claim"
                                    style={{ background: "transparent" }}
                                    onClick={() => getId(item)}
                                  >
                                    Claim
                                  </button>
                                </div>
                              </>
                            )}

                            {/* {tx && null} */}

                            <div class="scard-accordian">
                              <div class="accordion" id="accordionExample">
                                <div class="accordion-item">
                                  <h2 class="accordion-header">
                                    <button
                                      class="accordion-button more-details"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#collapseOne"
                                      aria-expanded="true"
                                      aria-controls="collapseOne"
                                    >
                                      <span>More Details</span>
                                    </button>
                                  </h2>
                                  <div
                                    id="collapseOne"
                                    class="accordion-collapse collapse show"
                                    data-bs-parent="#accordionExample"
                                  >
                                    <div class="accordion-body">
                                      <ul>
                                        <li>
                                          <span>Locked on:</span>
                                          <span>
                                            {new Date(
                                              item?.startDate * 1000
                                            ).toLocaleString()}
                                          </span>
                                        </li>
                                        <li>
                                          <span>UnLocked on:</span>
                                          <span>
                                            {new Date(
                                              item?.withdrawDate
                                            ).toLocaleString()}
                                          </span>
                                        </li>
                                      </ul>
                                      <ul class="stacking-contract">
                                        <li>
                                          <span className="linkhref">
                                            <Link
                                              target="_blank"
                                              href={`https://mumbai.polygonscan.com/address/${tokenAddress}`}
                                            >
                                              {tokenAddress?.slice(0, 5) +
                                                "****" +
                                                tokenAddress?.slice(-5)}
                                            </Link>
                                          </span>

                                          <span className="linkhref">
                                            <Link
                                              target="_blank"
                                              href={`https://mumbai.polygonscan.com/address/${item?.contractAddress}`}
                                            >
                                              {item?.contractAddress?.slice(
                                                0,
                                                5
                                              ) +
                                                "****" +
                                                item?.contractAddress?.slice(
                                                  -5
                                                )}
                                            </Link>
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="bottom-nav">
        <div class="container">
          <div class="bottomnav-head">
            <ul>
              <li>
                <Link href="/dashboard">
                  <svg
                    id="Dashboard"
                    xmlns="http://www.w3.org/2000/svg"
                    width="23.992"
                    height="24"
                    viewBox="0 0 23.992 24"
                  >
                    <g
                      id="Group_17237"
                      data-name="Group 17237"
                      transform="translate(0 0)"
                    >
                      <path
                        id="Path_10905"
                        data-name="Path 10905"
                        d="M5.449,2.1q1.093,0,2.184.014A2.063,2.063,0,0,1,9.7,4.179c.02,1.4.022,2.869,0,4.356a2.047,2.047,0,0,1-2.087,2.073q-1.067.011-2.135.011-1.091,0-2.179-.011a2.063,2.063,0,0,1-2.1-2.113c0-.319,0-.638,0-.958h.023v-1.2c0-.264,0-.528-.011-.792A14.443,14.443,0,0,1,1.235,3.99a2.01,2.01,0,0,1,2.04-1.878Q4.362,2.1,5.449,2.1m0-1.2q-1.1,0-2.191.014A3.21,3.21,0,0,0,.039,3.888C-.03,4.7.027,5.52.027,6.337H.006c0,.722-.006,1.446,0,2.169a3.269,3.269,0,0,0,3.283,3.3q1.1.011,2.191.011,1.073,0,2.148-.011A3.256,3.256,0,0,0,10.9,8.551q.031-2.194,0-4.391A3.251,3.251,0,0,0,7.649.912Q6.549.9,5.449.9"
                        transform="translate(0.001 -0.898)"
                        fill="#ccd0db"
                      />
                      <path
                        id="Path_10906"
                        data-name="Path 10906"
                        d="M16.431,2.1q1.037,0,2.072.01A2.045,2.045,0,0,1,20.6,4.178c.022,1.392.023,2.817,0,4.355a2.047,2.047,0,0,1-2.084,2.076q-1.06.011-2.119.011-1.1,0-2.195-.011A2.063,2.063,0,0,1,12.1,8.5c0-.319,0-.638,0-.958h.023v-1.2c0-.263-.006-.527-.012-.791a14.755,14.755,0,0,1,.019-1.555A2.027,2.027,0,0,1,14.21,2.11Q15.32,2.1,16.431,2.1m0-1.2Q15.317.9,14.2.91a3.218,3.218,0,0,0-3.269,2.981c-.07.81-.012,1.632-.012,2.448H10.9c0,.724-.006,1.447,0,2.169a3.269,3.269,0,0,0,3.285,3.3q1.1.011,2.207.011,1.066,0,2.132-.011A3.256,3.256,0,0,0,21.8,8.549q.031-2.194,0-4.391A3.254,3.254,0,0,0,18.515.912Q17.473.9,16.431.9"
                        transform="translate(2.179 -0.897)"
                        fill="#ccd0db"
                      />
                      <path
                        id="Path_10907"
                        data-name="Path 10907"
                        d="M5.455,13q1.08,0,2.16.011a2.061,2.061,0,0,1,2.091,2.1c0,.32.006.642.006.962H9.686v1.188c0,.266.006.533.012.8a15.2,15.2,0,0,1-.019,1.578A2.005,2.005,0,0,1,7.636,21.5q-1.1.014-2.2.016-1.078,0-2.156-.016a2.069,2.069,0,0,1-2.07-2.089c-.013-1.426-.013-2.877,0-4.317A2.049,2.049,0,0,1,3.3,13.007Q4.378,13,5.455,13m0-1.2q-1.084,0-2.167.011A3.259,3.259,0,0,0,.01,15.085q-.02,2.169,0,4.339A3.258,3.258,0,0,0,3.263,22.7q1.085.014,2.173.016,1.109,0,2.216-.016a3.211,3.211,0,0,0,3.223-2.973c.067-.82.011-1.649.011-2.474h.023c0-.722.008-1.446,0-2.169a3.266,3.266,0,0,0-3.279-3.278Q6.542,11.8,5.455,11.8"
                        transform="translate(0 1.281)"
                        fill="#ccd0db"
                      />
                      <path
                        id="Path_10908"
                        data-name="Path 10908"
                        d="M16.37,13q1.066,0,2.13.01a2.065,2.065,0,0,1,2.1,2.108c0,.323,0,.644,0,.967h-.024V17.27c0,.263.006.526.011.79a15.172,15.172,0,0,1-.018,1.559A2.009,2.009,0,0,1,18.54,21.5q-1.111.018-2.221.018-1.078,0-2.156-.018A2.047,2.047,0,0,1,12.1,19.4q-.016-2.147,0-4.295a2.058,2.058,0,0,1,2.1-2.1Q15.289,13,16.37,13m0-1.2q-1.087,0-2.173.008A3.264,3.264,0,0,0,10.9,15.1q-.018,2.156,0,4.314A3.257,3.257,0,0,0,14.142,22.7q1.089.018,2.177.018,1.12,0,2.239-.018a3.209,3.209,0,0,0,3.212-2.983c.068-.811.012-1.632.012-2.448h.02c0-.722.008-1.446,0-2.169a3.268,3.268,0,0,0-3.291-3.293q-1.069-.011-2.139-.01"
                        transform="translate(2.179 1.281)"
                        fill="#ccd0db"
                      />
                    </g>
                  </svg>
                </Link>
              </li>
              <li>
                <Link href="/mainGenealogy">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23.903"
                    height="24"
                    viewBox="0 0 23.903 24"
                  >
                    <path
                      id="Path_10932"
                      data-name="Path 10932"
                      d="M35.243,1h-.008a5.161,5.161,0,0,0-5.08,4.362,4.965,4.965,0,0,0,.731,3.5,5.138,5.138,0,0,0,3.636,2.37l.1.017v9.247l-1.81-1.408.05-.091a5.138,5.138,0,0,0-8.381-5.882,5.117,5.117,0,0,0,.07,6.678,5,5,0,0,0,3.118,1.7,5.58,5.58,0,0,0,.783.057,5.129,5.129,0,0,0,3.556-1.462l.075-.069.56.434c.625.487,1.245.968,1.864,1.453a.348.348,0,0,1,.13.247c0,.4,0,.794,0,1.2v.476H33.06c-.276,0-.553,0-.829,0a.588.588,0,0,0-.258,1.13.778.778,0,0,1,.075.046h6.344a.125.125,0,0,1,.028-.019.6.6,0,0,0-.284-1.158H35.82V23.3c0-.362,0-.71.008-1.058a.546.546,0,0,1,.185-.379c.585-.465,1.177-.925,1.768-1.384l.358-.278c.039-.03.081-.057.121-.084l.131-.086.07.065a5.257,5.257,0,0,0,3.607,1.444,5.075,5.075,0,0,0,3.589-1.478A5.134,5.134,0,1,0,37.6,18.995l.05.091L35.828,20.5V11.243l.1-.016a5.112,5.112,0,0,0,3.4-2.006,5.02,5.02,0,0,0,.984-3.836A5.13,5.13,0,0,0,35.243,1m-.012,9.091a3.956,3.956,0,0,1,0-7.913h.007a3.963,3.963,0,0,1,3.944,3.975,3.961,3.961,0,0,1-3.956,3.938m6.815,10.275a3.956,3.956,0,0,1,.01-7.913h.011a3.963,3.963,0,0,1,3.939,3.978,3.962,3.962,0,0,1-3.958,3.935Zm-13.636,0a3.956,3.956,0,0,1,.008-7.913h.011a3.963,3.963,0,0,1,3.941,3.978,3.962,3.962,0,0,1-3.958,3.935Z"
                      transform="translate(-23.277 -1.001)"
                      fill="#ccd0db"
                    />
                  </svg>
                </Link>
              </li>
              <li>
                <Link href="/mobileReward">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24.001"
                    viewBox="0 0 24 24.001"
                  >
                    <g
                      id="Group_17236"
                      data-name="Group 17236"
                      transform="translate(-1254.228 2273.334)"
                    >
                      <path
                        id="Path_10918"
                        data-name="Path 10918"
                        d="M54.336,18.591c.105-.644.232-1.4.351-2.157.215-1.357.318-1-.6-1.951q-.668-.691-1.349-1.37a1.5,1.5,0,0,1,.924-2.613c.83-.112,1.659-.253,2.489-.369a.636.636,0,0,0,.529-.4c.389-.834.793-1.66,1.18-2.494a1.4,1.4,0,0,1,2.62,0c.383.826.786,1.643,1.169,2.469a.671.671,0,0,0,.569.425c.885.122,1.767.265,2.648.405a1.37,1.37,0,0,1,1.158.973,1.414,1.414,0,0,1-.334,1.5q-.945.989-1.92,1.949a.8.8,0,0,0-.243.78q.241,1.359.454,2.723a1.428,1.428,0,0,1-.594,1.474,1.359,1.359,0,0,1-1.554.036c-.772-.429-1.553-.844-2.323-1.277a.628.628,0,0,0-.683,0c-.794.446-1.591.887-2.4,1.312a1.426,1.426,0,0,1-2.089-1.424m.924.068c-.014.5.357.741.761.523.794-.427,1.588-.855,2.375-1.3a1.464,1.464,0,0,1,1.541,0c.763.427,1.535.841,2.3,1.264.2.11.393.2.605.047a.587.587,0,0,0,.217-.627c-.149-.9-.29-1.8-.451-2.7a1.611,1.611,0,0,1,.473-1.529c.63-.622,1.244-1.26,1.867-1.889a.6.6,0,0,0,.2-.656.561.561,0,0,0-.522-.365c-.847-.128-1.693-.268-2.543-.382a1.5,1.5,0,0,1-1.251-.906c-.389-.833-.79-1.661-1.181-2.494-.1-.219-.232-.4-.5-.39s-.372.182-.469.39c-.39.834-.791,1.661-1.18,2.5a1.493,1.493,0,0,1-1.224.9c-.858.119-1.714.254-2.57.383-.357.054-.566.228-.545.522a.87.87,0,0,0,.223.493c.622.656,1.26,1.3,1.9,1.936a1.545,1.545,0,0,1,.454,1.384c-.035.25-.083.5-.125.748-.121.729-.242,1.459-.354,2.146"
                        transform="translate(1207.058 -2275.178)"
                        fill="#ccd0db"
                      />
                      <path
                        id="Path_10919"
                        data-name="Path 10919"
                        d="M60.634,4.666a11.889,11.889,0,0,1,11.432,9.6,11.662,11.662,0,0,1-.965,7.654c-.211.437-.507.583-.842.423s-.393-.478-.183-.922a10.855,10.855,0,0,0-16-13.631c-.091.065-.178.135-.274.192a.568.568,0,0,1-.8-.139.537.537,0,0,1,.156-.79,20.01,20.01,0,0,1,1.937-1.181,11.869,11.869,0,0,1,5.54-1.2"
                        transform="translate(1205.902 -2278)"
                        fill="#ccd0db"
                      />
                      <path
                        id="Path_10920"
                        data-name="Path 10920"
                        d="M62.131,26.052A12.017,12.017,0,0,1,51.448,8.768c.132-.271.309-.473.638-.442a.575.575,0,0,1,.418.888,11.418,11.418,0,0,0-.943,2.81A10.836,10.836,0,0,0,59.61,24.576a10.674,10.674,0,0,0,8.914-1.692,1.526,1.526,0,0,1,.5-.247.486.486,0,0,1,.555.281.527.527,0,0,1-.06.624,1.377,1.377,0,0,1-.252.216,12.361,12.361,0,0,1-7.131,2.294"
                        transform="translate(1204 -2275.389)"
                        fill="#ccd0db"
                      />
                    </g>
                  </svg>
                </Link>
              </li>
              {/* <li class="active">
             <Link href="/staking">
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 width="22.772"
                 height="25.148"
                 viewBox="0 0 22.772 25.148"
               >
                 <g
                   id="Group_17235"
                   data-name="Group 17235"
                   transform="translate(-1275.37 2278.598)"
                 >
                   <path
                     id="Path_10922"
                     data-name="Path 10922"
                     d="M85.45,21.143c.133.826.263,1.635.4,2.473.488,0,.967.008,1.445-.008.064,0,.15-.1.182-.169.713-1.6,1.433-3.205,2.118-4.822a2.172,2.172,0,0,1,.9-1.062,6.342,6.342,0,0,0,1.735-1.382,4.873,4.873,0,0,0,.946-1.886,3.757,3.757,0,0,0,.067-.832c.008-.609,0-1.217,0-1.849-.157-.011-.3-.016-.446-.033a2.213,2.213,0,0,1-1.57-.937A3.6,3.6,0,0,0,89.41,9.222c-.342-.105-.428-.385-.252-.738.389-.779.785-1.556,1.177-2.334.047-.093.089-.188.173-.368-.334.033-.612.053-.889.087-.109.014-.214.069-.323.08a.418.418,0,0,1-.482-.34.415.415,0,0,1,.239-.527,3,3,0,0,1,2.3.016c.262.107.311.4.151.72Q90.912,7,90.312,8.177c-.05.1-.1.2-.156.328.107.061.2.118.3.172a4.436,4.436,0,0,1,1.414,1.329,1.52,1.52,0,0,0,1.6.627c.48-.074.665.093.666.61,0,.7-.032,1.4.007,2.091a5,5,0,0,1-1.046,3.2,5.956,5.956,0,0,1-1.972,1.709,1.8,1.8,0,0,0-.791.917c-.712,1.689-1.465,3.359-2.2,5.039a.532.532,0,0,1-.545.356c-.658-.009-1.314,0-1.972,0-.394,0-.528-.125-.593-.53-.137-.857-.276-1.714-.419-2.6a9.689,9.689,0,0,1-4.69,0c-.094.568-.187,1.128-.28,1.688-.053.324-.1.648-.16.971-.062.346-.2.471-.522.472-.695,0-1.388,0-2.083,0a.51.51,0,0,1-.481-.279,58.18,58.18,0,0,1-3.518-6.907,7.834,7.834,0,0,1-.091-5.716c.036-.1.072-.2.113-.312-.166-.107-.336-.2-.491-.32a2.259,2.259,0,0,1-.982-2.351A2.205,2.205,0,0,1,73.18,6.914a2.106,2.106,0,0,1,.526-.024.449.449,0,0,1,.422.479.46.46,0,0,1-.433.444,2.665,2.665,0,0,0-.493.053,1.281,1.281,0,0,0-.55,2.151,5.873,5.873,0,0,0,.638.5A9.043,9.043,0,0,1,76.284,7.77a.449.449,0,0,1,.678.12c.146.256.056.5-.25.69-.032.02-.067.035-.1.058-.577.449-1.184.863-1.723,1.359a5.631,5.631,0,0,0-1.7,3.91,7.3,7.3,0,0,0,.685,3.57c.918,2.053,1.973,4.027,3.082,5.97.041.072.128.159.2.161.49.014.979.008,1.488.008.108-.664.218-1.31.319-1.958.08-.516.076-.516-.37-.76a2.251,2.251,0,0,1-.242-.142.465.465,0,0,1-.144-.634.415.415,0,0,1,.581-.164,6.868,6.868,0,0,0,3.814.8,6.194,6.194,0,0,0,3.068-.781.426.426,0,0,1,.628.152.471.471,0,0,1-.205.66c-.2.12-.408.226-.638.353"
                     transform="translate(1204 -2278)"
                     fill="#fff"
                   />
                   <path
                     id="Path_10923"
                     data-name="Path 10923"
                     d="M78.288,10.318a5.5,5.5,0,1,1,6.947,0c.284.117.57.221.84.352a.451.451,0,0,1-.365.824,9.818,9.818,0,0,0-3.916-.655,11.6,11.6,0,0,0-3.142.348c-.283.077-.556.194-.833.3a.456.456,0,0,1-.608-.206.442.442,0,0,1,.234-.618c.272-.129.557-.23.843-.345M81.74,1.451c-.2.02-.4.036-.6.062a4.563,4.563,0,0,0-1.73,8.453.648.648,0,0,0,.373.082,18.1,18.1,0,0,1,3.88-.006.831.831,0,0,0,.476-.112,4.58,4.58,0,0,0-2.4-8.478"
                     transform="translate(1204.797 -2279.048)"
                     fill="#fff"
                     stroke="#1d2025"
                     stroke-width="0.2"
                   />
                   <path
                     id="Path_10924"
                     data-name="Path 10924"
                     d="M86.257,10.18a.369.369,0,1,1-.365.372.371.371,0,0,1,.365-.372"
                     transform="translate(1207.022 -2276)"
                     fill="#fff"
                   />
                   <path
                     id="Path_10925"
                     data-name="Path 10925"
                     d="M83.514,3.9a1.42,1.42,0,0,0-.74-.738,1.31,1.31,0,0,0-.54-.112H79.4V6.366h-.413v.609H79.4v.572h1.187V6.975h.453V6.366h-.453V4.178A.249.249,0,0,1,80.66,4a.227.227,0,0,1,.174-.073h1.111a.512.512,0,1,1,0,1.024h-.329a.371.371,0,0,0-.187.035.5.5,0,0,0-.13.159l-.357.7h1.294a1.31,1.31,0,0,0,.54-.112,1.407,1.407,0,0,0,.74-.743,1.351,1.351,0,0,0,.11-.546,1.315,1.315,0,0,0-.11-.541"
                     transform="translate(1205.448 -2278.302)"
                     fill="#fff"
                   />
                 </g>
               </svg>
             </Link>
           </li>
           <li>
             <Link href="/ewallet">
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 width="24"
                 height="21.805"
                 viewBox="0 0 24 21.805"
               >
                 <g
                   id="Group_17240"
                   data-name="Group 17240"
                   transform="translate(-131.5 -291.1)"
                 >
                   <path
                     id="Path_10935"
                     data-name="Path 10935"
                     d="M26,16.92a3,3,0,0,0-2.4-2.94V12.12a3,3,0,0,0-3-3h-.952L14.32,3.792a3,3,0,0,0-4.242,0L4.724,9.149A2.993,2.993,0,0,0,2,12.12v9.6a3,3,0,0,0,3,3H20.6a3,3,0,0,0,3-3V19.86A3,3,0,0,0,26,16.92ZM10.928,4.642a1.8,1.8,0,0,1,2.545,0L17.952,9.12H6.448ZM20.6,23.52H5a1.8,1.8,0,0,1-1.8-1.8v-9.6A1.8,1.8,0,0,1,5,10.32H20.6a1.8,1.8,0,0,1,1.8,1.8v1.8H20.6a3,3,0,1,0,0,6h1.8v1.8a1.8,1.8,0,0,1-1.8,1.8Zm2.4-4.8H20.6a1.8,1.8,0,0,1,0-3.6H23a1.8,1.8,0,0,1,0,3.6Z"
                     transform="translate(129.5 288.185)"
                     fill="#CCD0DB"
                   />
                   <path
                     id="Path_10939"
                     data-name="Path 10939"
                     d="M132.238,12.161a2.221,2.221,0,0,0-1.151-1.151,2.069,2.069,0,0,0-.844-.174h-4.409v5.17h-.644v.95h.644v.89h1.85v-.89h.7v-.95h-.7V12.6a.394.394,0,0,1,.106-.278.354.354,0,0,1,.271-.113h1.73a.8.8,0,1,1,0,1.595h-.511a.59.59,0,0,0-.294.053.8.8,0,0,0-.2.248l-.557,1.084h2.016a2.05,2.05,0,0,0,.844-.174,2.2,2.2,0,0,0,1.151-1.158A2.119,2.119,0,0,0,132.41,13a2.063,2.063,0,0,0-.173-.842"
                     transform="translate(11.09 290.766)"
                     fill="#ccd0db"
                   />
                 </g>
               </svg>
             </Link>
           </li> */}
            </ul>
          </div>
        </div>
      </section>

      {/* Modal */}
      <Modal
        closeButton={false}
        blur
        aria-labelledby="modal-title"
        open={show}
        className="staking-modal"
      >
        <Modal.Body>
          <label htmlFor="duration">Duration</label>
          <input
            type="number"
            placeholder="duration"
            // onWheel={handleOnWheel}
            onChange={(e) => setDuration(e.target.value)}
            onFocus={(e) =>
              e.target.addEventListener(
                "wheel",
                function (e) {
                  e.preventDefault();
                },
                { passive: false }
              )
            }
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
          />
          <br />
          <label htmlFor="roi">Rate Of Interest</label>
          <input
            type="number"
            placeholder="rateOfInterest"
            onChange={(e) => setRoi(e.target.value)}
            onFocus={(e) =>
              e.target.addEventListener(
                "wheel",
                function (e) {
                  e.preventDefault();
                },
                { passive: false }
              )
            }
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
          />
          <br />
          <label htmlFor="startDate">
            Start Date
            <span className="span">
              <button className="connect-wallet1">Submit</button>
            </span>
          </label>
          <input
            type="datetime-local"
            class="transaction-date"
            onChange={(e) => setStartDate(e.target.value)}
          />
          <br />
          <label htmlFor="endDate">
            End Date
            <span className="span">
              <button className="connect-wallet1">Submit</button>
            </span>
          </label>
          <input
            type="datetime-local"
            class="transaction-date"
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
          />
          <br />
          <label htmlFor="minUser">Min User</label>
          <input
            type="number"
            placeholder="minUser"
            onChange={(e) => setMin(e.target.value)}
            onFocus={(e) =>
              e.target.addEventListener(
                "wheel",
                function (e) {
                  e.preventDefault();
                },
                { passive: false }
              )
            }
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
          />{" "}
          <br />
          <label htmlFor="maxUser">Max User</label>
          <input
            type="number"
            placeholder="maxUser"
            onChange={(e) => setMax(e.target.value)}
            onFocus={(e) =>
              e.target.addEventListener(
                "wheel",
                function (e) {
                  e.preventDefault();
                },
                { passive: false }
              )
            }
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
          />
          <br />
          <label htmlFor="total">Total Tokens</label>
          <input
            type="number"
            placeholder="totalTokens"
            onChange={(e) => setTotal(e.target.value)}
            onFocus={(e) =>
              e.target.addEventListener(
                "wheel",
                function (e) {
                  e.preventDefault();
                },
                { passive: false }
              )
            }
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
          />
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="connect-wallet"
            auto
            flat
            onPress={() => setShow(false)}
          >
            Close
          </Button>
          <Button className="connect-wallet" auto onPress={() => write()}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        closeButton={false}
        blur
        aria-labelledby="modal-title"
        open={show1}
        className="staking-modal"
      >
        <Modal.Body>
          <h3 style={{ textAlign: "center" }}>
            You already claim this staking
          </h3>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="connect-wallet"
            auto
            flat
            onPress={() => setShow1(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        closeButton={false}
        blur
        aria-labelledby="modal-title"
        open={show2}
        className="staking-modal"
      >
        <Modal.Body>
          <h3 style={{ textAlign: "center" }}>
          You cannot stake more than max stake of user
          </h3>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="connect-wallet"
            auto
            flat
            onPress={() => setShow2(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        closeButton={false}
        blur
        aria-labelledby="modal-title"
        open={show3}
        className="staking-modal"
      >
        <Modal.Body>
          <h3 style={{ textAlign: "center" }}>
          Withdraw Successfully
          </h3>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="connect-wallet"
            auto
            flat
            onPress={() => okSubmitHanlder()}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
