<template>
  <el-dialog
    title="Create favorites"
    :visible="visible"
    :width="clientWidth > 800 ? '560px' : '91.5%'"
    :before-close="handleClose"
    custom-class="customCreateFolderDialog"
  >
    <div class="createContent">
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="125px"
        label-position="top"
        class="ruleForm"
      >
        <el-form-item
          label="Upload the cover"
          prop="ParentCollectionFile"
        >
          <el-upload
            action="#"
            accept="*"
            v-model="form.ParentCollectionFile"
            :on-change="handleChangeParent"
            list-type="picture-card"
            :auto-upload="false"
            :file-list="fileList"
            :limit="1"
            class="createUpload"
            :class="{hideUpload: fileList.length >= 1}"
          >
            <div slot="default" class="uploadIcon">
              <i class="icImg"></i>
              <span>Click on the upload</span>
            </div>
            <div slot="file" slot-scope="{ file }">
              <img
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
        <el-form-item label="title" prop="title">
          <el-input
            v-model="form.title"
            placeholder="Please enter a favorites title"
          ></el-input>
        </el-form-item>
        <el-form-item label="symbol" prop="symbol">
          <el-input v-model="form.symbol" placeholder="Please enter symbol"></el-input>
        </el-form-item>
        <el-form-item label="intro" prop="desc">
          <el-input
            type="textarea"
            :rows="4"
            v-model="form.desc"
            placeholder="Please enter a description of favorites (optional)"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="fixBtn">
        <el-button
          type="primary"
          class="btnCompelete"
          @click="handleCreateFavorite"
          :loading="loading"
          >creation</el-button
        >
        <el-button class="btnCancel" @click="handleClose">cancel</el-button>
      </div>
      <TipModal
        :visible.sync="tipVisible"
        title="Tips"
        :content="content"
        cancelTxt="cancel"
        :confirmTxt="confirmTxt"
        @close="tipVisible = false"
        @ok="toCharge"
      />
    </div>
  </el-dialog>
</template>

<script>
import MPageHeader from "@/components/MPageHeader";
import TipModal from "@/components/TipModal";
import byteCodeSing from "@/contract/byteCodeSing.json";
import abiSing from "@/contract/abiSing.json";
import ipfsAPI from 'ipfs-api'
import API from '@/service/index';

const node = ipfsAPI({host: 'artlinx.hk', port: '/ipfs', protocol: 'https'})
const EtheremTx = require('ethereumjs-tx');
let Web3 = require("web3");
//测试数据
let web3 = new Web3(new Web3.providers.HttpProvider(API.getNetWorkUrl()));

export default {
  props: {
    visible: Boolean,
  },
  components: {
    MPageHeader,
    TipModal,
  },
  data() {
    return {
      form: {
        ParentCollectionFile: null,
        ParentCollectionFileBuffer: null,
        cover: '',
        title: '',
        symbol: '',
        desc: '',
      },
      rules: {
        ParentCollectionFile: [{required: true, message: 'Please upload cover', trigger: 'blur'}],
        title: [{required: true, message: 'Please enter a favorites title', trigger: 'blur'}],
        symbol: [{required: true, message: 'Please enter symbol', trigger: 'blur'}],
      },
      tipVisible: false,
      imageUrlParent: '',
      loading: false,
      loadingText: 'loading',
      fileList: [],
      NftTokenAddress: {},
      ipfsAddress: '',
      content: '',
      fee: 0,
      clientWidth: 750,
      confirmTxt: '',
      isToCharge: false,
      isRemindFee: false,
    }
  },
  mounted() {this.getCurrentUser();
    this.$nextTick(() => {
      this.clientWidth = document.documentElement.clientWidth;
    });
    API.getContractConfig().then(result => {
      console.log("getContractConfigResult: " + JSON.stringify(result));
      if (result.code !== 200) {
        this.common.notification(this, result.msg, 3);
        return;
      } else {
        this.NftTokenAddress = result.data;
      }
    })
  },

  methods: {
    handleClose () {
      this.$refs.ruleForm.resetFields();
      this.$emit('update:visible', false);
    },
    // Go to prepaid phone
    toCharge() {
      if (this.isToCharge) {
        this.$router.push({
          path: '/funding'
        });
      } else {
        this.tipVisible = false;
        this.handleCreateFavorite();
      }
    },
    handleRemove(file) {
      console.log(file);
      this.fileList.splice(0, 1);
    },
    handleCreateFavorite() {
      //这里Create favorites
      let privateKey = this.getPrivateKey();
      let walletAddress = window.localStorage.getItem("walletAddress");
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.deploy(privateKey, walletAddress);
        } else {
          return false;
        }
      })
      // this.tipVisible = true;
    },
    async deploy(privateKeys, walletAddress) {
      const that = this;
      that.loading = true;
      that.loadingText = 'creating';
      node.add(Buffer.from(this.form.ParentCollectionFileBuffer)).then(async ret => {
        const response = ret[0];
        // console.log(response);
        this.ipfsAddress = response.path;
        // eslint-disable-next-line no-new-object
        const data = new Object();
        data.name = this.form.title;
        data.description = this.form.desc;
        data.image = `${response.hash}`;
        node.add(Buffer.from(JSON.stringify(data), 'utf-8')).then(async response => {
          const metadata = response[0];
          // console.log(metadata);
          // 在这里部署新的合约
          const collection = new web3.eth.Contract(abiSing);
          let privateKey = Buffer.from(privateKeys, "hex");
          let sendCode = collection.deploy({
            data: byteCodeSing.object,
            //TODO 最后的域名参数需要再确认
            arguments: [that.form.title, that.form.symbol, that.NftTokenAddress.singSignAddress, `${metadata.hash}`, `https://artlinx.hk/`]
          }).encodeABI();
          await that.ethGas("", sendCode, 0, walletAddress, this.deploy_cb, privateKey);
        })
      })
    },
    async ethGas(contractAddress, data, value, walletAddress, cb, privateKey) {
      await web3.eth.estimateGas(
          {
            data: data,
            value: value,
            from: walletAddress
          },
          (error, gas) => {
            // console.log("error\n:" + error);
            // console.log("gas:\n" + gas);
            var fee = web3.utils.fromWei((gas * 2381000000000).toString(), 'ether');
            // console.log("service fee：" + fee);
            this.fee = parseFloat(fee).toFixed(2);
            if(error != undefined) {
              if(error.toString().indexOf("insufficient funds") != -1) {
                this.loading = false;
                this.content = 'It costs about chain handling fee ' + this.fee +'RMB Around, the balance is not enough to create a favorites folder, please go to recharge.';
                this.confirmTxt = 'Go to prepaid phone';
                this.isToCharge = true;
                this.tipVisible = true;
                return;
              }
            } else {
              if (!this.isRemindFee) {
                this.loading = false;
                this.content = 'It costs about chain handling fee ' + this.fee + 'RMB So, do you want to continue?';
                this.confirmTxt = 'continue';
                this.isToCharge = false;
                this.tipVisible = true;
                this.isRemindFee = true;
                return;
              }
            }
            web3.eth.getTransactionCount(walletAddress, web3.eth.defaultBlock.latest).then(nonce => {
              let rawTx = { //4700000 //2000000000
                nonce: web3.utils.toHex(nonce),
                gasLimit: web3.utils.toHex(gas),
                gasPrice: web3.utils.toHex(2381000000000),
                value: 0x00,
                data: data,
                chainId: API.getChainId()
              }
              let tx = new EtheremTx(rawTx)
              tx.sign(privateKey)
              let serializedTx = tx.serialize();
              let serializedTxStr = "0x" + serializedTx.toString("hex")
              web3.eth.sendSignedTransaction(serializedTxStr, cb)
            })
          }
      );
    },
    deploy_cb(err, hash) {
      console.log(err);
      console.log(hash);
      if(err != undefined) {
        if(err.toString().indexOf("insufficient funds") != -1) {
          this.loading = false;
          this.content = 'It costs about chain handling fee ' + this.fee +'RMBAround, the balance is not enough to create a favorites folder, please go to recharge.';
          this.confirmTxt = 'Go to prepaid phone';
          this.isToCharge = true;
          this.tipVisible = true;
          return;
        }
      } else {
        if (!this.isRemindFee) {
          this.loading = false;
          this.content = 'It costs about chain handling fee ' + this.fee + 'About RMB, do you want to continue?';
          this.confirmTxt = 'continue';
          this.isToCharge = false;
          this.tipVisible = true;
          this.isRemindFee = true;
          return;
        }
      }
      let that = this;
      that.loadingText = 'The transaction is awaiting confirmation';
      let recpt;
      that.time = window.setInterval(async () => {
        console.log(await web3.eth.getTransactionReceipt(hash))
        recpt = await web3.eth.getTransactionReceipt(hash)
        if (recpt) {
          if (recpt.status) {
            window.clearInterval(that.time);
            window.clearInterval(that.time);
            console.log('Transaction is confirmed!')
            that.loadingText = 'Transaction confirmed';
            that.loading = false
            console.log(recpt.contractAddress); // 将合约地址获取到并且加入到本地缓存
            //调用后台接口, 新增收藏夹
            API.addCollectionDir({
              certificationId: window.localStorage.getItem("loginId"),
              tokenName: this.form.title,
              tokenSymbol: this.form.symbol,
              tokenDesc: this.form.desc,
              tokenImage: this.ipfsAddress,
              contractAddress: recpt.contractAddress,
              tokenType: 1,
              tradeHash: hash,
              fee: this.fee
             }).then(result => {
               if (result.code !== 200) {
                  this.common.notification(this, "Failed to create favorites", 3);
                  return;
                }
                this.common.notification(this, "The favorites folder is created successfully", 1);
                sessionStorage.setItem("dirContractAddress", recpt.contractAddress);
                // 跳转铸造页面
                this.$emit('onCreateSuccess');
                this.handleClose();
            });

          } else {
            that.loadingText = 'Transaction Failure';
            that.loading = false;
          }
          window.clearInterval(that.time)
        }
      }, 2000)
    },
    handleChangeParent(file, fileList) {
      this.fileList = fileList;
      const that = this;
      this.form.ParentCollectionFile = file.raw;
      this.imageUrlParent = URL.createObjectURL(file.raw);
      const reader = new FileReader();
      reader.readAsArrayBuffer(file.raw);
      // eslint-disable-next-line no-unused-vars
      reader.onload = function (e) {
        that.form.ParentCollectionFileBuffer = reader.result;
      }
    },
  }
}
</script>

<style lang="less" scoped>
.favorites {
  @media screen and (min-width: 800px) {
    min-height: 100vh;
    padding-top: 0.98rem;
    background: #F7F7F7;
  }
  @media screen and (max-width: 800px) {
    padding-top: 0.85rem;
  }
  /deep/ .el-form-item {
    margin-bottom: 0.44rem;
  }

  /deep/ .el-input__inner {
    height: 0.48rem;
    line-height: 0.48rem;
    padding-left: 0.28rem;
    border-radius: 0;
  }

  /deep/ .el-form-item__label {
    font-size: 0.16rem;
    color: #666;
  }

  /deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 0.83rem;
    height: 0.83rem;
  }

  /deep/ .el-upload--picture-card {
    width: 42%;
    border: 1px dotted #999;
    height:auto;
    line-height: 1;
    background: #f9f9f9;
    border-radius: 0.18rem;

    i {
      margin-top: 35%;
      font-size: 0.29rem;
      color: #bfbfbf;
    }
  }
}

.ruleForm {
  @media screen and (min-width: 800px) {

  }
  @media screen and (max-width: 800px) {

  }
}

.iconRemove {
  position: absolute;
  font-size: 0.24rem;
  color: #fd4a4a;
  right: 0.02rem;
  top: 0.02rem;
}

.avatar {
  width: 100%;
  height: auto;
  max-width: 100%;
  display: block;
}

.uploadIcon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 0.22rem;
  color: #999;
}

.fixBtn {
  padding: 0.32rem 0.24rem 0;
  text-align: center;
  @media screen and (max-width: 800px) {
    padding-top: 0;
  }
  .btnCompelete {
    margin-right: 0.16rem;
  }
  .btnCancel, .btnCompelete {
    width: 96px;
    border-radius: 18px;
  }
  .btnCancel {
    background-color: #C6C6C6;
    color: #494949;
    border-color: #C6C6C6;
  }
}

.createUpload {
  .icImg {
    width: 0.32rem;
    height: 0.32rem;
  }
 /deep/ .el-upload--picture-card {
   width: 42%;
   border: 1px dotted #999;
   height:auto;
   line-height: 1;
   background: #f9f9f9;
   border-radius: 0.18rem;
   span {
     color: #fff;
   }
    i {
      margin-top: 0.3rem;
      margin-bottom: 0.16rem;
      color: #000000;
    }
 }
}

.icImg {
  width: 0.4rem;
  height: 0.4rem;
  display: block;
  margin: 0 auto;
  background: url('../../assets/images/newTheme/ic_img.png') no-repeat center;
  background-size: contain;
}

.hideUpload {
  /deep/ .el-upload--picture-card {
    display: none;
  }
}
</style>

<style lang="less">
.customCreateFolderDialog {
  background-color: #ffffff;
  filter: blur(0) brightness(100%);
  backdrop-filter: blur(0.18rem);
  .el-dialog__header {
    border-bottom: 1px solid #464656;
  }
  .el-dialog__title {
    font-size: 0.16rem;
    color: #000000;
  }
}
</style>
