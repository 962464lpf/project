<template>
  <div class="recruit-contract-info-detail">
    <div class="pro-name">
      <span v-if="projectName">{{projectName}}</span>
    </div>
    <el-form ref="form" :model="form" label-width="120px">
      <div class="headline-text">合同信息</div>
      <div>
        <table class="pdf-show-table tc">
          <tr>
            <td style="min-width: 120px">合同编码</td>
            <td style="min-width: 120px"><span>{{form.contractCode}}</span></td>
            <td style="min-width: 120px">合同名称</td>
            <td style="min-width: 120px"><span>{{form.contractName}}</span></td>
          </tr>
          <tr>
            <td>合同总金额(元)</td>
            <td><span>{{form.contractAmount}}</span></td>
            <td>合同签订日期</td>
            <td><span>{{parseTime(form.contractDate, '{y}-{m}-{d}')}}</span></td>
          </tr>
          <tr>
            <td>供应商编码</td>
            <td><span>{{form.supplierCode}}</span></td>
            <td>供应商名称</td>
            <td><span>{{form.supplierName}}</span></td>
          </tr>
          <tr>
            <td>税率</td>
            <td><span>{{form.taxRate}}</span></td>
            <td>净价(元)</td>
            <td><span>{{form.taxPrice}}</span></td>
          </tr>
          <tr>
            <td>税价(元)</td>
            <td><span>{{form.netPrice}}</span></td>
            <td>ERP项目编码</td>
            <td><span>{{form.erpCode}}</span></td>
          </tr>
          <tr>
            <td>采购申请编码</td>
            <td><span>{{form.purchaseApplicationCode}}</span></td>
            <td>采购订单编码</td>
            <td><span>{{form.purchaseOrderCode}}</span></td>
          </tr>
          <tr>
            <td>合同文件</td>
            <td colspan="3"><upload v-model="form.contractFilePaths" :edit="false" /></td>
          </tr>
        </table>
      </div>
      <div class="headline-text">支付信息</div>
        <table class="pdf-show-table tc">
          <tr v-for="(mItem, mIndex) in form.moneyPlans" :key="mIndex">
            <td style="min-width: 120px">{{ '第' + (mIndex + 1) + '笔款项占比(%)' }}</td>
            <td style="min-width: 120px"><span>{{mItem.moneyRate}}</span></td>
            <td style="min-width: 120px">{{'第' + (mIndex + 1) + '笔款项(元)'}}</td>
            <td style="min-width: 120px"><span>{{mItem.moneyAmount}}</span></td>
            <td style="min-width: 120px">预计付款时间</td>
            <td style="min-width: 120px"><span>{{parseTime(mItem.payTime, '{y}-{m}-{d}')}}</span></td>
          </tr>
        </table>
    </el-form>
    <el-divider></el-divider>
  </div>
</template>

<script>
export default {
  name: "recruitContractInfoDetail",
  props: {
    proContractInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {

    }
  },
  computed: {
    form() {
      return this.proContractInfo
    },
    projectName() {
      return this.$route.query.projectName
    }
  }
}
</script>

<style lang="scss" scoped>
.recruit-contract-info-detail {
  width: 100%;
  display: flex;
  flex-direction: column;
  .pro-name {
    width: 100%;
    margin-bottom: 20px;
    span {
      font-size: 24px;
      font-weight: bold;
    }
  }
  .headline-text {
    width: 100%;
    display: flex;
    font-size: 18px;
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .pdf-show-table {
    table-layout: fixed;
    font-size: 18px;
    color: #000;
    margin: 0;
    tr td:nth-child(2n+1) {
      text-align: center;
      color: #666;
      background-color: #f8f8f9;
    }
  }
}
</style>
