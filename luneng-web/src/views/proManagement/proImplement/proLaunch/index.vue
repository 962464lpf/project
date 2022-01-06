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
        <!--        <el-row :gutter="15" class="mb8">-->
        <!--          <el-col :span="1.5">-->
        <!--            <el-button-->
        <!--              type="primary"-->
        <!--              icon="el-icon-s-promotion"-->
        <!--              @click="issueProEstablishNotice">发布启动会通知-->
        <!--            </el-button>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
      </div>
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          :data="proLaunchList">
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
            min-width="230"
            label="项目名称"
            align="center"
            prop="projectName">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)"
                   @click="navProDetail(scope.row)">
                <span>{{ scope.row.projectName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="userRoles"
            width="200"
            label="主要承担单位"
            align="center"
            prop="undertakeUnit"/>
          <el-table-column
            width="140"
            label="研究领域"
            align="center"
            :formatter="researchFieldFormat"
            prop="researchField"/>
          <el-table-column
            width="200"
            label="申报单位"
            align="center"
            prop="declareUnit">
          </el-table-column>
          <el-table-column
            width="100"
            label="年度"
            align="center"
            :formatter="formatterApprovalTime"
            prop="approvalTime">
          </el-table-column>
          <el-table-column
            width="100"
            label="项目任务书"
            align="center"
            prop="projectType">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-hasPermi="['pro:proApprovalInfo:proTaskBookSb', 'pro:proApprovalInfo:proTaskBookKxb']"
                @click="navProPlayPlan(scope.row)">
                查看任务书
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="PPT"
            align="center"
            width="140">
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.pptFilePaths"
                type="text"
                :disabled="scope.row.proStatus == 8"
                @click="openUploadFile('1', scope.row)"
                v-hasPermi="['pro:proApprovalInfo:pptSb']">上传
              </el-button>
              <el-button
                v-if="scope.row.pptFilePaths"
                type="text"
                :disabled="scope.row.proStatus == 8"
                @click="openUploadFile('1', scope.row)"
                v-hasPermi="['pro:proApprovalInfo:pptSb']">更新
              </el-button>

              <el-button
                v-if="scope.row.pptFilePaths"
                type="text"
                @click="queryUploadFile('1', scope.row)"
                v-hasPermi="['pro:proApprovalInfo:pptKxb','pro:proApprovalInfo:pptSb']">查看
              </el-button>
<!--              <el-button-->
<!--                v-if="scope.row.pptFilePaths"-->
<!--                type="text"-->
<!--                @click="queryUploadFile('1', scope.row)"-->
<!--                v-hasPermi="['pro:proApprovalInfo:pptSb']">查看-->
<!--              </el-button>-->
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            label="实施计划"
            align="center"
            prop="proStatus">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.playPlanStatus == 3"
                type="text"
                :disabled="scope.row.proStatus == 8"
                @click="auditUpdateApply(scope.row)"
                v-hasPermi="['pro:proApprovalInfo:selectPlayPlanKxb']">查看修改申请
              </el-button>
              <el-button
                v-if="scope.row.playPlanStatus == null || scope.row.playPlanStatus == 0"
                type="text"
                :disabled="scope.row.proStatus == 8"
                @click="editImplementPlan(scope.row)"
                v-hasPermi="['pro:proApprovalInfo:updatePlayPlan']">编制
              </el-button>
              <el-button
                v-if="scope.row.playPlanStatus == 3"
                type="text"
                :disabled="scope.row.proStatus == 8"
                @click="urgeImplementPlan(scope.row)"
                v-hasPermi="['pro:proApprovalInfo:urgingPlayPlan']">催办
              </el-button>
              <el-button
                v-if="scope.row.playPlanStatus == 1||scope.row.playPlanStatus == 2"
                type="text"
                :disabled="scope.row.proStatus == 8"
                @click="editImplementPlan(scope.row)"
                v-hasPermi="['pro:proApprovalInfo:updatePlayPlan']">编辑
              </el-button>
              <el-button
                v-if="scope.row.playPlanStatus > 0"
                type="text"
                @click="queryImplementPlan(scope.row)"
                v-hasPermi="['pro:proApprovalInfo:queryPlayPlanKxb','pro:proApprovalInfo:selectPlayPlan']">查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="会议纪要"
            align="center"
            width="150"
            fixed="right"
            class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.meetingFilePaths"
                type="text"
                :disabled="scope.row.proStatus == 8"
                @click="openUploadFile('2', scope.row)"
                v-hasPermi="['pro:proApprovalInfo:meetingSb']">上传
              </el-button>
              <el-button
                v-if="scope.row.meetingFilePaths"
                type="text"
                :disabled="scope.row.proStatus == 8"
                @click="openUploadFile('2', scope.row)"
                v-hasPermi="['pro:proApprovalInfo:meetingSb']">更新
              </el-button>
              <el-button
                v-if="scope.row.meetingFilePaths"
                type="text"
                @click="queryUploadFile('2', scope.row)"
                v-hasPermi="['pro:proApprovalInfo:meetingKxb','pro:proApprovalInfo:meetingSb']">查看
              </el-button>
<!--              <el-button-->
<!--                v-if="scope.row.meetingFilePaths"-->
<!--                type="text"-->
<!--                @click="queryUploadFile('2', scope.row)"-->
<!--                v-hasPermi="['pro:proApprovalInfo:meetingSb']">查看-->
<!--              </el-button>-->
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
    <el-dialog
      :title="option.title"
      :visible.sync="option.open"
      width="600px"
      append-to-body :close-on-click-modal="false">
      <div class="dialog-center">
        <el-form ref="fileForm" :model="fileForm" :rules="fileRules" label-width="96px">
          <el-form-item label="附件" prop="pptFilePaths">
            <upload  v-model="fileForm.pptFilePaths" :limit="1000"/>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 100px" type="primary" @click="submitForm">确 定</el-button>
        <el-button style="width: 100px"  @click="cancelClose">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="option2.title"
      :visible.sync="option2.open"
      width="600px"
      append-to-body :close-on-click-modal="false">
      <div class="dialog-center">
        <el-form ref="fileForm2" :model="fileForm2" :rules="fileRules2" label-width="96px">
          <el-form-item label="附件" prop="meetingFilePaths">
            <upload  v-model="fileForm2.meetingFilePaths" :limit="1000"/>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 100px" type="primary" @click="submitForm2">确 定</el-button>
        <el-button style="width: 100px" @click="cancelClose2">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {
  initLaunchPlayPlan,
  proInfoStartList,
  uploadLaunchMeetingFile,
  uploadLaunchPpt,
  urgingPlayPlan
} from "@/api/pro/proLaunch";

export default {
  name: "index",
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
        curYear: null
      },
      curYearTem: new Date(),
      //项目启动列表
      proLaunchList: [],
      researchFieldOptions: [],
      option: {
        title: '上传PPT',
        open: false
      },
      fileForm: {
        pptFilePaths: null
      },
      fileRules: {
        pptFilePaths: [
          {required: true, message: "上传文件不能为空", trigger: "blur"},
        ]
      },
      option2: {
        title: '上传会议纪要',
        open: false
      },
      fileForm2: {
        meetingFilePaths: null
      },
      fileRules2: {
        meetingFilePaths: [
          {required: true, message: "上传文件不能为空", trigger: "blur"},
        ]
      }
    }
  },
  created() {
    //获取接口数据
    this.getList()
    this.getDicts("project_storage_area").then(response => {
      this.researchFieldOptions = response.data;
    });
  },
  computed: {
    userRoles() {
      const kxb = 'kxbgly'
      const roles = this.$store.state.user.roles
      if (roles.length > 0) {
        return roles.some((value) => { return value === kxb })
      }
    },
    projectNameStyle() {
      return (row) => {
        return row.setupStatus === 0 ? 'project-name-all-grey' : (row.proStatus === 8 ? 'project-name-all' : 'project-name-all-hover')
      }
    }
  },
  methods: {
    /*********************** 数据获取及处理 ***********************/
    /** 获取申报待评审列表 */
    getList() {
      this.loading = true;
      this.queryParams.curYear = this.parseTime(this.curYearTem, "{y}");
      proInfoStartList(this.queryParams).then(({rows, total}) => {
        this.proLaunchList = rows;
        this.total = total;
        this.loading = false;
      });
    },
    researchFieldFormat({researchField}) {
      return this.selectDictLabel(this.researchFieldOptions, researchField);
    },

    formatterApprovalTime(row){
      return row.approvalTime.substring(0,4)
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
    //发布立项通知
    // issueProEstablishNotice() {
    //   const path = '/msgSelNotice'
    //   this.$router.push({
    //     path
    //   })
    // },
    //查看项目详情
    navProDetail(row) {
      const id = row.id
      const path = '/proManagement/proImplement/proEstablish/proMainTask'
      this.$router.push({
        'path': path,
        'query': {
          id,
          proDetailFlag: '5',
          tabActiveName: '6'
        }
      })
    },
    //跳转项目任务书
    navProPlayPlan(row) {
      const id = row.id
      const path = '/proManagement/proImplement/drawUpPlan/proPlanDetail'
      this.$router.push({
        'path': path,
        'query': {
          id,
          navPageFlag: '1'
        }
      })
    },
    //查看上传文件
    queryUploadFile(index, row) {
      const id = row.id
      const fileFlag = index
      const path = '/proManagement/proImplement/proLaunch/proLaunchDetail'
      this.$router.push({
        'path': path,
        'query': {
          id,
          fileFlag
        }
      })
    },
    //打开上传文件弹窗
    openUploadFile(index, row) {
      if ((row.setupStatus === 0 && (row.proStatus == 4 || row.proStatus == 5)) || (row.setupStatus !== 0)) {
        if (index === '1') {
          this.option.open = true
          this.fileForm.id = row.id
          this.fileForm.pptFilePaths = row.pptFilePaths
        } else {
          this.option2.open = true
          this.fileForm2.id = row.id
          this.fileForm2.meetingFilePaths = row.meetingFilePaths
        }
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //提交表单
    submitForm() {
      this.$refs["fileForm"].validate(valid => {
        if (valid) {
          uploadLaunchPpt(this.fileForm).then(() => {
            this.msgSuccess('上传成功')
            this.option.open = false
            this.getList()
          })
        }
      })
    },
    //取消关闭
    cancelClose() {
      this.option.open = false
      this.fileForm.pptFilePaths = null
    },
    //提交表单
    submitForm2() {
      this.$refs["fileForm2"].validate(valid => {
        if (valid) {
          uploadLaunchMeetingFile(this.fileForm2).then(() => {
            this.msgSuccess('上传成功')
            this.option2.open = false
            this.getList()
          })
        }
      })
    },
    //取消关闭
    cancelClose2() {
      this.option2.open = false
      this.fileForm2.meetingFilePaths = null
    },
    //科信部查询实施计划
    // queryImplementPlanKXB(row) {
    //   const id = row.id
    //   const path = '/proManagement/proImplement/proLaunch/playPlanDetailKXB'
    //   this.$router.push({
    //     'path': path,
    //     'query': {
    //       id
    //     }
    //   })
    // },
    //申报查询实施计划
    queryImplementPlan(row) {
      const id = row.id
      const path = '/proManagement/proImplement/proLaunch/playPlanDetailDeclare'
      this.$router.push({
        'path': path,
        'query': {
          id
        }
      })
    },
    //编辑实施计划
    editImplementPlan(row) {
      if ((row.setupStatus === 0 && (row.proStatus == 4 || row.proStatus == 5)) || (row.setupStatus !== 0)) {
        const id = row.id
        const path = '/proManagement/proImplement/proLaunch/playImplementPlan'
        if (row.playPlanStatus!=null) {
          this.$router.push({
            'path': path,
            'query': {
              id,
              playPlanStatus: row.playPlanStatus
            }
          })
        } else {
          initLaunchPlayPlan(id).then(() => {
            this.$router.push({
              'path': path,
              'query': {
                id,
                playPlanStatus: row.playPlanStatus  == null ? 0 : row.playPlanStatus
              }
            })
          })
        }
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //催办实施计划
    urgeImplementPlan(row) {
      if (row.setupStatus !== 0) {
        urgingPlayPlan(row.id).then(() => {
          this.msgSuccess('催办成功，请耐心等待')
        })
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //审核实施计划修改
    auditUpdateApply(row) {
      if (row.setupStatus !== 0) {
        const id = row.id
        const detailFlag = '1'
        const path = '/proManagement/proImplement/proLaunch/playPlanDetailKXB'
        this.$router.push({
          'path': path,
          'query': {
            id,
            detailFlag
          }
        })
      } else {
        this.msgError('当前项目已暂停，不可操作')
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
    .main-center {
      .project-name {
        font-size: 14px;
        cursor: pointer;
      }
    }
    .main-footer {
      width: 420px;
      margin-top: 20px;
    }
  }
  .dialog-center {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .table-data, .table-pagination {
      width: 100%;
    }
  }
}
</style>
