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
        <el-form-item label="月份" prop="curMonthTem">
          <el-date-picker
            v-model="curMonthTem"
            :clearable="false"
            style="width: 200px"
            type="month"
            placeholder="请选择月份">
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
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          :data="projectList">
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
            label="年度"
            align="center"
            min-width="100"
            prop="reportYearName">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)" @click="navReportRecordDetail(scope.row)">
                <span>{{ scope.row.reportYearName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="月份"
            align="center"
            min-width="100"
            prop="reportMonthName">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)" @click="navReportRecordDetail(scope.row)">
                <span>{{ scope.row.reportMonthName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="260"
            label="项目名称"
            align="center"
            prop="projectName">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)" @click="navReportRecordDetail(scope.row)">
                <span>{{ scope.row.projectName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="260"
            label="单位"
            align="center"
            prop="undertakeUnit">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)" @click="navReportRecordDetail(scope.row)">
                <span>{{ scope.row.undertakeUnit }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="160"
            label="提交时间"
            align="center"
            prop="submitTime">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)" @click="navReportRecordDetail(scope.row)">
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
            width="120"
            label="状态"
            align="center"
            prop="reportStatus"
            fixed="right">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)" @click="navReportRecordDetail(scope.row)">
                <span>{{ statusFormat(scope.row) }}</span>
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
import {listProMonthReportAudit} from "@/api/pro/proMonthReport";
import {changeStatusReportRecord} from "@/api/pro/proMonthReportRecord";

export default {
  name: "index",
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
        reportMonth: null
      },
      curMonthTem: '',
      //审核项目列表
      projectList: []
    }
  },

  created() {
    //获取接口数据
    this.getList()
  },
  computed: {
    userId() {
      return this.$store.state.user.userId
    },
    userName() {
      return this.$store.state.user.name
    },
    statusFormat() {
      return ({reportStatus}) => {
        return (reportStatus === 0 ? '无内容' : '') || (reportStatus === 1 ? '有更新' : '') || (reportStatus === 2 ? '已阅' : '')
      }
    },
    projectNameStyle() {
      return (row) => {
        if (row.reportStatus === 2) {
          return 'project-name-all'
        } else if (row.reportStatus === 1) {
          return 'project-name-all-hover'
        } else {
          return 'project-name-all no-cursor-point'
        }
      }
    }
  },
  methods: {
    /*********************** 数据获取及处理 ***********************/
    /** 获取申报待评审列表 */
    getList() {
      this.loading = true;
      this.queryParams.reportMonth = this.parseTime(this.curMonthTem, "{y}-{m}");
      listProMonthReportAudit(this.queryParams).then(({rows, total}) => {
        this.projectList = rows;
        this.total = total;
        this.loading = false;
      });
    },
    /*********************** 交互操作 ***********************/
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.curMonthTem = ''
      this.resetForm("queryForm");
      this.handleQuery();
    },
    navReportRecordDetail(row) {
      if (row.reportStatus === 2) {
        this.$router.push({
          path: '/proManagement/monthlyReport/monthReportAudit/reportList/detail',
          query: {
            id: row.id,
            detailFlag: '1'
          }
        })
      } else if (row.reportStatus === 1) {
        changeStatusReportRecord({
          id: row.id,
          reportStatus: 2
        }).then(() => {
          this.$router.push({
            path: '/proManagement/monthlyReport/monthReportAudit/reportList/detail',
            query: {
              id: row.id,
              detailFlag: '1'
            }
          })
        })
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
    .main-center {
      width: 100%;
    }
    .main-footer {
      width: 420px;
      margin-top: 20px;
    }
    .project-name {
      font-size: 14px;
      cursor: pointer;
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
