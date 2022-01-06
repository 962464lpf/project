<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="90px">
      <el-form-item label="获奖类型" prop="awardsType">
        <el-select v-model="queryParams.awardsType" placeholder="请选择获奖类型" clearable >
          <el-option
            v-for="dict in awardsTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="获奖单位" prop="declareUnit">
        <el-input
          v-model="queryParams.declareUnit"
          placeholder="请输入获奖单位"
          clearable

          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评审年度" prop="reviewYear">
        <el-select
          v-model="queryParams.declareYear"
          placeholder="请选择评审年度"
          style="width: 160px"
          >
          <el-option
            v-for="dict in reviewYears"
            :key="dict.value"
            :label="dict.key"
            :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search"  @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh"  @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"

          @click="handleBatch"
          :disabled="multiple"
          v-hasPermi="['sel:selDeclareReviewResult:batchRelease']"
        >批量下发
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"

          @click="handleAll"
          v-hasPermi="['sel:selDeclareReviewResult:batchRelease']"
        >全部下发
        </el-button>
      </el-col>
    </el-row>
    <el-table ref="table" v-loading="loading" :data="selDeclareReviewResultList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" min-width="40" align="center"/>
      <el-table-column
        label="序号"
        align="center"
        min-width="55"
        type="index">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="220" label="证书编号" align="center" prop="certificateCode" />
      <el-table-column min-width="120" label="获奖奖项" align="center" prop="awardsType" :formatter="awardsTypeFormat"
                       />
      <el-table-column min-width="100" label="产业类别" align="center" prop="industryType" :formatter="industryTypeFormat"
                       />
      <el-table-column min-width="110" label="奖项等级" align="center" prop="reviewResult" :formatter="awardFormat" />
      <el-table-column min-width="230" label="项目名称" align="center" prop="projectName" />
      <el-table-column min-width="200" label="获奖单位" align="center" prop="declareUnit" :formatter="handleNull" />
      <el-table-column min-width="120" label="主要完成人" align="center" prop="mainPersons" />
      <el-table-column width="120" label="证书下发状态" align="center" :formatter="statusFormat" prop="status" fixed="right" />
      <el-table-column label="证书" align="center" class-name="small-padding fixed-width" fixed="right" width="140">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="scope.row.status==0"
            @click="handleIssue(scope.row)"
            v-hasPermi="['sel:selDeclareReviewResult:batchRelease']"
          >下发证书
          </el-button>
          <el-button
            type="text"
            v-if="scope.row.status==1"
            @click="handleDetail(scope.row)"
            v-hasPermi="['sel:selDeclareReviewResult:view']"
          >查看证书
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
  import {getRecognitionList, batchRelease} from "@/api/sel/selDeclareReviewResult";
  import {presenter} from '@/components/Crud/crud';
  import certificate from './certificate';
  import {listSelReviewYears} from "@/api/sel/selNotice";
  import {base64ToPDF} from "@/api/common/utils";

  export default {
    name: "SelDeclareReviewResult",
    mixins: [presenter()],
    components: {
      certificate
    },
    data() {
      return {
        //控制搜索栏显示隐藏
        searchToggle: true,
        // 遮罩层
        loading: true,
        // 选中数组
        selectData: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 全部下发禁用
        multipleAll: true,
        // 总条数
        total: 0,
        // 申报评选结果表格数据
        selDeclareReviewResultList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 产业类别字典
        industryTypeOptions: [],
        // 奖项类别字典
        awardsTypeOptions: [],
        // 获奖等级字典
        awardOptions: [],
        // 申报年度
        reviewYears: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          awardsType: undefined,
          declareUnit: undefined,
          declareYear: new Date().getFullYear()
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
      this.getReviewYears();
      this.getDicts("industry_type").then(response => {
        this.industryTypeOptions = response.data;
      });
      this.getDicts("award_type").then(response => {
        this.awardsTypeOptions = response.data;
      });
      this.getDicts("sys_sel_award").then(res => {
        this.awardOptions = res.data;
      })
    },
    activated() {
      this.getList();
    },
    methods: {
      search() {
        this.searchToggle = !this.searchToggle;
      },
      /** 查询申报评选结果列表 */
      getList() {
        this.loading = true;
        getRecognitionList(this.queryParams).then(response => {
          this.selDeclareReviewResultList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      //获取评审年份选择列表
      getReviewYears() {
        listSelReviewYears().then(res => {
          console.log(res)
          this.reviewYears = res.data
        })
      },
      // 产业类别字典翻译
      industryTypeFormat(row, column) {
        return this.selectDictLabel(this.industryTypeOptions, row.industryType);
      },
      // 奖项类别字典翻译
      awardsTypeFormat(row, column) {
        return this.selectDictLabel(this.awardsTypeOptions, row.awardsType);
      },
      // 状态翻译
      statusFormat(row) {
        return row.status == 0 ? "未下发" : "已下发";
      },
      //处理空值
      handleNull({declareUnit}) {
        if (declareUnit) {
          return declareUnit
        } else {
          return '--'
        }
      },
      // 获奖等级字典翻译
      awardFormat(row) {
        return this.selectDictLabel(this.awardOptions, row.reviewResult);
      },
      //
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      handleIssue(row) {
        this.$router.push({
          "path": '/sel/selRecognition/issue',
          "query": {"id": row.id, code: row.certificateCode}
        })
      },
      /** 详情按钮操作 */
      handleDetail(row) {
        let path = "/sel/selRecognition/detail"
        let id = row.id;
        this.$router.push({
          "path": path,
          "query": {"id": id}
        })
      },
      // 全部下发
      handleAll() {
        this.$confirm('是否确认下发全部未下发证书?', "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          getRecognitionList({
            awardsType: this.queryParams.awardsType,
            declareUnit: this.queryParams.declareUnit,
            declareYear: this.queryParams.declareYear
          }).then(response => {
            const datas = [];
            response.rows.some(data => {
              if (data.status == "0") {
                datas.push(data);
              }
            })
            if (datas.length != 0) {
              batchRelease(datas).then(res => {
                if (res.code == 200) {
                  this.$message.success("证书下发成功");
                  this.getList();
                }
              })
            } else {
              this.msgError("没有证书需要下发！")
            }
          });
        }).catch(function () {
        });
      },
      // 批量下发
      handleBatch() {
        this.$confirm('是否确认批量下发证书?', "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
            batchRelease(this.selectData).then(res => {
              if (res.code == 200) {
                this.$message.success("证书下发成功");
                this.getList();
              }
            })
          }
        ).catch(function () {
        });

      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.selectData = selection;
        this.multiple = !selection.length
        selection.some(data => {
          if (data.status == "1") {
            this.multiple = true;

          }
        })
      }
    }
  };
</script>
