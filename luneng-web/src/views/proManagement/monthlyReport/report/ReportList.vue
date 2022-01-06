<template>
  <div class="app-container">
    <div class="header">
      <el-row>
        <el-col :span="18">
          <el-button
            type="primary"
            @click="backPage">返回
          </el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :span="18">
          <span class="project-name">{{ projectName }}</span>
        </el-col>
      </el-row>
    </div>

    <div class="main">
      <div class="main-top" style="margin-bottom: 10px;">
        <el-button
          type="primary"
          v-hasPermi="['pro:proMonthReportRecord:add']"
          @click="handleAdd">新增月报
        </el-button>
      </div>
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          :data="reportList">
          <el-table-column
            label="序号"
            min-width="55"
            align="center"
            type="index">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="200"
            label="月报年份"
            align="center"
            prop="reportYearName">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)" @click="onQuery(scope.row)">
                <span>{{ scope.row.reportYearName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="200"
            label="月报月份"
            align="center"
            prop="reportMonthName">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)" @click="onQuery(scope.row)">
                <span>{{ scope.row.reportMonthName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="最后提交时间"
            align="center"
            min-width="300"
            prop="submitTime">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)" @click="onQuery(scope.row)">
                <el-row>
                  <el-col>
                    <span>{{ scope.row.submitTime }}</span>
                  </el-col>
                </el-row>
                <el-row v-if="scope.row.submitCount > 0">
                  <el-col>
                    <span>第{{ scope.row.submitCount }}次提交</span>
                  </el-col>
                </el-row>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            align="center"
            width="200"
            prop="reportStatus">
            <template slot-scope="scope">
              <el-row :gutter="20">
                <el-col>
                  <div
                    :class="projectNameStyle2(scope.row)"
                    @click="editReport(scope.row)"
                    type="text">
                    {{ reportStatusFormat(scope.row) }}
                  </div>
                </el-col>
                <el-col v-if="scope.row.reportStatus === 3">
                  <span class="report-list" @click="backReason(scope.row.backReason)">退回缘由</span>
                </el-col>
              </el-row>
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

    <el-dialog
      :visible.sync="open"
      width="600px"
      append-to-body
      :close-on-click-modal="false">
      <div>
        <el-form ref="opinionForm" :model="opinionForm" :rules="opinionRules" label-width="150px">
          <el-form-item label="选择月报时间：" prop="reportMonth">
            <el-date-picker
              v-model="opinionForm.reportMonth"
              :clearable="false"
              style="width: 250px"
              type="month"
              placeholder="请选择月份">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 100px" type="primary"  @click="submitForm">确 定</el-button>
        <el-button style="width: 100px"   @click="cancelClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addProMonthReportRecord,
  listProMonthReportRecord
} from "@/api/pro/proMonthReportRecord";

export default {
  name: "ReportList",
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
        reportId: null,
        auditFlag: 0
      },
      //审核项目列表
      reportList: [],
      open: false,
      opinionForm: {
        reportId: null,
        reportMonth: null
      },
      opinionRules: {
        reportMonth: [
          {required: true, message: "月报时间不能为空", trigger: "blur"}
        ]
      }
    }
  },

  created() {
    //获取接口数据
    this.getList()
  },
  activated() {
    this.getList()
  },
  computed: {
    userId() {
      return this.$store.state.user.userId
    },
    userName() {
      return this.$store.state.user.name
    },
    id() {
      return this.$route.query.id || null
    },
    projectName() {
      return this.$route.query.projectName || '无'
    },
    reportTimeFormat() {
      return ({reportTime}) => {
        let str = reportTime.replace(/-/g, '.')
        str = str.replace(/,/g, ' - ')
        return str
      }
    },
    projectNameStyle() {
      return (row) => {
        if (row.reportStatus === 2 || row.reportStatus === 1) {
          return 'project-name-all'
        } else if (row.reportStatus === 3) {
          return 'project-name-all-red'
        } else {
          return 'project-name-all-hover'
        }
      }
    },
    projectNameStyle2() {
      return (row) => {
        if (row.reportStatus === 2 || row.reportStatus === 1) {
          return 'project-name-all no-cursor-point'
        } else if (row.reportStatus === 3) {
          return 'project-name-all-red'
        } else {
          return 'project-name-all-hover'
        }
      }
    },
    reportStatusFormat() {
      return ({reportStatus}) => {
        switch (reportStatus) {
          case -1:
            return '待编辑';
          case 0:
            return '已保存';
          case 1:
            return '已提交';
          case 2:
            return '已阅';
          case 3:
            return '待修改';
        }
      }
    }
  },
  methods: {
    /*********************** 数据获取及处理 ***********************/
    /** 获取申报待评审列表 */
    getList() {
      this.loading = true;
      this.queryParams.reportId = this.id;
      listProMonthReportRecord(this.queryParams).then(({rows, total}) => {
        this.reportList = rows;
        this.total = total;
        this.loading = false;
      });
    },

    /*********************** 交互操作 ***********************/
    handleAdd() {
      this.open = open
    },

    //提交审批
    submitForm() {
      const opinionForm = {
        reportId: this.id,
        reportMonth: this.parseTime(this.opinionForm.reportMonth, "{y}-{m}")
      }
      addProMonthReportRecord(opinionForm).then(() => {
        this.msgSuccess('新增成功')
        this.open = false
        this.getList()
      })
    },

    cancelClose() {
      this.open = false
    },

    backPage() {
      this.closeView(this.$route.path, '/proManagement/monthlyReport/workMonthReport', 0)
    },

    backReason(backReason) {
      this.$alert(backReason, '退回缘由', {
        showConfirmButton: false
      })
    },

    //编辑月报
    editReport(row) {
      if (row.reportStatus === -1 || row.reportStatus === 0 || row.reportStatus === 3) {
        this.$router.push({
          path: '/proManagement/monthlyReport/workMonthReport/reportList/edit',
          query: {
            id: row.id
          }
        })
      }
    },

    //详情
    onQuery(row) {
      if (row.reportStatus <= -1) {
        this.msgInfo('请先编辑月报')
        return;
      }
      this.$router.push({
        path: '/proManagement/monthlyReport/workMonthReport/reportList/detail',
        query: {
          id: row.id,
          detailFlag: '0'
        }
      })
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
    .project-name {
      font-size: 24px;
      font-weight: bold;
    }
  }
  .main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .main-top,
    .main-center {
      width: 100%;
    }
    .main-footer {
      width: 420px;
      margin-top: 20px;
    }
  }
  .dialog-center {
    display: flex;
    flex-direction: column;
  }
  .report-list {
    cursor: pointer;
  }
}
</style>
