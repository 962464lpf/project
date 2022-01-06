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
      <el-form-item label="申报年度" prop="declareYear">
        <el-date-picker
          v-model="declareYear"
          type="year"
          :clearable="false"
          placeholder="请选择申报年度">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

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
      <el-table-column min-width="230" label="项目名称" align="center" prop="projectName">
        <template slot-scope="scope">
          <div :class="projectNameStyle(scope.row)" @click="handleDetail(scope.row)">
            <span>{{ scope.row.projectName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="160" label="技术领域" align="center" prop="area" :formatter="areaFormat"/>
      <el-table-column min-width="230" label="申报单位" align="center" prop="subordinateUnit"/>
      <el-table-column min-width="100" label="申报年度" align="center" prop="declareYear"/>
      <el-table-column min-width="160" label="项目经费（万）" align="center" prop="totalInvestment"/>
      <el-table-column width="120" label="状态" align="center" prop="status" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <div :class="projectNameStyle(scope.row) + ' no-cursor-point'">
            <span>{{ statusFormat(scope.row) }}</span>
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
import {listProjectStorageInfo, operation} from "@/api/storage/storageReviewOnLine";

export default {
  name: "ProjectStorageInfo",
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectName: undefined,
        subordinateUnit: undefined,
        userName: this.$store.getters.name
      },
      // 申报年限
      declareYear: new Date(),
    };
  },
  computed: {
    projectNameStyle() {
      return (row) => {
        if (row.reviewStatus == 0 && row.infoStatus != 7) {
          return 'project-name-all-hover'
        } else if (row.infoStatus == 8 && row.scoreStatus == 0) {
          return 'project-name-all-hover'
        } else {
          return 'project-name-all'
        }
      }
    }
  },
  created() {
    this.getList();
    this.getDicts("project_storage_area").then(response => {
      this.areaOptions = response.data;
    });
  },
  methods: {
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
    // 研究领域字典翻译
    areaFormat(row, column) {
      return this.selectDictLabel(this.areaOptions, row.area);
    },
    // 状态字典翻译
    statusFormat(row, column) {
      if (row.infoStatus == 7) {
        return "评审结束";
      } else if (row.reviewStatus == 0) {
        return "待评审";
      } else if (row.reviewStatus == 1) {
        return "已评审";
      } else if (row.reviewStatus == -1) {
        return "已作废";
      }
      // return row.infoStatus == 7 ? "评审结束" : (row.reviewStatus == 0 ? "待评审" : "已评审");
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
      operation({"infoId": row.id, "expertId": row.expertId, "operation": "2"}).then(res => {
        if (res.code == 200) {
          if ((row.reviewStatus == 0 && row.infoStatus != 7) || (row.infoStatus == 8 && row.scoreStatus == 0)) {
            this.$router.push({
              path: '/selReview/storageReviewOnLine/review',
              query: {
                id: row.id,
                expertId: row.expertId
              }
            })
          } else {
            this.$router.push({
              path: '/selReview/storageReviewOnLine/detail',
              query: {
                id: row.id
              }
            })
          }
        } else {
          this.msgError(res.msg);
        }
      })
    }
  }
};
</script>
