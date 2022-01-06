<template>
  <div class="plan-fund">
    <div class="top-box">
      <span>单位：万元</span>
    </div>
    <table class="pdf-show-table tc">
      <tr>
        <td style="width: 200px">科目名称</td>
        <td>预算总金额</td>
        <td v-if="planInfo.mainUnit">{{ planInfo.mainUnit }}</td>
        <td v-if="planInfo.otherUnit">{{ planInfo.otherUnit }}</td>
        <td>备注</td>
      </tr>
      <tr v-for="(item, index) in newPlanFunds" :key="index">
        <td>
          <h4>{{item.fundName}}</h4>
        </td>
        <td>
          <div v-if="!judgeShowInput(index)">
            <span>{{ item.totalAmount }}</span>
          </div>
          <div v-if="judgeShowInput(index)">
            <m-input
              v-model="item.totalAmount"
              placeholder=""
              @blur="submitPlanFundsForm(item)"
              inputType="wanYuan"
            />
          </div>
        </td>
        <td v-if="planInfo.mainUnit">
          <div v-if="!judgeShowInput(index)">
            <span>{{ item.unit1 }}</span>
          </div>
          <div v-if="judgeShowInput(index)">
            <m-input
              v-model="item.unit1"
              placeholder=""
              @blur="submitPlanFundsForm(item)"
              inputType="wanYuan"
            />
          </div>
        </td>
        <td v-if="planInfo.otherUnit">
          <div v-if="!judgeShowInput(index)">
            <span>{{ item.unit2 }}</span>
          </div>
          <div v-if="judgeShowInput(index)">
            <m-input
              v-model="item.unit2"
              placeholder=""
              @blur="submitPlanFundsForm(item)"
              inputType="wanYuan"
            />
          </div>
        </td>
        <td>
          <el-input
            type="textarea"
            :rows="2"
            v-model="item.remark"
            placeholder=""
            @blur="submitPlanFundsForm(item)"
            show-word-limit
            maxlength="200" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { updateEstablishmentPlan } from "@/api/pro/proApprovalInfo";
import {getProPlanFund} from "@/api/pro/proPlanFund";

export default {
  name: "planFund",
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      planFundsForm: {
        updateType: 0
      },
      newPlanFunds: [],
      planInfo: {}
    }
  },
  computed: {
    userName() {
      return this.$store.state.user.name
    }
  },
  watch: {
    value (newVal) {
      // newVal.planFunds.forEach(item => {
      //   if (item.totalAmount === 0) {
      //     item.totalAmount = ''
      //   }
      //   if (item.unit1 === 0) {
      //     item.unit1 = ''
      //   }
      //   if (item.unit2 === 0) {
      //     item.unit2 = ''
      //   }
      // })
      this.newPlanFunds = newVal.planFunds;
      this.planInfo = newVal.planInfo;
    }
  },
  methods: {
    //刷新经费计算
    refreshPlanFund() {
      const id = this.planInfo.infoId
      getProPlanFund(id).then(({data}) => {
        // data.forEach(item => {
        //   if (item.totalAmount === 0) {
        //     item.totalAmount = ''
        //   }
        //   if (item.unit1 === 0) {
        //     item.unit1 = ''
        //   }
        //   if (item.unit2 === 0) {
        //     item.unit2 = ''
        //   }
        // })
        this.newPlanFunds = data
      })
    },
    //判断当前是否显示输入框
    judgeShowInput(index) {
      const indexList = [0, 1, 5, 8, 12, 17, 22]
      return !(indexList.indexOf(index) !== -1);
    },
    submitPlanFundsForm(item) {
      let planFundsTem = []
      // let itemTem = {}
      // Object.keys(item).forEach(subItem => {
      //   itemTem[subItem] = item[subItem]
      // })
      // if (itemTem.totalAmount === '') {
      //   itemTem.totalAmount = 0
      // }
      // if (itemTem.unit1 === '') {
      //   itemTem.unit1 = 0
      // }
      // if (itemTem.unit2 === '') {
      //   itemTem.unit2 = 0
      // }
      planFundsTem.push(item)
      this.planFundsForm.planFunds =JSON.stringify(planFundsTem)
      updateEstablishmentPlan(this.planFundsForm).then(()=>{
        this.refreshPlanFund()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.plan-fund {
  width: 100%;
  display: flex;
  flex-direction: column;
  .top-box {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
  .pdf-show-table {
    border-collapse: separate;
    table-layout: fixed;
    width: 100%;
    & > tr:first-child {
      position: sticky;
      top: 0;
      z-index:1;
      background-color: #f8f8f9;
    }
    & > tr:last-child {
      position: sticky;
      bottom: 0;
      z-index:1;
      background-color: #f8f8f9;
    }
  }
}
</style>
