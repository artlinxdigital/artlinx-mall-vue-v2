// @ts-nocheck
import { ethers } from "ethers";
import { isMetaMaskInstalled, initialize } from "@/wallet/metamask";
import WalletConnectProvider from "@walletconnect/web3-provider";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { config } from "@/const/const";
const formatETHWalletAddress = (address) => {
  if (!address) return "";

  return (
    address.substring(0, 6) +
    "..." +
    address.substring(address.length - 4, address.length)
  );
};

import Web3 from "web3";
import { add } from "mathjs";
const chainUrl = config.chainURI;
const chainName = config.chainName;
const chainId = config.chainId;
const networkId = config.networkId;
const state = () => ({
  provider: null,
  web3Provider: null,
  signer: null,
  onboard: null,
  notify: null,
  // connectWallet,
  // disconnectWallet,
  // switchAccounts,
  // isHardwareWallet,
  selectedWallet: null,
  walletConnected: false,
  walletAddress: "",
  formattedWalletAddress: "",
  networkId: chainId,
  innerText: "",
});
const getters = {
  incorrectNetwork(state) {
    return chainId != state.networkId;
  },
  web3(state) {
    return new Web3(state.web3Provider);
  },
  walletAddress(state) {
    return state.walletAddress;
  },
};

const actions = {
  async connectWallet({ state, dispatch }, useSavedWallet) {
    // eslint-disable-next-line
    await initialize(state);

    const walletConnectorS = window.localStorage.getItem("walletconnect");
    if (walletConnectorS) {
      var walletConnect = JSON.parse(walletConnectorS);
      if (walletConnect.connected == true) {
        await dispatch("cWalletConnect", {
          Init: async (callback) => {
            const connector = state.web3Provider;
            if (connector != undefined) {
              var web3 = new Web3(connector);
              const accounts = await web3.eth.getAccounts();
              const chainId = await web3.eth.getChainId();
              callback([{ chainId: chainId, accounts: accounts }]);
            }
          },
          onDisconnect: async () => {
            state.walletConnected = false;
            state.networkId = chainId;
            state.signer = [];
            state.walletAddress = "";
            window.localStorage.setItem("walletAddress", "");
            window.localStorage.setItem("walletitem", "");
            window.localStorage.setItem("loginId", "");
          },
          onConnect: async (payload) => {
            QRCodeModal.close();
            const { chainId, accounts } = payload[0];

            const address = accounts[0];
            state.walletConnected = true;
            state.networkId = chainId;
            state.signer = accounts;
            state.walletAddress = address;
            if (
              address != null &&
              address != undefined &&
              address != "undefined" &&
              address.length == 42
            ) {
              window.localStorage.setItem("walletAddress", address);
            }
            state.selectedWallet = "walletconnect";
            window.localStorage.setItem("selectedWallet", "walletconnect");
            // 可以直接到首页
            console.log("state", state);
            // router.replace({
            //   path: "/",
            // });
          },
        });
      }
    }
  },
  async fetchEthBalance({ state, commit }) {
    if (!state.walletAddress) return;

    const ethBalance = await state.provider
      .getBalance(state.walletAddress)
      .then((balance) => {
        return ethers.utils.formatEther(balance);
      })
      .catch((err) => {
        console.error(err);
        return null;
      });

    const walletObject = {
      // ...walletData,
      // formattedWalletAddress: formatETHWalletAddress(walletData.address),
      // walletName: walletData.wallet.name,
      ethBalance,
    };

    commit("SET_SELECTED_WALLET", walletObject);
  },
  cMetamask({ state, commit }, context) {
    // console.log("metamask:", this.metamask);
    state.onclick(state);
    // Connected 登录
    if (state.innerText == "Connected") {
      // 可以直接到首页
      // wallet.js
      // state.walletConnected = true;
      // this.SET_WALLET_CONNECTED(true);

      //state.walletAddress = this.metamask.accountsDiv.innerHTML[0];
      // this.SET_WALLET_ADDRESS(this.metamask.accountsDiv.innerHTML[0]);
      commit("SET_WALLET_ADDRESS", state.signer[0]);
      //state.formattedWalletAddress = this.metamask.accountsDiv.innerHTML[0];
      //state.networkId = this.metamask.networkDiv.innerHTML;
      // this.SET_NETWORK_ID(this.metamask.networkDiv.innerHTML);
      //state.wallet.selectedWallet = "metamask";
      state.selectedWallet = "metamask";
      window.localStorage.setItem("selectedWallet", "metamask");
      const { ethereum } = window;
      const web3Provider = ethereum;
      const provider = new ethers.providers.Web3Provider(web3Provider);
      const signer = provider.getSigner();

      // notify.config({ networkId })
      // this.SET_WEB3_PROVIDER(web3Provider);
      commit("SET_WEB3_PROVIDER", web3Provider);
      // this.SET_PROVIDER(provider);
      commit("SET_PROVIDER", provider);
      // this.SET_SIGNER(signer);
      commit("SET_SIGNER", signer);
      console.log("this.$store.state", state);
      // this.handleLogin();
      // router.replace({
      //   path: "/",
      // });
    }
  },
  async cWalletConnect({ state, commit }, context) {
    // bridge url
    const bridge = "https://bridge.walletconnect.org";

    // create new walletConnector
    const walletConnector = new WalletConnectProvider({
      rpc: {
        [chainId]: chainUrl,
        [networkId]: chainUrl,
      },
      chainId: chainId, //需要连接的区块链id
      networkId: chainId,
      qrcode: true, //二维码是否开启
      qrcodeModal: QRCodeModal,
    });

    window.walletConnector = walletConnector;

    const web3Provider = walletConnector;
    const provider = new ethers.providers.Web3Provider(web3Provider);
    const signer = provider.getSigner();

    commit("SET_WEB3_PROVIDER", web3Provider);
    commit("SET_PROVIDER", provider);
    commit("SET_SIGNER", signer);
    commit("SET_SELECTED_WALLET", "walletconnect");
    // check if already connected
    if (
      !walletConnector.walletConnected &&
      state.selectedWallet == "walletconnect"
    ) {
      // create new session
      walletConnector
        .enable()
        .then((accounts) => {
          //账户更改触发的方法
          provider.on("accountsChanged", (accounts) => {
            context.onConnect(accounts);
          });
          //账户断开的方法
          provider.on("disconnect", (error, reason) => {
            console.log(`connector.on("disconnect")`);

            if (error) {
              throw error;
            }

            context.onDisconnect();
          });

          //这里返回的是链接地址
          context.Init((result) => {
            context.onConnect(result);
          });
          //这里返回的是链接地址
          // context.onConnect(accounts);
        })
        .catch((err) => {
          console.log("fail:", err);
        });
    }
  },
  GET_WALLET_ADDRESS({ state, commit }) {
    return commit("GET_WALLET_ADDRESS");
  },
  SET_WALLET_ADDRESS({ state, commit }, address) {
    commit("SET_WALLET_ADDRESS", address);
  },
  SET_PROVIDER({ state, commit }, provider) {
    commit("SET_PROVIDER", provider);
  },
  SET_WEB3_PROVIDER({ state, commit }, provider) {
    commit("SET_WEB3_PROVIDER", provider);
  },
  SET_SIGNER({ state, commit }, signer) {
    commit("SET_SIGNER", signer);
  },
  SET_WALLET_CONNECTED({ state, commit }, walletObj) {
    commit("SET_WALLET_CONNECTED", walletObj);
  },
  SET_SELECTED_WALLET({ state, commit }, connected) {
    commit("SET_SELECTED_WALLET", connected);
  },
  SET_NETWORK_ID({ state, commit }, networkId) {
    commit("SET_NETWORK_ID", networkId);
  },
};
const mutations = {
  SET_WALLET_ADDRESS(state, address) {
    state.walletAddress = address;
    if (address) state.formattedWalletAddress = formatETHWalletAddress(address);
    else state.formattedWalletAddress = address;
  },
  GET_WALLET_ADDRESS(state, address) {
    return state.walletAddress;
  },
  SET_PROVIDER(state, provider) {
    state.provider = provider;
  },
  SET_WEB3_PROVIDER(state, provider) {
    state.web3Provider = provider;
  },
  SET_SIGNER(state, signer) {
    state.signer = signer;
  },
  SET_SELECTED_WALLET(state, walletObj) {
    window.localStorage.setItem("selectedWallet", walletObj);
    state.selectedWallet = walletObj;
  },
  SET_WALLET_CONNECTED(state, connected) {
    state.walletConnected = connected;
  },
  SET_NETWORK_ID(state, networkId) {
    state.networkId = parseInt(networkId);
  },
};

export default {
  namespaced: true,
  name: "wallet",
  state,
  getters,
  actions,
  mutations,
};
