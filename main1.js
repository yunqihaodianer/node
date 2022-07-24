const { Worker, MessageChannel } = require("worker_threads");
const ethers = require("ethers");

const pool1 = new Worker("./pool.js");
const pool2 = new Worker("./pool.js");
const worker1 = new Worker("./worker.js");
const worker2 = new Worker("./worker.js");
const worker3 = new Worker("./worker.js");
var RPC = "http://12.0.0.1:8080";

pool1.postMessage({
  name: "pool1",
  RPC: RPC,
  address: "5c7C45E7C8Febb2a16092FE32Bc465e88d4389Eb",
});
pool2.postMessage({
  name: "pool2",
  RPC: RPC,
  address: "5c7C45E7C8Febb2a16092FE32Bc465e88d4389Eb",
});
//初始化传值
worker1.postMessage({
  code: 0,
  name: "worker1",
  RPC: RPC,
  privateKey:
    "0x530ebe9decd37798b7b84cd2091516deb728bbcf25e204e2c94ec108f55c51bb",
  large: "0x6CD889c590f2b27DFe5f8368B6ef767e67122222",
  amountIn: "0.0001",
  slippage: "40",
  useToken: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  routeToken: "0x0000000000000000000000000000000000000000",
  targetToken: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
  testSell: false,
});
worker2.postMessage({
  code: 0,
  name: "worker2",
  RPC: RPC,
  privateKey:
    "0x57108fded8f94136de09e40f6e00799c65a3171cd7c50614a69cd783f1f2ad33",
  large: "0x6CD889c590f2b27DFe5f8368B6ef767e67122222",
  amountIn: "0.0001",
  slippage: "40",
  useToken: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  routeToken: "0x0000000000000000000000000000000000000000",
  targetToken: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
  testSell: false,
});
worker3.postMessage({
  code: 0,
  name: "worker2",
  RPC: RPC,
  privateKey:
    "0x8aba06121b6b9307687e7211fc4d65eab0290b5cb1582d4466f5794136c6d55e",
  large: "0x6CD889c590f2b27DFe5f8368B6ef767e67122222",
  amountIn: "0.0001",
  slippage: "40",
  useToken: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  routeToken: "0x0000000000000000000000000000000000000000",
  targetToken: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
  testSell: false,
});

//线程传值中转
pool1.on("message", (message) => worker1.postMessage(message));
pool1.on("message", (message) => worker2.postMessage(message));
pool1.on("message", (message) => worker3.postMessage(message));

pool2.on("message", (message) => worker1.postMessage(message));
pool2.on("message", (message) => worker2.postMessage(message));
pool1.on("message", (message) => worker3.postMessage(message));
