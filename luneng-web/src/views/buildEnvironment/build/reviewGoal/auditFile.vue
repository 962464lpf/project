<template>
  <div class="app-container">
    <div class="header">
      <div class="pro-name">
        <span v-if="greenBuildInfo.projectName">{{greenBuildInfo.projectName}}</span>
        <div class="pro-name-subtitle">
          <span v-if="greenBuildInfo.createByName">{{ greenBuildInfo.createByName }}</span>
          <span>编制于</span>
          <span v-if="greenBuildInfo.createTime">{{ greenBuildInfo.createTime | proCreateTime }}</span>
        </div>
      </div>
      <div class="option-btn">
        <div class="option-btn-item2">
          <el-button
            v-if="detailFlag === '0'"
            type="primary"
            icon="el-icon-back"
            @click="backPage">返回
          </el-button>
        </div>
        <div class="option-btn-item" v-if="detailFlag !== '0'">
          <el-button
            type="primary"
            icon="el-icon-back"
            @click="backPage">返回
          </el-button>
          <el-button
            type="success"
            v-hasPermi="['pro:proPlanInfo:audit']"
            @click="submitConfirm">同意
          </el-button>
          <el-button
            type="warning"
            v-hasPermi="['pro:proPlanInfo:audit']"
            @click="submitWithdraw">退回
          </el-button>
        </div>
      </div>
    </div>
    <div class="main">
      <iframe
        v-if="pdfUrl"
        :src="pdfUrl"
        frameborder="0"
        style="width: 100%;height: calc(100vh - 170px);">
      </iframe>
    </div>
    <div class="footer">
      <el-tabs v-model="activeName">
        <el-tab-pane label="操作日志" name="0">
          <el-table ref="table" :data="optLogDataList">
            <el-table-column width="300" prop="operNickName" label="操作人" align="center"/>
            <el-table-column prop="operName" label="操作事件" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.operName }}</span>
              </template>
            </el-table-column>
            <el-table-column width="300" prop="createTime" label="操作时间" align="center"/>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </el-tab-pane>
        <el-tab-pane label="审核日志" name="1">
          <el-table ref="table1" :data="auditLogDataList">
            <el-table-column width="300" prop="operNickName" label="操作人" align="center"/>
            <el-table-column prop="operName" label="操作事件" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.operName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="filePaths" label="审批附件" align="center">
              <template slot-scope="scope">
                <upload style="justify-content: center" v-model="scope.row.filePaths" :edit="false"></upload>
              </template>
            </el-table-column>
            <el-table-column width="300" prop="createTime" label="操作时间" align="center"/>
          </el-table>
          <pagination
            v-show="total1 > 0"
            :total="total1"
            :page.sync="queryParams1.pageNum"
            :limit.sync="queryParams1.pageSize"
            @pagination="getList1"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      :visible.sync="open"
      width="600px"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false">
      <div class="dialog-center">
        <el-form ref="opinionForm" :model="opinionForm" :rules="opinionRules" label-width="96px">
          <el-form-item label="审批意见" prop="remark">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入该审批的流转意见"
              maxlength="200"
              show-word-limit
              v-model="opinionForm.remark"
              style="width: 100%; margin-bottom: 10px">
            </el-input>
          </el-form-item>
          <el-form-item label="附件" prop="filePath">
            <upload v-model="opinionForm.filePath" :limit="100"/>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 100px" type="primary" @click="submitForm">确 定</el-button>
        <el-button style="width: 100px" @click="cancelClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getBuildInfo, getOperLog, operation} from "@/api/build/buildInfo";

export default {
  name: "auditFile",
  data() {
    return {
      //跳转携带信息
      detailFlag: null,
      id: null,
      otherDetailFlag: null,
      proDetailFlag: null,
      tabActiveName: null,
      //弹窗信息
      open: false,
      openType: 1,
      //当前项目信息
      greenBuildInfo: {},
      //操作日志
      activeName: '0',
      optLogDataList: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        infoId: null,
        type: 1
      },
      //审核日志
      auditLogDataList: [],
      total1: 0,
      queryParams1: {
        pageNum: 1,
        pageSize: 10,
        infoId: null,
        type: 2
      },
      //审批弹窗
      opinionForm: {
        infoId: null,
        operation: null,
        remark: '',
        filePath: ''
      },
      opinionRules: {
        remark: [
          {required: true, message: "审批意见不能为空", trigger: "blur", pattern: '[^ \x22]+'}
        ]
      },
      pdfUrl: undefined
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getGreenBuildProDetail(this.id)
      this.getList()
      this.getList1()
    }
    if (this.$route.query.detailFlag) {
      this.detailFlag = this.$route.query.detailFlag
    }
    if (this.$route.query.otherDetailFlag) {
      this.otherDetailFlag = this.$route.query.otherDetailFlag
    }
    if (this.$route.query.proDetailFlag) {
      this.proDetailFlag = this.$route.query.proDetailFlag
    }
    if (this.$route.query.tabActiveName) {
      this.tabActiveName = this.$route.query.tabActiveName
    }
  },
  computed: {
    userName() {
      return this.$store.state.user.name
    }
  },
  filters: {
    proCreateTime(value) {
      if (value) {
        return value.toString().substr(0, 10)
      }
    }
  },
  methods: {
    //获取项目信息
    getGreenBuildProDetail(id) {
      getBuildInfo(id).then(({data}) => {
        this.greenBuildInfo = data
        if (data.targetSuggestionsFile){
          let filePath = JSON.parse(data.targetSuggestionsFile);
          this.pdfUrl = filePath[0].response.url;
        }else if(data.targetSuggestionsPdfFile){
          this.pdfUrl = data.targetSuggestionsPdfFile;
        }
      })
    },
    //获取操作日志
    getList() {
      this.queryParams.infoId = this.id
      getOperLog(this.queryParams).then(({rows, total}) => {
        this.optLogDataList = rows
        this.total = total
      })
    },
    //获取审核日志
    getList1() {
      this.queryParams1.infoId = this.id
      getOperLog(this.queryParams1).then(({rows, total}) => {
        this.auditLogDataList = rows
        this.total1 = total
      })
    },
    //同意计划书
    submitConfirm() {
      this.open = true
      this.openType = 1
    },
    //退回计划书
    submitWithdraw() {
      this.open = true
      this.openType = 2
    },
    //提交审批
    submitForm() {
      getBuildInfo(this.id).then(({data}) => {
        if (data.approvalStatus === 3) {
          this.submitFormInfo()
        } else if (data.approvalStatus === 4){
          this.msgInfo('该项目已审核通过')
        } else if (data.approvalStatus === 5) {
          this.msgInfo('该项目已退回')
        } else {
          this.msgInfo('该项目还没编制或正在编制中')
        }
      })
    },
    //提交审批信息
    submitFormInfo() {
      this.$refs["opinionForm"].validate(valid => {
        if (valid) {
          this.opinionForm.infoId = this.id
          if (this.openType === 1) {
            this.opinionForm.operation = 2
            operation(this.opinionForm).then(()=>{
              this.cancelClose()
              this.msgSuccess("审核通过")
              this.closeView("/buildEnvironment/build/reviewGoal/auditFile", "/buildEnvironment/build/reviewGoal", 0)
            })
          } else {
            this.opinionForm.operation = 3
            operation(this.opinionForm).then(()=>{
              this.cancelClose()
              this.msgSuccess("退回成功");
              this.closeView("/buildEnvironment/build/reviewGoal/auditFile", "/buildEnvironment/build/reviewGoal", 0)
            })
          }
        }
      })
    },
    cancelClose() {
      this.open = false
      this.$refs["opinionForm"].resetFields();
    },
    backPage() {
      if (this.proDetailFlag) {
        this.closeView("/buildEnvironment/build/buildProject/targetBookDetail", "/buildEnvironment/build/buildProject/buildProDetail?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 0)
      } else {
        if (this.detailFlag !== '0') {
          this.closeView("/buildEnvironment/build/reviewGoal/auditFile", "/buildEnvironment/build/reviewGoal", 0)
        } else {
          if (this.otherDetailFlag === '1') {
            this.closeView("/buildEnvironment/build/buildProject/targetBookDetail", "/buildEnvironment/build/confirmGoal", 0)
          } else {
            this.closeView("/buildEnvironment/build/buildProject/targetBookDetail", "/buildEnvironment/build/reviewGoal", 0)
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 30px 50px 30px;
  .header {
    width: 100%;
    display: flex;
    margin-bottom: 20px;
    .option-btn {
      width: 30%;
      display: flex;
      height: 30px;
      .option-btn-item {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
      .option-btn-item2 {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
    .pro-name {
      width: 70%;
      display: flex;
      flex-direction: column;
      font-size: 24px;
      font-weight: bold;
      .pro-name-subtitle {
        margin-top: 20px;
        font-size: 18px;
        color: #666;
      }
    }
  }
  .main {
    width: 100%;
    margin: 20px 0;
  }
  .footer {
    width: 100%;
  }
  .dialog-center {
    display: flex;
    flex-direction: column;
  }
}
</style>
