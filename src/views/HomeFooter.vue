<template>
  <footer class="footer mPage">
    <p class="grid-content bg-purple">
      Artlinx is a pioneering digital art gallery<br> helping artists and clients enhance the value<br>  of the digital arts.
    </p><br>
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
              @click="
              open('https://www.youtube.com/channel/UCqm8nrIIlKQcty_0VrDhnDw')
            "
              class="cImg"
          />
        </div>
      </el-col>
    </el-row>
    <p class="ft18 fb">
      CATEGORIES
    </p>
    <p class="hand" @click="tremsOfUseVisible = true">Terms of Use</p>
    <p class="hand" @click="privacyPolicyVisible = true">Artlinx Privacy Policy</p>
    <p class="hand" @click="aboutUsVisible = true">About us</p>
    <p class="hand" @click="coporateVisible = true">Coporate Social Responsibility</p>
<!--    <p class="hand" @click="handleHome('https://www.artlinxdigital.com/')">Home</p><br>-->

    <p class="fb">Contact Us</p>
    <p>Asia Biz-research Limited</p>
    <p>Room 1450, 14/F, Eton Tower, 8 Hysan Avenue, Causeway Bay, HongKong</p>
    <p>Tel: +852 8197 2552</p>
    <p>Email: artlinx@artlinx.hk</p><br>
    <TremsOfUse :visible.sync="tremsOfUseVisible" />
    <PrivacyPolicy :visible.sync="privacyPolicyVisible" />
    <Coporate :visible.sync="coporateVisible" />
    <AboutUs :visible.sync="aboutUsVisible" />
  </footer>
</template>

<script>
import PrivacyPolicy from '@/components/SellContractProtocol';

import TremsOfUse from "@/components/TremsOfUse";
import PrivacyOfUse from "@/components/PrivacyOfUse";
import Coporate from "@/components/Coporate";
import AboutUs from "@/components/AboutUs";
import {isUK} from "@/utils/rules";
export default {
  components: {
    TremsOfUse,
    PrivacyOfUse,
    Coporate,
    AboutUs,
    PrivacyPolicy
  },
  data() {
    return {
      privacyOfUseVisible: false,
      tremsOfUseVisible: false,
      coporateVisible: false,
      aboutUsVisible: false,
      privacyPolicyVisible: false
    };
  },
  methods: {
    open(url) {
      window.open(url);
    },
    handleHome(url) {
      window.open(url);
    }
  },
};
</script>

<style lang="less" scoped>
.footer {
  width: 92%;
  //height: 0.72rem;
  background: #2a513f;
  margin: 0 auto;
  border-top: 1px solid #e4e7ed;
  padding: 4%;
  color: #ffffff;

  .cImg {
    margin-top: 0.2rem;
    cursor: pointer;
    height: 0.3rem;
  }

  p {
    line-height: 2em;
  }

  .fb {
    font-weight: bold;
  }

  span,
  .icp {
    font-size: 0.14rem;
    color: #767885;
  }

  .copyright {
    margin-bottom: 0.08rem;
  }

  .edi {
    margin-top: 0.08rem;
  }
}

.footer.mPage {
  @media screen and (min-width: 800px) {
    display: none;
  }
}


.loginContainer {
  .footer {
    width: 100%;
    //height: 2.9rem;
    background: #2a513f;
    //position: fixed;
    //bottom: 0px;
  }
}
</style>
