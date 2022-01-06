<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="80px">
      <el-form-item label="时间" prop="recordDate">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="经办人" prop="agent">
        <el-input
          v-model="queryParams.agent"
          placeholder="请输入经办人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          :disabled="fileStatus == '1'"
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
          v-hasPermi="['hb:hbRectRecord:dc:add']"
        >新增记录</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hb:hbRectRecord:edit']"
        >修改</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          v-if="fileStatus != '1'"
          type="danger"
          icon="el-icon-delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hb:hbRectRecord:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          @click="handleExport"
          v-hasPermi="['hb:hbRectRecord:export']"
        >导出</el-button>
      </el-col>
      <crud-operation @refresh="getList" @search="search" />
    </el-row>

    <el-table ref="table" v-loading="loading" :data="hbRectRecordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" min-width="40" align="center" />
      <el-table-column min-width="55" label="序号" align="center" type="index">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center" prop="projectName"  min-width="230">
        <template slot-scope="scope">
          <span class="project-name-all" @click="handleProjectDetail(scope.row)">{{scope.row.projectName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="经办人" align="center" prop="agent" min-width="90"  />
      <el-table-column label="记录时间" align="center" prop="recordDate" min-width="120" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.recordDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地点" align="center" prop="happenAddr" min-width="160"  />
      <el-table-column label="问题描述" align="center" prop="questionDesc" min-width="180"  />
      <el-table-column v-if="managementClzt" label="处理状态" align="center" prop="completeStatus" min-width="120" >
        <template slot-scope="scope">
          <el-switch v-model="scope.row.completeStatus" :active-value="1" :inactive-value="0" @change="changeCompleteStatus(scope.row, $event)" />
          <span style="margin-left: 6px;">{{scope.row.completeStatus == 0? '未完成' : '已完成'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.completeStatus == 0 && fileStatus != '1'"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hb:hbRectRecord:dc:edit']"
          >修改</el-button>
          <el-button
            v-if="scope.row.completeStatus == 0 && fileStatus != '1'"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hb:hbRectRecord:dc:remove']"
          >删除</el-button>
          <el-button
            type="text"
            @click="handleDetail(scope.row)"
            v-hasPermi="['hb:hbRectRecord:dc:query']"
          >详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <div v-hasPermi="['hb:hbRectRecord:dc:clzt']" id="managementClzt"></div>
  </div>
</template>

<script>
import { listHbRectRecord, getHbRectRecord, delHbRectRecord, addHbRectRecord, updateHbRectRecord, exportHbRectRecord } from "@/api/hb/hbRectRecord";
import { getHbProjectInfo } from "@/api/hb/hbProjectInfo";
import { presenter} from '@/components/Crud/crud';

export default {
  name: "buildEnvironment-environment-management-dc",
  mixins: [presenter()],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 环保问题整改记录表格数据
      hbRectRecordList: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        recordDate: undefined,
        agent: undefined,
        recordType: undefined
      },
      fileStatus: 0,
      managementClzt: false
    };
  },
  computed: {
    infoId() {
      return this.$route.query.infoId;
    },
    recordType() {
      return this.$route.query.recordType;
    },
    pageType() {
      return this.$route.query.pageType;
    }
  },
  created() {
    this.getList();
  },
  activated() {
    this.getList();
  },
  mounted() {
    let managementClzt = document.getElementById('managementClzt');
    if(managementClzt) this.managementClzt = true;
  },
  methods: {
    /** 查询环保问题整改记录列表 */
    getList() {
      this.loading = true;
      this.queryParams.infoId = this.infoId;
      this.queryParams.recordType = this.recordType;
      listHbRectRecord(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.hbRectRecordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      getHbProjectInfo(this.infoId).then(response => {
        this.fileStatus = response.data.fileStatus;
      })
    },
    changeCompleteStatus(row, event) {
      event ? row.completeStatus = 0 : row.completeStatus = 1;
      let type = '已完成';
      row.completeStatus ? type = '未完成' : type = '已完成';
      this.$confirm(`是否确认设置为${type}?`, "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        row.completeStatus ? row.completeStatus = 0 : row.completeStatus = 1;
        return updateHbRectRecord(row);
      }).then(() => {
        this.getList();
        this.msgSuccess("设置成功");
      }).catch(function() {});
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
      if (selection.length > 0) {
        selection.map(item => {
          if (item.completeStatus == 1) {
            this.multiple = true
          }
        })
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      getHbProjectInfo(this.infoId).then(response => {
        if (response.data.fileStatus == 1) {
          this.msgInfo('该项目已归档，暂时无法操作');
          this.getList();
        } else {
          let path = '';
          if (this.recordType == 1) path = '/buildEnvironment/environment/management/record/add';
          if (this.recordType == 2) path = '/buildEnvironment/environment/management/zc/add';
          if (this.recordType == 3) path = '/buildEnvironment/environment/management/dc/add';
          this.$router.push({
            path: path,
            query: {
              infoId: this.infoId,
              recordType: this.recordType,
              pageType: this.pageType
            }
          })
        }
      })
    },
    handleProjectDetail(row) {
      let pageType = '';
      if (this.recordType == 1) pageType = 'record';
      if (this.recordType == 2) pageType = 'supervise';
      this.$router.push({
        path: "/buildEnvironment/environment/project/detail",
        query: {
          id: row.infoId,
          pageType: pageType
        }
      })
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      let path = '';
      if (this.recordType == 1) path = '/buildEnvironment/environment/management/record/detail';
      if (this.recordType == 2) path = '/buildEnvironment/environment/management/zc/detail';
      if (this.recordType == 3) path = '/buildEnvironment/environment/management/dc/detail';
      this.$router.push({
        path: path,
        query: {
          id: row.id,
          infoId: this.infoId,
          recordType: this.recordType,
          pageType: this.pageType
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      getHbProjectInfo(this.infoId).then(response => {
        if (response.data.fileStatus == 1) {
          this.msgInfo('该项目已归档，暂时无法操作');
          this.getList();
        } else {
          let path = '';
          if (this.recordType == 1) path = '/buildEnvironment/environment/management/record/edit';
          if (this.recordType == 2) path = '/buildEnvironment/environment/management/zc/edit';
          if (this.recordType == 3) path = '/buildEnvironment/environment/management/dc/edit';
          this.$router.push({
            path: path,
            query: {
              id: row.id,
              infoId: this.infoId,
              recordType: this.recordType,
              pageType: this.pageType
            }
          })
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除?', "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          getHbProjectInfo(row.infoId).then(response => {
            if (response.data.fileStatus == 1) {
              this.msgInfo('该项目已归档，暂时无法操作');
              this.getList();
            } else {
              delHbRectRecord(ids).then(() => {
                this.getList();
                this.msgSuccess("删除成功");
              })
            }
          })
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有环保问题整改记录数据项?', "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportHbRectRecord(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
