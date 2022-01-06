<template>
  <div class="app-container">
    <div class="header">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true">
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="queryParams.projectName"
            placeholder="请输入项目名称"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="年度" prop="curYearTem">
          <el-date-picker
            v-model="curYearTem"
            :clearable="false"
            style="width: 200px"
            type="year"
            placeholder="请选择年度">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleQuery">查询
          </el-button>
          <el-button
            icon="el-icon-refresh"
            @click="resetQuery">重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="main">
      <div class="main-top">

      </div>

      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          :data="proRecruitList">
          <el-table-column
            label="序号"
            width="60"
            align="center"
            type="index">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="项目名称"
            align="center"
            min-width="230"
            prop="projectName">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)"
                   @click="navProDetail(scope.row)">
                <span>{{ scope.row.projectName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="年度"
            align="center"
            width="60"
            prop="approvalYear">
          </el-table-column>
          <el-table-column
            label="月度"
            align="center"
            width="150"
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
            width="150"
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
            width="200"
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
            width="200"
            prop="actualAmount">
            <template slot-scope="scope">
              <div @dblclick="getActualAmount(scope.row)">
                <div :style="{color: scope.row.actualAmount > scope.row.budgetAmount ? 'red' : ''}"
                     v-if="scope.row.showActualAmount && scope.row.actualAmount">
                  {{scope.row.actualAmount > scope.row.budgetAmount ? `${scope.row.actualAmount}(超预算)` : scope.row.actualAmount}}
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
            width="150"
            prop="biddingTime">
            <template slot-scope="scope">
              <div @dblclick="getBiddingTime(scope.row)">
                <div v-if="scope.row.showBiddingTime && scope.row.biddingTime">
                  {{scope.row.biddingTime}}
                </div>
                <div v-else>
                  <el-date-picker
                    :disabled="scope.row.proStatus == 8"
                    v-model="scope.row.biddingTime"
                    style="width: 140px"
                    type="date"
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
            align="center"
            width="150"
            prop="calibrationTime">
            <template slot-scope="scope">
              <div @dblclick="getCalibrationTime(scope.row)">
                <div v-if="scope.row.showCalibrationTime && scope.row.calibrationTime">
                  {{scope.row.calibrationTime}}
                </div>
                <div v-else>
                  <el-date-picker
                    :disabled="scope.row.proStatus == 8"
                    v-model="scope.row.calibrationTime"
                    style="width: 140px"
                    type="date"
                    value-format="yyyy-MM-dd"
                    @change="submitCalibrationTime(scope.row)"
                    placeholder="选择日期">
                  </el-date-picker>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="招采资料(已上传/未上传)"
            align="center"
            fixed="right"
            width="120"
            prop="planStatus">
            <template slot-scope="scope">
              <el-button
                :disabled="scope.row.proStatus == 8"
                type="text"
                @click="uploadRecruitFile(scope.row)">{{scope.row.fileCount}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="合同文件"
            align="center"
            class-name="small-padding fixed-width"
            fixed="right"
            width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.contractCount > 0">
                <el-button
                  type="text"
                  :disabled="scope.row.proStatus == 8"
                  v-hasPermi="['pro:proContract:add']"
                  @click="addRecruitInfo(scope.row)">修改
                </el-button>
                <el-button
                  type="text"
                  v-hasPermi="['pro:proContract:query']"
                  @click="queryRecruitInfo(scope.row)">查看
                </el-button>
              </div>
              <div v-else>
                <el-button
                  type="text"
                  :disabled="scope.row.proStatus == 8"
                  v-hasPermi="['pro:proContract:add']"
                  @click="addRecruitInfo(scope.row)">补充合同信息
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="main-footer">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"/>
      </div>
    </div>
  </div>
</template>

<script>

import {listProRecruitInfo, updateProRecruitInfo} from "@/api/pro/proRecruit";

export default {
  name: "",
  data() {
    return {
      // 加载等待线
      loading: false,
      // 总条数
      total: 0,
      // 搜索框查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectName: '',
        curYear: null
      },
      curYearTem: new Date(),
      //立项项目列表
      proRecruitList: [],
      proRecruitTypeOptions: []
    }
  },
  created() {
    //获取接口数据
    this.getList()
    //获取字典数据
    this.getDicts("pro_recruit_type").then(response => {
      this.proRecruitTypeOptions = response.data;
    });
  },
  computed: {
    projectNameStyle() {
      return (row) => {
        return row.setupStatus === 0 ? 'project-name-all-grey' : (row.proStatus === 8 ? 'project-name-all' : 'project-name-all-hover')
      }
    }
  },
  methods: {
    /*********************** 数据获取及处理 ***********************/
    /** 获取列表 */
    getList() {
      this.loading = true;
      this.queryParams.curYear = this.parseTime(this.curYearTem, "{y}");
      listProRecruitInfo(this.queryParams).then(({rows, total}) => {
        if (rows && rows.length > 0) {
          rows.forEach(item => {
            item.showBiddingMonth = !!item.biddingMonth;
            item.showBiddingType = !!item.biddingType;
            item.showBudgetAmount = !!item.budgetAmount;
            item.showActualAmount = !!item.actualAmount;
            item.showBiddingTime = !!item.biddingTime;
            item.showCalibrationTime = !!item.calibrationTime;
          })
          this.proRecruitList = rows
          this.total = total;
        } else {
          this.proRecruitList = rows
          this.total = total;
        }
        this.loading = false;
      });
    },
    // 研究领域字典翻译

    /*********************** 交互操作 ***********************/
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.curYearTem = new Date()
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //输入月度
    getBiddingMonth(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        row.showBiddingMonth = false
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    submitBiddingMonth(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        updateProRecruitInfo({
          id: row.id,
          biddingMonth: row.biddingMonth,
          type: '3'
        }).then(() => {
          this.getList()
        })
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //选择采购方式
    getBiddingType(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        row.showBiddingType = false
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    submitBiddingType(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        updateProRecruitInfo({
          id: row.id,
          biddingType: row.biddingType,
          type:'4'
        }).then(() => {
          this.getList()
        })
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //输入预算金额
    getBudgetAmount(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        row.showBudgetAmount = false
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    submitBudgetAmount(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        updateProRecruitInfo({
          id: row.id,
          budgetAmount: row.budgetAmount==''?null:row.budgetAmount,
          type:'5'
        }).then(() => {
          this.getList()
        })
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //输入实际金额
    getActualAmount(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        row.showActualAmount = false
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    submitActualAmount(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        updateProRecruitInfo({
          id: row.id,
          actualAmount: row.actualAmount==''?null:row.actualAmount,
          type:'6'
        }).then(() => {
          this.getList()
        })
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //招标会时间
    getBiddingTime(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        row.showBiddingTime = false
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    submitBiddingTime(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        updateProRecruitInfo({
          id: row.id,
          biddingTime: row.biddingTime,
          type:'1'
        }).then(() => {
          this.getList()
        })
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //定标会时间
    getCalibrationTime(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        row.showCalibrationTime = false
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    submitCalibrationTime(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        updateProRecruitInfo({
          id: row.id,
          calibrationTime: row.calibrationTime,
          type: '2'
        }).then(() => {
          this.getList()
        })
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //查看项目详情
    navProDetail(row) {
      const id = row.id
      const path = '/proManagement/proImplement/proEstablish/proMainTask'
      this.$router.push({
        'path': path,
        'query': {
          id,
          proDetailFlag: '4',
          tabActiveName: '4'
        }
      })
    },
    //跳转补充合同信息
    addRecruitInfo(row) {
      if ((row.setupStatus === 0 && (row.proStatus == 3 || row.proStatus == 4)) || (row.setupStatus !== 0)) {
        const id = row.id
        const projectName = row.projectName
        const path = '/proManagement/proImplement/proRecruit/addRecruitInfo'
        this.$router.push({
          'path': path,
          'query': {
            id,
            projectName
          }
        })
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //查看合同信息
    queryRecruitInfo(row) {
      const id = row.id
      const projectName = row.projectName
      const path = '/proManagement/proImplement/proRecruit/recruitContractDetail'
      this.$router.push({
        'path': path,
        'query': {
          id,
          projectName
        }
      })
    },
    //跳转招采资料
    uploadRecruitFile(row) {
      if ((row.setupStatus === 0 && row.proStatus == 3) || (row.setupStatus !== 0)) {
        const id = row.id
        const path = '/proManagement/proImplement/proRecruit/recruitFile'
        this.$router.push({
          'path': path,
          'query': {
            id
          }
        })
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  padding: 20px 30px 50px 30px;
  display: flex;
  flex-direction: column;
  .header {
    width: 100%;
    margin-bottom: 20px;
  }
  .main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .main-top, .main-center {
      width: 100%;
    }
    .main-footer {
      width: 420px;
      margin-top: 20px;
    }
  }
  .dialog-center {
    width: 100%;
    display: flex;
    justify-content: center;
    span {
      color: #333;
      margin-right: 20px;
    }
  }
}
</style>
