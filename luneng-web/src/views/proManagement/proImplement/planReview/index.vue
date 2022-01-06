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
            style="width: 200px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="年度" prop="curYearTem">
          <el-date-picker
            v-model="curYearTem"
            :clearable="false"
            style="width: 200px"
            type="year"
            placeholder="请选择年度">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="评审状态" prop="planStatus">
          <el-select
            v-model="queryParams.planStatus"
            placeholder="请选择计划状态"
            clearable
            style="width: 200px">
            <el-option
              v-for="item in planStatusOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"/>
          </el-select>
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
        <el-button
          type="warning"
          icon="el-icon-download"
          v-hasPermi="['pro:proApprovalInfo:exportPlanInfo']"
          @click="handleExport">导出Excel
        </el-button>
        <div class="main-top-total">
          <span>共{{ allPlanNum }}条，</span>
          <span>审核通过{{ passPlanNum }}条，</span>
<!--          <span>审核未通过{{ backPlanNum }}条，</span>-->
          <span>待审核{{ auditPlanNum }}条</span>
        </div>
      </div>
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          :data="reviewProList">
          <el-table-column
            label="序号"
            width="60"
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
                   @click="navProDetail(scope.row)">
                <span>{{ scope.row.projectName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="研究领域"
            align="center"
            width="160"
            prop="researchField"
            :formatter="researchFieldFormat">
          </el-table-column>
          <el-table-column
            label="主要承担单位"
            align="center"
            prop="undertakeUnit"/>
          <el-table-column
            label="起止时间"
            align="center"
            width="170"
            :formatter="proTimeFormat">
          </el-table-column>
          <el-table-column
            label="年度"
            align="center"
            width="80"
            prop="approvalYear">
          </el-table-column>
          <el-table-column
            label="是否已读"
            align="center"
            width="90"
            prop="declareYear">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.userReadStatus !== '1'" type="success">未读</el-tag>
              <el-tag v-if="scope.row.userReadStatus === '1'" type="info">已读</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="计划状态"
            align="center"
            prop="planStatus"
            width="100">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row) + ' no-cursor-point'">
                <span>{{ selectDictLabel(planStatusOptions, scope.row.planStatus) }}</span>
              </div>
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

import {
  exportPlanInfo,getProApprovalInfo,
  listPlayPlanInfo, saveProOptLog
} from "@/api/pro/proApprovalInfo";
import {auditPlanInfo, getProAuditInfo, saveProApprovalInfoRead} from "@/api/pro/proPlanReview";

export default {
  name: "",
  data() {
    return {
      // 加载等待线
      loading: false,
      // 总条数
      total: 0,
      // 搜索框查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectName: '',
        curYear: null,
        planStatus: '',
        selType: 1
      },
      curYearTem: new Date(),
      //审核项目列表
      reviewProList: [],
      //统计
      allPlanNum: 0,
      auditPlanNum: 0,
      passPlanNum: 0,
      // backPlanNum: 0,
      planStatusOptions: [],
      researchFieldOptions: [],
      open: false,
      opinionForm: {
        infoId: null,
        planId: null,
        planStatus: null,
        reviewOpinion: '',
        auditFilePath: '',
        permission: 1
      },
      opinionRules: {
        reviewOpinion: [
          {required: true, message: "操作说明不能为空", trigger: "blur", pattern: '[^ \x22]+'}
        ]
      }
    }
  },
  created() {
    //获取接口数据
    this.getList()
    // this.getPlayPlanNum()
    //获取字典数据
    this.getDicts("draw_up_plan_status").then(({data}) => {
      this.planStatusOptions = data.filter(item => {
        return item.dictValue === '2' || item.dictValue === '3'
      })
    });
    this.getDicts("project_storage_area").then(response => {
      this.researchFieldOptions = response.data;
    });
  },
  computed: {
    userId() {
      return this.$store.state.user.userId
    },
    userName() {
      return this.$store.state.user.name
    },
    projectNameStyle() {
      return (row) => {
        if (row.setupStatus === 0) {
          return 'project-name-all-grey'
        } else {
          if (row.planStatus === 5) {
            return 'project-name-all-red'
          } else if (row.planStatus === 3) {
            return 'project-name-all'
          } else {
            return 'project-name-all-hover'
          }
        }
      }
    }
  },
  methods: {
    /*********************** 数据获取及处理 ***********************/
    /** 获取申报待评审列表 */
    getList() {
      this.loading = true;
      this.queryParams.curYear = this.parseTime(this.curYearTem, "{y}");
      listPlayPlanInfo(this.queryParams).then((res) => {
        this.reviewProList = res.page.rows;
        this.total = res.page.total;
        this.loading = false;
        this.allPlanNum = res.ap.total
        this.auditPlanNum = res.ap.audit
        this.passPlanNum = res.ap.pass
      });
    },
    //查询编制计划数量统计
    // getPlayPlanNum() {
    //   selectPlanInfoCount().then(({data}) => {
    //     data.forEach(item => {
    //       if (item.name === 'total') {
    //         this.allPlanNum = item.count
    //       } else if (item.name === 'aduit'){
    //         this.auditPlanNum = item.count
    //       } else if (item.name === 'pass') {
    //         this.passPlanNum = item.count
    //       }
    //       // else {
    //       //   this.backPlanNum = item.count
    //       // }
    //     })
    //   })
    // },
    // 研究领域字典翻译
    researchFieldFormat({researchField}) {
      return this.selectDictLabel(this.researchFieldOptions, researchField);
    },
    proTimeFormat({proBeginDate, proEndDate}) {
      if (proBeginDate && proEndDate) {
        return proBeginDate + '-' + proBeginDate
      }
    },
    /*********************** 交互操作 ***********************/
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.curYearTem = new Date()
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //导出Excel
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出当前年度所有数据项?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return exportPlanInfo(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function() {});
    },
    //查看项目详情
    navProDetail(row) {
      const id = row.id
      const path = '/proManagement/proImplement/proEstablish/proMainTask'
      if (row.userReadStatus !== '1') {
        const objTem = {
          infoId: row.id,
          userId: this.userId,
          type: 1
        }
        saveProApprovalInfoRead(objTem).then(() => {
          this.$router.push({
            'path': path,
            'query': {
              id,
              proDetailFlag: '3',
              tabActiveName: '3'
            }
          })
        })
      } else {
        this.$router.push({
          'path': path,
          'query': {
            id,
            proDetailFlag: '3',
            tabActiveName: '3'
          }
        })
      }
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
    .main-top {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      .main-top-total {
        margin-left: 15px;
        font-size: 18px;
      }
    }
    .main-footer {
      width: 420px;
      margin-top: 20px;
    }
  }
  .dialog-center {
    display: flex;
    flex-direction: column;
  }
}
</style>
