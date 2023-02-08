<template>
  <div
      class="castingContainer"
      v-loading.fullscreen.lock="loading"
      :element-loading-text="loadingText"
  >
    <PcPageHeader @search="searchList"/>
    <div class="contentContainer">
      <div class="pcPageTitle">Casting NFT</div>
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
              accept=".jpg,.jpeg,.png,.gif,.svg,.JPG,.JPEG,.PNG,.GIF,.SVG"
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
              File types supported: JPG, JPEG, PNG, GIF, SVG. Max size: 5 MB
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
              accept=".jpg,.jpeg,.png,.gif,.svg,.JPG,.JPEG,.PNG,.GIF,.SVG,wmv,.asf,.asx,.rm,.rmvb,.mp4,.3gp,.mov,.m4v,.avi,.dat,.mkv,.flv,.vob,.WMV,.ASF,.ASX,.RM,.RMVB,.MP4,.3GP,.MOV、M4V,.AVI,.DAT,.MKV,.FLV,.VOB"
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
              File types supported: JPG, JPEG, PNG, GIF, VIDEO, SVG. Max size:
              350 MB
            </p>

            <div slot="file" slot-scope="{ file }">
              <div
                  class="playIconBox"
                  v-if="
                  file.raw.type === 'video/wmv' ||
                  file.raw.type === 'video/asf' ||
                  file.raw.type === 'video/asx' ||
                  file.raw.type === 'video/rm' ||
                  file.raw.type === 'video/rmvb' ||
                  file.raw.type === 'video/mp4' ||
                  file.raw.type === 'video/3gp' ||
                  file.raw.type === 'video/mov' ||
                  file.raw.type === 'video/m4v' ||
                  file.raw.type === 'video/avi' ||
                  file.raw.type === 'video/dat' ||
                  file.raw.type === 'video/mkv' ||
                  file.raw.type === 'video/flv' ||
                  file.raw.type === 'video/vob' ||
                  file.raw.type === 'audio/ogg' ||
                  file.raw.type === 'video/quicktime' ||
                  file.raw.type === 'video/webm' ||
                  file.raw.type === ''
                "
              ></div>
              <img
                  v-if="
                  file.raw.type !== 'video/wmv' &&
                  file.raw.type !== 'video/asf' &&
                  file.raw.type !== 'video/asx' &&
                  file.raw.type !== 'video/rm' &&
                  file.raw.type !== 'video/rmvb' &&
                  file.raw.type !== 'video/mp4' &&
                  file.raw.type !== 'video/3gp' &&
                  file.raw.type !== 'video/mov' &&
                  file.raw.type !== 'video/m4v' &&
                  file.raw.type !== 'video/avi' &&
                  file.raw.type !== 'video/dat' &&
                  file.raw.type !== 'video/mkv' &&
                  file.raw.type !== 'video/flv' &&
                  file.raw.type !== 'video/vob' &&
                  file.raw.type !== 'audio/ogg' &&
                  file.raw.type !== 'video/quicktime' &&
                  file.raw.type !== 'video/webm' &&
                  file.raw.type !== ''
                "
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
              v-model="ruleForm.name"
              placeholder="Please enter name"
          ></el-input>
        </el-form-item>
        <el-form-item label="Price" prop="price">
          <!-- <el-input
            v-model.trim="ruleForm.price"
            placeholder="请输入价格"
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
              placeholder="Please enter price"
              @updateCoin="updateCoin"
          />
          <p class="tipTxt">
            *The platform will charge {{ serviceRate }}% Service fee
          </p>
        </el-form-item>
        <!-- <el-form-item label="Artist" prop="author">
          <el-input
            v-model="ruleForm.author"
            placeholder="Please enter Artist name"
            @blur="matchAuthor"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="Artist" prop="author">
          <el-autocomplete
              class="inline-input"
              v-model="ruleForm.author"
              :fetch-suggestions="querySearch"
              placeholder="Please enter artist name"
              @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="Artist profile" prop="authorDesc">
          <el-input
              type="textarea"
              :rows="4"
              v-model="ruleForm.authorDesc"
              placeholder="Please enter artist profile"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="版税分成比例" prop="percent">
          <el-input
            v-model.trim="ruleForm.percent"
            placeholder="请输入版税分成比例"
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
        <el-form-item label="Description" prop="desc">
          <el-input
              type="textarea"
              :rows="4"
              v-model="ruleForm.desc"
              placeholder="Please give a description for this artwork to let public know more about it."
          ></el-input>
        </el-form-item>

        <el-form-item label="Cating mode" prop="castingMode">
          <div style="">
            <el-radio-group v-model="ruleForm.castingMode" size="medium">
              <el-radio label="0" border>lazy casting
              </el-radio>
              <div></div>
              <el-radio label="1" border>normal casting</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>

        <div class="fixBtn">
          <el-button type="primary" class="btnCompelete" @click="handleCasting"
          >Mint
          </el-button
          >
          <el-button class="btnCancel" @click="$router.go(-1)">Home</el-button>
          <!-- <el-button class="btnCancel" @click="placeData">填充数据</el-button> -->
        </div>
      </el-form>
    </div>

    <el-drawer
        title="Category label"
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
        >confirm
        </el-button
        >
      </div>
    </el-drawer>
    <TipModal
        :visible.sync="tipVisible"
        title="Tips"
        :content="content"
        cancelTxt="cancel"
        :confirmTxt="confirmTxt"
        @close="toClose"
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
import {isUK, matchFileSuffixType} from "@/utils/rules";
import NumberInput from "@/components/Magic/NumberInput";
import {constractAddress} from "@/const/const";
import contractAPI from "@/wallet_nc/contract/contractAPI";
import {Asset, Order, Ordersign} from "@/wallet_nc/common/erc721/order";
import {
  encDataV1,
  encLazy,
  ERC1155,
  ERC721,
  ERC721_LAZY,
  ETH,
  id,
  ORDER_DATA_V1
} from "@/wallet_nc/common/erc721/assets";

const ERC721Types = {
  Part: [
    {name: 'account', type: 'address'},
    {name: 'value', type: 'uint96'},
  ],
  Mint721: [
    {name: 'tokenId', type: 'uint256'},
    {name: 'tokenURI', type: 'string'},
    {name: 'creators', type: 'Part[]'},
    {name: 'royalties', type: 'Part[]'},
  ],
};

const ERC1155Types = {
  Part: [
    {name: 'account', type: 'address'},
    {name: 'value', type: 'uint96'},
  ],
  Mint1155: [
    {name: 'tokenId', type: 'uint256'},
    {name: 'supply', type: 'uint256'},
    {name: 'tokenURI', type: 'string'},
    {name: 'creators', type: 'Part[]'},
    {name: 'royalties', type: 'Part[]'},
  ],
};

const ZERO = "0x0000000000000000000000000000000000000000";
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";
const ONE = "0x0000000000000000000000000000000000000001";
let ethUtil = require("ethereumjs-util");
const node = ipfsAPI({
  host: "artlinx." + (isUK() ? 'uk' : 'hk'),
  port: "/ipfs",
  protocol: "https",
});
// const node = ipfsAPI({
//   host: "18.163.238.190",
//   port: "5001",
//   protocol: "http",
// });
const TRANSACTION_RECEIPT_STATUS = {
  SUCCESS: 1,
  REVERTED: 0,
};
const DOMAIN_TYPE = [
  {
    type: "string",
    name: "name",
  },
  {
    type: "string",
    name: "version",
  },
  {
    type: "uint256",
    name: "chainId",
  },
  {
    type: "address",
    name: "verifyingContract",
  },
];
const EtheremTx = require("ethereumjs-tx");
let Web3 = require("web3");
//测试数据
let assetType = new Map();
assetType.set("ETH", 0);
assetType.set("ERC20", 1);
assetType.set("ERC1155", 2);
assetType.set("ERC721", 3);
assetType.set("ERC721Deprecated", 4);
let dAPI = new contractAPI();
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
        bankStatus: 0,
        castingMode: "0",
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
          {required: true, message: "Please enter a name", trigger: "blur"},
        ],
        price: [
          {
            required: true,
            message: "Please enter the price",
            trigger: "blur",
          },
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
            message:
                "Please give a description for this artwork to let public know more about it.",
            trigger: "blur",
          },
        ],
        tag: [
          {required: true, message: "Select item Label", trigger: "blur"},
        ],
        author: [
          {
            required: true,
            message: "Please enter the author",
            trigger: "blur",
          },
        ],
        authorDesc: [
          {
            required: true,
            message: "Please enter the author sintroduction",
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
      pricePlaceholder: "Please enter the price",
      isToHome: false,
      web3: null,
      coinType: "ETH",
      coinName: "ETH",
      coinAddress: ZERO,
      // 定义v-model
      state1: "",
      artList: [],
      netInfo: null
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
  watch: {
    "$store.state.wallet.walletConnected": {
      handler(newName, oldName) {
        // console.log("newName:", newName);
        // console.log("oldName:", oldName);
        if (newName) {
          // 钱包连接成功后刷新数据
          this.web3 = this.$store.getters["wallet/web3"];
        }
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，如果设置了false，那么效果和上边例子一样
      immediate: true,
    },
  },
  mounted() {
    this.getCurrentUser();
    this.$nextTick(() => {
      this.clientWidth = document.documentElement.clientWidth;
    });

    API.getContractConfig().then(async (result) => {
      console.log("msgResult: " + JSON.stringify(result));
      if (result.code !== 200) {
        this.common.notification(this, result.msg, 3);
        return;
      }
      this.NftTokenAddress = result.data;
      // 服务费率(动态获取)
      this.serviceRate = result.data.buyerFee / 100;

      // 查询藏品分类列表
      this.categoryList();
      // 查询收藏夹列表
      this.getCollectionDirList();
    });
  },
  methods: {
    isUK,
    encLazy,
    querySearch(queryString, cb) {
      this.artList = [];
      if (!queryString || !queryString.trim()) {
        // 调用 callback 返回建议列表的数据
        cb(this.artList);
        this.ruleForm.authorDesc = '';
        return;
      }
      // console.log("queryString", queryString);
      let artInfo = {};
      API.getCollectArtist({artName: queryString}).then(result => {
        if (result.code == 200 && result.data != null) {
          let dataLength = result.data.length;
          for (let i = 0; i < dataLength; i++) {
            artInfo = {};
            artInfo.id = i;
            artInfo.value = result.data[i].author;
            artInfo.valueDesc = result.data[i].authorDesc;
            this.artList.push(artInfo);
          }
          if (dataLength == 0) {
            this.ruleForm.authorDesc = '';
          }
          // console.log("dataList", this.artList);
          // var results = queryString ? dataList.filter(this.createFilter(queryString)) : dataList;
          // 调用 callback 返回建议列表的数据
          cb(this.artList);
        }
      });
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item.id);
      let targetArtList = this.artList.filter(art => art.id === item.id);
      if (targetArtList.length > 0) {
        this.ruleForm.authorDesc = targetArtList[0].valueDesc;
      }
    },
    updateCoin(address) {
      console.log("address;", address);
      switch (address) {
        case ZERO:
          this.coinType = "ETH";
          this.coinName = "ETH";
          this.coinAddress = ZERO;
          break;
        default:
          this.coinAddress = address;
          this.coinType = "ERC20";
          var coinArr = constractAddress.coinType;
          for (let i = 0; i < coinArr.length; i++) {
            if (coinArr[i].address == address) {
              this.coinName = coinArr[i].name;
              break;
            }
          }
          break;
      }
    },
    toClose() {
      this.tipVisible = false;
      this.$router.push({
        path: "/funding",
      });
    },
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
    // 匹配数据库作者
    matchAuthor() {
      console.log("匹配作者");
      if (this.ruleForm.author) {
        API.getCollectAuthorInfo({authorName: this.ruleForm.author}).then(
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
    // 去充值
    toCharge() {
      if (this.isToCharge) {
        this.$router.push({
          path: "/funding",
        });
      } else if (this.isToHome) {
        this.$router.push({
          path: "/",
        });
        return;
      } else {
        if (this.bankStatus == 0) {
          this.$router.push({
            path: "/funding",
          });
          return;
        }
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
    placeData() {
      // ruleForm: {
      // SubTokenFile: null,
      // SubTokenFileBuffer: null,
      // thumbSubTokenFile: null,
      // thumbSubTokenFileBuffer: null,
      // name: "",
      // desc: "",
      // author: "",
      // authorDesc: "",
      // tag: "",
      // price: "",
      // percent: "",
      // fold: "",
      // bankStatus: 0,
      // },
    },
    handleCasting() {
      if (
          this.selectTagId == "" ||
          this.selectTagId == null ||
          this.selectTagId == undefined
      ) {
        this.common.notification(this, "Select item Label", 2);
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
              "Minting in process, normally 1-5 minutes up to " + (this.isUK() ? 'Polygon' : 'Ethereum') + " traffic.";

          let _fees = [];
          let tokenURI;

          node
              .add(Buffer.from(this.ruleForm.thumbSubTokenFileBuffer))
              .then(async (res) => {
                const thumbResponse = res[0];
                console.log(thumbResponse);
                this.thumbIpfsAddress = thumbResponse.path;
                // console.log(
                //   "this.ruleForm.SubTokenFileBuffer",
                //   this.ruleForm.SubTokenFileBuffer
                // );
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
                      data.image =
                          "https://artlinx.hk/ipfs/api/v0/cat/" + `${response.hash}`;
                      const selectObj = this.tags.find(
                          (item) => item.id === this.selectTagId
                      );
                      data.tag = JSON.stringify(selectObj);
                      //  author: "",
                      //       authorDesc: "",
                      data.author = this.ruleForm.author;
                      data.authorDesc = this.ruleForm.authorDesc;
                      node
                          .add(Buffer.from(JSON.stringify(data), "utf-8"))
                          .then(async (response) => {
                            const metadata = response[0];
                            console.log(metadata);
                            tokenURI = metadata.hash;

                            // 改动, 接下来调用合约

                            // 版权费用    TODO  这里地址需要最后再测试
                            // 判断铸造放好似
                            switch (this.ruleForm.castingMode) {
                              case "0": {
                                this.toCreateLazy(tokenURI);
                                break
                              }
                              case "1": {
                                this.toCreate(tokenURI);
                                break
                              }
                              default: {
                                this.$message.error("Casting mode error!")
                              }
                            }

                            // let recipient = window.localStorage.getItem("walletAddress");
                            // recipient = this.web3.utils.toChecksumAddress(recipient);
                            // if (this.ruleForm.percent > 0) {
                            //   _fees = [[recipient, this.ruleForm.percent * 100]];
                            // }
                            // const collection = new this.web3.eth.Contract(abiSing);

                            // let data = collection.methods
                            //   .mint(_fees, tokenURI)
                            //   .encodeABI();
                            // let privateKey = this.getPrivateKey();
                            // let walletAddress =
                            //   window.localStorage.getItem("walletAddress");
                            // that.sendSignedTransaction(
                            //   data,
                            //   that.paramAddress,
                            //   walletAddress,
                            //   privateKey,
                            //   that.mint_cb,
                            //   0
                            // );
                          });
                    });
              });
        } else {
          return false;
        }
      });
      // this.tipVisible = true;
    },
    // 懒铸造
    async toCreateLazy(metadataHash) {
      var web3client = this.web3.eth;
      let walletAddress = window.localStorage.getItem("walletAddress");
      // TODO 版税暂时不设置
      var royaltyPayment = "0";
      // tokenId
      const tokenId =
          window.localStorage.getItem("walletAddress") +
          "b1234567890" +
          Date.now();
      var tokenURI = metadataHash;
      // TODO 使用tokenId 和 tokenURI  版税 来进行铸造  版税暂时0 代替
      const form = await this.createLazyMintNft(
          tokenURI,
          tokenId,
          royaltyPayment,
          "ERC721"
      );
      var netInfo = await this.signAndPutLazyMint(form);
      console.log('>>>>>铸造成功', netInfo);
      this.netInfo = netInfo;
      this.tradeHash = ZERO_HASH;
      this.tokenId = tokenId;
      dAPI.isApprovedForAllLazy(web3client, walletAddress, this.paramAddress).then(async (ret) => {
        // ret = true;
        switch (ret) {
          case true:
            this.toTwiceFixPrice(tokenId);
            // 懒铸造藏品成功
            break;
          case false:
          default:
            // TODO  这里缺少等待的逻辑
            dAPI.approvalForAllLazy(
                web3client,
                this.setApprovalForAll_cb,
                this.paramAddress,
                true
            );
            break;
        }
      });
    },
    // 正常铸造
    async toCreate(metadataHash) {
      var web3client = this.web3.eth;
      const walletAddress = window.localStorage.getItem("walletAddress");
      // TODO 版税暂时不设置
      var royaltyPayment = "0";
      // tokenId
      const tokenId = walletAddress + "b1234567890" + Date.now();
      var tokenURI = metadataHash;
      // TODO 使用tokenId 和 tokenURI  版税 来进行铸造  版税暂时0 代替
      const form = await this.createLazyMintNft(
          tokenURI,
          tokenId,
          royaltyPayment,
          "ERC721"
      );
      var netInfo = form;
      dAPI.mintAndTransfer(
          tokenId,
          tokenURI,
          walletAddress,
          royaltyPayment,
          "0x",
          walletAddress,
          walletAddress,
          web3client,
          this.toCreate_cb,
          this.paramAddress
      );
      // 懒铸造藏品成功
    },
    async toCreate_cb(err, hash, tokenId) {
      if (err != null) {
        this.common.notification(this, err.message, 3);
        this.loading = false;
        return;
      }
      let provider = this.$store.state.wallet.provider;
      const result = await provider.waitForTransaction(hash);
      console.log("err:", err);
      console.log("ret:", hash);

      if (result.status === TRANSACTION_RECEIPT_STATUS.REVERTED) {
        throw "Transaction Reverted";
      }
      this.tradeHash = hash;
      this.tokenId = tokenId;

      // this.approve(
      //   this.paramAddress,
      //   window.localStorage.getItem("walletAddress"),
      //   tokenId
      // );
      // this.approve(
      //     this.paramAddress,
      //     window.localStorage.getItem("walletAddress"),
      //     tokenId
      // );
      var web3client = this.web3.eth;
      let walletAddress = window.localStorage.getItem("walletAddress");
      dAPI.isApprovedForAllLazy(web3client, walletAddress, this.paramAddress).then(async (ret) => {
        // ret = true;
        switch (ret) {
          case true:
            this.toTwiceFixPrice(tokenId);
            // 懒铸造藏品成功
            break;
          case false:
          default:
            // TODO  这里缺少等待的逻辑
            dAPI.approvalForAllLazy(
                web3client,
                this.setApprovalForAll_cb,
                this.paramAddress,
                true
            );
            break;
        }
      });
      // this.toTwiceFixPrice(tokenId);
    },
    toTwiceFixPrice(tokenId) {
      var price = this.web3.utils.toWei(this.ruleForm.price);
      this.toTwiceFixPriceFun(tokenId, price);
    },
    // 二次上架设置价格
    async toTwiceFixPriceFun(tokenId, price) {
      const from = window.localStorage.getItem("walletAddress");
      var payouts = dAPI.creators([from]); //  多个入款账户!!
      // var originFees = dAPI.creators([from]);
      // var originFees = [['0x1cf0df2a5a20cd61d68d4489eebbf85b8d39e18a', '10000']];
      var originFees = []; // 版税
      var encDataLeft = encDataV1([payouts, originFees]);
      let tradeToken = "";
      if (this.coinType == "ETH") {
        tradeToken = "0x";
      } else {
        tradeToken = this.coinAddress;
      }
      var erc721LazyAddress = this.paramAddress;
      const exchangeV2Address = constractAddress.exchangeV2Address;
      var left;
      if (this.ruleForm.castingMode == "0") {
        var NFTINFO = this.netInfo;
        var tokenURI, signatureMint;
        // tokenId = '11236957069382883613971689922628377939214151938208327694302585602699098587139';
        tokenURI = NFTINFO.uri;
        var markCreators = NFTINFO.creators;
        var markRoyalties = NFTINFO.royalties;
        var creators = [];
        var royalties = [];

        for (let markCreatorsKey in markCreators) {
          creators.push([
            markCreators[markCreatorsKey].account,
            markCreators[markCreatorsKey].value,
          ]);
        }
        // for (let markRoyaltiesKey in markRoyalties) {
        //   royalties.push([
        //     markRoyalties[markRoyaltiesKey].account,
        //     markRoyalties[markRoyaltiesKey].value,
        //   ]);
        // }
        var collectAddress;
        collectAddress = NFTINFO['contract'];
        signatureMint = NFTINFO['signatures'];
        var makeAssetData = this.encLazy(collectAddress, [
          tokenId,
          tokenURI,
          creators,
          royalties,
          signatureMint,
        ]);
        left = Order(
            from,
            Asset(ERC721_LAZY, makeAssetData, 1),
            ZERO,
            Asset(id(this.coinType), this.enc(tradeToken), price),
            this.random(1, 10000),
            0,
            0,
            ORDER_DATA_V1,
            encDataLeft
        );
      } else if (this.ruleForm.castingMode == "1") {
        left = Order(
            from,
            Asset(ERC721, this.enc(erc721LazyAddress, tokenId), 1),
            ZERO,
            Asset(id(this.coinType), this.enc(tradeToken), price),
            this.random(1, 10000),
            0,
            0,
            ORDER_DATA_V1,
            encDataLeft
        );

      } else {
        this.$message.error("Casting mode error!")
        return;
      }

      var signature = await this.getSignature(left, exchangeV2Address);
      // debugger;
      console.log("signOrderFormsignature" + signature);
      // var twiceOrderLEFT = {...left, signature};
      // TODO 改成接口请求
      // window.sessionStorage.setItem("twiceOrderLEFT", JSON.stringify(left));
      // window.sessionStorage.setItem("twiceOrderLEFT_SIGN", signature);
      // this.approve(this.paramAddress, from, tokenId);

      // let left = JSON.stringify(left);
      // let leftJSON = JSON.parse(left);
      // let signature = window.sessionStorage.getItem("twiceOrderLEFT_SIGN");

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
        coinType: this.coinAddress,
        signatureLeft: signature,
        orderLeft: JSON.stringify(left),
        remark: window.localStorage.getItem("currNetwork"),
      }).then((result) => {
        if (result.code !== 200) {
          this.common.notification(
              this,
              "Casting failure, Please wait for a moment!",
              3
          );
          return;
        }
        this.common.notification(this, "minted successfully!", 1);
        this.loading = false;
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
    },
    random(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    enc(token, tokenId) {
      if (tokenId) {
        return this.web3.eth.abi.encodeParameters(
            ["address", "uint256"],
            [token, tokenId]
        );
      }
      if (token == "0x") {
        return token;
      }
      return this.web3.eth.abi.encodeParameter("address", token);
    },

    async getSignature(order, exchangeV2Address) {
      const signer = window.localStorage.getItem("walletAddress");
      return await Ordersign(this.web3.eth, order, signer, exchangeV2Address);
    },
    async signAndPutLazyMint(form) {
      const signed = await this.signLazyMint(form);
      return this.putLazyMint(signed);
    },
    async putLazyMint(form) {
      const res = {data: form};
      return res.data;
    },
    async signLazyMint(form) {
      const chainId = Number(await this.web3.eth.getChainId());

      const signature = await this.signLazyMintMessage(
          form,
          window.localStorage.getItem("walletAddress"),
          chainId,
          this.paramAddress
      );
      return {...form, signatures: [signature]};
    },
    async signLazyMintMessage(form, account, chainId, verifyingContract) {
      const typeName = form["@type"] === "ERC721" ? "Mint721" : "Mint1155";
      const data = this.createTypeData(
          {
            name: typeName,
            version: "1",
            chainId,
            verifyingContract,
          },
          typeName,
          {...form, tokenURI: form.uri},
          form["@type"] === "ERC721" ? ERC721Types : ERC1155Types
      );
      console.log("signing", data);
      return await this.signTypedData(account, data);
    },

    createTypeData(domainData, primaryType, message, types) {
      return {
        types: Object.assign(
            {
              EIP712Domain: DOMAIN_TYPE,
            },
            types
        ),
        domain: domainData,
        primaryType: primaryType,
        message: message,
      };
    },
    async signTypedData(from, data) {
      return (
          await new Promise((resolve, reject) => {
            function cb(err, result) {
              if (err) return reject(err);
              if (result.error) return reject(result.error);
              const sig = result.result;
              const sig0 = sig.substring(2);
              const r = "0x" + sig0.substring(0, 64);
              const s = "0x" + sig0.substring(64, 128);
              const v = parseInt(sig0.substring(128, 130), 16);
              resolve({data, sig, v, r, s});
            }

            if (this.web3.currentProvider.isMetaMask) {
              return this.web3.currentProvider.sendAsync(
                  {
                    jsonrpc: "2.0",
                    method: "eth_signTypedData_v4",
                    params: [from, JSON.stringify(data)],
                    id: new Date().getTime(),
                  },
                  cb
              );
            } else {
              let send = this.web3.currentProvider.sendAsync;
              if (!send) send = this.web3.currentProvider.send;
              return send.bind(this.web3.currentProvider)(
                  {
                    jsonrpc: "2.0",
                    method: "eth_signTypedData",
                    params: [from, data],
                    id: new Date().getTime(),
                  },
                  cb
              );
            }
          })
      ).sig;
    },
    async createLazyMintNft(tokenURI, tokenId, royaltiesValue, type) {
      const creator = window.localStorage.getItem("walletAddress");
      console.log("creator is", creator);
      console.log("generated tokenId", tokenId);
      // TODO 暂时先实现ERC721
      switch (type) {
        case "ERC721":
          return {
            "@type": type,
            contract: this.paramAddress,
            tokenId: tokenId,
            uri: tokenURI,
            creators: [{account: creator, value: "10000"}],
            // royalties: [{account: creator, value: royaltiesValue}], // 版税  int值
            royalties: [], // 版税  int值
          };
        case "ERC1155":
          break;
        default:
          break;
      }
    },

    async ethGas(contractAddress, data, value, walletAddress, cb, privateKeys) {
      let _this = this;
      await this.web3.eth.estimateGas(
          {
            to: contractAddress,
            data: data,
            value: value,
            from: walletAddress,
          },
          (error, gas) => {
            console.log("error\n:" + error);
            console.log("gas:\n" + gas);
            var fee = this.web3.utils.fromWei(
                (gas * _this.artGasPrice).toString(),
                "ether"
            );
            console.log("手续费：" + fee);
            _this.fee = parseFloat(_this.fee) + parseFloat(fee);
            if (error != undefined) {
              if (error.toString().indexOf("not enough stock") != -1) {
                _this.loading = false;
                _this.content =
                    "The current collection has been traded, you can return to the home page to continue to browse other collections!";
                _this.confirmTxt = "Go to the home page";
                _this.isToHome = true;
                _this.tipVisible = true;
                return;
              }
              if (error.toString().indexOf("insufficient funds") != -1) {
                // _this.loading = false;
                // _this.content =
                //   "大约需要花费上链手续费 " +
                //   _this.fee +
                //   "RMB 左右, 余额不足, 无法铸造藏品, 请去充值。";
                // _this.confirmTxt = "去充值";
                // _this.isToCharge = true;
                // _this.tipVisible = true;
                // return;
              } else {
                _this.loading = false;
                _this.common.notification(
                    _this,
                    "Casting failed. Please try again later！",
                    3
                );
                return;
              }
            } else {
              if (parseFloat(fee) > 0.2) {
                _this.totalFee = parseFloat(_this.fee) + 0.2;
                // if (!_this.isRemindFee) {
                //   _this.totalFee = parseFloat(_this.fee) + 0.2;
                //   _this.loading = false;
                //   _this.content =
                //     "大约需要花费上链手续费 " +
                //     _this.totalFee.toFixed(2) +
                //     "RMB 左右, 是否继续?";
                //   _this.confirmTxt = "继续";
                //   _this.isToCharge = false;
                //   _this.isRemindFee = true;
                //   _this.tipVisible = true;
                //   return;
                // }
              }
            }
            let addressFee = _this.totalFee == 0 ? fee : _this.totalFee;
            API.checkAddressFee({address: walletAddress, fee: addressFee}).then(
                (result) => {
                  console.log("检查手续费结果：" + JSON.stringify(result));
                  if (result.code == 200) {
                    this.web3.eth
                        .getTransactionCount(
                            walletAddress,
                            this.web3.eth.defaultBlock.latest
                        )
                        .then((nonce) => {
                          console.info("nonce:\n" + nonce);
                          let rawTx = {
                            // nonce: ct3.utils.toHex(ct3.utils.hexToNumber(("0x" + nonce))),
                            nonce: this.web3.utils.toHex(nonce),
                            gasLimit: this.web3.utils.toHex(gas),
                            gasPrice: this.web3.utils.toHex(_this.artGasPrice),
                            to: this.web3.utils.toHex(contractAddress),
                            from: walletAddress,
                            value: this.web3.utils.toHex(value),
                            data: this.web3.utils.toHex(data),
                            chainId: API.getChainId(),
                          };
                          // console.log("privateKeys:" + privateKeys);
                          let privateKeyBuffer = Buffer.from(privateKeys, "hex");
                          let tx = new EtheremTx(rawTx);
                          tx.sign(privateKeyBuffer);
                          let serializedTx = tx.serialize();
                          let serializedTxStr = "0x" + serializedTx.toString("hex");
                          this.web3.eth
                              .sendSignedTransaction(serializedTxStr)
                              .then((ret) => {
                                cb(ret);
                              })
                              .catch((err) => {
                                console.log("铸造发送交易报错：" + err);
                                _this.loading = false;
                                _this.tipVisible = false;
                                _this.common.notification(
                                    _this,
                                    "Casting failed. Please try again later！",
                                    3
                                );
                                return;
                              });
                        });
                  } else {
                    _this.loading = false;
                    _this.tipVisible = false;
                    _this.common.notification(
                        _this,
                        "Casting failed. Please try again later！",
                        3
                    );
                    return;
                  }
                }
            );
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

    approve(ctsignTokencontractAddress, walletAddress, tokenId) {
      var web3client = this.web3.eth;

      console.log(
          "approve ctsignTokencontractAddress:",
          ctsignTokencontractAddress
      );
      console.log("approve walletAddress:", walletAddress);
      console.log("approve tokenId:", tokenId);
      console.log("approve web3client:", web3client);
      //上架  true
      dAPI.approve(
          walletAddress,
          tokenId,
          web3client,
          this.setApprovalForAll_cb,
          ctsignTokencontractAddress
      );
    },
    setApprovalForAll(ctsignTokencontractAddress, walletAddress, tokenId) {
      //上架  true

      const collection = new this.web3.eth.Contract(abiSing);
      let data = collection.methods
          .approve(constractAddress.transferProxy, true)
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

    async setApprovalForAll_cb(err, hash) {
      if (err != null) {
        this.common.notification(this, err.message, 3);
        this.loading = false;
        return;
      }
      let provider = this.$store.state.wallet.provider;
      const result = await provider.waitForTransaction(hash);
      console.log("err:", err);
      console.log("ret:", hash);

      if (result.status === TRANSACTION_RECEIPT_STATUS.REVERTED) {
        throw "Transaction Reverted";
      }
      this.toTwiceFixPrice(this.tokenId);
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

    handleChangeEvi(file, fileList) {
      const isLt350M = file.size / 1024 / 1024 <= 350;
      if (!isLt350M) {
        this.common.notification(
            this,
            "Upload HD file the size cannot exceed 350MB!",
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
            "Upload the cover to a maximum size of 5MB!",
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
    color: #fff;
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
    width: 70%;
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
    background-color: #ffffff;
    color: #000000;
    border-color: #000000;
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
  background: #c0cad3 url("../assets/images/icon_shipin@2x.png") no-repeat center;
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

.el-autocomplete {
  width: 100%;
}
</style>
