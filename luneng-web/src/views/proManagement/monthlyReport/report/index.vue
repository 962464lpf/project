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
            min-width="230"
            label="项目名称"
            align="center"
            prop="projectName">
          </el-table-column>
          <el-table-column
            min-width="230"
            label="工作月报"
            align="center">
            <template slot-scope="scope">
              <div :class="projectNameStyle" @click="navReportRecordList(scope.row)">
                <span>月报管理</span>
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
import {listProMonthReport} from "@/api/pro/proMonthReport";

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
        projectYear: null,
        auditFlag: 0
      },
      curYearTem: new Date(),
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
    projectNameStyle() {
      return 'project-name-all-hover'
    }
  },
  methods: {
    /*********************** 数据获取及处理 ***********************/
    /** 获取申报待评审列表 */
    getList() {
      this.loading = true;
      this.queryParams.projectYear = this.parseTime(this.curYearTem, "{y}");
      listProMonthReport(this.queryParams).then(({rows, total}) => {
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
      this.curYearTem = new Date()
      this.resetForm("queryForm");
      this.handleQuery();
    },
    navReportRecordList(row) {
      this.$router.push({
        path: '/proManagement/monthlyReport/workMonthReport/reportList',
        query: {
          id: row.id,
          projectName: row.projectName
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
