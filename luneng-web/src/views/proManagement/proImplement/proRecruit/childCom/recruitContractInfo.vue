<template>
  <div class="recruit-contract-info">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <div class="headline-text">
        <div>
          <span>合同信息</span>
        </div>
        <div v-if="curIndex > 0 && (!form.id)">
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete">删除合同
          </el-button>
        </div>
      </div>
      <div>
        <el-row :gutter="40">
          <el-col :span="10">
            <el-form-item label="合同编码" prop="contractCode">
              <el-input
                :disabled="form.isContractUpdate == 0 ? false : true"
                v-model="form.contractCode"
                placeholder="请填写合同编码"
                maxlength="20"
                @blur="backFillContractInfo"
                />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="合同名称" prop="contractName">
              <el-input
                :disabled="form.isContractUpdate == 0 ? false : true"
                v-model="form.contractName"
                placeholder="请填写合同名称"
                maxlength="50"
                @blur="backFillContractInfo"
                />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="10">
            <el-form-item label="合同总金额" prop="contractAmount">
              <m-input
                :disabled="form.isContractUpdate == 0 ? false : true"
                v-model="form.contractAmount"
                placeholder="请填写合同总金额"
                @blur="backFillContractInfo"
                inputType="yuan">
              </m-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="合同签订日期" prop="contractDate">
              <el-date-picker
                :disabled="form.isContractUpdate == 0 ? false : true"
                v-model="form.contractDate"
                style="width: 100%"
                type="date"

                @change="backFillContractInfo"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="10">
            <el-form-item label="供应商编码" prop="supplierCode">
              <el-input
                :disabled="form.isContractUpdate == 0 ? false : true"
                v-model="form.supplierCode"
                placeholder="请填写供应商编码"
                maxlength="10"
                @blur="backFillContractInfo"
                />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input
                :disabled="form.isContractUpdate == 0 ? false : true"
                v-model="form.supplierName"
                placeholder="请填写供应商名称"
                maxlength="30"
                @blur="backFillContractInfo"
                />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="10">
            <el-form-item label="税率" prop="taxRate">
              <m-input
                :disabled="form.isContractUpdate == 0 ? false : true"
                v-model="form.taxRate"
                placeholder="请填写税率"
                @blur="backFillContractInfo"
                inputType="percentage2"/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="净价" prop="taxPrice">
              <m-input
                :disabled="form.isContractUpdate == 0 ? false : true"
                v-model="form.taxPrice"
                placeholder="请填写净价"
                @blur="backFillContractInfo"
                inputType="yuan"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="10">
            <el-form-item label="税价" prop="netPrice">
              <m-input
                :disabled="form.isContractUpdate == 0 ? false : true"
                v-model="form.netPrice"
                placeholder="请填写税价"
                @blur="backFillContractInfo"
                inputType="yuan"/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="ERP项目编码" prop="erpCode">
              <el-input
                :disabled="form.isContractUpdate == 0 ? false : true"
                v-model="form.erpCode"
                placeholder="请填写ERP项目编码"
                maxlength="20"
                @blur="backFillContractInfo"
                />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="10">
            <el-form-item label="采购申请编码" prop="purchaseApplicationCode">
              <el-input
                :disabled="form.isContractUpdate == 0 ? false : true"
                v-model="form.purchaseApplicationCode"
                placeholder="请填写采购申请编码"
                maxlength="20"
                @blur="backFillContractInfo"
                />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="采购订单编码" prop="purchaseOrderCode">
              <el-input
                :disabled="form.isContractUpdate == 0 ? false : true"
                v-model="form.purchaseOrderCode"
                placeholder="请填写采购订单编码"
                maxlength="20"
                @blur="backFillContractInfo"
                />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col>
            <el-form-item label="合同文件" prop="contractFilePaths">
              <div v-if="form.isContractUpdate == 0">
                <upload
                  :size="50"
                  :limit="100"
                  @change="backFillContractInfo"
                  v-model="form.contractFilePaths"/>
              </div>
              <div v-else>
                <upload
                  :edit="false"
                  v-model="form.contractFilePaths"/>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="headline-text">支付信息</div>
      <div v-for="(mItem, mIndex) in form.moneyPlans" :key="mIndex">
        <el-row :gutter="40">
          <el-col :span="7">
            <span class="red-star">*</span>
            <el-form-item :label="'第' + (mIndex + 1) + '笔款项占比'" prop="moneyRate">
              <m-input
                v-model="mItem.moneyRate"
                placeholder=""
                :disabled="!form.contractAmount || (form.isContractUpdate == 0 ? false : true)"
                @blur="handleMoneyRate(form.moneyPlans, mItem, mIndex)"
                inputType="percentage"/>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item :label="'第' + (mIndex + 1) + '笔款项'" prop="moneyAmount">
              <m-input
                v-model="mItem.moneyAmount"
                placeholder=""
                :disabled="true"
                inputType="yuan"/>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="预计付款时间" prop="payTime">
              <el-date-picker
                :disabled="form.isContractUpdate == 0 ? false : true"
                v-model="mItem.payTime"
                style="width: 100%"
                type="date"
                @change="backFillContractInfo"

                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <div v-if="mIndex > 0 && form.isContractUpdate == 0">
            <el-button
              type="danger"
              icon="el-icon-delete"

              @click="handleDeleteMoney(form.moneyPlans, mIndex)">删除
            </el-button>
          </div>
        </el-row>
      </div>
      <div class="add-money-info">
        <el-button :disabled="form.isContractUpdate == 0 ? false : true" type="primary"  @click="addMoneyInfo">添加款项计划</el-button>
      </div>
    </el-form>
    <el-divider></el-divider>
  </div>
</template>

<script>

let MoneyPlansItem = function (options2) {
  this.infoId = options2.infoId
  this.moneyAmount = options2.moneyAmount
  this.moneyRate = options2.moneyRate
  this.payTime = options2.payTime
  this.sort = options2.sort
}

export default {
  name: "recruitContractInfo",
  props: {
    infoId: {
      type: Number,
      default: null
    },
    curIndex: {
      type: Number,
      default: null
    },
    proContractInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    options2: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      rules: {
        contractCode: [
          {required: true, message: "内容不能为空", trigger: "blur"}
        ],
        contractName: [
          {required: true, message: "内容不能为空", trigger: "blur"}
        ],
        contractAmount: [
          {required: true, message: "内容不能为空", trigger: "blur"}
        ],
        supplierCode: [
          {required: true, message: "内容不能为空", trigger: "blur"}
        ],
        supplierName: [
          {required: true, message: "内容不能为空", trigger: "blur"}
        ],
        taxRate: [
          {required: true, message: "内容不能为空", trigger: "blur"}
        ],
        taxPrice: [
          {required: true, message: "内容不能为空", trigger: "blur"}
        ],
        netPrice: [
          {required: true, message: "内容不能为空", trigger: "blur"}
        ],
        erpCode: [
          {required: true, message: "内容不能为空", trigger: "blur"}
        ],
        purchaseApplicationCode: [
          {required: true, message: "内容不能为空", trigger: "blur"}
        ],
        purchaseOrderCode: [
          {required: true, message: "内容不能为空", trigger: "blur"}
        ],
        contractFilePaths: [
          {required: true, message: "内容不能为空", trigger: "blur"}
        ]
      }
    }
  },
  computed: {
    form() {
      return this.proContractInfo
    }
  },
  methods: {
    //添加款项计划
    addMoneyInfo() {
      const length = this.form.moneyPlans.length
      this.options2.infoId = this.infoId
      this.options2.sort = this.form.moneyPlans[length - 1].sort + 1
      this.form.moneyPlans.push(new MoneyPlansItem(this.options2))
    },
    backFillContractInfo() {
      this.$emit('formItem', this.form)
    },
    handleMoneyRate(moneyPlans, mItem, mIndex) {
      let moneyRateNums = moneyPlans.reduce((prev, cur) => {
        return prev + (cur.moneyRate * 1)
      }, 0)
      if (moneyRateNums <= 100) {
        mItem.moneyAmount = this.form.contractAmount * (mItem.moneyRate / 100)
        mItem.moneyAmount = mItem.moneyAmount.toFixed(2)
        this.$emit('formItem', this.form)
      } else {
        this.msgError('款项占比总和不得大于100')
        moneyPlans[mIndex].moneyRate = ''
      }
    },
    /** 删除按钮操作 */
    handleDelete() {
      this.$confirm('是否确认删除?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$emit('deleteContract', this.curIndex)
      })
    },
    handleDeleteMoney(moneyPlans, index) {
      this.$confirm('是否确认删除?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        moneyPlans.splice(index, 1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.recruit-contract-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  .headline-text {
    font-size: 17px;
    margin-bottom: 20px;
    position: relative;
    display: flex;
    justify-content: space-between;
  }
  .add-money-info {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .red-star {
    font-size: 14px;
    color: red;
    position: absolute;
    left: 28px;
    top: 11px;
  }
}
</style>
