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
        <el-form-item label="计划状态" prop="planStatus">
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
        <el-row :gutter="15" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              v-hasPermi="['pro:proApprovalInfo:initEstablishmentPlan']"
              @click="drawUpPlan">编制计划
            </el-button>
          </el-col>
        </el-row>
      </div>

      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          :data="proDrawUpList">
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
            min-width="250">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)" @click="navProDetail(scope.row)">
                <span>{{ scope.row.projectName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="研究领域"
            align="center"
            width="230"
            prop="researchField">
            <template slot-scope="scope">
              <div class="project-name">
                <span>{{ selectDictLabel(researchFieldOptions, scope.row.researchField) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="230"
            label="主要承担单位"
            align="center"
            prop="undertakeUnit">
          <template slot-scope="scope">
            <div class="project-name">
              <span>{{ scope.row.undertakeUnit }}</span>
            </div>
          </template>
          </el-table-column>
          <el-table-column
            label="年度"
            align="center"
            width="90"
            prop="approvalYear">
          </el-table-column>
          <el-table-column
            label="起止时间"
            align="center"
            width="180"
            :formatter="proTimeFormat">
          </el-table-column>
          <el-table-column
            label="计划状态"
            align="center"
            prop="planStatus"
            width="120"
            fixed="right">
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
    <!-- 选择项目对话框 -->
    <el-dialog
      :title="dialogOption.title"
      :visible.sync="dialogOption.open"
      width="30%"
      append-to-body :close-on-click-modal="false">
      <div class="dialog-center">
        <span>选择项目</span>
        <el-select
          v-model="selProID"
          placeholder="请选择项目"
          clearable
          style="width: 250px"
          >
          <el-option
            v-for="item in proDrawUpDelList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 100px" type="primary"  @click="submitConfirm">确 定</el-button>
        <el-button style="width: 100px"  @click="cancelClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {
    delProApprovalInfo,
    initEstablishmentPlan, invalidPlanInfo,
    listPlayPlanInfo,
    listUnPrepareProApprovalInfo, reBackPlanInfo, saveProOptLog, updatePlanAuditStatus,
    updateProApprovalInfo, getProApprovalInfo
  } from "@/api/pro/proApprovalInfo";

export default {
  name: "",
  data() {
    return {
      // 加载等待线
      loading: false,
      // 表格选中数组id串
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 搜索框查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectName: '',
        curYear: null,
        planStatus: ''
      },
      curYearTem: new Date(),
      //立项项目列表
      proDrawUpList: [],
      //立项项目计划删除列表
      proDrawUpDelList: [],
      //对话框一
      dialogOption: {
        title: '选择项目',
        open: false
      },
      selProID: null,
      planStatusOptions: [],
      researchFieldOptions: [],
      proLevelOptions: [],
      navDrawUpProPlanFlag: false
    }
  },
  created() {
    //获取接口数据
    this.getList()
    //获取字典数据
    this.getDicts("draw_up_plan_status").then(response => {
      this.planStatusOptions = response.data;
    });
    this.getDicts("project_storage_area").then(response => {
      this.researchFieldOptions = response.data;
    });
  },
  computed: {
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
        this.proDrawUpList = res.page.rows;
        this.total = res.page.total;
        this.loading = false;
      });
    },
    // 研究领域字典翻译
    researchFieldFormat({researchField}) {
      return this.selectDictLabel(this.researchFieldOptions, researchField);
    },
    planStatusFormat({planStatus}) {
      return this.selectDictLabel(this.planStatusOptions, planStatus);
    },
    proTimeFormat({proBeginDate, proEndDate}) {
      if (proBeginDate && proEndDate) {
        return proBeginDate.replace('-','.') + '-' + proEndDate.replace('-','.')
      }else {
        return ''
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    //打开对话框查询立项项目
    drawUpPlan() {
      listUnPrepareProApprovalInfo().then(({data})=>{
        this.dialogOption.open = true
        this.proDrawUpDelList = data
      })
    },
    //确认选中项目
    submitConfirm() {
      if (this.selProID) {
        let proInfo = {}
        this.proDrawUpDelList.forEach(item => {
          if (item.id == this.selProID) {
            proInfo = item
          }
        })
        const id = this.selProID
        const path = '/proManagement/proImplement/drawUpPlan/editProPlan'
        if (proInfo.proStatus != 8) {
          if ((proInfo.setupStatus === 0 && (proInfo.proStatus == 2 || proInfo.proStatus == 1)) || (proInfo.setupStatus !== 0)) {
            initEstablishmentPlan(id).then(() => {
              this.$router.push({
                'path': path,
                'query': {
                  id
                }
              })
            })
          } else {
            this.msgError('当前项目已暂停，不可操作')
          }
        } else {
          this.msgInfo('当前项目已验收，不可操作')
        }
      }
    },
    //取消关闭
    cancelClose() {
      this.dialogOption.open = false
      this.selProID = null
    },
    //查看项目详情
    navProDetail(row) {
      const id = row.id
      const path = '/proManagement/proImplement/proEstablish/proMainTask'
      this.$router.push({
        'path': path,
        'query': {
          id,
          proDetailFlag: '2',
          tabActiveName: '3'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  padding: 20px 30px 60px 30px;
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
  .dialog-center {
    width: 100%;
    display: flex;
    justify-content: center;
    span {
      color: #333;
      margin-right: 20px;
    }
  }
}
</style>
