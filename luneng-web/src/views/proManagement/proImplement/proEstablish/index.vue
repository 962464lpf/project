<template>
  <div class="app-container">
    <div class="header">
      <el-form
        v-if="searchToggle"
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
        <el-form-item label="申报单位" prop="declareUnit">
          <el-input
            v-model="queryParams.declareUnit"
            placeholder="请输入申报单位"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="实施单位" prop="implementationUnit">
          <el-input
            v-model="queryParams.implementationUnit"
            placeholder="请输入实施单位"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleQuery"
          />
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
              @click="selReservePro"
              v-hasPermi="['pro:proApprovalInfo:getStorageInfoList']">选择立项项目
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-document-add"
              @click="moveReservePro"
              :disabled="multiple"
              v-hasPermi="['pro:proApprovalInfo:moveApprovalInfos']">移至储备库
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              @click="handleExport"
              v-hasPermi="['pro:proApprovalInfo:export']">导出Excel
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-s-promotion"
              @click="issueProEstablishNotice"
              v-hasPermi="['sel:selNotice:add']">发布立项通知
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          :data="proEstablishList"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="40"
            align="center"/>
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
            width="100"
            label="项目编码"
            align="center"
            prop="projectCode"/>
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
            width="120"
            label="项目总投入(万元)"
            align="center"
            prop="totalInvestment">
          </el-table-column>
          <el-table-column
            width="200"
            label="申报单位"
            align="center"
            prop="declareUnit">
          </el-table-column>
          <el-table-column
            width="200"
            label="承担单位"
            align="center"
            prop="undertakeUnit"/>
          <el-table-column
            width="120"
            label="项目类别"
            align="center"
            prop="projectType"/>
          <el-table-column
            width="120"
            label="项目属性"
            align="center"
            :formatter="proAttrFormat"
            prop="projectAttr"/>
          <el-table-column
            width="150"
            label="研究领域"
            align="center"
            :formatter="researchFieldFormat"
            prop="researchField"/>
          <el-table-column
            width="100"
            label="开始时间"
            align="center"
            prop="proBeginDate"/>
          <el-table-column
            width="100"
            label="结束时间"
            align="center"
            prop="proEndDate"/>
<!--          <el-table-column-->
<!--            width="100"-->
<!--            label="主要研究内容"-->
<!--            align="center"-->
<!--            prop="mainContent"-->
<!--            show-overflow-tooltip/>-->
<!--          <el-table-column-->
<!--            width="100"-->
<!--            label="预期目标"-->
<!--            align="center"-->
<!--            prop="expectedTarget"-->
<!--            show-overflow-tooltip/>-->
          <el-table-column
            width="200"
            label="实施单位"
            align="center"
            prop="implementationUnit"/>
          <el-table-column
            width="120"
            label="下年计划总投入(万元)"
            align="center"
            prop="planInvestment">
          </el-table-column>
          <el-table-column
            width="100"
            label="分级评分"
            align="center"
            prop="reviewResult"
            :formatter="reviewResultFormatter">
          </el-table-column>
          <el-table-column
            width="100"
            label="项目状态"
            align="center"
            prop="proStatus"
            :formatter="proStatusFormatter">
          </el-table-column>
          <el-table-column
            label="项目进度"
            align="center"
            :formatter="proStatusFormatter"
            class-name="small-padding fixed-width"
            :width="this.proEstablishList.length > 0 ? '600' : '100'"
            fixed="right">
            <template slot-scope="scope">
              <div class="pro-progress">
                <div class="pro-progress-item" :class="proProgressStyle(1, scope.row)">
                  <span>{{ proProgressTitle(1, scope.row) }}</span>
                  <span>{{ proProgressTime(1, scope.row) }}</span>
                </div>
                <div class="pro-progress-item" :class="proProgressStyle(2, scope.row)">
                  <span>{{ proProgressTitle(2, scope.row) }}</span>
                  <span>{{ proProgressTime(2, scope.row) }}</span>
                </div>
                <div class="pro-progress-item" :class="proProgressStyle(3, scope.row)">
                  <span>{{ proProgressTitle(3, scope.row) }}</span>
                  <span>{{ proProgressTime(3, scope.row) }}</span>
                </div>
                <div class="pro-progress-item" :class="proProgressStyle(4, scope.row)">
                  <span>{{ proProgressTitle(4, scope.row) }}</span>
                  <span>{{ proProgressTime(4, scope.row) }}</span>
                </div>
                <div class="pro-progress-item" :class="proProgressStyle(5, scope.row)">
                  <span>{{ proProgressTitle(5, scope.row) }}</span>
                  <span>{{ proProgressTime(5, scope.row) }}</span>
                </div>
                <div class="pro-progress-item" :class="proProgressStyle(6, scope.row)">
                  <span>{{ proProgressTitle(6, scope.row) }}</span>
                  <span>{{ proProgressTime(6, scope.row) }}</span>
                </div>
                <div class="pro-progress-item" :class="proProgressStyle(7, scope.row)">
                  <span>{{ proProgressTitle(7, scope.row) }}</span>
                  <span>{{ proProgressTime(7, scope.row) }}</span>
                </div>
                <div class="pro-progress-item" :class="proProgressStyle(8, scope.row)">
                  <span>{{ proProgressTitle(8, scope.row) }}</span>
                  <span>{{ proProgressTime(8, scope.row) }}</span>
                </div>
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
    <!-- 选择立项项目对话框 -->
    <reserve-pro-dialog :dialog-option="dialogOption" @selSuccess="selProSuccess"/>
    <!-- 选择补充资料对话框 -->
<!--    <el-dialog
      :title="dialogOption2.title"
      :visible.sync="dialogOption2.open"
      width="40%"
      append-to-body :close-on-click-modal="false">
      <div class="dialog-center">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          :inline="true">
          <el-form-item label="项目编码" prop="projectCode">
            <el-input
              v-model="form.projectCode"
              placeholder="请填写项目编码"
              clearable
              style="width: 300px"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 100px" type="primary" @click="submitConfirm2">确 定</el-button>
        <el-button style="width: 100px" @click="cancelClose2">取 消</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
  import ReserveProDialog from './childCom/ReserveProDialog'
  import {
    exportProApprovalInfo,
    listProApprovalInfo,
    moveStorageInfo,
    saveProOptLog,
    validProjectCode
  } from "@/api/pro/proApprovalInfo";
  export default {
    name: "",
    data() {
      const validProjectCodeFun = (rule, value, callback) => {
        if (!value) {
          callback(new Error("项目编码不能为空！"))
        } else if (!(/^52[\dA-Za-z]{10}$/.test(value))) {
          callback(new Error("编码格式为52开头后跟10位数字或字母！"))
        } else {
          console.log(this.form);
          validProjectCode(this.form).then(response => {
            if (!response.data) {
              callback(new Error('项目编码已存在！'))
            } else {
              callback()
            }
          })
        }
      }
      return {
        searchToggle: true,
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
          declareUnit: '',
          implementationUnit: '',
          curYear: null
        },
        curYearTem: new Date(),
        //立项项目列表
        proEstablishList: [],
        //对话框一
        dialogOption: {
          title: '选择立项项目',
          open: false
        },
        //对话框二
        dialogOption2: {
          title: '补充主数据',
          open: false
        },
        form: {
          id: null,
          projectCode: null
        },
        rules: {
          projectCode: [
            {required: true, validator: validProjectCodeFun, trigger: 'blur'}
            // {required: true, message: "项目编码不能为空", trigger: "blur"},
            // {max: 20, message: "", trigger: "blur"}
          ]
        },
        proStatusOptions: [],
        proLevelOptions: [],
        researchFieldOptions: [],
        proAttrOptions: []
      }
    },
    created() {
      //获取接口数据
      this.getList()
      //获取字典数据
      this.getDicts("pro_establish_status").then(response => {
        this.proStatusOptions = response.data;
      });
      this.getDicts("project_storage_level").then(response => {
        this.proLevelOptions = response.data;
      });
      this.getDicts("project_storage_area").then(response => {
        this.researchFieldOptions = response.data;
      });
      this.getDicts("project_storage_attri").then(response => {
        this.proAttrOptions = response.data;
      });
    },
    computed: {
      userName() {
        return this.$store.state.user.name
      },
      projectNameStyle() {
        return (row) => {
          return row.setupStatus === 0 ? 'project-name-all-grey' : (row.proStatus === 8 ? 'project-name-all' : 'project-name-all-hover')
        }
      }
    },
    filters: {
      formatterTime(value) {
        if (value) {
          return value.replace(/-/g, '.').toString().substr(2, 8)
        }
      }
    },
    components: {
      ReserveProDialog
    },
    methods: {
      /*********************** 数据获取及处理 ***********************/
      /** 获取申报待评审列表 */
      getList() {
        this.loading = true;
        this.queryParams.curYear = this.parseTime(this.curYearTem, "{y}");
        listProApprovalInfo(this.queryParams).then(({rows, total}) => {
          this.proEstablishList = rows;
          this.total = total;
          this.loading = false;
        });
      },
      //表格项目状态格式
      proStatusFormatter({proStatus, setupStatus}) {
        if (setupStatus === 0) {
          return '项目暂停'
        } else {
          return this.selectDictLabel(this.proStatusOptions, proStatus * 1);
        }
      },
      reviewResultFormatter({reviewResult}) {
        if (reviewResult) {
          return this.selectDictLabel(this.proLevelOptions, reviewResult)
        } else {
          return '--'
        }
      },
      researchFieldFormat({researchField}) {
        return this.selectDictLabel(this.researchFieldOptions, researchField);
      },
      proAttrFormat({projectAttr}) {
        return this.selectDictLabel(this.proAttrOptions, projectAttr);
      },
      proProgressStyle(index, row) {
        switch (index) {
          case 1:
            if (row.setupStatus !== 0) {
              if ((row.proStatus * 1) >= 1) {
                return 'color-change'
              } else {
                return ''
              }
            } else {
              return 'color-change-grey'
            }
          case 2:
            if (row.setupStatus !== 0) {
              if ((row.proStatus * 1) >= 2) {
                return 'color-change'
              } else {
                return ''
              }
            } else {
              return 'color-change-grey'
            }
          case 3:
            if (row.setupStatus !== 0) {
              if ((row.proStatus * 1) >= 3) {
                return 'color-change'
              } else {
                return ''
              }
            } else {
              return 'color-change-grey'
            }
          case 4:
            if (row.setupStatus !== 0) {
              if ((row.proStatus * 1) >= 4) {
                return 'color-change'
              } else {
                return ''
              }
            } else {
              return 'color-change-grey'
            }
          case 5:
            if (row.setupStatus !== 0) {
              if ((row.proStatus * 1) >= 5) {
                return 'color-change'
              } else {
                return ''
              }
            } else {
              return 'color-change-grey'
            }
          case 6:
            if (row.setupStatus !== 0) {
              if ((row.proStatus * 1) >= 6) {
                return 'color-change'
              } else {
                return ''
              }
            } else {
              return 'color-change-grey'
            }
          case 7:
            if (row.setupStatus !== 0) {
              if ((row.proStatus * 1) >= 7) {
                return 'color-change'
              } else {
                return ''
              }
            } else {
              return 'color-change-grey'
            }
          case 8:
            if (row.setupStatus !== 0) {
              if ((row.proStatus * 1) >= 8) {
                return 'color-change'
              } else {
                return ''
              }
            } else {
              return 'color-change-grey'
            }
        }
      },
      proProgressTitle(index, row) {
        switch (index) {
          case 1:
            if ((row.proStatus * 1) === 1 && row.setupStatus === 0) {
              return '已暂停'
            } else {
              return '立项'
            }
          case 2:
            if ((row.proStatus * 1) === 2 && row.setupStatus === 0) {
              return '已暂停'
            } else {
              return '计划'
            }
          case 3:
            if ((row.proStatus * 1) === 3 && row.setupStatus === 0) {
              return '已暂停'
            } else {
              return '招采'
            }
          case 4:
            if ((row.proStatus * 1) === 4 && row.setupStatus === 0) {
              return '已暂停'
            } else {
              return '合同'
            }
          case 5:
            if ((row.proStatus * 1) === 5 && row.setupStatus === 0) {
              return '已暂停'
            } else {
              return '启动'
            }
          case 6:
            if ((row.proStatus * 1) === 6 && row.setupStatus === 0) {
              return '已暂停'
            } else {
              return '实施'
            }
          case 7:
            if ((row.proStatus * 1) === 7 && row.setupStatus === 0) {
              return '已暂停'
            } else {
              return '结题'
            }
          case 8:
            if ((row.proStatus * 1) === 8 && row.setupStatus === 0) {
              return '已暂停'
            } else {
              return '验收'
            }
        }
      },
      proProgressTime(index, row) {
        switch (index) {
          case 1:
            if (row.setupStatus === 0 && (row.proStatus * 1) === 1) {
              const updateTime = this.parseTime(row.updateTime, '{y}-{m}-{d}')
              if (updateTime) {
                return updateTime.toString().replace(/-/g, '.').substr(2, 8)
              } else {
                return '--'
              }
            } else {
              let approvalTime = this.parseTime(row.approvalTime, '{y}-{m}-{d}')
              if (approvalTime) {
                return approvalTime.toString().replace(/-/g, '.').substr(2, 8)
              } else {
                return '--'
              }
            }
          case 2:
            if (row.setupStatus === 0 && (row.proStatus * 1) === 2) {
              const updateTime = this.parseTime(row.updateTime, '{y}-{m}-{d}')
              if (updateTime) {
                return updateTime.toString().replace(/-/g, '.').substr(2, 8)
              } else {
                return '--'
              }
            } else {
              let planAuditTime = this.parseTime(row.planAuditTime, '{y}-{m}-{d}')
              if (planAuditTime) {
                return planAuditTime.toString().replace(/-/g, '.').substr(2, 8)
              } else {
                return '--'
              }
            }
          case 3:
            if (row.setupStatus === 0 && (row.proStatus * 1) === 3) {
              const updateTime = this.parseTime(row.updateTime, '{y}-{m}-{d}')
              if (updateTime) {
                return updateTime.toString().replace(/-/g, '.').substr(2, 8)
              } else {
                return '--'
              }
            } else {
              let calibrationTime = this.parseTime(row.calibrationTime, '{y}-{m}-{d}')
              if (calibrationTime) {
                return calibrationTime.toString().replace(/-/g, '.').substr(2, 8)
              } else {
                return '--'
              }
            }
          case 4:
            if (row.setupStatus === 0 && (row.proStatus * 1) === 4) {
              const updateTime = this.parseTime(row.updateTime, '{y}-{m}-{d}')
              if (updateTime) {
                return updateTime.toString().replace(/-/g, '.').substr(2, 8)
              } else {
                return '--'
              }
            } else {
              let contractDate = this.parseTime(row.contractDate, '{y}-{m}-{d}')
              if (contractDate) {
                return contractDate.toString().replace(/-/g, '.').substr(2, 8)
              } else {
                return '--'
              }
            }
          case 5:
            if (row.setupStatus === 0 && (row.proStatus * 1) === 5) {
              const updateTime = this.parseTime(row.updateTime, '{y}-{m}-{d}')
              if (updateTime) {
                return updateTime.toString().replace(/-/g, '.').substr(2, 8)
              } else {
                return '--'
              }
            } else {
              let playStartTime = this.parseTime(row.playStartTime, '{y}-{m}-{d}')
              if (playStartTime) {
                return playStartTime.toString().replace(/-/g, '.').substr(2, 8)
              } else {
                return '--'
              }
            }
          case 6:
            if (row.setupStatus === 0 && (row.proStatus * 1) === 6) {
              const updateTime = this.parseTime(row.updateTime, '{y}-{m}-{d}')
              if (updateTime) {
                return updateTime.toString().replace(/-/g, '.').substr(2, 8)
              } else {
                return '--'
              }
            } else {
              let playPlanTime = this.parseTime(row.playPlanTime, '{y}-{m}-{d}')
              if (playPlanTime) {
                return playPlanTime.toString().replace(/-/g, '.').substr(2, 8)
              } else {
                return '--'
              }
            }
          case 7:
            if (row.setupStatus === 0 && (row.proStatus * 1) === 7) {
              const updateTime = this.parseTime(row.updateTime, '{y}-{m}-{d}')
              if (updateTime) {
                return updateTime.toString().replace(/-/g, '.').substr(2, 8)
              } else {
                return '--'
              }
            } else {
              let concludeSuccessTime = this.parseTime(row.concludeSuccessTime, '{y}-{m}-{d}')
              if (concludeSuccessTime) {
                return concludeSuccessTime.toString().replace(/-/g, '.').substr(2, 8)
              } else {
                return '--'
              }
            }
          case 8:
            if (row.setupStatus === 0 && (row.proStatus * 1) === 8) {
              const updateTime = this.parseTime(row.updateTime, '{y}-{m}-{d}')
              if (updateTime) {
                return updateTime.toString().replace(/-/g, '.').substr(2, 8)
              } else {
                return '--'
              }
            } else {
              let checkTime = this.parseTime(row.checkTime, '{y}-{m}-{d}')
              if (checkTime) {
                return checkTime.toString().replace(/-/g, '.').substr(2, 8)
              } else {
                return '--'
              }
            }
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
        this.ids = selection.map(item => {
          if (item.proStatus == 8) {
            return undefined
          } else {
            return item.id
          }
        })
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      //打开对话框查询立项项目
      selReservePro() {
        this.dialogOption.open = true
      },
      //选择立项项目成功
      selProSuccess() {
        this.handleQuery();
      },
      //移至储备库
      moveReservePro() {
        const acceptanceFlag = this.ids.some((item) => item === undefined)
        if (!acceptanceFlag) {
          const ids = this.ids;
          this.$confirm('当前所选移至储备库后，已完成的环节数据将被清除', "系统提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(function () {
            return moveStorageInfo(ids);
          }).then(() => {
            this.getList();
            this.msgSuccess("移至储备库成功");
            saveProOptLog({
              infoId: row.id,
              operName: '移至了储备库',
              operUserName: this.userName,
              operType: 1
            }).then(() => {
            })
          }).catch(function () {
          })
        } else {
          this.msgError('当前所选包含已验收的项目，无法移至储备库，请重新选择')
        }
      },
      //导出Excel
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有项目立项信息数据项?', "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportProApprovalInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function () {
        });
      },
      //发布立项通知
      issueProEstablishNotice() {
        const path = '/msgSelNotice'
        this.$router.push({
          path
        })
      },
      //查看项目详情
      navProDetail(row) {
        const id = row.id
        const path = '/proManagement/proImplement/proEstablish/proMainTask'
        this.$router.push({
          'path': path,
          'query': {
            id,
            proDetailFlag: '1'
          }
        })
      },
      //编辑项目
      // editProject(row) {
      //   const id = row.id
      //   const path = '/proManagement/proImplement/proEstablish/editProInfo'
      //   this.$router.push({
      //     'path': path,
      //     'query': {
      //       id
      //     }
      //   })
      // },
      //补充主数据
      // addMainData(row) {
      //   this.resetForm("form");
      //   this.form.id = row.id
      //   if (row.projectCode) {
      //     this.dialogOption2.title = '修改主数据'
      //     this.form.projectCode = row.projectCode
      //   }
      //   this.dialogOption2.open = true
      // },
      //提交确认补充
      // submitConfirm2() {
      //   this.$refs["form"].validate(valid => {
      //     if (valid) {
      //       updateProApprovalInfo(this.form).then(({code}) => {
      //         if (code === 200) {
      //           this.dialogOption2.open = false
      //           this.msgSuccess("提交成功")
      //           this.getList()
      //           saveProOptLog({
      //             infoId: this.form.id,
      //             operName: '补充了主数据',
      //             operUserName: this.userName,
      //             operType: 1
      //           }).then(() => {
      //           })
      //         }
      //       })
      //     }
      //   })
      // },
      //取消补充
      cancelClose2() {
        this.dialogOption2.open = false
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

      .main-top {
        width: 100%;
      }

      .main-center {
        width: 100%;

        .pro-progress {
          display: flex;
          .pro-progress-item {
            display: flex;
            flex-direction: column;
            font-size: 16px;
            margin-right: 3px;
            flex: 1;
          }

          .color-change {
            color: #11A983;
          }

          .color-change-grey {
            color: #A9A9A9;
          }
        }
      }

      .main-footer {
        width: 420px;
        margin-top: 20px;
      }
    }
  }
</style>
