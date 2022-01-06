<template>
  <div class="pro-recruit">
    <el-table
      ref="table"
      :data="proRecruitList">
      <el-table-column
        label="月度"
        align="center"
        width="145"
        prop="biddingMonth">
        <template slot-scope="scope">
          <div @dblclick="getBiddingMonth(scope.row)">
            <div v-if="scope.row.showBiddingMonth && scope.row.biddingMonth">
              {{scope.row.biddingMonth}}
            </div>
            <div v-else>
              <el-date-picker
                v-model="scope.row.biddingMonth"
                style="width: 140px"
                type="month"
                :disabled="scope.row.proStatus == 8"
                value-format="yyyy-MM"
                @change="submitBiddingMonth(scope.row)"
                placeholder="选择月">
              </el-date-picker>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="采购方式"
        align="center"
        prop="biddingType">
        <template slot-scope="scope">
          <div @dblclick="getBiddingType(scope.row)">
            <div v-if="scope.row.showBiddingType && scope.row.biddingType">
              {{ selectDictLabel(proRecruitTypeOptions, scope.row.biddingType) }}
            </div>
            <div v-else>
              <el-select
                v-model="scope.row.biddingType"
                placeholder="请选择采购方式"
                clearable
                :disabled="scope.row.proStatus == 8"
                @change="submitBiddingType(scope.row)"
                style="width: 140px">
                <el-option
                  v-for="item in proRecruitTypeOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"/>
              </el-select>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="预算金额(万元)"
        align="center"
        width="180"
        prop="budgetAmount">
        <template slot-scope="scope">
          <div @dblclick="getBudgetAmount(scope.row)">
            <div v-if="scope.row.showBudgetAmount && scope.row.budgetAmount">
              {{scope.row.budgetAmount}}
            </div>
            <div v-else>
              <m-input
                :disabled="scope.row.proStatus == 8"
                size-type="small"
                v-model="scope.row.budgetAmount"
                @blur="submitBudgetAmount(scope.row)"
                inputType="wanYuan"/>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="实际金额(万元)"
        align="center"
        width="180"
        prop="actualAmount">
        <template slot-scope="scope">
          <div @dblclick="getActualAmount(scope.row)">
            <div v-if="scope.row.showActualAmount && scope.row.actualAmount">
              {{scope.row.actualAmount}}
            </div>
            <div v-else>
              <m-input
                :disabled="scope.row.proStatus == 8"
                size-type="small"
                v-model="scope.row.actualAmount"
                @blur="submitActualAmount(scope.row)"
                inputType="wanYuan"/>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="招标会时间"
        align="center"
        width="180"
        prop="biddingTime">
        <template slot-scope="scope">
          <div @dblclick="getBiddingTime(scope.row)">
            <div v-if="scope.row.showBiddingTime && scope.row.biddingTime">
              {{scope.row.biddingTime}}
            </div>
            <div v-else>
              <el-date-picker
                v-model="scope.row.biddingTime"
                style="width: 160px"
                type="date"
                :disabled="scope.row.proStatus == 8"
                value-format="yyyy-MM-dd"
                @change="submitBiddingTime(scope.row)"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="定标会时间"
        width="180"
        align="center"
        prop="calibrationTime">
        <template slot-scope="scope">
          <div @dblclick="getCalibrationTime(scope.row)">
            <div v-if="scope.row.showCalibrationTime && scope.row.calibrationTime">
              {{scope.row.calibrationTime}}
            </div>
            <div v-else>
              <el-date-picker
                v-model="scope.row.calibrationTime"
                style="width: 160px"
                type="date"
                :disabled="scope.row.proStatus == 8"
                value-format="yyyy-MM-dd"
                @change="submitCalibrationTime(scope.row)"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <table class="pdf-show-table tc">
      <tr>
        <td class="td-one">合同信息</td>
        <td>
          <div>
            <recruit-contract-info-detail
              v-for="(item, index) in recruitContractInfoList"
              :key="index"
              :pro-contract-info="item"/>
            <el-button
              type="primary"
              :disabled="formInfoTem.proStatus == 8"
              v-hasPermi="['pro:proContract:add']"
              @click="addRecruitInfo">补充合同信息
            </el-button>
          </div>
<!--          <div v-else>-->
<!--            <el-button-->
<!--              type="primary"-->
<!--              icon="el-icon-plus"-->
<!--              -->
<!--              v-hasPermi="['pro:proContract:add']"-->
<!--              @click="addRecruitInfo">补充合同信息-->
<!--            </el-button>-->
<!--          </div>-->
        </td>
      </tr>
    </table>
    <recruit-file-table @refreshbs="refreshHeight" :form="this.formInfo"/>
  </div>
</template>

<script>
import {getContractInfo, updateProRecruitInfo} from "@/api/pro/proRecruit";
import recruitFileTable from '@/views/proManagement/proImplement/proRecruit/childCom/recruitFileTable'
import recruitContractInfoDetail from '@/views/proManagement/proImplement/proRecruit/childCom/recruitContractInfoDetail'

export default {
  name: "ProRecruit",
  props: {
    formInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    proDetailFlag: {
      type: String,
      default: ''
    },
    tabActiveName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      proRecruitList: [],
      proRecruitTypeOptions: [],
      recruitContractInfoList: []
    }
  },
  created() {
    //获取字典数据
    this.getDicts("pro_recruit_type").then(response => {
      this.proRecruitTypeOptions = response.data;
    });
  },
  computed: {
    formInfoTem() {
      return this.formInfo
    }
  },
  watch: {
    formInfoTem: {
      handler(newValue) {
        if (newValue && newValue.id) {
          this.getContractInfoDetail(newValue.id)
          this.proRecruitList = []
          this.proRecruitList.push(newValue)
          console.log(this.proRecruitList)
        }
      },
      immediate:true
    }
  },
  components: {
    recruitFileTable,
    recruitContractInfoDetail
  },
  methods: {
    //获取招采合同信息
    getContractInfoDetail(id) {
      getContractInfo(id).then(({data}) => {
        this.recruitContractInfoList = data
        this.$emit('refreshbs')
      })
    },
    //输入月度
    getBiddingMonth(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        if (row.planStatus == 3 && row.proStatus >= 3) {
          row.showBiddingMonth = false
        } else {
          this.msgError('当前项目未通过审核或没进行到当前阶段，不可操作')
        }
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    submitBiddingMonth(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        if (row.planStatus == 3 && row.proStatus >= 3) {
          updateProRecruitInfo({
            id: row.id,
            biddingMonth: row.biddingMonth,
            type: '3'
          }).then(() => {
            this.$emit('refreshList')
          })
        } else {
          this.msgError('当前项目未通过审核或没进行到当前阶段，不可操作')
          row.biddingMonth = ''
        }
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //选择采购方式
    getBiddingType(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        if (row.planStatus == 3 && row.proStatus >= 3) {
          row.showBiddingType = false
        } else {
          this.msgError('当前项目未通过审核或没进行到当前阶段，不可操作')
        }
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    submitBiddingType(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        if (row.planStatus == 3 && row.proStatus >= 3) {
          updateProRecruitInfo({
            id: row.id,
            biddingType: row.biddingType,
            type:'4'
          }).then(() => {
            this.$emit('refreshList')
          })
        } else {
          this.msgError('当前项目未通过审核或没进行到当前阶段，不可操作')
          row.biddingType = ''
        }
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //输入预算金额
    getBudgetAmount(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        if (row.planStatus == 3 && row.proStatus >= 3) {
          row.showBudgetAmount = false
        } else {
          this.msgError('当前项目未通过审核或没进行到当前阶段，不可操作')
        }
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    submitBudgetAmount(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        if (row.planStatus == 3 && row.proStatus >= 3) {
          updateProRecruitInfo({
            id: row.id,
            budgetAmount: row.budgetAmount==''?null:row.budgetAmount,
            type:'5'
          }).then(() => {
            this.$emit('refreshList')
          })
        } else {
          this.msgError('当前项目未通过审核或没进行到当前阶段，不可操作')
          row.budgetAmount = ''
        }
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //输入实际金额
    getActualAmount(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        if (row.planStatus == 3 && row.proStatus >= 3) {
          row.showActualAmount = false
        } else {
          this.msgError('当前项目未通过审核或没进行到当前阶段，不可操作')
        }
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    submitActualAmount(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        if (row.planStatus == 3 && row.proStatus >= 3) {
          updateProRecruitInfo({
            id: row.id,
            actualAmount: row.actualAmount==''?null:row.actualAmount,
            type:'6'
          }).then(() => {
            this.$emit('refreshList')
          })
        } else {
          this.msgError('当前项目未通过审核或没进行到当前阶段，不可操作')
          row.actualAmount = ''
        }
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //招标会时间
    getBiddingTime(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        if (row.planStatus == 3 && row.proStatus >= 3) {
          row.showBiddingTime = false
        } else {
          this.msgError('当前项目未通过审核或没进行到当前阶段，不可操作')
        }
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    submitBiddingTime(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        if (row.planStatus == 3 && row.proStatus >= 3) {
          updateProRecruitInfo({
            id: row.id,
            biddingTime: row.biddingTime,
            type:'1'
          }).then(() => {
            this.$emit('refreshList')
          })
        } else {
          this.msgError('当前项目未通过审核或没进行到当前阶段，不可操作')
          row.biddingTime = ''
        }
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //定标会时间
    getCalibrationTime(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        if (row.planStatus == 3 && row.proStatus >= 3) {
          row.showCalibrationTime = false
        } else {
          this.msgError('当前项目未通过审核或没进行到当前阶段，不可操作')
        }
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    submitCalibrationTime(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        if (row.planStatus == 3 && row.proStatus >= 3) {
          updateProRecruitInfo({
            id: row.id,
            calibrationTime: row.calibrationTime,
            type: '2'
          }).then(() => {
            this.$emit('refreshList')
          })
        } else {
          this.msgError('当前项目未通过审核或没进行到当前阶段，不可操作')
          row.calibrationTime = ''
        }
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //跳转补充合同信息
    addRecruitInfo() {
      if ((this.formInfo.setupStatus === 0 && (this.formInfo.proStatus == 3 || this.formInfo.proStatus == 4)) || (this.formInfo.setupStatus !== 0)) {
        if (this.formInfo.planStatus == 3 && this.formInfo.proStatus >= 3) {
          const id = this.formInfo.id
          const path = '/proManagement/proImplement/proRecruit/addRecruitInfo'
          this.$router.push({
            'path': path,
            'query': {
              id,
              proDetailFlag: this.proDetailFlag,
              tabActiveName: this.tabActiveName
            }
          })
        } else {
          this.msgError('当前项目未通过审核或没进行到当前阶段，不可操作')
        }
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //刷新高度
    refreshHeight() {
      this.$emit('refreshbs')
    }
  }
}
</script>

<style lang="scss" scoped>
.pdf-show-table {
  .td-one {
    width: 200px;
    font-size: 18px;
    font-weight: bold;
    background-color: #f8f8f9;
  }
}
</style>
