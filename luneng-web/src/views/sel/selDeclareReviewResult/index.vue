<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="申报奖项" prop="awardsType">
        <el-select v-model="queryParams.awardsType" placeholder="请选择奖项类别" clearable >
          <el-option
            v-for="dict in awardsTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产业类别" prop="industryType">
        <el-select v-model="queryParams.industryType" placeholder="请选择产业类别" clearable >
          <el-option
            v-for="dict in industryTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申报单位" prop="declareUnit">
        <el-input
          v-model="queryParams.declareUnit"
          placeholder="请输入申报单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评审年度" prop="reviewYear">
        <el-select
          v-model="queryParams.declareYear"
          placeholder="请选择评审年度"
          style="width: 200px">
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

    <el-table ref="table" v-loading="loading" :data="selDeclareReviewResultList">
      <el-table-column min-width="55" label="序号" align="center" type="index">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="230" label="项目名称" align="center" prop="projectName">
        <template slot-scope="scope">
          <div :class="projectNameStyle(scope.row)" @click="handleDetail(scope.row)">
            <span>{{ scope.row.projectName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="130" label="申报奖项" align="center" prop="awardsType" :formatter="awardsTypeFormat"
                       />
      <el-table-column min-width="100" label="产业类别" align="center" prop="industryType" :formatter="industryTypeFormat"
                       />
      <el-table-column min-width="230" label="申报单位" align="center" prop="declareUnit" :formatter="handleNull" />
<!--      <el-table-column min-width="90" label="申报人" align="center" prop="createBy"  />-->
      <el-table-column min-width="100" label="评审年度" align="center" prop="declareYear" />
      <el-table-column width="110" fixed="right" label="得分(平均分)" align="center" prop="score" />
      <el-table-column width="140" fixed="right" label="排序" align="center" prop="sort" >
        <template slot-scope="scope">
          <el-button type="text"  v-if="scope.row.sort!=null&&scope.$index!=0&&scope.row.status==0"
                     @click="upLayer(scope.$index,scope.row)" v-hasPermi="['sel:selDeclareReviewResult:move']">上移
          </el-button>
          <el-button type="text"  v-if="scope.row.sort!=null&&scope.row.status==0"
                     @click.native.prevent="downLayer(scope.$index,scope.row)"
                     v-hasPermi="['sel:selDeclareReviewResult:move']">下移
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="评选结果" align="center" fixed="right" width="160">
        <template slot-scope="scope">
          <el-select style="width: 100%;"  v-model="scope.row.reviewResult" v-if="scope.row.sort!=null" :disabled="scope.row.status==1"
                     @change="resultChange(scope.row)" v-hasPermi="['sel:selDeclareReviewResult:edit']">
            <el-option
              v-for="dict in awardOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
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
  import {
    listSelDeclareReviewResult, move, updateSelDeclareReviewResult
  } from "@/api/sel/selDeclareReviewResult";
  import {presenter} from '@/components/Crud/crud';
  import {listSelReviewYears} from "@/api/sel/selNotice";
  import add from "../selDeclareInfo/science";

  export default {
    name: "SelDeclareReviewResult",
    mixins: [presenter()],
    data() {
      return {
        //控制搜索栏显示隐藏
        searchToggle: true,
        // 遮罩层
        loading: false,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
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
        // 设置奖项类别字典
        awardOptions: [],
        // 申报年度
        reviewYears: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          industryType: undefined,
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
    computed: {
      projectNameStyle() {
        return (row) => {
          if (row.reviewResult) {
            return 'project-name-all'
          } else {
            return 'project-name-all-hover'
          }
        }
      }
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
        listSelDeclareReviewResult(this.queryParams).then(response => {
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
      //处理空值
      handleNull({declareUnit}) {
        if (declareUnit) {
          return declareUnit
        } else {
          return '--'
        }
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          infoId: undefined,
          industryType: undefined,
          awardsType: undefined,
          projectName: undefined,
          declareUnit: undefined,
          declareYear: undefined,
          score: undefined,
          sort: undefined,
          reviewResult: undefined,
          certificateCode: undefined,
          mainPersons: undefined,
          status: "0",
          createBy: undefined,
          createTime: undefined,
          updateBy: undefined,
          updateTime: undefined
        };
        this.resetForm("form");
      },
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
      /** 详情按钮操作 */
      handleDetail(row) {
        let path = "/sel/selDeclareReviewResult/detail"
        let id = row.id;
        let infoId = row.infoId
        let awardsType = row.awardsType
        this.$router.push({
          "path": path,
          "query": {
            "id": id,
            "infoId": infoId,
            "awardsType": awardsType
          }
        })
      },
      // 上移
      upLayer(index, row) {
        const subtractId = row.id;
        const addId = this.selDeclareReviewResultList[index - 1].id;
        const params = {"subtractId": subtractId, "addId": addId}
        move(params).then(res => {
          this.getList();
        })
      },
      // 下移
      downLayer(index, row) {
        const addId = row.id;
        const subtractId = this.selDeclareReviewResultList[index + 1].id;
        if (this.selDeclareReviewResultList[index + 1].status == 0) {
          const params = {"subtractId": subtractId, "addId": addId}
          move(params).then(res => {
            this.getList();
          })
        }
      },
      // 设置奖项值改变
      resultChange(row) {
        updateSelDeclareReviewResult(row);
      }
    }
  };
</script>
