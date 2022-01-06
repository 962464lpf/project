<template>
  <div class="plan-contact-way">
    <div class="fill-box">
      <div v-for="(item, index) in currPlanUnits" :key="index">
        <h3 v-if="index === 0 || index === 1 || index === 3">{{backTitle(index)}}</h3>
        <el-row :gutter="40">
          <el-col :span="18">
            <el-form-item :label="backTitleIndex(index)">
              <el-input
                v-model="item.unitName"
                placeholder="请填写单位名称"
                maxlength="20"
                @blur="submitPlanUnitsForm(item)"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="9">
            <el-form-item label="联系人:">
              <el-input
                v-model="item.linkman"
                placeholder="请填写联系人"
                @blur="submitPlanUnitsForm(item)"
                maxlength="10"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="9">
            <el-form-item label="固定电话:">
              <m-input
                v-model="item.tel"
                placeholder="请填写固定电话"
                @blur="submitPlanUnitsForm(item)"
                input-type="telephone"/>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="电子邮件:">
              <m-input
                v-model="item.email"
                placeholder="请填写电子邮件"
                @blur="submitPlanUnitsForm(item)"
                input-type="email"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="9">
            <el-form-item label="移动电话:">
              <m-input
                v-model="item.mobile"
                placeholder="请填写移动电话"
                @blur="submitPlanUnitsForm(item)"
                input-type="phone"/>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="邮编:">
              <m-input
                v-model="item.postCode"
                placeholder="请填写邮编"
                @blur="submitPlanUnitsForm(item)"
                input-type="postcode"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="9">
            <el-form-item label="传真:">
              <m-input
                v-model="item.fax"
                placeholder="请填写传真"
                @blur="submitPlanUnitsForm(item)"
                input-type="fax"/>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="邮寄地址:">
              <el-input
                v-model="item.address"
                placeholder="请填写邮寄地址"
                @blur="submitPlanUnitsForm(item)"
                maxlength="20"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider></el-divider>
      </div>
    </div>
  </div>
</template>

<script>
import { updateEstablishmentPlan } from "@/api/pro/proApprovalInfo";

export default {
  name: "planContactWay",
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
      planUnitsForm: {
        updateType: 0
      },
      planUnits: [],
      currPlanUnits: []
    }
  },
  computed: {
    userName() {
      return this.$store.state.user.name
    }
  },
  watch: {
    value (newVal) {
      this.currPlanUnits = newVal.planUnits
    }
  },
  methods: {
    submitPlanUnitsForm(item) {
      let planUnitsTem = []
      planUnitsTem.push(item)
      this.planUnitsForm.planUnits = JSON.stringify(planUnitsTem)
      updateEstablishmentPlan(this.planUnitsForm).then(()=>{

      })
    },
    backTitle(index) {
      if (index === 0) {
        return '(一)项目管理单位'
      } else if (index === 1) {
        return '(二) 项目承担单位'
      } else {
        return '(三) 项目出资单位'
      }
    },
    backTitleIndex(index) {
      if (index === 0) {
        return '1.单位名称:'
      } else if (index === 1) {
        return '1.单位名称:'
      } else if (index === 2) {
        return '2.单位名称:'
      }else if (index === 3) {
        return '1.单位名称:'
      }else if (index === 4) {
        return '2.单位名称:'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.plan-contact-way {
  width: 100%;
  display: flex;
  flex-direction: column;
  .fill-box {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
