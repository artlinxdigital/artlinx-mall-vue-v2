<template>
  <div class="loginContainer">
    <!--		<img class="mPage" src="../assets/images/bg@1x.png" />-->
    <div class="loginContent fWhite" style="margin-bottom: 40px">
      <div class="pcPage fl">
        <div class="pcLogo"></div>
        <div class="text-login">
          <p>
            You are one step away to join the global serious art community,
            Artlinx, create your digital art assets for free, and enjoy the
            pleasure to buy and sell real art pieces online.
          </p>
          <br />
          <p>
            We only accept serious artists and collectors to develop the global
            digital art world. The cutting-edge technology makes it possible for
            your art works alive in the digital world with uniqueness and low
            costs.
          </p>
          <br />
          <p>
            All artists, institutions or individual collectors are most welcome
            to join our community, from time to time we will have offline event
            Artlinx Seminar and meet-up for our community.
          </p>
          <br />
        </div>
        <!-- <img
          src="../assets/images/Illustration.jpg"
          style="width: 100%; height: auto; margin-bottom: 30px"
        /> -->
      </div>
      <div class="loginPannel fr">
        <div class="mLogo"></div>
        <h3 class="mPage">Global Digital Art Marketplace</h3>
        <el-tabs>
          <el-descriptions title="Connect Wallet" :column="1" :border="true">
            <el-descriptions-item>
              <template slot="label">
                <img src="@/assets/images/metamask.svg" class="walletImg" />
                MetaMask
              </template>

              <div
                v-if="
                  $store.state.wallet.walletConnected == true &&
                  $store.state.wallet.selectedWallet == 'metamask'
                "
              >
                <el-button
                  size="medium"
                  type="primary"
                  effect="dark"
                  @click="connectWallet('metamask')"
                >
                  <!-- Connected -->
                  Connect
                </el-button>
              </div>
              <div v-else>
                <el-button
                  size="medium"
                  type="primary"
                  effect="dark"
                  @click="connectWallet('metamask')"
                  >Connect</el-button
                >
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <img
                  src="@/assets/images/walletconnect.svg"
                  class="walletImg1"
                />
                WalletConnect
              </template>

              <div
                v-if="
                  $store.state.wallet.walletConnected == true &&
                  $store.state.wallet.selectedWallet == 'walletconnect'
                "
              >
                <el-button
                  size="medium"
                  type="primary"
                  effect="dark"
                  @click="connectWallet('walletconnect')"
                >
                  <!-- Connected -->
                  Connect
                </el-button>
                <el-button
                  size="medium"
                  type="primary"
                  effect="dark"
                  @click="killSession"
                  v-show="false"
                  >DisConnect</el-button
                >
              </div>
              <div v-else>
                <el-button
                  size="medium"
                  type="primary"
                  effect="dark"
                  @click="connectWallet('walletconnect')"
                  >Connect</el-button
                >
              </div>

              <!-- $store.state.walletConnector.connected -->
            </el-descriptions-item>
          </el-descriptions>
          <LoginBtnRow @login="login" v-show="false"></LoginBtnRow>
        </el-tabs>
      </div>
      <div class="clear"></div>
    </div>
    <AccountValidate
      v-if="accountValidateVisible"
      @close="accountValidateVisible = false"
    />
    <ServiceProtocol :visible.sync="protocalVisible" />
    <pcFooter />
    <mFooter />
  </div>
</template>

<script>
import pcFooter from "@/pcviews/HomeFooter";
import mFooter from "@/views/HomeFooter";
import LoginBtnRow from "@/components/LoginBtnRow";
import AccountValidate from "@/components/AccountValidate";
import ServiceProtocol from "@/components/ServiceProtocol";
import API from "@/service/index";
import { checkPhoneNumber, checkEmail } from "@/utils/rules";
import { isMetaMaskInstalled, initialize } from "@/wallet/metamask";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { mapActions } from "vuex";
import { ethers } from "ethers";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { config } from "@/const/const";
import { re } from "mathjs";
const sm3 = require("sm-crypto").sm3;
const EtheremUtil = require("ethereumjs-util");
const INITIAL_STATE = {
  connector: null,
  connected: false,
  chainId: 1,
  showModal: false,
  pendingRequest: false,
  uri: "",
  accounts: [],
  address: "",
  result: null,
};
export default {
  components: {
    pcFooter,
    mFooter,
    LoginBtnRow,
    AccountValidate,
    ServiceProtocol,
  },
  data() {
    // 校验账号
    return {
      privateKeys: "",
      privateRuleForm: {
        privateKey: "",
      },
      accountValidateVisible: false,
      protocalVisible: false,
      metamask: {
        connectButton: {
          disabled: true,
          innerText: "",
        },
        getAccountsButton: {},
        getAccountsResults: {},
        requestPermissionsButton: {},
        getPermissionsButton: {},
        permissionsResult: {
          innerHTML: "",
        },
        accountsDiv: {
          innerHTML: "",
        },
        chainIdDiv: {
          innerHTML: "",
        },
        networkDiv: {
          innerHTML: "",
        },
      },
      canToMain: false,
    };
  },
  inject: ["reload"], //注入App里的reload方法
  async mounted() {
    // this.killSession();
    // this.reload();
    this.getCurrentUser();
    // walletAddress
    let walletAddress = window.localStorage.getItem("walletAddress");
    if (walletAddress == undefined) {
      await this.killSession();
      this.reload();
    }
  },
  async beforeCreate() {},
  watch: {
    // "$store.state.wallet.walletConnected": {
    //   handler(newName, oldName) {
    //     console.log("newName:", newName);
    //     console.log("oldName:", oldName);
    //     // Connected 登录
    //     if (newName == true) {
    //       // 可以直接到首页
    //       this.canToMain = true;
    //     }
    //   },
    //   // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，如果设置了false，那么效果和上边例子一样
    //   immediate: true,
    // },
    // "$store.state.walletConnected": {
    //   handler(newName, oldName) {
    //     console.log("newName:", newName);
    //     console.log("oldName:", oldName);
    //     // Connected 登录
    //     if (newName == "Connected") {
    //       // 可以直接到首页
    //       // wallet.js
    //       // this.$store.state.walletConnected = true;
    //       // this.$store.state.networkId = this.metamask.networkDiv.innerHTML;
    //       // this.SET_NETWORK_ID(this.metamask.networkDiv.innerHTML);
    //       // this.$store.state.wallet.selectedWallet = "metamask";
    //       // 可以直接到首页
    //       this.canToMain = true;
    //     }
    //   },
    //   // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，如果设置了false，那么效果和上边例子一样
    //   immediate: false,
    // },
  },
  methods: {
    ...mapActions("wallet", [
      "SET_WALLET_ADDRESS",
      "SET_WALLET_ADDRESS",
      "SET_PROVIDER",
      "SET_WEB3_PROVIDER",
      "SET_SIGNER",
      "SET_WALLET_CONNECTED",
      "SET_SELECTED_WALLET",
      "SET_NETWORK_ID",
      "cMetamask",
      "cWalletConnect",
    ]),
    connectWallet(walletName) {
      switch (walletName) {
        case "metamask":
          this.cMetamask(this);
          break;
        case "walletconnect":
          this.cWalletConnect(this);
          break;

        default:
          break;
      }
    },

    // 获取钱包地址
    async Init(callback) {
      const connector = this.$store.state.wallet.web3Provider;
      if (connector != undefined) {
        var web3 = new Web3(connector);
        const accounts = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();
        callback([{ chainId: chainId, accounts: accounts }]);
      }
    },
    async onDisconnect() {
      this.resetApp();
    },

    async onConnect(payload) {
      QRCodeModal.close();
      const { chainId, accounts } = payload[0];

      const address = accounts[0];
      this.SET_WALLET_CONNECTED(true);
      this.SET_NETWORK_ID(chainId);
      this.SET_SIGNER(accounts);
      this.SET_WALLET_ADDRESS(address);
      this.SET_SELECTED_WALLET("walletconnect");
      // 可以直接到首页
      // let timeTask = window.setInterval(() => {
      console.log(address);
      if (
        address != null &&
        address != undefined &&
        address != "undefined" &&
        address.length == 42
      ) {
        window.localStorage.setItem("walletAddress", address);
        this.handleLogin();
        // timeTask.clearInterval();
      }
      // }, 200);
    },

    async killSession() {
      const connector = this.$store.state.wallet.web3Provider;
      if (connector) {
        await connector.close();
      }
      this.resetApp();
    },
    resetApp() {
      this.SET_WALLET_CONNECTED(false);
      this.SET_NETWORK_ID(config.chainId);
      this.SET_SIGNER([]);
      this.SET_WALLET_ADDRESS("");
      window.localStorage.setItem("walletAddress", "");
      window.localStorage.setItem("walletitem", "");
      window.localStorage.setItem("loginId", "");
    },

    // async cMetamask() {
    //   // console.log("metamask:", this.metamask);
    //   this.metamask.connectButton.onclick(this);
    //   // Connected 登录
    //   if (this.metamask.connectButton.innerText == "Connected") {
    //     // 可以直接到首页
    //     // wallet.js
    //     // this.$store.state.walletConnected = true;
    //     this.SET_WALLET_CONNECTED(true);
    //     // window.localStorage.getItem("walletAddress") = this.metamask.accountsDiv.innerHTML[0];
    //     this.SET_WALLET_ADDRESS(this.metamask.accountsDiv.innerHTML[0]);
    //     // this.$store.state.formattedWalletAddress = this.metamask.accountsDiv.innerHTML[0];
    //     // this.$store.state.networkId = this.metamask.networkDiv.innerHTML;
    //     this.SET_NETWORK_ID(this.metamask.networkDiv.innerHTML);
    //     this.$store.state.wallet.selectedWallet = "metamask";
    //     const { ethereum } = window;
    //     const web3Provider = ethereum;
    //     const provider = new ethers.providers.Web3Provider(web3Provider);
    //     const signer = provider.getSigner();

    //     // notify.config({ networkId })
    //     this.SET_WEB3_PROVIDER(web3Provider);
    //     this.SET_PROVIDER(provider);
    //     this.SET_SIGNER(signer);
    //     console.log("this.$store.state", this.$store.state);
    //     // this.handleLogin();
    //   }
    // },

    // 处理登录前的逻辑
    handleLogin() {
      // this.accountValidateVisible = true;
      this.login();
    },
    login() {
      //   this.accountValidateVisible = true;
      API.loginByWalletAddress({
        address: window.localStorage.getItem("walletAddress"),
      }).then((result) => {
        if (result.code == 200) {
          // 在这将事件传递出去
          window.localStorage.setItem(
            "walletitem",
            JSON.stringify(result.data)
          );
          window.localStorage.setItem("loginId", result.data.loginId);
          this.common.notification(this, "login successfully.", 1);
          this.$router.push({
            path: "/",
          });
        } else {
          this.common.notification(
            this,
            "Identity information does not match！",
            3
          );
          return;
        }
      });
    },
    // sm4解密
    forSM4Decrypt(privateKeys) {
      const pwdOri = this.ruleForm.pwd;
      const pwd = sm3(pwdOri);
      let privateKey = "";
      try {
        privateKey = this.sm4decrypt(privateKeys, pwd);
      } catch (e) {
        console.log(e);
      }
      if (privateKey) {
        this.common.notification(this, "login successfully.", 1);
        return privateKey;
      }
    },
    // sm4解密
    sm4decrypt(word, pwd) {
      const decrypt = this.$sm4.decrypt_ecb(word, pwd);
      return decrypt;
    },
  },
};
</script>

<style lang="less" scoped>
.text-login {
  margin-top: 20px;
}
.loginContainer {
  position: relative;
  max-width: 100vw;
  min-height: 100vh;
  //overflow: hidden;
  //background: url("../assets/images/bg@2x.png") no-repeat;
  background: #ffffff;
  background-size: cover;
  .walletImg {
    vertical-align: middle;
    height: 0.3rem;
    // width: 0.5rem;
  }
  .walletImg1 {
    vertical-align: middle;
    height: 0.3rem;
    // width: 0.5rem;
  }
  @media (min-width: 801px) and (max-width: 1168px) {
    width: 1168px;
    overflow: scroll;
  }
  @media screen and (max-width: 800px) {
    background: none;
    height: auto;
    /deep/ img.mPage {
      z-index: -1;
      position: relative;
      display: block;
      width: 100%;
    }
    /deep/ .pcHeader {
      display: none;
    }
    /deep/.el-input__suffix {
      line-height: 0.4rem;
    }
  }
  /deep/ .loginContent {
    width: 1186px;
    margin: 50px auto 0;
    @media screen and (max-width: 800px) {
      width: 100%;
      margin: 0;
    }
    .pcPage {
      width: 540px;
      .pcLogo {
        // width: 120px;
        height: 100px;
        background: url(../assets/images/logo_vertical.png) no-repeat;
        background-size: auto 100px;
      }
      h3 {
        text-align: left;
        font-size: 32px;
        margin: 54px 0 30px;
      }
      p {
        font-size: 16px;
        color: #2a513f;
      }
      img {
        //margin-top: -30px;
      }
    }
  }
  /deep/ .el-tabs {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.07) 0%,
      rgba(255, 255, 255, 0.1) 100%
    );
    border-radius: 16px;
    border: 1px solid #444;
    padding: 40px 5%;
    @media screen and (max-width: 800px) {
      margin-top: 0.45rem;
      padding: 0.4rem 5%;
    }
  }
  /deep/ .el-tabs__item {
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    color: #505050;
    &.is-active {
      color: #000000;
    }
    @media screen and (max-width: 800px) {
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0.18rem;
    }
  }
  /deep/ .el-tabs__nav-wrap {
    width: 200px;
    margin: 0 auto;
    @media screen and (max-width: 800px) {
      width: 2.2rem;
    }
  }
  /deep/ .el-tabs__nav-wrap::after {
    background: transparent;
  }
  /deep/ .el-tabs__header {
    margin-bottom: 0.35rem;
  }
  /deep/ .el-tabs__active-bar {
    height: 0.04rem;
  }
  /*/deep/ .el-input__prefix {
			line-height: 0.63rem;
			left: 0.17rem;
			@media screen and (max-width: 800px) {
				line-height: 0.79rem;
				left: 0.25rem;
			}
		}*/
}

.loginPannel {
  width: 540px;
  margin-top: 116px;
  @media screen and (max-width: 800px) {
    width: 90%;
    margin-right: 5%;
    //position: absolute;
    //width: 90%;
    //top:0.5rem;
    //left: 0;
    //right: 0;
    //margin: auto;
  }
  /deep/ .el-input__inner {
    color: #000000;
    height: 40px;
    line-height: 40px;
    background: #ffffff;
    border: 1px solid #000000;
    border-radius: 8px;
    font-size: 14px;
    @media screen and (max-width: 800px) {
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0.14rem;
    }
  }
  /deep/ .el-form-item {
    margin-bottom: 0.15rem;
  }
}

.mLogo {
  display: none;
  @media screen and (max-width: 800px) {
    display: block;
    width: 2.2rem;
    height: 0.5rem;
    margin: 0 auto 0.4rem;
    background: url("../assets/images/logo_vertical.png") no-repeat center;
    background-size: 2.2rem auto;
  }
}

h3 {
  font-size: 0.24rem;
  text-align: center;
  font-weight: 400;
}

.login-tip {
  margin-top: 15px;
  text-align: center;
  font-size: 12px;
  color: #2a513f;
  @media screen and (max-width: 800px) {
    margin-top: 0.15rem;
    font-size: 0.12rem;
    text-align: center;
  }
  .link {
    font-size: 12px;
    line-height: 40px;
    color: #000000;
    cursor: pointer;
    @media screen and (max-width: 800px) {
      font-size: 0.12rem;
    }
  }
}

///deep/.footer{background:none ;}
</style>
