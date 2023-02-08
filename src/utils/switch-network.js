import Web3 from "web3";
import { getObjectConfig } from "@/wallet_nc/common/ObjectConfig";
import { config, constractAddress } from "@/const/const";
import store from "@/store";
const switchNetwork = async function (ethereum, chainId) {
  chainId = Web3.utils.toHex(chainId);
  try {
    // @ts-ignore
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId }],
    }).then(()=>{
      location.reload()
    });
    window.localStorage.setItem(
      "currNetwork",
      getObjectConfig().CHAINID_MAP[chainId + ""]
    );
    location.reload()
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        switch (envChaindId) {
          case "42161":
            await addArbOneNet();
            break;
          case "421611":
            await addArbTestNet();
            break;
          case "52":
            await addJurtNetwork();
            break;
          case "137":
            await addPolyMainNetwork(ethereum);
          default:
            await addArbOneNet();
            break;
        }
      } catch (addError) {
        console.error("Error adding ethereum mainnet", addError);
      }
    }

    console.error("Error switching networks", switchError);
  }
};

const addArbOneNet = async function () {
  // @ts-ignore
  await window.ethereum
    .request({
      jsonrpc: "2.0",
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0xa4b1",
          chainName: "Arbitrum One",
          nativeCurrency: {
            name: "Arbitrum Ether",
            symbol: "AETH",
            decimals: 18,
          },
          rpcUrls: [
            "https://arb1.arbitrum.io/rpc",
            "wss://arb1.arbitrum.io/ws",
          ],
          blockExplorerUrls: ["https://arbiscan.io"],
        },
      ],
      id: 0,
    })
    .then(() => {
      window.localStorage.setItem("currNetwork", "arbitrumone");
      // history.go(0);
    });
};

const addJurtNetwork = async function (ethereum) {
  // @ts-ignore
  await ethereum
    .request({
      jsonrpc: "2.0",
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x34",
          chainName: "Jurt",
          nativeCurrency: {
            name: "Jurt JU",
            symbol: "JU",
            decimals: 18,
          },
          rpcUrls: ["https://jubbart-chain.com/blockChain"],
          blockExplorerUrls: ["https://jubbart-chain.com"],
        },
      ],
      id: 0,
    })
    .then(() => {
      window.localStorage.setItem("currNetwork", "jurt");
      // history.go(0);
    });
};

const addPolyMainNetwork = async function (ethereum) {
  // @ts-ignore
  await ethereum
    .request({
      jsonrpc: "2.0",
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x89",
          chainName: "Matic(Polygon) Mainnet",
          nativeCurrency: {
            name: "Matic(Polygon) Mainnet",
            symbol: "MATIC",
            decimals: 18,
          },
          rpcUrls: ["https://polygon-rpc.com/"],
          blockExplorerUrls: ["https://polygonscan.com"],
        },
      ],
      id: 0,
    })
    .then(() => {
      window.localStorage.setItem("currNetwork", "matic");
      // history.go(0);
    });
};
const addArbTestNet = async function () {
  await window.ethereum
    .request({
      jsonrpc: "2.0",
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x66eeb",
          chainName: "Arbitrum Testnet Rinkeby",
          nativeCurrency: {
            name: "Arbitrum Rinkeby Ether",
            symbol: "ARETH",
            decimals: 18,
          },
          rpcUrls: [
            "https://rinkeby.arbitrum.io/rpc",
            "wss://rinkeby.arbitrum.io/ws",
          ],
          blockExplorerUrls: ["https://rinkeby-explorer.arbitrum.io"],
        },
      ],
      id: 0,
    })
    .then(() => {
      window.localStorage.setItem("currNetwork", "arbitrumrinkeby");
      // history.go(0);
    });
};

const switchNetworkByChainId = async function (ethereum, tochainId) {
  debugger;
  const envChaindId = tochainId;
  const chainId = Web3.utils.toHex(envChaindId);
  try {
    debugger;
    var switchRet = await ethereum
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      })
      .then((ret) => {
        debugger;
        return ret;
      });
    debugger;
    window.localStorage.setItem(
      "currNetwork",
      getObjectConfig().CHAINID_MAP[envChaindId + ""]
    );
    // history.go(0);
  } catch (switchError) {
    debugger;
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        switch (envChaindId) {
          case "42161":
            await addArbOneNet();
            break;
          case "421611":
            await addArbTestNet();
            break;
          case "52":
            await addJurtNetwork(ethereum);
            break;
          case "137":
            await addPolyMainNetwork(ethereum);
            break;
          default:
            await addArbOneNet();
            break;
        }
      } catch (addError) {
        console.error("Error adding ethereum mainnet", addError);
      }
    }

    console.error("Error switching networks", switchError);
  }
};

export {
  switchNetwork,
  switchNetworkByChainId,
  addJurtNetwork,
  addPolyMainNetwork,
};
