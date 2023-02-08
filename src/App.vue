<template>
  <div id="app" v-loading="!isRouterAlive">
    <div v-show="tipShow" style="background: #2a513f; height: 60px">
      <div class="tipShow">
        <span
        >This is an Internal test website for business testing purpose only, it is not officially for commercial
launch yet.</span
        >
        <i
            class="el-icon-close"
            @click="tipShow = false"
            style="cursor: pointer"
        ></i>
      </div>
    </div>
    <router-view :key="key" v-if="isRouterAlive"/>
    <el-dialog
        title=""
        :visible.sync="errVisible"
        width="30%"
        :before-close="handleCloseErrVisible"
        :show-close="false"
        fullscreen
    >
      <NetErr @refresh="handleRefresh"/>
    </el-dialog>
    <el-dialog
        title=""
        :visible.sync="isErrorNet"
        width="30%"
        :before-close="handleCloseErrVisible"
        :show-close="false"
        fullscreen
    >
      <ChainErr @switch="switchNet"/>
    </el-dialog>
  </div>
</template>
<script>
import NetErr from "@/components/NetErr";
import ChainErr from "@/components/ChainErr";
import {EventBus} from "@/utils/event-bus";
import API from "@/service/index";
import Web3 from "web3";
import {config, supportChainId} from "@/const/const";
import {addPolyMainNetwork, switchNetwork} from "@/utils/switch-network";

import {getObjectConfig} from "@/wallet_nc/common/ObjectConfig";
import {isUK} from "@/utils/rules";

export default {
  name: "App",

  components: {
    NetErr,
    ChainErr,
  },
  provide() {
    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload,
    };
  },
  metaInfo: {
    title: "Artlinx-Global Digital Art Marketplace",
    meta: [
      {
        vmid: "description",
        name: "description",
        content:
            "Artlinx-Global Digital Art Marketplace,Digital Art Value Enhancer",
      },

      {
        // set meta
        vmid: "keywords",
        name: "keywords",
        content:
            "Digital art,Free Minting NFT for recognized artist,Serious Digital Art,Digital Artist",
      },
    ],
  },

  data() {
    return {
      isRouterAlive: true, //控制视图是否显示的变量
      errVisible: false,
      tipShow: true,
      isErrorNet: false,
      isConnect: false,
      timeTask: null,
    };
  },
  watch: {
    "$store.state.wallet.walletConnected": {
      handler(newName, oldName) {
        // console.log("newName:", newName);
        // console.log("oldName:", oldName);
        if (newName == true) {
          this.isConnect = true;
          this.isErrorNet = this.isErrorNet && true;
        } else {
          this.isConnect = false;
          this.isErrorNet = false;
        }
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，如果设置了false，那么效果和上边例子一样
      immediate: true,
    },
    "$store.state.wallet.walletAddress": {
      handler(newName, oldName) {
        // console.log("newName:", newName);
        // console.log("oldName:", oldName);
        if (
            newName != "" &&
            newName != undefined &&
            newName != "undefined" &&
            newName.length == 42
        ) {
          window.localStorage.setItem("walletAddress", newName);
          this.login(newName);
        } else {
          window.localStorage.setItem("walletAddress", "");
          window.localStorage.setItem("walletitem", "");
          window.localStorage.setItem("loginId", "");
          let href = window.location.href;
          if (!href.endsWith("/")) {
            this.$router.replace({
              path: "/",
            });
          }
        }
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，如果设置了false，那么效果和上边例子一样
      immediate: true,
    },
    "$store.state.wallet.networkId": {
      handler(newName, oldName) {

        // console.log("newName networkId:", newName);
        // console.log("oldName networkId:", oldName);
        if (newName != "" && newName != undefined) {
          if (newName > 0) {
            window.localStorage.setItem("currNetwork", getObjectConfig().CHAINID_MAP[newName.toString()]);
            if (supportChainId.includes(newName.toString())) {
              this.isErrorNet = this.isConnect && false;
            } else {
              this.isErrorNet = this.isConnect && true;
            }
          }
        }
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，如果设置了false，那么效果和上边例子一样
      immediate: true,
    },

    // "window.localStorage.getItem('walletconnect')": {
    //   handler(newName, oldName) {
    //     console.log("newName walletconnect:", newName);
    //     console.log("oldName walletconnect:", oldName);
    //   },
    //   // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，如果设置了false，那么效果和上边例子一样
    //   immediate: true,
    // },
  },
  computed: {
    key() {
      return this.$route.path + Math.random();
    },
  },
  async beforeCreate() {
  },
  beforeMount() {
  },
  async mounted() {

    !isUK() ? this.tipShow = false : "";

    this.getCurrentUser();
    // console.log("---beforeCreate---");
    // await this.$store.dispatch("wallet/connectWallet", true);
    EventBus.$on("onNetErr", () => {
      this.errVisible = true;
    });
    let networkFee = await fetch(
        "https://gasstation-mainnet.matic.network/"
    ).then((res) => {
      return res.json();
    });
    window.localStorage.setItem("networkFee", networkFee.fastest);
  },
  beforeDestroy() {
    EventBus.$off("onNetErr");
  },
  methods: {
    async switchNet() {
      var web3 = this.$store.state.wallet.web3Provider;
      var chainId = Web3.utils.toHex(config.chainId);
      console.log("web3:", web3);
      if (isUK()) {
        await addPolyMainNetwork(web3);
      } else {
        await switchNetwork(web3, 1);
      }
      history.go(0);
    },
    login(address) {
      //   this.accountValidateVisible = true;
      API.loginByWalletAddress({
        address: address,
      }).then((result) => {
        if (result.code == 200) {
          // 在这将事件传递出去
          window.localStorage.setItem(
              "walletitem",
              JSON.stringify(result.data)
          );
          window.localStorage.setItem("loginId", result.data.loginId);
          let chainId = this.$store.state.wallet.networkId;
          // console.log("newName networkId:", newName);
          // console.log("oldName networkId:", oldName);

          if (chainId != "" && chainId != undefined) {
            if (chainId > 0) {
              window.localStorage.setItem("currNetwork", getObjectConfig().CHAINID_MAP[chainId.toString()]);
              if (supportChainId.includes(chainId.toString())) {
                this.isErrorNet = false;
              } else {
                this.isErrorNet = true;
                return;
              }
            }
          }

          this.common.notification(this, "connect successfully.", 1);
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
    reload() {
      this.isRouterAlive = false; //先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true; //再打开
      });
    },
    handleCloseErrVisible() {
      this.errVisible = false;
    },
    handleRefresh() {
      this.reload();
      this.handleCloseErrVisible();
    },
  },
};
</script>
