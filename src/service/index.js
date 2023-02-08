import axios from "@/utils/request";
import router from "@/router";
import { baseUrl } from "./config";
import store from "../store";
// import QS from 'qs';
import { config, constractAddress } from "@/const/const";
import nameImg from "./../assets/images/name_img.jpg";
const NET_WORK_URL = "https://polygon-rpc.com/";
const RPC_CHAINID = 137;
const IPFS_ACCESS_PREFIX = "https://artlinx.hk/ipfs/api/v0/cat/";
const DEFAULT_AVATAR_URL = nameImg;
const AVATAR_ACCESS_PREFIX = "/prod-api";

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    var url = config.url;
    // console.log("url：" + url);
    const walletAddress = store.getters["wallet/walletAddress"];
    if (
      url.indexOf("login") != -1 ||
      url.indexOf("register") != -1 ||
      url.indexOf("checkAccountIsExist") != -1 ||
      url.indexOf("getCode") != -1 ||
      url.indexOf("categoryList") != -1 ||
      url.indexOf("listBanner") != -1 ||
      url.indexOf("statProductInfo") != -1 ||
      url.indexOf("getMallCollectionList") != -1 ||
      url.indexOf("faceAuthenticationForH5Person") != -1 ||
      url.indexOf("getMallCollectionInfo") != -1 ||
      url.indexOf("/contract/config") != -1 ||
      url.indexOf("getSameAuthorOrCategoryCollectionList") != -1 ||
      url.indexOf("getCollectDealRecordList") != -1 ||
      url.indexOf("/items/bestOffers") != -1
    ) {
      return config;
    }
    if (!walletAddress) {
      if (url.indexOf("getUserInfo") != -1) {
        return config;
      }
      router.replace({
        path: "/login",
      });
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

const API = {
  movies() {
    return axios.get(`${baseUrl.test}/test`);
  },
  /** 区块链地址 */
  getNetWorkUrl() {
    return NET_WORK_URL;
  },
  /** 区块链地址 */
  getChainId() {
    return RPC_CHAINID;
  },
  /** IPFS访问前缀 */
  getIpfsAccessPrefix() {
    return IPFS_ACCESS_PREFIX;
  },
  parseHttp(prefix, value) {
    if (value && value.substr(0, 4) == "http") {
      return value;
    } else {
      return prefix + value;
    }
  },
  /** 默认头像地址 */
  getDefaultAvatarUrl() {
    return DEFAULT_AVATAR_URL;
  },
  /** 头像访问前缀 */
  getAvatarAccessPrefix() {
    return AVATAR_ACCESS_PREFIX;
  },
  /** 检查账号是否已经存在 */
  checkAccountIsExist(params) {
    return axios.get(
      `${baseUrl.dev}/mall/login/checkAccountIsExist/` + params.account
    );
  },
  /** 检查地址是否已经存在 */
  checkAddressIsExist(params) {
    return axios.get(
      `${baseUrl.dev}/mall/login/checkAddressIsExist/` + params.address
    );
  },
  /** 获取验证码 */
  getCode(params) {
    return axios.get(`${baseUrl.dev}/mall/login/getCode/` + params.account);
  },
  /** 用户注册 */
  register(data) {
    return axios.post(`${baseUrl.dev}/mall/login/register`, data);
  },
  /** 密码登录 */
  loginByPwd(data) {
    return axios.post(
      `${baseUrl.dev}/mall/login/loginByPwd?account=` + data.account
    );
  },
  /** 私钥登录 */
  loginByWalletAddress(data) {
    if (
      data.address == null ||
      data.address == undefined ||
      data.address.length != 42
    ) {
      return;
    }
    return axios.post(
      `${baseUrl.dev}/mall/login/loginByWalletAddress?address=` + data.address
    );
  },
  /** 通过私钥重置托管密码 */
  resetPwdByPrivateKey(data) {
    return axios.post(`${baseUrl.dev}/mall/login/resetPwdByPrivateKey`, data);
  },
  /** 查询用户详细信息 */
  getUserInfo(params) {
    console.log("params:", params);
    return axios.get(
      `${baseUrl.dev}/mall/user/getUserInfo/` + params.certificationId
    );
  },
  /** 查询用户详细信息(根据用户账号和类型) */
  getUserByAccountAndType(params) {
    return axios.get(
      `${baseUrl.dev}/mall/login/getUserByAccountAndType/` +
        params.account +
        `/` +
        params.type
    );
  },
  /** 用户修改昵称 */
  updateNickName(data) {
    return axios.post(`${baseUrl.dev}/mall/user/updateNickName`, data);
  },
  /** 用户修改 mobile */
  updateMobile(data) {
    return axios.post(`${baseUrl.dev}/mall/user/updateMobile`, data);
  },
  /** 用户修改introduction */
  updateIntroduction(data) {
    return axios.post(`${baseUrl.dev}/mall/user/updateIntroduction`, data);
  },
  /** 我的团队 */
  getTeamList(params) {
    return axios.get(
      `${baseUrl.dev}/mall/user/getTeamList/` + params.certificationId
    );
  },
  /** 用户申请成为藏品铸造者 */
  addReleaseApply(data) {
    return axios.post(
      `${baseUrl.dev}/mall/user/addReleaseApply?certificationId=` +
        data.certificationId
    );
  },
  /** 用户实名认证申请 */
  addRealNameApply(data) {
    return axios.post(`${baseUrl.dev}/mall/user/addRealNameApply`, data);
  },
  /** 用户充值 */
  addCharge(data) {
    return axios.post(`${baseUrl.dev}/mall/user/addCharge`, data);
  },
  /** 充值列表 */
  getChargeList(params) {
    return axios.get(
      `${baseUrl.dev}/mall/user/getChargeList/` + params.certificationId
    );
  },
  /** 用户设置提现方式 */
  addWithdrawConfig(data) {
    return axios.post(`${baseUrl.dev}/mall/user/addWithdrawConfig`, data);
  },
  /** 获取用户提现配置信息 */
  getWithdrawConfig(params) {
    return axios.get(
      `${baseUrl.dev}/mall/user/getWithdrawConfig/` +
        params.certificationId +
        `/` +
        params.type
    );
  },
  /** 用户申请提现 */
  addWithdraw(data) {
    return axios.post(`${baseUrl.dev}/mall/user/addWithdraw`, data);
  },
  /** 获取用户提现列表 */
  getWithdrawList(params) {
    return axios.get(
      `${baseUrl.dev}/mall/user/getWithdrawList/` + params.certificationId
    );
  },
  /** 获取用户原石数量 */
  getTokenBalance(params) {
    return axios.get(
      `${baseUrl.dev}/mall/user/getTokenBalance/` +
        params.walletAddress +
        `/` +
        params.contractAddress
    );
  },
  /** 用户Upload your Avatar */
  updateAvatar(data) {
    return axios.post(`${baseUrl.dev}/mall/user/updateAvatar`, data);
  },
  /** 用户删除头像 */
  delAvatar(data) {
    return axios.post(`${baseUrl.dev}/mall/user/delAvatar`, data);
  },
  /** 上传实名认证图片 */
  uploadImg(data) {
    return axios.post(`${baseUrl.dev}/mall/common/uploadImg`, data);
  },
  /** 藏品分类列表 */
  categoryList(params) {
    return axios.get(`${baseUrl.dev}/mall/collection/categoryList`, {
      params,
    });
  },
  /** 新增收藏夹 */
  addCollectionDir(data) {
    return axios.post(`${baseUrl.dev}/mall/collection/addCollectionDir`, data);
  },
  /** 收藏夹列表 */
  getCollectionDirList(params) {
    return axios.get(`${baseUrl.dev}/mall/collection/getCollectionDirList`, {
      params,
    });
  },
  /** 新增藏品 */
  addMallCollection(data) {
    return axios.post(`${baseUrl.dev}/mall/collection/addMallCollection`, data);
  },
  inquiryCollection(data) {
    return axios.post(`${baseUrl.dev}/mall/collection/inquiryCollection`, data);
  },
  /** 藏品再次上架 */
  addMallCollectionAgain(data) {
    return axios.post(
      `${baseUrl.dev}/mall/collection/addMallCollectionAgain`,
      data
    );
  },
  /** 藏品详情 */
  getMallCollectionInfo(params) {
    return axios.get(
      `${baseUrl.dev}/mall/collection/getMallCollectionInfo/` +
        params.certificationId +
        `/` +
        params.productId
    );
  },
  /** 导入藏品 */
  importMallCollection(data) {
    return axios.post(
      `${baseUrl.dev}/mall/collection/importMallCollection`,
      data
    );
  },
  //   下架沧萍
  revokeMallCollection(data) {
    return axios.post(
      `${baseUrl.dev}/mall/collection/revokeMallCollection`,
      data
    );
  },
  /** 查询TokenId信息 */
  checkTokenId(params) {
    return axios.get(
      `${baseUrl.dev}/mall/collection/checkTokenId/` + params.tokenId
    );
  },
  /** 查询藏品是否点赞/收藏 */
  checkIsFavoriteAndCollect(params) {
    return axios.get(
      `${baseUrl.dev}/mall/collection/checkIsFavoriteAndCollect/` +
        params.certificationId +
        `/` +
        params.productId
    );
  },
  /** 查询同类型或者同author藏品列表 */
  getSameAuthorOrCategoryCollectionList(params) {
    return axios.get(
      `${baseUrl.dev}/mall/collection/getSameAuthorOrCategoryCollectionList`,
      {
        params,
      }
    );
  },
  /** 首页藏品列表 */
  getMallCollectionList(params) {
    return axios.get(`${baseUrl.dev}/mall/collection/getMallCollectionList`, {
      params,
    });
  },
  /** 藏品交易记录 */
  getCollectDealRecordList(params) {
    return axios.get(
      `${baseUrl.dev}/mall/collection/getCollectDealRecordList`,
      {
        params,
      }
    );
  },
  /** 藏品点赞、收藏 */
  addProductOpe(data) {
    return axios.post(`${baseUrl.dev}/mall/collection/addProductOpe`, data);
  },
  /** 藏品点赞、收藏列表 */
  myCollectionOpeList(params) {
    return axios.get(`${baseUrl.dev}/mall/collection/myCollectionOpeList`, {
      params,
    });
  },
  /** 我的NFT列表 */
  myNftList(params) {
    return axios.get(`${baseUrl.dev}/mall/collection/myNftList`, {
      params,
    });
  },
  /** 下单购买藏品 */
  buyCollect(data) {
    return axios.post(`${baseUrl.dev}/mall/collection/buyCollect`, data);
  },
  /** 藏品交易列表 */
  getCollectionTradeList(params) {
    return axios.get(`${baseUrl.dev}/mall/collection/getCollectionTradeList`, {
      params,
    });
  },
  /** 币种配置信息 */
  getCoinConfig(params) {
    return axios.get(
      `${baseUrl.dev}/mall/collection/getCoinConfig/` + params.coinType
    );
  },
  /** 藏品author信息 */
  getCollectAuthorInfo(params) {
    return axios.get(
      `${baseUrl.dev}/mall/collection/getCollectAuthorInfo/` + params.authorName
    );
  },
  /** 查询藏品订单支付信息 */
  checkProductPayInfo(params) {
    return axios.get(`${baseUrl.dev}/mall/collection/checkProductPayInfo`, {
      params,
    });
  },
  /** PC端获取FaceId */
  getFaceIdForPc(params) {
    return axios.get(`${baseUrl.dev}/mall/approve/getFaceId`, {
      params,
    });
  },
  /** PC端人脸识别 */
  startPcFace(params) {
    return axios.get(
      `${baseUrl.dev}/mall/approve/startPcFace?userId=` +
        params.userId +
        "&nonce=" +
        params.nonce +
        "&orderNo=" +
        params.orderNo +
        "&faceId=" +
        params.faceId
    );
  },
  /** PC端人脸识别回调 */
  faceAuthentication(data) {
    return axios.post(`${baseUrl.dev}/mall/approve/faceAuthentication`, data);
  },
  /** H5端获取FaceId */
  getFaceIdForH5(params) {
    return axios.get(`${baseUrl.dev}/mall/approve/getFaceIdForH5`, {
      params,
    });
  },
  /** H5端人脸识别 */
  startH5Face(params) {
    return axios.get(
      `${baseUrl.dev}/mall/approve/startH5Face?userId=` +
        params.userId +
        "&nonce=" +
        params.nonce +
        "&orderNo=" +
        params.orderNo +
        "&faceId=" +
        params.faceId
    );
  },
  /** H5端人脸识别回调 */
  faceAuthenticationForH5Person(data) {
    return axios.post(
      `${baseUrl.dev}/mall/approve/faceAuthenticationForH5Person`,
      data
    );
  },
  /**更新用户实名状态(临时使用) */
  updateUserAuthStatus(data) {
    return axios.post(`${baseUrl.dev}/mall/user/updateUserAuthStatus`, data);
  },
  /** 获取银行配置列表 */
  getBankConfigList(params) {
    return axios.get(`${baseUrl.dev}/mall/common/getBankConfigList`, {
      params,
    });
  },
  /** 获取GasPrice */
  getGasPrice() {
    return axios.get(`${baseUrl.dev}/mall/common/getGasPrice`, {});
  },
  /** 获取轮播图 */
  getBannerList() {
    return axios.get(`${baseUrl.dev}/mall/common/listBanner`, {});
  },
  /** 获得合约配置 */
  getContractConfig() {
    return axios.get(`${baseUrl.dev}/mall/token/contract/config`, {});
  },
  /** 获得TokenId */
  getSignBuTokenId(data) {
    return axios.get(`${baseUrl.dev}/mall/token/${data.address}/nonce`, {});
  },
  /** 获取最新的订单数据 */
  bestOffers(data) {
    return axios.post(`${baseUrl.dev}/mall/token/items/bestOffers`, data);
  },
  /** Fix price */
  fixprice(data) {
    return axios.post(`${baseUrl.dev}/mall/token/fixprice`, data);
  },
  /** buyFee接口 */
  buyerFeesign(data) {
    return axios.post(`${baseUrl.dev}/mall/token/buyerFeesign`, data);
  },
  /** Alipay支付 */
  startAliPay(params) {
    return axios.get(
      `${baseUrl.dev}/mall/aliPay/toPay?type=` +
        params.type +
        `&address=` +
        params.address +
        `&money=` +
        params.money +
        `&from=` +
        params.from +
        `&productId=` +
        params.productId +
        `&totalAmount=` +
        params.totalAmount +
        `&contractAddress=` +
        params.contractAddress +
        `&invitorAddress=` +
        params.invitorAddress +
        `&fee=` +
        params.fee
    );
  },
  /** WeChat Pay */
  startWxPay(params) {
    return axios.get(
      `${baseUrl.dev}/mall/txPay/toPay?type=` +
        params.type +
        `&address=` +
        params.address +
        `&subject=` +
        params.subject +
        `&money=` +
        params.money +
        `&from=` +
        params.from +
        `&productId=` +
        params.productId +
        `&totalAmount=` +
        params.totalAmount +
        `&contractAddress=` +
        params.contractAddress +
        `&invitorAddress=` +
        params.invitorAddress +
        `&fee=` +
        params.fee
    );
  },
  /** 查询订单详情 */
  getChargeByOrderId(params) {
    return axios.get(
      `${baseUrl.dev}/mall/user/getChargeByOrderId/` + params.orderId
    );
  },
  /** 查询订单和下单详情 */
  getChargeAndOrderByOrderId(params) {
    return axios.get(
      `${baseUrl.dev}/mall/user/getChargeAndOrderByOrderId/` + params.orderId
    );
  },
  /** 更新藏品状态 */
  updateCollectionStatus(data) {
    return axios.post(
      `${baseUrl.dev}/mall/collection/updateCollectionStatus?productId=` +
        data.productId +
        `&status=` +
        data.status
    );
  },
  /** 查询用户交易记录 */
  getMoneyHistory(params) {
    return axios.get(
      `${baseUrl.dev}/mall/user/getMoneyHistory?certificationId=` +
        params.certificationId
    );
  },
  /** 查询用户待支付订单 */
  getMyToPay(params) {
    return axios.get(
      `${baseUrl.dev}/mall/user/getMyToPay?certificationId=` +
        params.certificationId
    );
  },
  /** 查询用户待支付订单 */
  toPay(data) {
    return axios.post(`${baseUrl.dev}/mall/bopPay/toPay`, data);
  },
  /** 查询订单支付状态 */
  getTradePayStatus(params) {
    return axios.get(
      `${baseUrl.dev}/mall/bopPay/getTradePayStatus?tradeId=` +
        params.tradeId +
        `&tradeHash=` +
        params.tradeHash
    );
  },
  /** 查询用户service fee */
  checkAddressFee(params) {
    return axios.get(
      `${baseUrl.dev}/mall/user/checkAddressFee/` +
        params.address +
        `/` +
        params.fee
    );
  },
  /** 用户设置银行卡 */
  addCertificationBank(data) {
    return axios.post(`${baseUrl.dev}/mall/user/addCertificationBank`, data);
  },
  /** 用户更新银行卡 */
  updateCertificationBank(data) {
    return axios.post(`${baseUrl.dev}/mall/user/updateCertificationBank`, data);
  },
  /** 获取用户银行卡信息 */
  getCertificationBank(params) {
    return axios.get(
      `${baseUrl.dev}/mall/user/getCertificationBank/` + params.certificationId
    );
  },
  /** 查询首页banner card 数据 */
  getCardData() {
    return axios.get(`${baseUrl.dev}/mall/common/statProductInfo`)
  },
  /** 模糊查询艺术家列表 */
  getCollectArtist(params) {
    return axios.get(`${baseUrl.dev}/mall/collection/getCollectArtist?artName=` + params.artName);
  },
  /** 模糊查询艺术家列表 */
  collectionU(params) {
    return axios.get(`${baseUrl.dev}/mall/collection/upload/` + params.ipfsHash);
  }
};

export default API;
