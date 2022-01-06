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
      <el-form-item label="研究领域" prop="researchField">
        <el-select v-model="queryParams.researchField" placeholder="请选择研究领域" clearable>
          <el-option
            v-for="researchField in researchFieldOptions"
            :key="researchField.dictValue"
            :label="researchField.dictLabel"
            :value="researchField.dictValue"/>
        </el-select>
      </el-form-item>
      <el-form-item label="年度" prop="curYear">
        <el-date-picker
          v-model="curYear"
          type="year"
          :clearable="false"
          placeholder="请选择申报年度">
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
      <el-table-column min-width="120" label="技术领域" align="center" prop="researchField" :formatter="researchFieldFormat" />
      <el-table-column min-width="230" label="主要承担单位" align="center" prop="undertakeUnit" />
      <el-table-column min-width="90" label="年度" align="center" prop="approvalTime" :formatter="dateFormat"/>
      <el-table-column min-width="110" label="结题状态" align="center" prop="concludeStatus">
        <template slot-scope="scope">
          <div :class="projectNameStyle(scope.row) + ' no-cursor-point'">
            <span>{{ selectDictLabel(statusOptions, scope.row.concludeStatus) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="成果/结题详情" align="center" class-name="small-padding fixed-width" fixed="right" width="165">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-hasPermi="['conclude:researchResult:resultDetail']"
            @click="handleResult(scope.row)"
          >研究成果
          </el-button>
          <el-button
            type="text"
            v-hasPermi="['conclude:researchResult:concludeInfoDetail']"
            v-if="scope.row.concludeStatus==2||scope.row.concludeStatus==3||scope.row.concludeStatus==4"
            @click="handleDetail(scope.row)"
          >结题详情
          </el-button>
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
import {concludeList, operation} from "@/api/conclude/result"
import {presenter} from '@/components/Crud/crud';

export default {
  mixins: [presenter()],
  data() {
    return {
      //控制搜索栏显示隐藏
      searchToggle: true,
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
        researchField: undefined
      },
      // 申报年限
      curYear: new Date(),
      // 统计数量
      statisticalNum: {},
      researchFieldOptions: [],
    };
  },
  activated() {
    this.getList();
  },
  created() {
    this.getList();
    this.getDicts("conclude_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("project_storage_area").then(response => {
      this.researchFieldOptions = response.data;
    })
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
  methods: {
    handleApprovalDetail(row) {
      const path = '/proManagement/proImplement/proEstablish/proMainTask'
      this.$router.push({
        'path': path,
        'query': {
          "id": row.id,
          "proDetailFlag": '8',
          tabActiveName: '9'
        }
      })
    },
    dateFormat(row) {
      return this.parseTime(row.approvalTime, "{y}")
    },
    search() {
      this.searchToggle = !this.searchToggle;
    },
    /** 查询项目储备申报列表 */
    getList() {
      this.loading = true;
      this.queryParams.curYear = this.curYear.getFullYear();
      console.log(this.queryParams);
      concludeList(this.queryParams).then(response => {
        this.resultList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    researchFieldFormat(row) {
      return this.selectDictLabel(this.researchFieldOptions, row.researchField);
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
        path: "/proManagement/conclude/conclude/detail",
        query: {
          "infoId": row.id,
          "type": "1"
        }
      })
    },
    // 申请结题
    handleApply(row) {
      operation({"infoId": row.id, "operation": "1"}).then(res => {
        if (res.code == 200) {
          this.$router.push({
            path: "/proManagement/conclude/conclude/apply",
            query: {
              "infoId": row.id,
              "type": "2"
            }
          })
        }
      })
    },
    // 研究成果
    handleResult(row) {
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
