<template>
  <div
    class="castingContainer"
    v-loading.fullscreen.lock="loading"
    :element-loading-text="loadingText"
  >
    <PcPageHeader @search="searchList" />
    <div class="contentContainer">
      <div class="pcPageTitle">CASE NFT</div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="auto"
        label-position="top"
        class="ruleForm"
      >
        <el-form-item label="Choose collection" prop="fold">
          <!-- <i
            class="el-icon-arrow-down iconFold"
            :class="{ rotateIcon: !isFold }"
            @click="handleFoldArrow"
          ></i> -->
          <div class="folders" :class="{ open: !isFold }">
            <!-- <div class="iconAddFolder" @click="createFolderVisible = true">
              <i class="el-icon-circle-plus"></i>
              <span>创建</span>
            </div> -->
            <div
              class="chooseFold"
              :class="{ select: item.id === slectFold }"
              v-for="item in folds"
              :key="item.id"
              @click="slectFold = item.id"
            >
              <el-image
                class="fillImg"
                :src="imgSrc"
                v-if="imgSrc"
                fit="cover"
              ></el-image>
              <i class="iconCheck" v-if="item.id === slectFold"></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="Upload file" prop="thumbSubTokenFile">
          <el-upload
            action="#"
            accept="image/*"
            list-type="picture-card"
            :file-list="thumbFileList"
            :limit="1"
            :on-change="handleChangeThumb"
            :auto-upload="false"
            class="specialUpload"
            :class="{ hideUpload: thumbFileList.length >= 1 }"
          >
            <i slot="default" class="icImg"></i>
            <p class="uploadTip">
              File types supported: JPG, PNG, GIF, SVG. Max size: 5 MB
            </p>

            <div slot="file" slot-scope="{ file }">
              <div
                class="playIconBox"
                v-if="
                  file.raw.type === 'video/mp4' || file.raw.type === 'audio/ogg'
                "
              ></div>
              <img
                v-if="file.raw.type !== 'video/mp4'"
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-delete"
                  @click="handleRemoveThumb(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
              <i
                class="el-icon-error iconRemove"
                @click="handleRemoveThumb(file)"
              ></i>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="Upload HD file" prop="SubTokenFile">
          <el-upload
            action="#"
            accept="image/*"
            list-type="picture-card"
            :file-list="fileList"
            :limit="1"
            :on-change="handleChangeEvi"
            :auto-upload="false"
            class="specialUpload"
            :class="{ hideUpload: fileList.length >= 1 }"
          >
            <i slot="default" class="icImg"></i>
            <p class="uploadTip">
              File types supported: JPG, PNG, GIF, SVG. Max size: 150 MB
            </p>

            <div slot="file" slot-scope="{ file }">
              <div
                class="playIconBox"
                v-if="
                  file.raw.type === 'video/mp4' || file.raw.type === 'audio/ogg'
                "
              ></div>
              <img
                v-if="file.raw.type !== 'video/mp4'"
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
              <i
                class="el-icon-error iconRemove"
                @click="handleRemove(file)"
              ></i>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="Label" prop="tag">
          <!-- <el-input
            v-model.trim="ruleForm.tag"
            placeholder="Select Category Label（单选）"
            @click.native="drawer = true"
            readonly
        >
          <i slot="suffix" class="el-input__icon el-icon-arrow-right"></i>
        </el-input> -->
          <div class="tagsBox">
            <span
              class="tagItem"
              :class="{ activeTagitem: item.id === selectTagId }"
              v-for="item in tags"
              :key="item.id"
              @click="handleSelectTag(item)"
              >{{ item.name }}</span
            >
          </div>
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input
            v-model.trim="ruleForm.name"
            placeholder="Please enter a name"
          ></el-input>
        </el-form-item>
        <el-form-item label="Price" prop="price">
          <!-- <el-input
            v-model.trim="ruleForm.price"
            placeholder="Please enter the price"
            onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
            onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
          >
            <el-dropdown slot="suffix" class="el-input__icon">
              <span class="el-dropdown-link">
                RMB<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>RMB</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-input> -->
          <NumberInput
            v-model.trim="ruleForm.price"
            :placeholder="pricePlaceholder"
          />
          <p class="tipTxt">
            *The platform will charge {{ serviceRate }}% service fee
          </p>
        </el-form-item>
        <el-form-item label="Artist" prop="author">
          <el-input
            v-model.trim="ruleForm.author"
            placeholder="Please enter artist"
            @blur="matchAuthor"
          ></el-input>
        </el-form-item>
        <el-form-item label="about the author" prop="authorDesc">
          <el-input
            type="textarea"
            :rows="4"
            v-model.trim="ruleForm.authorDesc"
            placeholder="Please enter author introduction"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="版税分成比例" prop="percent">
          <el-input
            v-model.trim="ruleForm.percent"
            placeholder="Please enter royalty sharing ratio"
            onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
            onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
          >
            <i slot="suffix" class="el-input__icon">%</i>
          </el-input>
          <p class="tipTxt">
            *在二次售卖及其后续售卖过程中，NFT铸造者的分成比例，
            建议最大不超过10%
          </p>
        </el-form-item> -->
        <el-form-item label="Introduction" prop="desc">
          <el-input
            type="textarea"
            :rows="4"
            v-model.trim="ruleForm.desc"
            placeholder="Please enter a brief introduction"
          ></el-input>
        </el-form-item>
        <div class="fixBtn">
          <el-button type="primary" class="btnCompelete" @click="handleCasting"
            >confirm</el-button
          >
          <el-button class="btnCancel" @click="$router.go(-1)"
            >cancel</el-button
          >
        </div>
      </el-form>
    </div>

    <el-drawer
      title="Please enter the description category label"
      :visible.sync="drawer"
      :direction="clientWidth < 800 ? 'btt' : 'rtl'"
      :before-close="handleCloseDrawer"
      custom-class="tagDrawer"
      size="50%"
    >
      <div class="tagsBox">
        <span
          class="tagItem"
          :class="{ activeTagitem: item.id === selectTagId }"
          v-for="item in tags"
          :key="item.id"
          @click="selectTagId = item.id"
          >{{ item.name }}</span
        >
      </div>
      <div class="btnRow">
        <el-button type="primary" class="btnConfirm" @click="confirmSelectTag"
          >confirm</el-button
        >
      </div>
    </el-drawer>
    <TipModal
      :visible.sync="tipVisible"
      title="Tips"
      :content="content"
      cancelTxt="cancel"
      :confirmTxt="confirmTxt"
      @close="tipVisible = false"
      @ok="toCharge"
    />

    <CreateFolder
      :visible.sync="createFolderVisible"
      @onCreateSuccess="handleCreateSuccess"
    />
  </div>
</template>

<script>
import PcPageHeader from "@/components/PcPageHeader";
import TipModal from "@/components/TipModal";
import CreateFolder from "@/components/Casting/CreateFolder";
import abiSing from "@/contract/abiSing.json";
import ipfsAPI from "ipfs-api";
import API from "@/service/index";
import { matchFileSuffixType } from "@/utils/rules";
import NumberInput from "@/components/Magic/NumberInput";
let ethUtil = require("ethereumjs-util");
const node = ipfsAPI({
  host: "artlinx.hk",
  port: "/ipfs",
  protocol: "https",
});
const EtheremTx = require("ethereumjs-tx");
let Web3 = require("web3");
//测试数据
let web3 = new Web3(new Web3.providers.HttpProvider(API.getNetWorkUrl()));
let assetType = new Map();
assetType.set("ETH", 0);
assetType.set("ERC20", 1);
assetType.set("ERC1155", 2);
assetType.set("ERC721", 3);
assetType.set("ERC721Deprecated", 4);

export default {
  components: {
    TipModal,
    PcPageHeader,
    CreateFolder,
    NumberInput,
  },
  inject: ["reload"], //注入App里的reload方法
  data() {
    return {
      imgSrc: require("@/assets/images/logo_vertical.png"),
      createFolderVisible: false,
      ruleForm: {
        SubTokenFile: null,
        SubTokenFileBuffer: null,
        thumbSubTokenFile: null,
        thumbSubTokenFileBuffer: null,
        name: "",
        desc: "",
        author: "",
        authorDesc: "",
        tag: "",
        price: "",
        percent: "",
        fold: "",
      },
      rules: {
        SubTokenFile: [
          {
            required: true,
            message: "Please upload the collection source file",
            trigger: "blur",
          },
        ],
        thumbSubTokenFile: [
          {
            required: true,
            message: "Please upload the collection cover image",
            trigger: "blur",
          },
        ],
        name: [
          { required: true, message: "Please enter a name", trigger: "blur" },
        ],
        price: [
          { required: true, message: "Please enter price", trigger: "blur" },
        ],
        percent: [
          {
            required: true,
            message: "Please enter royalty sharing ratio",
            trigger: "blur",
          },
        ],
        desc: [
          {
            required: true,
            message: "Please enter a brief introduction",
            trigger: "blur",
          },
        ],
        tag: [
          {
            required: true,
            message: "Please select the category label",
            trigger: "blur",
          },
        ],
        author: [
          { required: true, message: "Please enter author", trigger: "blur" },
        ],
        authorDesc: [
          {
            required: true,
            message: "Please enter author introduction",
            trigger: "blur",
          },
        ],
      },
      folds: [],
      slectFold: -1,
      drawer: false,
      tags: [],
      selectTagId: "",
      tipVisible: false,
      fileList: [],
      thumbFileList: [],
      NftTokenAddress: {},
      loading: false,
      loadingText: "loading",
      tokenId: 0,
      order: {},
      ipfsAddress: "",
      thumbIpfsAddress: "",
      serviceRate: 2,
      isFold: true,
      fileName: "",
      fileSuffix: "",
      coverImage: "",
      productType: 1,
      content: "",
      confirmTxt: "",
      fee: "0",
      clientWidth: 750,
      isToCharge: false,
      isRemindFee: false,
      totalFee: 0,
      tradeHash: "",
      pricePlaceholder: "Please enter price",
    };
  },
  computed: {
    paramAddress() {
      const selectFoldObj = this.folds.find(
        (item) => item.id === this.slectFold
      );
      return selectFoldObj ? selectFoldObj.contractAddress : "";
    },
  },
  mounted() {
    this.getCurrentUser();
    this.$nextTick(() => {
      this.clientWidth = document.documentElement.clientWidth;
    });
    API.getContractConfig().then((result) => {
      console.log("msgResult: " + JSON.stringify(result));
      if (result.code !== 200) {
        this.common.notification(this, result.msg, 3);
        return;
      } else {
        this.NftTokenAddress = result.data;
        // 服务费率(动态获取)
        this.serviceRate = (result.data.buyerFee + 250) / 100;
        // 查询藏品分类列表
        this.categoryList();
        // 查询收藏夹列表
        this.getCollectionDirList();
      }
    });
  },
  methods: {
    // 搜索
    searchList(keyword) {
      if (keyword) {
        this.$router.push({
          name: "Home",
          params: {
            keyword: keyword,
          },
        });
      }
    },
    // 匹配数据库author
    matchAuthor() {
      console.log("Match the author");
      if (this.ruleForm.author) {
        API.getCollectAuthorInfo({ authorName: this.ruleForm.author }).then(
          (result) => {
            if (result.code == 200 && result.data != null) {
              this.ruleForm.authorDesc = result.data.authorDesc;
            }
          }
        );
      }
    },
    handleCreateSuccess() {
      this.getCollectionDirList();
    },
    // Go to prepaid phone
    toCharge() {
      if (this.isToCharge) {
        this.$router.push({
          path: "/funding",
        });
      } else {
        this.tipVisible = false;
        this.handleCasting();
      }
    },
    handleFoldArrow() {
      this.isFold = !this.isFold;
    },
    // 查询藏品分类列表
    categoryList() {
      API.categoryList().then((result) => {
        // console.log("分类列表：" + JSON.stringify(result));
        if (result.code == 200) {
          if (result.data !== null) {
            this.tags = [];
            for (let i = 1; i < result.data.length; i++) {
              this.tags.push({
                id: result.data[i].productCategoryId,
                name: result.data[i].categoryName,
              });
            }
          }
        }
      });
    },
    // 查询用户收藏夹列表
    getCollectionDirList() {
      API.getCollectionDirList({
        certificationId: window.localStorage.getItem("loginId"),
      }).then((result) => {
        // console.log("收藏夹列表：" + JSON.stringify(result));
        if (result.code !== 200) {
          this.common.notification(this, "Data loading failure!", 3);
          return;
        }
        if (result.data !== null) {
          this.folds = [];
          for (let i = result.data.length - 1; i < result.data.length; i++) {
            this.folds.push({
              id: result.data[i].collectDirId,
              img: this.parseHttp(result.data[i].tokenImage),
              contractAddress: result.data[i].contractAddress,
            });
          }
          this.slectFold = this.folds.length ? this.folds[0].id : -1;
        }
      });
    },
    handleRemove(file) {
      console.log(file);
      this.fileList.splice(0, 1);
    },
    handleRemoveThumb(file) {
      console.log(file);
      this.thumbFileList.splice(0, 1);
    },
    handleCloseDrawer() {
      this.drawer = false;
    },
    handleSelectTag(item) {
      this.selectTagId = item.id;
      const selectObj = this.tags.find((item) => item.id === this.selectTagId);
      this.ruleForm.tag = selectObj ? selectObj.name : "";
    },
    confirmSelectTag() {
      const selectObj = this.tags.find((item) => item.id === this.selectTagId);
      this.ruleForm.tag = selectObj ? selectObj.name : "";
      this.handleCloseDrawer();
    },
    handleCasting() {
      if (
        this.selectTagId == "" ||
        this.selectTagId == null ||
        this.selectTagId == undefined
      ) {
        this.common.notification(this, "Please select the category label", 2);
        return;
      }
      if (this.slectFold == -1) {
        this.common.notification(this, "Please select favorites", 2);
        return;
      }
      if (!this.ruleForm.price || parseFloat(this.ruleForm.price) <= 0) {
        this.common.notification(
          this,
          "Please enter the correct commodity price",
          2
        );
        return;
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const that = this;
          that.loading = true;
          that.loadingText =
            "We are doing our best to mint your artworks, normally it takes around 2-3 minutes, please don't leave the page until the process completed. Thanks for your patience!（請靜候2-3分鐘，請勿離開）";

          let tokenId;
          let v;
          let r;
          let s;
          let _fees = [];
          let tokenURI;

          API.getSignBuTokenId({ address: this.paramAddress }).then(
            (result) => {
              tokenId = result.data.value;
              that.tokenId = tokenId;
              v = result.data.v;
              r = result.data.r;
              s = result.data.s;
              node
                .add(Buffer.from(this.ruleForm.thumbSubTokenFileBuffer))
                .then(async (res) => {
                  const thumbResponse = res[0];
                  console.log(thumbResponse);
                  this.thumbIpfsAddress = thumbResponse.path;

                  node
                    .add(Buffer.from(this.ruleForm.SubTokenFileBuffer))
                    .then(async (ret) => {
                      const response = ret[0];
                      console.log(response);
                      this.ipfsAddress = response.path;

                      // eslint-disable-next-line no-new-object
                      const data = new Object();
                      data.name = this.ruleForm.name;
                      data.description = this.ruleForm.desc;
                      data.image = `${response.hash}`;
                      node
                        .add(Buffer.from(JSON.stringify(data), "utf-8"))
                        .then(async (response) => {
                          const metadata = response[0];
                          console.log(metadata);
                          tokenURI = metadata.hash;
                          // 版权费用    TODO  这里地址需要最后再测试
                          let recipient =
                            window.localStorage.getItem("walletAddress");
                          recipient = web3.utils.toChecksumAddress(recipient);
                          this.ruleForm.percent = 2;
                          if (this.ruleForm.percent > 0) {
                            _fees = [[recipient, this.ruleForm.percent * 100]];
                          }
                          const collection = new web3.eth.Contract(abiSing);
                          let data = collection.methods
                            .mint(tokenId, v, r, s, _fees, tokenURI)
                            .encodeABI();
                          let privateKey = this.getPrivateKey();
                          let walletAddress =
                            window.localStorage.getItem("walletAddress");
                          that.sendSignedTransaction(
                            data,
                            that.paramAddress,
                            walletAddress,
                            privateKey,
                            that.mint_cb,
                            0
                          );
                        });
                    });
                });
            }
          );
        } else {
          return false;
        }
      });
      // this.tipVisible = true;
    },
    async ethGas(contractAddress, data, value, walletAddress, cb, privateKeys) {
      await web3.eth.estimateGas(
        {
          to: contractAddress,
          data: data,
          value: value,
          from: walletAddress,
        },
        (error, gas) => {
          console.log("error\n:" + error);
          console.log("gas:\n" + gas);
          var fee = web3.utils.fromWei(
            (gas * 2381000000000).toString(),
            "ether"
          );
          console.log("service fee：" + fee);
          this.fee = parseFloat(this.fee) + parseFloat(fee);
          if (error != undefined) {
            if (error.toString().indexOf("insufficient funds") != -1) {
              this.loading = false;
              this.content =
                "It costs about chain handling fee " +
                this.fee +
                "RMB Around, the balance is not enough to cast the collection, please go to recharge.";
              this.confirmTxt = "Go to prepaid phone";
              this.isToCharge = true;
              this.tipVisible = true;
              return;
            }
          } else {
            if (parseFloat(fee) > 0.2) {
              if (!this.isRemindFee) {
                this.totalFee = parseFloat(this.fee) + 0.2;
                this.loading = false;
                this.content =
                  "It costs about chain handling fee " +
                  this.totalFee.toFixed(2) +
                  "RMB So, do you want to continue?";
                this.confirmTxt = "go on";
                this.isToCharge = false;
                this.isRemindFee = true;
                this.tipVisible = true;
                return;
              }
            } else {
              gas = 90000;
            }
          }
          web3.eth
            .getTransactionCount(walletAddress, web3.eth.defaultBlock.latest)
            .then((nonce) => {
              console.info("nonce:\n" + nonce);
              let rawTx = {
                // nonce: ct3.utils.toHex(ct3.utils.hexToNumber(("0x" + nonce))),
                nonce: web3.utils.toHex(nonce),
                gasLimit: web3.utils.toHex(gas),
                gasPrice: web3.utils.toHex(2381000000000),
                to: web3.utils.toHex(contractAddress),
                from: walletAddress,
                value: web3.utils.toHex(value),
                data: web3.utils.toHex(data),
                chainId: API.getChainId(),
              };
              // console.log("privateKeys:" + privateKeys);
              let privateKeyBuffer = Buffer.from(privateKeys, "hex");
              let tx = new EtheremTx(rawTx);
              tx.sign(privateKeyBuffer);
              let serializedTx = tx.serialize();
              let serializedTxStr = "0x" + serializedTx.toString("hex");
              web3.eth.sendSignedTransaction(serializedTxStr).then((ret) => {
                cb(ret);
              });
            });
        }
      );
    },
    sendSignedTransaction(data, to, address, privateKeys, cb, value) {
      this.ethGas(to, data, value, address, cb, privateKeys);
      /* from 交易发起人地址 */
    },

    mint_cb(ret) {
      console.info(ret.status);
      console.log("tradHash：" + ret.transactionHash);
      this.tradeHash = ret.transactionHash;
      //Approw  将操作给经办人
      let privateKey = this.getPrivateKey();
      let walletAddress = window.localStorage.getItem("walletAddress");
      this.setApprovalForAll(this.paramAddress, privateKey, walletAddress);
    },
    setApprovalForAll(ctsignTokencontractAddress, privateKey, walletAddress) {
      //上架  true
      const collection = new web3.eth.Contract(abiSing);
      let data = collection.methods
        .setApprovalForAll(this.NftTokenAddress.transferProxy, true)
        .encodeABI();
      this.sendSignedTransaction(
        data,
        ctsignTokencontractAddress,
        walletAddress,
        privateKey,
        this.setApprovalForAll_cb,
        0
      );
    },

    setApprovalForAll_cb(ret) {
      console.log(ret.status);
      //Fix Price 固定price
      let privateKey = this.getPrivateKey();
      let walletAddress = window.localStorage.getItem("walletAddress");
      //这里先请求后端,go back订单的详细信息
      // debugger;
      API.bestOffers({
        param: `${this.paramAddress}:${this.tokenId}:${walletAddress}`,
      }).then((result) => {
        this.order = result.data;
        this.sellSignOrder(privateKey, walletAddress);
      });
    },
    //对应solidity中的encodePacked(num)
    encodePacked(...params) {
      let zeroStr64 =
        "0000000000000000000000000000000000000000000000000000000000000000";
      let resultHash = "0x";
      for (let i = 0; i < params.length; i++) {
        let param16Str = params[i].toString(16);
        if (param16Str.indexOf("0x") == 0) param16Str = param16Str.substr(2);
        param16Str = zeroStr64.substr(0, 64 - param16Str.length) + param16Str; //注释掉，使用紧凑压缩
        resultHash += param16Str;
      }
      return resultHash;
    },

    sellSignOrder(privateKey, walletAddress) {
      let selling = 1;
      let encode16Str = this.encodePacked(
        walletAddress,
        web3.utils.toHex(this.order.saltValue),
        this.order.token,
        parseInt(this.order.tokenId),
        assetType.get(this.order.assettype),
        this.order.buyToken,
        parseInt(this.order.buyTokenId),
        assetType.get(this.order.buyAssetType),
        parseInt(selling), //   ERC721 默认是1个,   小于一个没有测试
        web3.utils.toHex(web3.utils.toWei(this.ruleForm.price)),
        parseInt(this.NftTokenAddress.sellerFee)
      );
      // console.log(stoken)
      let hashStr = web3.utils.sha3(encode16Str);
      hashStr = hashStr.replace("0x", "");
      console.log("hashStr:\n" + hashStr);
      let fullMessage =
        "\x19Ethereum Signed Message:\n" + hashStr.length + hashStr;
      hashStr = web3.utils.sha3(fullMessage);
      console.log("hashStr:\n" + hashStr);
      let privateBuffer = Buffer.from(privateKey, "hex");
      let ecsign = ethUtil.ecsign(
        Buffer.from(Web3.utils.hexToBytes(hashStr)),
        privateBuffer
      );
      console.log("r:\n" + ethUtil.bufferToHex(ecsign.r));
      console.log("s:\n" + ethUtil.bufferToHex(ecsign.s));
      console.log("v:\n" + ecsign.v);
      console.log("paramHash:\n" + hashStr);
      console.log("paramHash:\n" + hashStr);
      //r,s,v,    selling,    //   ERC721 默认是1个,   小于一个没有测试
      // web3.utils.toWei(this.ruleForm.price),
      //     this.NftTokenAddress.sellerFee);
      API.fixprice({
        r: ethUtil.bufferToHex(ecsign.r),
        s: ethUtil.bufferToHex(ecsign.s),
        v: ecsign.v,
        value: selling,
        fee: web3.utils.toWei(this.ruleForm.price),
        sellPrice: this.NftTokenAddress.sellerFee,
        id: this.order.id,
      }).then((result) => {
        console.log(result);
        this.loading = false;
        // 收藏品创建成功, 调用后台处理其他逻辑
        API.addMallCollection({
          createId: window.localStorage.getItem("loginId"),
          collectDirId: this.slectFold,
          productCategoryId: this.selectTagId,
          price: this.ruleForm.price,
          productName: this.ruleForm.name,
          productImage: this.ipfsAddress,
          productDesc: this.ruleForm.desc,
          productAuthor: this.ruleForm.author,
          productAuthorDesc: this.ruleForm.authorDesc,
          serviceRate: this.serviceRate,
          copyrightRate: 0,
          tokenId: this.tokenId,
          fileName: this.fileName,
          fileSuffix: this.fileSuffix,
          coverImage: this.thumbIpfsAddress,
          productType: this.productType,
          tradeHash: this.tradeHash,
          fee: this.totalFee.toFixed(2),
        }).then((result) => {
          if (result.code !== 200) {
            this.common.notification(
              this,
              "Casting failed. Please try again later!",
              3
            );
            return;
          }
          this.common.notification(this, "minted successfully!", 1);
          this.$router.push({
            path: "/",
            query: {
              sort: "time",
              tab: this.selectTagId,
            },
          });
          // 刷新整个页面
          this.reload();
        });
      });
    },

    handleChangeEvi(file, fileList) {
      const isLt200M = file.size / 1024 / 1024 < 200;
      if (!isLt200M) {
        this.common.notification(
          this,
          "The size of the uploaded source file cannot exceed 200MB!",
          2
        );
        return;
      }
      console.log("file", file);
      this.fileList = fileList;
      this.fileName = file.name;
      this.fileSuffix = matchFileSuffixType(file.name);
      console.log(this.fileSuffix);
      if (this.fileSuffix === "radio") {
        this.productType = 2;
      }
      if (this.fileSuffix === "video") {
        this.productType = 3;
      }
      const that = this;
      this.ruleForm.SubTokenFile = file.raw;
      this.imageUrlSub = URL.createObjectURL(file.raw);
      const reader = new FileReader();
      reader.readAsArrayBuffer(file.raw);
      // eslint-disable-next-line no-unused-vars
      reader.onload = function (e) {
        that.ruleForm.SubTokenFileBuffer = reader.result;
      };
    },
    handleChangeThumb(file, thumbFileList) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.common.notification(
          this,
          "The size of the uploaded cover image cannot exceed 5MB!",
          2
        );
        return;
      }
      console.log("file", file);
      this.thumbFileList = thumbFileList;
      const that = this;
      this.ruleForm.thumbSubTokenFile = file.raw;
      const reader = new FileReader();
      reader.readAsArrayBuffer(file.raw);
      // eslint-disable-next-line no-unused-vars
      reader.onload = function (e) {
        that.ruleForm.thumbSubTokenFileBuffer = reader.result;
      };
    },
  },
};
</script>

<style lang="less" scoped>
.castingContainer {
  @media screen and (min-width: 800px) {
    min-height: 100vh;
    background: #ffffff;
  }
  @media screen and (max-width: 800px) {
  }
  /deep/ .el-input__icon {
    width: auto;
    line-height: 0.4rem;
    color: #000000;
    @media screen and (max-width: 800px) {
      line-height: 0.4rem;
    }
  }

  /deep/ .el-input__inner {
    height: 0.4rem;
    line-height: 0.4rem;
    padding-left: 0.16rem;
    font-size: 0.14rem;
    background: #ffffff;
    border-radius: 0.08rem;
    border: 1px solid #000000;
    color: #000000;
  }
  /deep/ .el-textarea__inner {
    font-size: 0.14rem;
    background: rgba(255, 255, 255, 0.08);
    line-height: 0.4rem;
    padding-left: 0.16rem;
    background: #ffffff;
    border-radius: 0.08rem;
    border: 1px solid #000000;
    color: #000000;
  }

  /deep/ .el-form-item {
    margin-bottom: 0.4rem;
    @media screen and (max-width: 800px) {
      margin-bottom: 0.32rem;
    }
  }

  /deep/ .el-form-item__label {
    padding: 0;
    margin-bottom: 0.16rem;
    font-size: 0.14rem;
    color: #000000;
    line-height: 1;
    @media screen and (max-width: 800px) {
    }
  }

  /deep/ .el-upload--picture-card {
    line-height: 1;
    border: 0;
    border-radius: 0.08rem;
  }
  /deep/ .el-upload-list--picture-card {
    .el-upload-list__item {
      width: 1.92rem;
      height: 1.6rem;
    }
  }
  /deep/ .createContent {
    .el-upload-list--picture-card .el-upload-list__item {
      width: 1.6rem;
      height: 1.2rem;
    }
  }
  /deep/ .specialUpload .el-upload--picture-card {
    width: 42%;
    border: 1px dotted #999;
    height: auto;
    line-height: 1;
    background: #f9f9f9;
    border-radius: 0.18rem;
    i {
      margin-top: 0.4rem;
      font-size: 0.32rem;
      color: #000000;
    }
  }
  .icImg {
    width: 0.4rem;
    height: 0.4rem;
    display: block;
    margin: 0 auto;
    background: url("../assets/images/newTheme/ic_img.png") no-repeat center;
    background-size: contain;
  }

  /deep/ .tagDrawer {
    padding-bottom: 1.4rem;
    border-radius: 0.3rem 0.3rem 0px 0px;

    .el-drawer__header {
      margin-bottom: 0.71rem;

      & > :first-child {
        font-size: 0.28rem;
        text-align: center;
        color: #333;
      }
    }
  }
}

.ruleForm {
  max-width: 720px;
  margin: 0 auto;
  background: #ffffff;
  @media screen and (max-width: 800px) {
    max-width: 100%;
    padding: 0 0.16rem;
  }
}

.fixBtn {
  padding: 0.2rem 0.24rem 0.71rem 0;
  margin-top: 0.43rem;
  text-align: center;
  @media screen and (max-width: 800px) {
    margin-top: 0.32rem;
    padding: 0 0 1rem 0;
  }
  .btnCompelete,
  .btnCancel {
    width: 96px;
    margin-right: 0.16rem;
    border-radius: 18px;
    @media screen and (max-width: 800px) {
      border-radius: 0.2rem;
    }
  }
  .btnCancel {
    background-color: #c6c6c6;
    color: #494949;
    border-color: #c6c6c6;
  }
}

.tipTxt {
  margin-top: 0.05rem;
  font-size: 0.12rem;
  line-height: 0.18rem;
  color: #b0b0b0;
}

.uploadTip {
  margin-top: 0.12rem;
  line-height: 0.18rem;
  font-size: 0.12rem;
  color: #b0b0b0;
}

.folders {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 0.18rem;
  height: 1.1rem;
  overflow-y: hidden;
  // border-bottom: 1px solid #eeeeee;
  @media screen and (max-width: 800px) {
    height: 1.1rem;
  }
  &.open {
    height: auto;
  }
}

.iconAddFolder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 0.96rem;
  height: 0.96rem;
  margin-right: 0.25rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 0.08rem;
  cursor: pointer;
  @media screen and (max-width: 800px) {
    margin-right: 0.16rem;
  }
  i {
    margin-bottom: 0.15rem;
    font-size: 0.18rem;
    color: #000000;
  }

  span {
    line-height: 1;
    font-size: 0.14rem;
    color: #fff;
  }
}

.chooseFold {
  position: relative;
  width: 0.96rem;
  height: 0.96rem;
  margin-right: 0.16rem;
  margin-bottom: 0.2rem;
  border-radius: 0.08rem;
  overflow: hidden;
  cursor: pointer;
  &.select {
    border: 2px solid #000000;
    &::after {
      content: "";
      position: absolute;
      border-top: 0.28rem solid #000000;
      border-right: 0.28rem solid #000000;
      border-radius: 0.08rem 0px 0.08rem 0px;
      // border-bottom-right-radius: 0.18rem;
      right: -1px;
      bottom: -1px;
    }
  }

  .iconCheck {
    position: absolute;
    width: 0.12rem;
    height: 0.1rem;
    background: url("../assets/images/dui@2x.png") no-repeat center;
    background-size: contain;
    right: 0.06rem;
    bottom: 0.06rem;
    z-index: 2;
  }

  .fillImg {
    border-radius: 0.08rem;
  }
}

.iconRemove {
  position: absolute;
  font-size: 0.24rem;
  color: #fd4a4a;
  right: 0.02rem;
  top: 0.02rem;
}

.tagsBox {
  display: flex;
  flex-wrap: wrap;

  .tagItem {
    height: 0.34rem;
    min-width: 0.64rem;
    line-height: 0.34rem;
    padding: 0 0.13rem;
    margin: 0.1rem 0.16rem 0 0;
    font-size: 0.13rem;
    color: #000000;
    background: #ffffff;
    border: 1px solid #000000;
    // border: 1px solid rgba(128, 130, 178, 0.4);
    //box-shadow: 0px 0.02rem 0.08rem 0px rgba(22, 21, 54, 0.5);
    border-radius: 0.2rem;
    text-align: center;
    cursor: pointer;
    &.activeTagitem {
      background: #000000;
      // border: 1px solid #6ccada;
      color: #fff;
    }
  }
}

.btnRow {
  position: absolute;
  padding: 0.1rem 0.24rem 0.52rem;
  bottom: 0;
  left: 0;
  right: 0;
  @media screen and (max-width: 800px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .btnConfirm {
    width: 100%;
  }
}
.iconFold {
  position: absolute;
  font-size: 0.24rem;
  right: 0;
  top: -0.1rem;
  transition: all 0.3s ease-in-out;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.08);
  font-size: 16px;
  right: 0rem;
  top: 0.4rem;
  cursor: pointer;
  @media screen and (min-width: 800px) {
    top: 0;
  }
  &.rotateIcon {
    transform: rotate(180deg);
  }
}
.videoBox {
  width: auto;
  height: 100%;
}
.playIconBox {
  width: 100%;
  height: 1.48rem;
  background: #c0cad3 url("../assets/images/icon_shipin@2x.png") no-repeat
    center;
  background-size: 0.88rem 0.88rem;
}
.pcPageTitle {
  margin: 0.32rem 0 0.64rem;
  font-size: 0.24rem;
  color: #000000;
  @media screen and (max-width: 800px) {
    margin-left: 0.16rem;
    margin-bottom: 0.32rem;
    font-size: 0.16rem;
  }
}
.contentContainer {
  max-width: 1186px;
  margin: 0 auto;
}
.hideUpload {
  /deep/ .el-upload--picture-card {
    display: none;
  }
}
</style>
