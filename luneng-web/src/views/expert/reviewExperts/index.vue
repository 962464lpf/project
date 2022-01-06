<template>
  <div class="app-container">
    <div class="header">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true">
        <el-form-item label="姓名" prop="expertName">
          <el-input
            v-model="queryParams.expertName"
            placeholder="请输入姓名"
            clearable
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="上报单位" prop="reportingUnit">
          <el-input
            v-model="queryParams.reportingUnit"
            placeholder="请输入上报单位"
            clearable
            style="width: 220px"
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
          :data="expertSelectionList">
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
            min-width="260"
            label="上报单位"
            align="center"
            prop="reportingUnit">
          </el-table-column>
          <el-table-column
            min-width="300"
            label="专家姓名"
            align="center"
            prop="expertNames">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)" @click="queryDetail(scope.row)">
                <span>{{ scope.row.expertNames }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="110"
            label="添加日期"
            align="center"
            prop="createTime">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="110"
            label="状态"
            fixed="right"
            align="center"
            prop="auditStatus">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row) + ' no-cursor-point'">
                <span>{{ selectDictLabel(expertSelectionOptions, scope.row.auditStatus) }}</span>
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
import { listExpertReportingRecord } from "@/api/expert/expertReportingRecord";

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
        expertName: '',
        reportingUnit: '',
        type: '1'
      },
      //专家选拔列表
      expertSelectionList: [],
      //字典选项
      expertSelectionOptions: []
    }
  },
  computed: {
    projectNameStyle() {
      return (row) => {
        if (row.auditStatus === 2) {
          return 'project-name-all-hover'
        } else if (row.auditStatus === 3) {
          return 'project-name-all'
        } else if (row.auditStatus === 4) {
          return 'project-name-all-red'
        }
      }
    }
  },
  created() {
    //获取接口数据
    this.getList()
    //获取字典数据
    this.getDicts("expert_selection").then(response => {
      this.expertSelectionOptions = response.data;
    });
  },
  methods: {
    /*********************** 数据获取及处理 ***********************/
    /** 获取申报待评审列表 */
    getList() {
      this.loading = true;
      this.queryParams.createTime = JSON.stringify(this.searchTime)
      listExpertReportingRecord(this.queryParams).then(({rows, total}) => {
        this.expertSelectionList = rows;
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
      this.$refs["queryForm"].resetFields();
      this.handleQuery();
    },
    //去审核
    handleAudit(row) {
      const id = row.id
      const path = "/expert/reviewExperts/reportSelExperts"
      this.$router.push({
        "path": path,
        'query': {
          id,
          detailFlag: '1',
          reviewFlag: '1'
        }
      })
    },
    //查看
    queryDetail(row) {
      if (row.auditStatus === 2) {
        this.handleAudit(row)
      } else {
        const id = row.id
        const path = "/expert/selection/selExpertsDetail"
        this.$router.push({
          "path": path,
          'query': {
            id,
            reviewFlag: '2'
          }
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

    .main-top {
      width: 100%;
    }

    .main-center {
      width: 100%;
    }

    .main-footer {
      width: 420px;
      margin-top: 20px;
    }
  }
}
</style>
