const { parentPort, MessagePort } = require("worker_threads");
const ethers = require("ethers");
var ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "large",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "slippage",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "useToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "routeToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "targetToken",
        type: "address",
      },
      {
        internalType: "bool",
        name: "testSell",
        type: "bool",
      },
    ],
    name: "cao",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
];
var provider,
  wallet,
  large,
  amountIn,
  slippage,
  useToken,
  routeToken,
  targetToken,
  testSell,
  data,
  iface;

let c = 0;
parentPort.on("message", async (message) => {
  console.log("传过来的值:", message);
  //初始化
  if (message.code == 0) {
    console.log(message.name + "线程开始运行");
    provider = ethers.getDefaultProvider(message.RPC);
    wallet = new ethers.Wallet(message.privateKey, provider);
    large = message.large;
    amountIn = ethers.utils.parseUnits(message.amountIn, "18");
    slippage = message.slippage;
    useToken = message.useToken;
    routeToken = message.routeToken;
    targetToken = message.targetToken;
    testSell = message.testSell;
    iface = new ethers.utils.Interface(ABI);
    data = iface.encodeFunctionData("cao", [
      large,
      amountIn,
      slippage,
      useToken,
      routeToken,
      targetToken,
      testSell,
    ]);
    //console.log("data:"+data);
  }
  //接收
  if (message.code == 1) {
    c = c + 1;
    if (c == 1) {
      tx = {
        from: wallet.address,
        to: "0xe419EAF0ED3D67Ce385B8aeD208f7333cE8FA0c1",
        value: ethers.utils.parseEther("0"),
        chainId: 56,
        nonce: wallet.getTransactionCount(),
        gasLimit: parseInt("1000000"),
        gasPrice: message.gasPrice,
        data: data,
      };

      let sign = await wallet.signTransaction(tx);
      console.log("交易签名:" + sign);
      if (sign != "") {
        let res = await provider.sendTransaction(sign);
        console.log(res.hash);
      }
    }
  }
});

return;
