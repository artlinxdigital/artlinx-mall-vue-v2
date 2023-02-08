<template>
  <el-dialog
    title="Coporate Social Responsibility"
    :visible="visible"
    width="70%"
    :before-close="handleClose"
    fullscreen
  >
    <p>
      - JOIN US AS ONE OF THE LEADERS OF SUSTAINABLE VALUE CREATION IN DIGITAL ART AND ASSET MANAGEMENT
      <br> <br>
      The Founders of Artlinx International all hold a strong believe that corporate social responsibility (CSR) is the right business model that help a company be socially accountable-to itself, its stakeholders, and the public.<br><br>
      Artlinx commits ourselves by practicing corporate social responsibility, and be conscious of the kind of impact Artlinx is having on all aspects of society, including economic, social and environment.<br><br>

      From the second of the founding of Artlinx, we commit so and our first programme is to work with internationally recognised Charitable orgnization to share a slice of our profit.<br><br>

      Details will be updated very soon!
    </p>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false);
    }
  }
}
</script>

<style lang="less" scoped>
h2 {
  margin: 0.2rem 0;
  font-size: 0.18rem;
  font-weight: bold;
}
h3 {
  margin: 0.2rem 0;
  font-size: 0.16rem;
  font-weight: bold;
}
p {
  font-size: 0.14rem;
  line-height: 0.25rem;
  @media screen and (max-width: 800px) {
    line-height: 0.4rem;
  }
}
ul {
  padding-left: 0.2rem;
  @media screen and (max-width: 800px) {
    padding-left: 0.28rem;
  }
  li {
    font-size: 0.14rem;
    line-height: 0.4rem;
  }
}
</style>
