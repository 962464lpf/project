<template>
  <div class="app-container">
    <div class="header">
      <div class="pro-name">
        <span v-if="projectName">{{projectName}}</span>
      </div>
    </div>
    <div class="main">
      <recruit-contract-info
        v-for="(item, index) in recruitContractInfoList"
        :key="index"
        :pro-contract-info="item"
        :options2="options2"
        :infoId="id"
        :cur-index="index"
        @deleteContract="deleteContract"
        @formItem="getFormItem"/>
      <div class="add-btn">
        <el-button
          type="primary"
          @click="addContractInfoForm">新增合同信息
        </el-button>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button  @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import recruitContractInfo from './childCom/recruitContractInfo'
import {addBatchContractInfo, getContractInfo} from "@/api/pro/proRecruit";
import {saveProOptLog} from "@/api/pro/proApprovalInfo";

let ProContractInfo = function (options) {
  this.infoId = options.infoId
  this.contractCode = options.contractCode
  this.contractName = options.contractName
  this.contractAmount = options.contractAmount
  this.contractDate = options.contractDate
  this.supplierCode = options.supplierCode
  this.supplierName = options.supplierName
  this.taxRate = options.taxRate
  this.taxPrice = options.taxPrice
  this.netPrice = options.netPrice
  this.erpCode = options.erpCode
  this.purchaseApplicationCode = options.purchaseApplicationCode
  this.purchaseOrderCode = options.purchaseOrderCode
  this.contractFilePaths = options.contractFilePaths
  this.moneyPlans = options.moneyPlans
  this.sort = options.sort
  this.isContractUpdate = options.isContractUpdate
}
let ProContractInfo2 = function (options1) {
  this.id = options1.id
  this.infoId = options1.infoId
  this.contractCode = options1.contractCode
  this.contractName = options1.contractName
  this.contractAmount = options1.contractAmount
  this.contractDate = options1.contractDate
  this.supplierCode = options1.supplierCode
  this.supplierName = options1.supplierName
  this.taxRate = options1.taxRate
  this.taxPrice = options1.taxPrice
  this.netPrice = options1.netPrice
  this.erpCode = options1.erpCode
  this.purchaseApplicationCode = options1.purchaseApplicationCode
  this.purchaseOrderCode = options1.purchaseOrderCode
  this.contractFilePaths = options1.contractFilePaths
  this.moneyPlans = options1.moneyPlans
  this.isContractUpdate = options1.isContractUpdate
  this.sort = options1.sort
}
let MoneyPlansItem = function (options2) {
  this.infoId = options2.infoId
  this.moneyAmount = options2.moneyAmount
  this.moneyRate = options2.moneyRate
  this.payTime = options2.payTime
  this.sort = options2.sort
}

let MoneyPlansItem2 = function (options3) {
  this.id = options3.id
  this.contractId = options3.contractId
  this.infoId = options3.infoId
  this.moneyAmount = options3.moneyAmount
  this.moneyRate = options3.moneyRate
  this.payTime = options3.payTime
  this.sort = options3.sort
}
export default {
  name: "addRecruitInfo",
  data() {
    return {
      options: {
        infoId: null,
        contractCode: null,
        contractName: null,
        contractAmount: null,
        contractDate: null,
        supplierCode: null,
        supplierName: null,
        taxRate: null,
        taxPrice: null,
        netPrice: null,
        erpCode: null,
        purchaseApplicationCode: null,
        purchaseOrderCode: null,
        contractFilePaths: null,
        moneyPlans: [],
        isContractUpdate: 0,
        sort: null
      },
      options2: {
        infoId: null,
        moneyAmount: null,
        moneyRate: null,
        payTime: null,
        sort: null
      },
      recruitContractInfoList: [],
      id: null,
      proDetailFlag: null,
      tabActiveName: null
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id * 1
      this.getContractInfoDetail(this.id)
    }
    if (this.$route.query.proDetailFlag) {
      this.proDetailFlag = this.$route.query.proDetailFlag
    }
    if (this.$route.query.tabActiveName) {
      this.tabActiveName = this.$route.query.tabActiveName
    }
  },
  computed: {
    userName() {
      return this.$store.state.user.name
    },
    projectName() {
      return this.$route.query.projectName
    }
  },
  components: {
    recruitContractInfo
  },
  methods: {
    getContractInfoDetail(id) {
      getContractInfo(id).then(({data}) => {
        if (data && data.length === 0) {
          this.options.infoId = this.id
          this.options.sort = 1
          this.options2.infoId = this.id
          this.options2.sort = 1
          const recruitContractInfo = new ProContractInfo(this.options)
          const moneyPlansItem = new MoneyPlansItem(this.options2)
          recruitContractInfo.moneyPlans.push(moneyPlansItem)
          this.recruitContractInfoList = []
          this.recruitContractInfoList.push(recruitContractInfo)
        } else {
          data.forEach(item => {
            let recruitContractInfo2 = new ProContractInfo2(item)
            let moneyPlansTem = []
            item.moneyPlans.forEach(subItem => {
              moneyPlansTem.push(new MoneyPlansItem2(subItem))
            })
            recruitContractInfo2.moneyPlans = moneyPlansTem
            this.recruitContractInfoList.push(recruitContractInfo2)
          })
          console.log(this.recruitContractInfoList)
        }
      })
    },
    //获取单个合同所填信息
    getFormItem(value) {
      this.recruitContractInfoList.forEach(item => {
        if (item.sort === value.sort) {
          item = value
        }
      })
    },
    //提交表单
    submitForm() {
      const arrListTem = this.validateNull(this.recruitContractInfoList)
      const length = arrListTem.length
      if (length === 0) {
        const objTem = {
          proContracts: JSON.stringify(this.recruitContractInfoList)
        }
        addBatchContractInfo(objTem).then(() => {
          this.msgSuccess('提交成功')
          if (this.proDetailFlag) {
            this.closeView("/proManagement/proImplement/proRecruit/addRecruitInfo", "/proManagement/proImplement/proEstablish/proMainTask?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 200)
          } else {
            this.closeView("/proManagement/proImplement/proRecruit/addRecruitInfo", "/proManagement/proImplement/proRecruit", 200)
          }
          saveProOptLog({
            infoId: this.id,
            operName: '编辑了合同信息',
            operUserName: this.userName,
            operType: 3
          }).then(() => {})
        })
      } else {
        this.msgError('不能有必填的字段为空')
      }
    },
    //取消返回
    cancel() {
      if (this.proDetailFlag) {
        this.closeView("/proManagement/proImplement/proRecruit/addRecruitInfo", "/proManagement/proImplement/proEstablish/proMainTask?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 0)
      } else {
        this.closeView("/proManagement/proImplement/proRecruit/addRecruitInfo", "/proManagement/proImplement/proRecruit", 0)
      }
    },
    //增加新的合同
    addContractInfoForm() {
      const length = this.recruitContractInfoList.length
      this.options.infoId = this.id
      this.options.sort = this.recruitContractInfoList[length - 1].sort + 1
      this.options2.infoId = this.id
      this.options2.sort = 1
      const recruitContractInfo = new ProContractInfo(this.options)
      const moneyPlansItem = new MoneyPlansItem(this.options2)
      recruitContractInfo.moneyPlans = []
      recruitContractInfo.moneyPlans.push(moneyPlansItem)
      this.recruitContractInfoList.push(recruitContractInfo)
    },
    //删除从第二个开始的新增合同
    deleteContract(index) {
      this.recruitContractInfoList.splice(index, 1)
    },
    //验证空值
    validateNull(arrList) {
      let arrTem = []
      arrList.forEach(item => {
        Object.keys(item).forEach(subItem => {
          if (subItem !== 'contractDate' && subItem !== 'moneyPlans') {
            if (item[subItem] === null || item[subItem] === '') {
              arrTem.push(subItem)
            }
          }
        })
        item.moneyPlans.forEach(item2 => {
          Object.keys(item2).forEach(subItem2 => {
            if (subItem2 !== 'payTime') {
              if (item2[subItem2] === null || item2[subItem2] === '') {
                arrTem.push(subItem2)
              }
            }
          })
        })
      })
      return arrTem
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 20px 30px 130px 30px;
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
    display: flex;
    flex-direction: column;
    .add-btn {
      width: 20%;
      align-self: center;
    }
  }
  .footer {
    width: 100%;
    padding: 20px 0 30px 0;
    position: fixed;
    bottom: 30px;
    background-color: #fff;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
  }
}
</style>
