import { encrypt } from "eth-sig-util";
import MetaMaskOnboarding from "@metamask/onboarding";
import { ethers } from "ethers";
import { API } from "@/service/index";
const currentUrl = new URL(window.location.href);
const forwarderOrigin =
  currentUrl.hostname === "localhost" ? "http://localhost:9010" : undefined;

const isMetaMaskInstalled = () => {
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
};

const initialize = async (state) => {
  let onboarding;
  try {
    onboarding = new MetaMaskOnboarding({ forwarderOrigin });
  } catch (error) {
    console.error(error);
  }

  let accounts;
  let accountButtonsInitialized = false;

  const isMetaMaskConnected = () => accounts && accounts.length > 0;

  const onClickInstall = (state) => {
    state.innerText = "Onboarding in progress";
    state.disabled = true;
    onboarding.startOnboarding();
  };

  const onClickConnect = async (state) => {
    try {
      const newAccounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      handleNewAccounts(newAccounts);
    } catch (error) {
      console.error(error);
    }
  };

  const updateButtons = (state) => {
    if (!isMetaMaskInstalled()) {
      state.innerText = "Click here to install MetaMask!";
      state.onclick = onClickInstall;
      state.walletConnected = false;
      state.disabled = false;
    } else if (isMetaMaskConnected()) {
      state.innerText = "Connected";
      state.walletConnected = true;
      state.selectedWallet = "metamask";

      const { ethereum } = window;
      const web3Provider = ethereum;
      const provider = new ethers.providers.Web3Provider(web3Provider);
      const signer = provider.getSigner();

      // notify.config({ networkId })
      // this.SET_WEB3_PROVIDER(web3Provider);
      state.web3Provider = web3Provider;
      // this.SET_PROVIDER(provider);
      state.provider = provider;
      // this.SET_SIGNER(signer);
      state.signer = signer;

      // console.log("this.$store.state", this.$store.state);

      state.disabled = true;
      if (onboarding) {
        onboarding.stopOnboarding();
      }
    } else {
      state.innerText = "Connect";
      state.walletConnected = false;
      state.onclick = onClickConnect;
      state.disabled = false;
    }
  };

  const initializeAccountButtons = () => {
    if (accountButtonsInitialized) {
      return;
    }
    accountButtonsInitialized = true;

    /**
     * Permissions
     */

    // context.metamask.requestPermissionsButton.onclick = async () => {
    //   try {
    //     const permissionsArray = await ethereum.request({
    //       method: "wallet_requestPermissions",
    //       params: [{ eth_accounts: {} }],
    //     });
    //     permissionsResult.innerHTML = getPermissionsDisplayString(
    //       permissionsArray
    //     );
    //   } catch (err) {
    //     console.error(err);
    //     permissionsResult.innerHTML = `Error: ${err.message}`;
    //   }
    // };

    // context.metamask.getPermissionsButton.onclick = async () => {
    //   try {
    //     const permissionsArray = await ethereum.request({
    //       method: "wallet_getPermissions",
    //     });
    //     permissionsResult.innerHTML = getPermissionsDisplayString(
    //       permissionsArray
    //     );
    //   } catch (err) {
    //     console.error(err);
    //     permissionsResult.innerHTML = `Error: ${err.message}`;
    //   }
    // };

    // context.metamask.getAccountsButton.onclick = async () => {
    //   try {
    //     const _accounts = await ethereum.request({
    //       method: "eth_accounts",
    //     });
    //     getAccountsResults.innerHTML =
    //       _accounts[0] || "Not able to get accounts";
    //   } catch (err) {
    //     console.error(err);
    //     getAccountsResults.innerHTML = `Error: ${err.message}`;
    //   }
    // };
  };
  const formatETHWalletAddress = (address) => {
    if (!address) return "";

    return (
      address.substring(0, 6) +
      "..." +
      address.substring(address.length - 4, address.length)
    );
  };

  function handleNewAccounts(newAccounts) {
    accounts = newAccounts;

    state.walletAddress = accounts[0];
    if (accounts[0]) {
      state.formattedWalletAddress = formatETHWalletAddress(accounts[0]);
    } else {
      state.formattedWalletAddress = accounts[0];
    }
    if (isMetaMaskConnected()) {
      initializeAccountButtons();
    }
 
    updateButtons(state);
  }

  function handleNewChain(chainId) {
    state.networkId = chainId;
  }

  function handleNewNetwork(networkId) {
    state.networkId = networkId;
  }

  async function getNetworkAndChainId() {
    try {
      const chainId = await ethereum.request({
        method: "eth_chainId",
      });
      handleNewChain(chainId);

      const networkId = await ethereum.request({
        method: "net_version",
      });
      handleNewNetwork(networkId);
    } catch (err) {
      console.error(err);
    }
  }

  updateButtons(state);

  if (isMetaMaskInstalled()) {
    ethereum.autoRefreshOnNetworkChange = false;
    getNetworkAndChainId();

    ethereum.on("chainChanged", handleNewChain);
    ethereum.on("networkChanged", handleNewNetwork);
    ethereum.on("accountsChanged", handleNewAccounts);

    try {
      const newAccounts = await ethereum.request({
        method: "eth_accounts",
      });
      handleNewAccounts(newAccounts);
    } catch (err) {
      console.error("Error on init when getting accounts", err);
    }
  }
};

window.addEventListener("DOMContentLoaded", initialize);

function getPermissionsDisplayString(permissionsArray) {
  if (permissionsArray.length === 0) {
    return "No permissions found.";
  }
  const permissionNames = permissionsArray.map((perm) => perm.parentCapability);
  return permissionNames
    .reduce((acc, name) => `${acc}${name}, `, "")
    .replace(/, $/u, "");
}

export { isMetaMaskInstalled, initialize };
