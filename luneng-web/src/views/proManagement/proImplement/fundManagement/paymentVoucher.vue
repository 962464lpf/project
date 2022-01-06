<template>
  <div class="payment-voucher">
    <div class="header">
<!--      <div class="back-btn">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          icon="el-icon-back"-->
<!--          style="width: 80px;"-->
<!--          @click="handleBack">返回-->
<!--        </el-button>-->
<!--      </div>-->
      <div class="pro-name">
        <span v-if="contractName">{{ contractName }}</span>
      </div>
    </div>
    <div class="main">
      <voucher-list :contract-id="contractId"/>
    </div>
  </div>
</template>

<script>
import voucherList from './childCom/voucherList'

export default {
  name: "paymentVoucher",
  data() {
    return {
      contractId: null
    }
  },
  created() {
    if (this.$route.query.id) {
      this.contractId = this.$route.query.id * 1
    }
  },
  computed: {
    contractName() {
      return this.$route.query.contractName
    }
  },
  components: {
    voucherList
  },
  // methods: {
  //   handleBack() {
  //     this.closeView('/proManagement/proImplement/proRecruit/recruitFile', '/proManagement/proImplement/proRecruit', 0)
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.payment-voucher {
  width: 100%;
  padding: 20px 30px 50px 30px;
  display: flex;
  flex-direction: column;
  .header {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    .pro-name {
      width: 100%;
      margin-bottom: 20px;
      span {
        font-size: 24px;
        font-weight: bold;
      }
    }
  }
  .main {
    width: 100%;
  }
}
</style>
