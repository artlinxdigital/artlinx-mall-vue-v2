<template>
  <div class="favorites" v-loading.fullscreen.lock='loading' :element-loading-text='loadingText'>
    <MPageHeader title="Create favorites"/>
    <div class="pcPage">
      <PcPageHeader />
    </div>
    <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        :label-width="clientWidth < 800 ? 'auto' : '125px'"
        :label-position="clientWidth < 800 ? 'top' : 'left'"
        class="ruleForm"
    >
    <div class="pcPageTitle">Create favorites</div>
      <el-form-item :label="clientWidth < 800 ? '' : 'Upload the cover'" prop="ParentCollectionFile">
        <el-upload action="#"
                   accept="*"
                   v-model="form.ParentCollectionFile"
                   :on-change="handleChangeParent"
                   list-type="picture-card"
                   :auto-upload="false"
                   :file-list="fileList"
                   :limit="1"
        >
          <div slot="default" class="uploadIcon">
            <i class="el-icon-plus"></i>
            <span>Upload the cover</span>
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
            <i class="el-icon-error iconRemove" @click="handleRemove(file)"></i>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="title" prop="title">
        <el-input v-model="form.title" placeholder="Please enter favorites title"></el-input>
      </el-form-item>
      <el-form-item label="
symbol" prop="symbol">
        <el-input v-model="form.symbol" placeholder="Please enter symbol"></el-input>
      </el-form-item>
      <el-form-item label="introduction" prop="desc">
        <el-input type="textarea" :rows="4" v-model="form.desc" placeholder="Please enter a description of favorites (optional)"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="fixBtn">
          <el-button type="primary" class="btnCompelete" @click="handleCreateFavorite">Create favorites</el-button>
        </div>
      </el-form-item>
    </el-form>
    <MTipModal
        :visible.sync="tipVisible"
        title="Tips"
        :content="content"
        cancelTxt="cancel"
        :confirmTxt="confirmTxt"
        @close="tipVisible = false"
        @ok="toCharge"
    />
  </div>
</template>

<script>
import MPageHeader from "@/components/MPageHeader";
import MTipModal from "@/components/MTipModal";
import byteCodeSing from "@/contract/byteCodeSing.json";
import abiSing from "@/contract/abiSing.json";
// import NftTokenAddress from "@/contract/NftTokenAddress.json";
import ipfsAPI from 'ipfs-api'
import API from '@/service/index';
import PcPageHeader from "@/components/PcPageHeader";

const node = ipfsAPI({host: 'artlinx.hk', port: '/ipfs', protocol: 'https'})
const EtheremTx = require('ethereumjs-tx');
let Web3 = require("web3");
//测试数据
let web3 = new Web3(new Web3.providers.HttpProvider(API.getNetWorkUrl()));

export default {
  components: {
    MPageHeader,
    MTipModal,
    PcPageHeader
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
        ParentCollectionFile: [{required: true, message: 'please  Upload the cover', trigger: 'blur'}],
        title: [{required: true, message: 'Please enter favorites title', trigger: 'blur'}],
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
        console.log(response);
        this.ipfsAddress = response.path;
        // eslint-disable-next-line no-new-object
        const data = new Object();
        data.name = this.form.title;
        data.description = this.form.desc;
        data.image = `${response.hash}`;
        node.add(Buffer.from(JSON.stringify(data), 'utf-8')).then(async response => {
          const metadata = response[0];
          console.log(metadata);
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
            console.log("error\n:" + error);
            console.log("gas:\n" + gas);
            var fee = web3.utils.fromWei((gas * 2381000000000).toString(), 'ether');
            console.log("service fee：" + fee);
            this.fee = parseFloat(fee).toFixed(2);
            if(error != undefined) {
              if(error.toString().indexOf("insufficient funds") != -1) {
                this.loading = false;
                this.content = 'It takes about a chain service fee ' + this.fee +'RMB Left or right, insufficient balance, unableCreate favorites, 请Go to prepaid phone。';
                this.confirmTxt = 'Go to prepaid phone';
                this.isToCharge = true;
                this.tipVisible = true;
                return;
              }
            } else {
              if (!this.isRemindFee) {
                this.loading = false;
                this.content = 'It takes about a chain service fee ' + this.fee + 'RMB About, whether to continue?';
                this.confirmTxt = 'go on';
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
          this.content = 'It takes about a chain service fee ' + this.fee +' Left or right, insufficient balance, unableCreate favorites, 请Go to prepaid phone。';
          this.confirmTxt = 'Go to prepaid phone';
          this.isToCharge = true;
          this.tipVisible = true;
          return;
        }
      } else {
        if (!this.isRemindFee) {
          this.loading = false;
          this.content = 'It takes about a chain service fee ' + this.fee + ' About, whether to continue?';
          this.confirmTxt = 'go on';
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
                this.$router.push({
                  path: '/casting'
                });
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
    padding-top: 0.88rem;
    background: #F7F7F7;
  }
  @media screen and (max-width: 800px) {
    padding-top: 0.85rem;
  }

  /deep/ .el-input__inner {
    height: 0.88rem;
    line-height: 0.88rem;
    padding-left: 0.28rem;
    border-radius: 0;
  }

  /deep/ .el-form-item__label {
    padding: 0;
    margin-bottom: 0.19rem;
    line-height: 0.3rem;
    font-size: 0.28rem;
    color: #000000;
  }

  /deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 1.48rem;
    height: 1.48rem;
  }

  /deep/ .el-upload--picture-card {
    width: 42%;
    border: 1px dotted #999;
    height:auto;
    line-height: 1;
    background: #f9f9f9;
    border-radius: 0.18rem;

    i {
      margin-top: 26%;
      margin-bottom: 0.12rem;
      font-size: 0.36rem;
      color: #bfbfbf;
    }
  }
}

.ruleForm {
  @media screen and (min-width: 800px) {
    max-width: 70%;
    margin: 0 auto;
    padding: 0.44rem 1.95rem;
    background: #fff;
  }
  @media screen and (max-width: 800px) {
    padding: 0.34rem 0.25rem 1.5rem;
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
  position: fixed;
  padding: 0.2rem 0.24rem 0.54rem;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9;
  background: #fff;
  @media screen and (min-width: 800px) {
    position: relative;
  }
  .btnCompelete {
    width: 100%;
  }
}
.pcPageTitle {
  @media screen and (max-width: 800px) {
    display: none;
  }
  margin-bottom: 0.47rem;
  font-size: 18px;
  color: #1a1a1a;
}
</style>
