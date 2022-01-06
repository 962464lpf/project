<template>
  <div class="plan-contribution">
    <span>
      项目经费总额为人民币（大写）
    </span>
    <m-input
      v-model="planInfo.totalAmountUpcase"
      placeholder=""
      style="width: 30%"
      :disabled="true"
      @blur="submitPlanInfoForm"
      input-type="capitalCN"
      maxlength="30" />
    <span>（ ￥</span>
    <m-input
      v-model="planInfo.totalAmount"
      placeholder=""
      @blur="submitPlanInfoForm"
      inputType="yuan"/>
    <span>）</span>
  </div>
</template>

<script>
import {updateEstablishmentPlan} from "@/api/pro/proApprovalInfo";
import {numberParseChina} from "@/utils/sailing";

export default {
  name: "planContribution",
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
      planInfoForm: {
        updateType: 0
      },
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
      this.planInfo = newVal.planInfo
      this.planInfo.totalAmountUpcase = numberParseChina(this.planInfo.totalAmount)
    }
  },
  methods: {
    submitPlanInfoForm() {
      this.planInfo.totalAmountUpcase = numberParseChina(this.planInfo.totalAmount)
      this.planInfoForm.planInfo = this.planInfo
      updateEstablishmentPlan(this.planInfoForm).then(()=>{

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.plan-contribution {
  width: 100%;
  display: flex;
  align-items: center;
  span:nth-last-of-type(1) {
    margin-left: 5px;
  }
}
</style>
