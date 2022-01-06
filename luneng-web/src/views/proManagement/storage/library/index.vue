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
      <el-form-item label="年度" prop="declareYear">
        <el-date-picker
          v-model="declareYear"
          type="year"
          :clearable="false"
          placeholder="请选择年度">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="项目属性" prop="attri">
        <el-select
          v-model="queryParams.attri"
          placeholder="请选择项目属性"
          clearable>
          <el-option
            v-for="dict in attriOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申报单位" prop="subordinateUnit">
        <el-input
          v-model="queryParams.subordinateUnit"
          placeholder="请输入申报单位名称"
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
          type="warning"
          icon="el-icon-download"
          @click="handleExport"
          v-hasPermi="['project:storageLibrary:export']"
        >导出Excel
        </el-button>
        <el-button
          type="primary"
          v-hasPermi="['project:storageLibrary:add']"
          @click="handleAdd"
        >添加项目储备
        </el-button>
      </el-col>
    </el-row>

    <el-table ref="table" v-loading="loading" :data="projectStorageInfoList">
      <el-table-column
        min-width="55"
        label="序号"
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
          <div :class="projectNameStyle(scope.row)"
               @click="handleDetail(scope.row)">
            <span>{{ scope.row.projectName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="230" label="申报单位" align="center" prop="subordinateUnit"/>
      <el-table-column min-width="120" label="项目类别" align="center" prop="type"/>
      <el-table-column min-width="100" label="项目属性" align="center" prop="attir" :formatter="attriFormat"/>
      <el-table-column min-width="120" label="研究领域" align="center" prop="area" :formatter="areaFormat"/>
      <el-table-column min-width="230" label="承担单位" align="center" prop="undertakeUnit"/>
      <el-table-column min-width="230" label="实施单位" align="center" prop="implementationUnit"/>
      <el-table-column min-width="110" label="起始时间" align="center" prop="beginDate" :formatter="beginDateFormat"/>
      <el-table-column min-width="110" label="结束时间" align="center" prop="endDate" :formatter="endDateFormat"/>
      <el-table-column min-width="120" label="项目总投入（成本性）" align="center" prop="totalInvestment"/>
      <el-table-column min-width="120" :label="label" align="center" prop="planInvestment"/>
      <el-table-column fixed="right" width="80" label="分级评分" align="center" prop="reviewResult" :formatter="reviewResultFormat"/>
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
import {listProjectStorageInfo, exportExcel} from "@/api/storage/library"
import {operation} from "@/api/storage/projectStorageInfo"

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
      // 研究领域字典
      areaOptions: [],
      // 项目属性字典
      attriOptions: [],
      // 等级字典
      levelOptions: [],
      label: new Date().getFullYear() + 1 + "年计划投入（成本性）",
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
    };
  },
  activated() {
    this.getList();
  },
  computed: {
    projectNameStyle() {
      return (row) => {
        return row.reviewResult ? 'project-name-all' : 'project-name-all-hover'
      }
    }
  },
  created() {
    this.getList();
    this.getDicts("project_storage_level").then(response => {
      this.levelOptions = response.data;
    });
    this.getDicts("project_storage_area").then(response => {
      this.areaOptions = response.data;
    });
    this.getDicts("project_storage_attri").then(response => {
      this.attriOptions = response.data;
    });
    this.getDicts("project_storage_level").then(res => {
      this.levelOptions = res.data;
    })
    // this.getDeclareYear();
  },
  methods: {
    // 获取申报年限
    // getDeclareYear() {
    //   listSelReviewYears().then(res => {
    //     this.declareYear = res.data;
    //   })
    // },
    // 项目属性字典翻译
    attriFormat(row, column) {
      return this.selectDictLabel(this.attriOptions, row.attri);
    },
    // 研究领域字典翻译
    areaFormat(row, column) {
      return this.selectDictLabel(this.areaOptions, row.area);
    },
    // 分级评分字段翻译
    reviewResultFormat(row) {
      return this.selectDictLabel(this.levelOptions, row.reviewResult);
    },
    beginDateFormat(row) {
      return this.parseTime(row.beginDate, "{y}年{m}月")
    },
    endDateFormat(row) {
      return this.parseTime(row.endDate, "{y}年{m}月")
    },
    /** 查询项目储备申报列表 */
    getList() {
      this.loading = true;
      this.queryParams.declareYear = this.parseTime(this.declareYear, "{y}")
      listProjectStorageInfo(this.queryParams).then(response => {
        this.projectStorageInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    totalInvestmentFormat(row) {
      return row.totalInvestment + "万元";
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
      this.declareYear = new Date();
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      operation({"infoId": row.id, "operation": "7"}).then(res => {
        this.$router.push({
          path: '/proManagement/storage/library/detail',
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
    // 添加项目储备
    handleAdd() {
      this.$router.push({
        path: '/proManagement/storage/library/add'
      })
    }
  }
};
</script>
