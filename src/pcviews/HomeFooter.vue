<template>
  <footer class="footer pcPage">
    <div class="footerContent">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            Artlinx is a pioneering digital art gallery<br> helping artists and clients enhance the value<br>  of the digital arts.
          </div>
          <el-row :gutter="5">
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <img
                    src="@/assets/images/telegrapm.png"
                    @click="open('https://t.me/artlinx')"
                    class="cImg"
                />
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <img
                    src="@/assets/images/twitter.png"
                    @click="open('https://twitter.com/ArtlinxDigita')"
                    class="cImg"
                />
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <img
                    src="@/assets/images/discord.png"
                    @click="open('https://discord.gg/arqwPVTqmY')"
                    class="cImg"
                />
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <img
                    src="@/assets/images/youtobe.png"
                    @click="open('https://www.youtube.com/channel/UCqm8nrIIlKQcty_0VrDhnDw')"
                    class="cImg"
                />
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8"><div class="grid-content bg-purple">
          <p class="ft18 mb10">
            CATEGORIES
          </p>
          <p class="hand" @click="handleTermsUse()">Terms of Use</p>
          <p class="hand" @click="handlePrivacyPolicy()">Artlinx Privacy Policy</p>
          <p class="hand" @click="handleAbout()">About us</p>
          <p class="hand" @click="handleCoporate()">Coporate Social Responsibility</p>
<!--          <p class="hand" @click="handleHome('https://www.artlinxdigital.com/')">Home</p>-->

        </div>
        </el-col>
        <el-col :span="8"><div class="grid-content bg-purple">
          <p class="mb10">Contact Us:</p>
          <p>Asia Biz-research Limited</p>
          <p>Room 1450, 14/F, Eton Tower, 8 Hysan Avenue, Causeway Bay, HongKong</p>
          <p>Tel: +852 8197 2552</p>
          <p>Email: artlinx@artlinx.hk</p>
        </div></el-col>
      </el-row>

    </div>
    <div class="footer-copy">Copyright © 2022 | All Rights Reserved.<br><br>Artlinx is registered Trade Mark of Artlinx Limited (Uk), this site is an affiliate of www.artlinxdigital.com.</div>

    <!--    <span class="copyright">@2022</span>-->
    <!--    <span class="name">南通鸿链信息科技有限公司</span>-->
    <!--    <span>版权所有</span>-->
    <!--    <span class="icp">苏ICP备2021030168号 </span>-->
    <!--    <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32068202000275" class="province"> 苏公网安备32068202000275号</a>-->
    <!--    <span class="edi">EDI许可编号</span>-->
    <!--    <span>苏B2-20211019</span>-->
    <TermsUse
        :visible.sync="termsUseVisible"
        title="USER AGREEMENT"
        @close="termsUseVisible = false"
    />
    <About
        :visible.sync="aboutVisible"
        title="ABOUT US"
        @close="aboutVisible = false"
    />
    <Coporate
        :visible.sync="coporateVisible"
        title="ARTLINX CORPORATE SOCIAL RESPONSIBILITY"
        @close="coporateVisible = false"
    />
    <PrivacyPolicy
        :visible.sync="privacyPolicyVisible"
        title="ARTLINX PRIVACY POLICY"
        @close="privacyPolicyVisible = false"
    />

  </footer>
</template>

<script>
import About from "./HomeFooter/About";
import TermsUse from "./HomeFooter/TermsUse";
import PrivacyOfUse from "./HomeFooter/PrivacyOfUse";
import Coporate from "./HomeFooter/Coporate";
import {isUK} from "@/utils/rules";
import PrivacyPolicy from '@/components/SellContractProtocol';

export default {
  components: {
    About,
    PrivacyOfUse,
    TermsUse,
    Coporate,
    PrivacyPolicy,
  },
  data() {
    return {
      aboutVisible: false,
      termsUseVisible: false,
      privacyUseVisible: false,
      coporateVisible: false,
      privacyPolicyVisible: false
    };
  },
  methods: {
    open(url) {
      window.open(url);
    },
    handleAbout() {
      this.aboutVisible = true;
    },
    handleHome(url) {
      window.open(url);
    },
    handlePrivacyPolicy() {
      this.privacyPolicyVisible = true;
    },
    handleTermsUse() {
      this.termsUseVisible = true;
    },
    handleCoporate() {
      this.coporateVisible = true;
    },
    handleprivacyUse() {
      this.privacyUseVisible = true;
    },
  },
};
</script>

<style lang="less" scoped>
.footer {
  width: 100%;
  //height: 2.9rem;
  background: #2a513f;
  span {
    font-size: 0.14rem;
    color: #767885;
  }

  .icp {
    margin: 0 0.1rem 0 0.1rem;
  }

  .edi {
    margin: 0 0 0 0.1rem;
  }

  .province {
    font-size: 0.14rem;
    color: #767885;

    &:hover {
      color: #fff;
    }
  }

  .footer-copy {
    width: 100%;
    border-top: 1px solid #666;
    color: #ffffff;
    padding: 20px 0;
    line-height: 1;
    text-align: center;
    letter-spacing: 1px;
    font-weight: normal;
  }

  .hand {
    cursor: pointer;
  }

  .tcenter {
    text-align: center;
  }

  .ft14 {
    font-size: 14px;
  }

  .ft16 {
    font-size: 16px;
  }

  .ft18 {
    font-size: 18px;
  }

  .ft20 {
    font-size: 20px;
  }

  .mt10 {
    margin-top: 10px;
  }

  .mt20 {
    margin-top: 20px;
  }

  .mb10 {
    margin-bottom: 10px;
  }

  .mb20 {
    margin-bottom: 20px;
  }

  .lh15em {
    line-height: 1.5em;
  }

  .lh20em {
    line-height: 2em;
  }
}

.footer.pcPage {
  .footer-copy {
    width: 100%;
    border-top: 1px solid #666;
    color: #ffffff;
    padding: 20px 0;
    line-height: 1;
    text-align: center;
    letter-spacing: 1px;
    font-weight: normal;
  }

  @media screen and (max-width: 800px) {
    display: none;
  }

  .footerContent {
    padding: 40px 0;
    width: 100%;
    color: #ffffff;
    line-height: 2em;
    @media screen and (min-width: 800px) {
      width: 1186px;
      margin: 0 auto;

    }
  }
}

.cImg {
  margin-top: 0.2rem;
  cursor: pointer;
  height: 0.3rem;
}

.loginContainer {
  .footer {
    width: 100%;
    //height: 2.9rem;
    background: #2a513f;
    position: fixed;
    bottom: 0px;
    span {
      font-size: 0.14rem;
      color: #767885;
    }

    .icp {
      margin: 0 0.1rem 0 0.1rem;
    }

    .edi {
      margin: 0 0 0 0.1rem;
    }

    .province {
      font-size: 0.14rem;
      color: #767885;

      &:hover {
        color: #fff;
      }
    }

    .footer-copy {
      width: 100%;
      border-top: 1px solid #666;
      color: #000000;
      padding: 20px 0;
      line-height: 1;
      text-align: center;
      letter-spacing: 1px;
      font-weight: normal;
    }

    .hand {
      cursor: pointer;
    }

    .tcenter {
      text-align: center;
    }

    .ft14 {
      font-size: 14px;
    }

    .ft16 {
      font-size: 16px;
    }

    .ft18 {
      font-size: 18px;
    }

    .ft20 {
      font-size: 20px;
    }

    .mt10 {
      margin-top: 10px;
    }

    .mt20 {
      margin-top: 20px;
    }

    .mb10 {
      margin-bottom: 10px;
    }

    .mb20 {
      margin-bottom: 20px;
    }

    .lh15em {
      line-height: 1.5em;
    }

    .lh20em {
      line-height: 2em;
    }
  }

  .footer.pcPage {
    .footer-copy {
      width: 100%;
      border-top: 1px solid #666;
      color: #ffffff;
      padding: 20px 0;
      line-height: 1;
      text-align: center;
      letter-spacing: 1px;
      font-weight: normal;
    }

    @media screen and (max-width: 800px) {
      display: none;
    }

    .footerContent {
      padding: 40px 0;
      width: 100%;
      color: #ffffff;
      line-height: 2em;
      @media screen and (min-width: 800px) {
        width: 1186px;
        margin: 0 auto;
      }
    }
  }
}
</style>
