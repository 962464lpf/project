<template>
  <div class="app-container">
    <div class="header">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true">
        <el-form-item label="成果产业类型" prop="achieType">
          <el-select
            v-model="queryParams.achieType"
            clearable
            style="width: 220px"
            placeholder="请选择成果产业类型">
            <el-option
              v-for="item in industryTypeOptions"
              :key="item.dictValue"
              :value="item.dictValue"
              :label="item.dictLabel"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="成果名称" prop="achieName">
          <el-input
            v-model="queryParams.achieName"
            clearable
            style="width: 200px"
            placeholder="请输入成果名称"
          />
        </el-form-item>
        <el-form-item label="发表年度" prop="curYearTem">
          <el-date-picker
            v-model="curYearTem"
            :clearable="false"
            style="width: 160px"
            type="year"
            placeholder="请选择发表年度">
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
        <el-row :gutter="15" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              :disabled="multiple"
              v-hasPermi="['achie:achieCooperationIntention:remove']"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          :data="achievementList"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            min-width="40"
            align="center"/>
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
            v-if="achieEdit"
            min-width="260"
            label="申请合作单位"
            align="center"
            prop="applyUnit">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)" @click="queryDetail(scope.row)">
                <span>{{ scope.row.applyUnit }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="260"
            label="申请合作成果名称"
            align="center"
            prop="achieName">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)" @click="queryDetail(scope.row)">
                <span>{{ scope.row.achieName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="120"
            label="发表年度"
            align="center"
            prop="publishYear">
          </el-table-column>
          <el-table-column
            width="120"
            label="状态"
            align="center"
            fixed="right"
            prop="auditStatus">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row) + ' no-cursor-point'">
                <span>{{ selectDictLabel(auditStatusOptions, scope.row.auditStatus) }}</span>
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
    <!-- 权限 -->
    <div v-hasPermi="['achie:achieCooperationIntention:edit']" id="achieEdit"></div>
  </div>
</template>

<script>

import {delAchieCooperationIntention, listAchieCooperationIntention} from "@/api/achie/achieCooperationIntention";

export default {
  name: "index",
  data() {
    return {
      // 加载等待线
      loading: false,
      // 表格选中数组id串
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      //当前年份
      curYearTem: new Date(),
      // 搜索框查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        achieType: '',
        achieName: '',
        publishYear: null
      },
      //列表
      achievementList: [],
      //字典
      industryTypeOptions: [],
      auditStatusOptions: [],
      achieEdit: false
    }
  },
  computed: {
    projectNameStyle() {
      return (row) => {
        if (row.auditStatus === 1) {
          return 'project-name-all-hover'
        } else if (row.auditStatus === 2) {
          return 'project-name-all'
        } else if (row.auditStatus === 3) {
          return 'project-name-all-red'
        }
      }
    }
  },
  created() {
    //获取接口数据
    this.getList()
    //获取字典信息
    this.getDicts("industry_type").then(response => {
      this.industryTypeOptions = response.data;
    });
    this.getDicts("cooperation_audit_status").then(response => {
      this.auditStatusOptions = response.data;
    });
  },
  mounted() {
    this.achieEdit = !!document.getElementById('achieEdit')
  },
  methods: {
    /*********************** 数据获取及处理 ***********************/
    /** 获取申报待评审列表 */
    getList() {
      this.loading = true;
      this.queryParams.publishYear = this.parseTime(this.curYearTem, "{y}");
      listAchieCooperationIntention(this.queryParams).then(({rows, total}) => {
        this.achievementList = rows;
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
      this.curYearTem = new Date()
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    //删除
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除所选择的合作申请信息?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delAchieCooperationIntention(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
    },
    handleAudit(row) {
      const id = row.id
      const path = '/achievement/cooperation/audit'
      this.$router.push({
        path: path,
        query: {
          id,
          auditFlag: '1'
        }
      })
    },
    queryDetail(row) {
      const path = "/achievement/cooperation/detail"
      const id = row.id;
      this.$router.push({
        "path": path,
        "query": {
          id
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
