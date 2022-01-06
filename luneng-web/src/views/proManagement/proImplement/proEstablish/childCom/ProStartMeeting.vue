<template>
  <div class="pro-start-meeting">
    <el-table
      ref="table"
      :data="proLaunchList">
      <el-table-column
        label="PPT"
        align="center">
        <template slot-scope="scope">
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
            v-hasPermi="['pro:proApprovalInfo:pptKxb', 'pro:proApprovalInfo:pptSb']">查看
          </el-button>
          <el-button
            v-if="!scope.row.pptFilePaths"

            type="text"
            :disabled="scope.row.proStatus == 8"
            @click="openUploadFile('1', scope.row)"
            v-hasPermi="['pro:proApprovalInfo:pptSb']">上传
          </el-button>

<!--          <el-button-->
<!--            v-if="scope.row.pptFilePaths"-->
<!--            -->
<!--            type="text"-->
<!--            @click="queryUploadFile('1', scope.row)"-->
<!--            v-hasPermi="['pro:proApprovalInfo:pptSb']">查看-->
<!--          </el-button>-->
        </template>
      </el-table-column>
      <el-table-column
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
            v-hasPermi="['pro:proApprovalInfo:queryPlayPlanKxb', 'pro:proApprovalInfo:selectPlayPlan']">查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="会议纪要"
        align="center">
        <template slot-scope="scope">
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
            v-hasPermi="['pro:proApprovalInfo:meetingKxb', 'pro:proApprovalInfo:meetingSb']">查看
          </el-button>
          <el-button
            v-if="!scope.row.meetingFilePaths"

            type="text"
            :disabled="scope.row.proStatus == 8"
            @click="openUploadFile('2', scope.row)"
            v-hasPermi="['pro:proApprovalInfo:meetingSb']">上传
          </el-button>

<!--          <el-button-->
<!--            v-if="scope.row.meetingFilePaths"-->
<!--            -->
<!--            type="text"-->
<!--            @click="queryUploadFile('2', scope.row)"-->
<!--            v-hasPermi="['pro:proApprovalInfo:meetingSb']">查看-->
<!--          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
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
        <el-button style="width: 100px" type="primary"  @click="submitForm">确 定</el-button>
        <el-button style="width: 100px"   @click="cancelClose">取 消</el-button>
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
        <el-button style="width: 100px" type="primary"  @click="submitForm2">确 定</el-button>
        <el-button style="width: 100px"   @click="cancelClose2">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {initLaunchPlayPlan, uploadLaunchMeetingFile, uploadLaunchPpt, urgingPlayPlan} from "@/api/pro/proLaunch";

export default {
  name: "ProStartMeeting",
  props: {
    formInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    proDetailFlag: {
      type: String,
      default: ''
    },
    tabActiveName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      proLaunchList: [],
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
  computed: {
    formInfoTem() {
      return this.formInfo
    }
  },
  watch: {
    formInfoTem: {
      handler(newValue) {
        if (newValue && newValue.id) {
          this.proLaunchList = []
          this.proLaunchList.push(newValue)
        }
      },
      immediate:true
    }
  },
  methods: {
    //查看文件
    queryUploadFile(index, row) {
      const id = row.id
      const fileFlag = index
      const path = '/proManagement/proImplement/proLaunch/proLaunchDetail'
      this.$router.push({
        'path': path,
        'query': {
          id,
          fileFlag,
          proDetailFlag: this.proDetailFlag,
          tabActiveName: this.tabActiveName
        }
      })
    },
    //打开上传文件弹窗
    openUploadFile(index, row) {
      if ((row.setupStatus === 0 && (row.proStatus == 4 || row.proStatus == 5)) || (row.setupStatus !== 0)) {
        if (row.planStatus == 3 && row.proStatus >= 4) {
          if (index === '1') {
            this.option.open = true
            this.fileForm.id = row.id
          } else {
            this.option2.open = true
            this.fileForm2.id = row.id
          }
        } else {
          this.msgError('当前项目未通过审核或没进行到当前阶段，不可操作')
        }
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //提交PPT
    submitForm() {
      this.$refs["fileForm"].validate(valid => {
        if (valid) {
          uploadLaunchPpt(this.fileForm).then(() => {
            this.msgSuccess('上传成功')
            this.option.open = false
            this.$emit('refreshList')
          })
        }
      })
    },
    //取消关闭
    cancelClose() {
      this.option.open = false
      this.fileForm.pptFilePaths = null
    },
    //提交会议纪要
    submitForm2() {
      this.$refs["fileForm2"].validate(valid => {
        if (valid) {
          uploadLaunchMeetingFile(this.fileForm2).then(() => {
            this.msgSuccess('上传成功')
            this.option2.open = false
            this.$emit('refreshList')
          })
        }
      })
    },
    //取消关闭
    cancelClose2() {
      this.option2.open = false
      this.fileForm2.meetingFilePaths = null
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
            detailFlag,
            proDetailFlag: this.proDetailFlag,
            tabActiveName: this.tabActiveName
          }
        })
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //科信部查询实施计划
    // queryImplementPlanKXB(row) {
    //   const id = row.id
    //   const path = '/proManagement/proImplement/proLaunch/playPlanDetailKXB'
    //   this.$router.push({
    //     'path': path,
    //     'query': {
    //       id,
    //       proDetailFlag: this.proDetailFlag,
    //       tabActiveName: this.tabActiveName
    //     }
    //   })
    // },
    //申报编辑实施计划
    editImplementPlan(row) {
      if ((row.setupStatus === 0 && (row.proStatus == 4 || row.proStatus == 5)) || (row.setupStatus !== 0)) {
        if (row.planStatus == 3 && row.proStatus >= 4) {
          const id = row.id
          const path = '/proManagement/proImplement/proLaunch/playImplementPlan'
          if (row.playPlanStatus!=null) {
            this.$router.push({
              'path': path,
              'query': {
                id,
                proDetailFlag: this.proDetailFlag,
                tabActiveName: this.tabActiveName,
                playPlanStatus: row.playPlanStatus
              }
            })
          } else {
            initLaunchPlayPlan(id).then(() => {
              this.$router.push({
                'path': path,
                'query': {
                  id,
                  proDetailFlag: this.proDetailFlag,
                  tabActiveName: this.tabActiveName,
                  playPlanStatus: row.playPlanStatus  == null ? 0 : row.playPlanStatus
                }
              })
            })
          }
        } else {
          this.msgError('当前项目未通过审核或没进行到当前阶段，不可操作')
        }
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //申报催办实施计划
    urgeImplementPlan(row) {
      if (row.setupStatus !== 0) {
        urgingPlayPlan(row.id).then(() => {
          this.msgSuccess('催办成功，请耐心等待')
        })
      } else {
        this.msgError('当前项目已暂停，不可操作')
      }
    },
    //申报查询实施计划
    queryImplementPlan(row) {
      const id = row.id
      const path = '/proManagement/proImplement/proLaunch/playPlanDetailDeclare'
      this.$router.push({
        'path': path,
        'query': {
          id,
          proDetailFlag: this.proDetailFlag,
          tabActiveName: this.tabActiveName
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
