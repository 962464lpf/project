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
      <el-form-item label="年度" prop="curYear">
        <el-date-picker
          v-model="curYear"
          type="year"
          :clearable="false"
          placeholder="请选择年度">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table ref="table" v-loading="loading" :data="resultList">
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
          <div :class="projectNameStyle(scope.row)" @click="handleApprovalDetail(scope.row)">
            <span>{{ scope.row.projectName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="100" label="年度" align="center" prop="approvalTime"/>
      <el-table-column min-width="120" label="报告（已上传/全部）" align="center" prop="uploadReport">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDetail(scope.row)">
            {{ scope.row.uploadReport }}/{{ scope.row.report }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column min-width="120" label="专利（已上传/全部）" align="center" prop="uploadPatent">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDetail(scope.row)">
            {{ scope.row.uploadPatent }}/{{ scope.row.patent }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column min-width="120" label="软著（已上传/全部）" align="center" prop="uploadSoftware">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDetail(scope.row)">
            {{ scope.row.uploadSoftware }}/{{ scope.row.software }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column min-width="120" label="论文（已上传/全部）" align="center" prop="uploadPaper">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDetail(scope.row)">
            {{ scope.row.uploadPaper }}/{{ scope.row.paper }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column min-width="120" label="标准（已上传/全部）" align="center" prop="uploadStandard">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDetail(scope.row)">
            {{ scope.row.uploadStandard }}/{{ scope.row.standard }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column width="100" label="项目进度" align="center" prop="proStatus" :formatter="statusFormat" fixed="right"/>
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
import {listResult, operation} from "@/api/conclude/result";

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 研究成果列表
      resultList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        curYear: undefined,
        projectName: undefined,
        subordinateUnit: undefined,
        status: undefined
      },
      // 申报年限
      curYear: new Date(),
      // 统计数量
      statisticalNum: {}
    };
  },
  activated() {
    this.getList();
  },
  computed: {
    projectNameStyle() {
      return (row) => {
        if (row.setupStatus === 0) {
          return 'project-name-all-grey'
        } else {
          if (row.concludeStatus === '4') {
            return 'project-name-all-red'
          } else if (row.concludeStatus === '3') {
            return 'project-name-all'
          } else {
            return 'project-name-all-hover'
          }
        }
      }
    }
  },
  created() {
    this.getList();
    this.getDicts("pro_establish_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    handleApprovalDetail(row) {
      const path = '/proManagement/proImplement/proEstablish/proMainTask'
      this.$router.push({
        'path': path,
        'query': {
          "id": row.id,
          "proDetailFlag": '7',
          tabActiveName: '8'
        }
      })
    },

    /** 查询项目储备申报列表 */
    getList() {
      this.loading = true;
      this.queryParams.curYear = this.parseTime(this.curYear, "{y}");
      listResult(this.queryParams).then(response => {
        this.resultList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.proStatus);
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
      this.curYear = new Date();
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.$router.push({
        path: "/proManagement/proImplement/proImplementation/playResults",
        query: {
          id: row.id
        }
      })
    }
  }
};
</script>
