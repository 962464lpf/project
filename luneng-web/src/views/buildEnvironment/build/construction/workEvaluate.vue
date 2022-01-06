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
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker
            v-model="curTime"
            :clearable="false"
            style="width: 200px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="经办人" prop="operator">
          <el-input
            v-model="queryParams.operator"
            placeholder="请输入经办人"
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
      <div class="main-top">
        <el-row :gutter="15" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              v-hasPermi="['build:buildAppraise:add']"
              @click="handleAdd">新增评价
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['build:buildAppraise:remove']">删除
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          :data="workEvaluateList">
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
            min-width="230"
            label="项目名称"
            align="center"
            prop="projectName">
            <template slot-scope="scope">
              <span>{{ scope.row.projectName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="120"
            label="绿建星级"
            align="center"
            :formatter="levelFormat"
            prop="level"
            />
          <el-table-column
            min-width="120"
            label="经办人"
            align="center"
            prop="operator"
            />
          <el-table-column
            min-width="120"
            label="时间"
            align="center"
            prop="time"
            >
          </el-table-column>
          <el-table-column
            min-width="120"
            label="地点"
            align="center"
            prop="address"
            >
          </el-table-column>
          <el-table-column
            min-width="230"
            label="评价标题"
            align="center"
            prop="title">
            <template slot-scope="scope">
              <span class="project-name-all-hover" @click="queryWorkEavluate(scope.row)">{{ scope.row.title }}</span>
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

import {delBuildAppraise, listBuildAppraise} from "@/api/build/buildAppraise";
import {getBuildInfo} from "@/api/build/buildInfo";

export default {
  name: "workEvaluate",
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
      // 搜索框查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        infoId: null,
        projectName: '',
        time: '',
        operator: ''
      },
      curTime: '',
      workEvaluateList: [],
      id: null
    }
  },
  created() {
    this.getDicts("national_standard_level").then(response => {
      this.levelOptions = response.data;
      //获取接口数据
      if (this.$route.query.id) {
        this.id = this.$route.query.id * 1
        this.getList()
      }
    });
  },
  computed: {
    userName() {
      return this.$store.state.user.name
    }
  },
  methods: {
    /*********************** 数据获取及处理 ***********************/
    /** 获取申报待评审列表 */
    getList() {
      this.loading = true;
      this.queryParams.infoId = this.id
      this.queryParams.time = this.parseTime(this.curTime, "{y}-{m}-{d}");
      listBuildAppraise(this.queryParams).then(({rows, total}) => {
        this.workEvaluateList = rows;
        this.total = total;
        this.loading = false;
      });
    },
    // 绿建星级字典翻译
    levelFormat(row) {
      return this.selectDictLabel(this.levelOptions, row.level);
    },
    /*********************** 交互操作 ***********************/
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.projectName = ''
      this.curTime = ''
      this.queryParams.operator = ''
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    //处理新增
    handleAdd() {
      getBuildInfo(this.id).then(({data}) => {
        if (data.finish === 0) {
          if (data.approvalStatus === 4) {
            const path = '/buildEnvironment/build/construction/editEvaluate'
            const id = this.id
            this.$router.push({
              'path': path,
              'query': {
                id
              }
            })
          } else {
            this.msgError('当前项目正在审核中或审核未通过，不可操作')
          }
        } else {
          this.msgError('当前项目已归档，不可操作')
        }
      })
    },
    //处理修改
    handleUpdate(row) {
      getBuildInfo(this.id).then(({data}) => {
        if (data.finish === 0) {
          const id = this.id
          const path = '/buildEnvironment/build/construction/editEvaluate'
          const eId = row.id
          this.$router.push({
            'path': path,
            'query': {
              eId,
              id
            }
          })
        } else {
          this.msgError('当前项目已归档，不可操作')
        }
      })
    },
    //处理删除
    handleDelete(row) {
      getBuildInfo(this.id).then(({data}) => {
        if (data.finish === 0) {
          const ids = row.id || this.ids;
          this.$confirm(`是否确认删除所选择的项目评价?`, "系统提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(function () {
            return delBuildAppraise(ids);
          }).then(() => {
            this.getList();
            this.msgSuccess("删除成功");
          }).catch(function () {
          });
        } else {
          this.msgError('当前项目已归档，不可操作')
        }
      })
    },
    //查看工作评价
    queryWorkEavluate(row) {
      const eId = row.id
      const path = '/buildEnvironment/build/construction/evaluateDetail'
      this.$router.push({
        'path': path,
        'query': {
          eId,
          id: this.id,
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
      .project-name {
        font-size: 14px;
      }
    }
    .main-footer {
      width: 420px;
      margin-top: 20px;
    }
  }
}
</style>
