<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="90px">
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申报单位" prop="subordinateUnit">
        <el-input
          v-model="queryParams.subordinateUnit"
          placeholder="请输入申报单位名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="年度" prop="declareYear">
        <el-date-picker
          v-model="declareYear"
          type="year"
          :clearable="false"
          placeholder="请选择年度">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="评审状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择评审状态" clearable>
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          @click="handleExport"
          v-hasPermi="['project:projectStorageAudit:export']"
        >导出Excel
        </el-button>
      </el-col>
      <el-col :span="20" style="line-height: 32px;font-size: 18px;color: #606266;">
        共{{ statisticalNum.sumCount }}条，审核通过{{ statisticalNum.agreeCount }}条，审核驳回{{ statisticalNum.refusedCount }}条，审核拒绝{{ statisticalNum.rejectedCount }}条，待审核{{ statisticalNum.noApprovalCount }}条
      </el-col>
    </el-row>

    <el-table ref="table" v-loading="loading" :data="projectStorageInfoList">
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
        label="项目名称"
        align="center"
        prop="projectName"
        min-width="230">
        <template slot-scope="scope">
          <div :class="projectNameStyle(scope.row)"
               @click="handleDetail(scope.row)">
            <span>{{ scope.row.projectName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="230" label="申报单位" align="center" prop="subordinateUnit" />
      <el-table-column min-width="100" label="申报人" align="center" prop="createBy" />
      <el-table-column min-width="120" label="项目类别" align="center" prop="type" />
      <el-table-column min-width="120" label="项目属性" align="center" prop="attri" :formatter="attriFormat" />
      <el-table-column min-width="120" label="开始时间" align="center" prop="beginDate" :formatter="beginDateFormat" />
      <el-table-column min-width="120" label="结束时间" align="center" prop="endDate" :formatter="endDateFormat" />
      <el-table-column width="140" fixed="right" label="可研报告" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            style="color: #000000;"
            @click="handlerLookReport(scope.row)"
            v-if="scope.row.feasibleStatus==1">查看可研报告
          </el-button>
          <el-button
            type="text"
            @click="handlerSendMsg(scope.row)"
            v-if="scope.row.feasibleStatus==0">提醒上传
          </el-button>
        </template>
      </el-table-column>
      <el-table-column width="90" fixed="right" label="是否已读" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.readStatus==1" type="info">已读</el-tag>
          <el-tag v-if="scope.row.readStatus==0" type="success">未读</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="120" fixed="right" label="评审状态" align="center" prop="status" >
        <template slot-scope="scope">
          <div :class="projectNameStyle(scope.row) + ' no-cursor-point'">
            <span>{{ selectDictLabel(statusOptions, scope.row.status) }}</span>
          </div>
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
  </div>
</template>

<script>
import {listProjectStorageInfo, getStatisticalNum, exportExcel, operation} from "@/api/storage/audit"

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 项目储备申报表格数据
      projectStorageInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 项目属性字典
      attriOptions: [],
      // 研究领域字典
      areaOptions: [],
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        declareYear: undefined,
        projectName: undefined,
        subordinateUnit: undefined,
        status: undefined
      },
      // 申报年限
      declareYear: new Date(),
      // 统计数量
      statisticalNum: {}
    };
  },
  activated() {
    this.getList();
    this.getStatisticalNum();
  },
  computed: {
    projectNameStyle() {
      return (row) => {
        return (row.status === '3' || row.status === '6' || row.status === '7' || row.status === '8') ? 'project-name-all' : 'project-name-all-hover'
      }
    }
  },
  created() {
    this.getList();
    this.getDicts("project_storage_attri").then(response => {
      this.attriOptions = response.data;
    });
    this.getDicts("project_storage_area").then(response => {
      this.areaOptions = response.data;
    });
    this.getDicts("project_storage_status").then(response => {
      response.data.some(status => {
        if (status.dictValue != 1 && status.dictValue != 9) {
          this.statusOptions.push(status);
        }
      })
    });
    this.getStatisticalNum();
  },
  methods: {
    // 获取未审核，同意，拒绝，驳回数量
    getStatisticalNum() {
      this.queryParams.declareYear = this.parseTime(this.declareYear, "{y}");
      getStatisticalNum(this.queryParams).then(res => {
        this.statisticalNum = res.data;
      })
    },
    /** 查询项目储备申报列表 */
    getList() {
      this.loading = true;
      this.queryParams.declareYear = this.parseTime(this.declareYear, "{y}");
      listProjectStorageInfo(this.queryParams).then(response => {
        this.projectStorageInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 项目属性字典翻译
    attriFormat(row, column) {
      return this.selectDictLabel(this.attriOptions, row.attri);
    },
    // 研究领域字典翻译
    areaFormat(row, column) {
      return this.selectDictLabel(this.areaOptions, row.area);
    },
    beginDateFormat(row) {
      return this.parseTime(row.beginDate, "{y}年{m}月")
    },
    endDateFormat(row) {
      return this.parseTime(row.endDate, "{y}年{m}月")
    },
    // 取消按钮
    cancel() {
      this.opinionOpen = false;
      this.reset();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
      this.getStatisticalNum();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.declareYear = new Date();
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      operation({"operation": 6, "infoId": row.id}).then(res => {
        this.$router.push({
          path: '/proManagement/storage/audit/detail',
          query: {
            id: row.id
          }
        })
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有项目储备申报数据项?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportExcel(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () {
      });
    },
    // 提醒上传可研报告
    handlerSendMsg(row) {
      operation({"infoId": row.id, "operation": 5}).then(res => {
        this.msgSuccess('提醒成功!');
      })
    },
    handlerLookReport(row) {
      this.$router.push({
        path: '/proManagement/storage/audit/report',
        query: {
          id: row.id
        }
      })
    }
  }
};
</script>
