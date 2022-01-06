<template>
  <div class="app-container">
    <div class="header">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true">
        <el-form-item label="项目名称" prop="name">
          <el-input
            v-model="queryParams.projectName"
            placeholder="请输入项目名称"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="单位名称" prop="jobLevel">
          <el-input
            v-model="queryParams.declareUnit"
            placeholder="请输入单位名称"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleQuery"/>
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
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          :data="scoreInfos">
          <el-table-column
            min-width="55"
            label="序号"
            align="center"
            type="index">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="230"
            label="项目名称"
            align="center"
            prop="projectName">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)" @click="handleDetail(scope.row)">
                <span>{{ scope.row.projectName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="230"
            label="申报单位"
            align="center"
            prop="declareUnit"/>
          <el-table-column
            min-width="160"
            label="申报奖项"
            align="center"
            :formatter="awardTypeFormat"/>
          <el-table-column
            min-width="150"
            label="产业类别"
            align="center"
            :formatter="industryTypeFormat"/>
          <el-table-column
            min-width="100"
            label="评选年度"
            align="center"
            prop="reviewYear"/>
          <el-table-column
            label="状态"
            align="center"
            width="120"
            fixed="right">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row) + ' no-cursor-point'">
                <span>{{ statusFormat(scope.row) }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="main-footer">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"/>
      </div>
    </div>
  </div>
</template>

<script>
  import {list} from "@/api/selReview/review";
  import {getSelDeclareInfo} from "@/api/sel/selDeclareInfo"

  export default {
    name: "",
    data() {
      return {
        //评审和详情切换控制
        isShowDetail: false,
        // 加载等待线
        loading: false,
        // 表格选中数组id串
        // ids: [],
        // 非单个禁用
        // single: true,
        // 非多个禁用
        // multiple: true,
        // 总条数
        total: 0,
        // 专家表格数据
        scoreInfos: [],
        // 获取奖项类别
        awardTypeOptions: [],
        // 获取产业类别
        industryTypeOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          userName: "",
          projectName: undefined,
          declareUnit: undefined
        }
      }
    },
    computed: {
      projectNameStyle() {
        return (row) => {
          if (row.status === -1) {
            return 'project-name-all-hover'
          } else {
            return 'project-name-all'
          }
        }
      }
    },
    created() {
      //获取审批列表
      this.getList();
      //获取奖项类别
      this.getDicts("award_type").then(response => {
        this.awardTypeOptions = response.data;
      });
      //获取产业类别
      this.getDicts("industry_type").then(response => {
        this.industryTypeOptions = response.data
      });
    },
    activated() {
      // this.getList()
    },
    methods: {
      /*********************** 数据获取及处理 ***********************/
      /** 查询专家列表 */
      getList() {
        this.loading = true;
        this.queryParams.userName = this.$store.getters.name;
        list(this.queryParams).then(response => {
          console.log(response)
          this.scoreInfos = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 奖项类别字典翻译
      awardTypeFormat(row, column) {
        return this.selectDictLabel(this.awardTypeOptions, row.awardsType);
      },
      // 产业类别字典翻译
      industryTypeFormat(row, column) {
        return this.selectDictLabel(this.industryTypeOptions, row.industryType);
      },
      // 状态
      statusFormat(row) {
        if (row.status == -1) {
          return "待评审";
        } else if (row.status == 0) {
          return "已回避";
        } else if (row.status == 1) {
          return "已评审";
        } else if (row.status == 2) {
          return "评审结束"
        }
      },
      /*********************** 交互操作 ***********************/
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams = {
          pageNum: 1,
          pageSize: 10,
          userName: "",
          projectName: undefined,
          declareUnit: undefined
        }
        this.resetForm("queryParams");
        this.handleQuery();
      },
      // 多选框选中数据
      // handleSelectionChange(selection) {
      //   this.ids = selection.map(item => item.id)
      //   this.single = selection.length != 1
      //   this.multiple = !selection.length
      // },
      /** 详情按钮操作 */
      handleDetail(row) {
        if (row.status === -1) {
          this.handleUpdate(row)
        } else {
          const path = "/selReview/reviewOnline/rewardDetail"
          this.$router.push({
            "path": path,
            "query": {
              "expertId": row.expertId,
              "infoId": row.infoId
            }
          })
        }
      },

      /** 评审按钮操作 */
      handleUpdate(row) {
        // 验证申报状态是否已结束
        getSelDeclareInfo(row.infoId).then(res => {
          if (res.code == 200) {
            if (res.data.declareStatus == 15) {
              const path = "/selReview/reviewOnline/rewardReview"
              this.$router.push({
                "path": path,
                "query": {
                  "expertId": row.expertId,
                  "infoId": row.infoId
                }
              })
            } else {
              this.$message("评审已结束！");
              this.getList();
            }
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

      .main-top, .main-center {
        width: 100%;
      }

      .main-footer {
        width: 420px;
        margin-top: 20px;
      }
    }
  }
</style>
