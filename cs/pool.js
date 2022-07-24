const { parentPort } = require("worker_threads");
const axios = require("axios");

parentPort.on("message", (message) => {
  console.log(message);
  txpool();
  async function txpool() {
    console.log(message.name + "正在发送请求");
    let result = await axios({
      url: message.RPC,
      method: "post",
      data: '{"method":"txpool_content","params":[],"id":1,"jsonrpc":"2.0"}',
      headers: {
        "Content-Type": "application/json",
      },
    });
    //console.log(result.data.result);
    let pending = result.data.result.pending;
    for (let key in pending) {
      //console.log(pending[key]);
      for (let key1 in pending[key]) {
        let input = pending[key][key1].input;
        let str = input.substr(0, 10);
        console.log(str);
        if (str == "0xe8e33700") {
          if (input.indexOf(message.address.toLowerCase()) != -1) {
            parentPort.postMessage({
              code: 1,
              name: message.name,
              MethodID: "addLiquidity",
              gasPrice: pending[key][key1].gasPrice,
              hash: pending[key][key1].hash,
            });
            return;
          }
        } else if (str == "0xf305d719") {
          if (input.indexOf(message.address.toLowerCase()) != -1) {
            parentPort.postMessage({
              code: 1,
              name: message.name,
              MethodID: "addLiquidityETH",
              gasPrice: pending[key][key1].gasPrice,
              hash: pending[key][key1].hash,
            });
            return;
          }
        }
      }
    }
    txpool();
  }
});
