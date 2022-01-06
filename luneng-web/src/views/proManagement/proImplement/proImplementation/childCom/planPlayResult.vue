<template>
  <div class="plan-play-result">
    <div>
      <table class="pdf-show-table tc">
        <tr>
          <td>序号</td>
          <td>课题名称</td>
          <td>研究内容</td>
          <td>起止时间</td>
          <td>成果类型</td>
          <td>成果名称</td>
          <td>受理通知</td>
          <td>正式文件</td>
        </tr>
        <tr v-if="playPlansList.length > 0" v-for="(item, index) in playPlansList" :key="index">
          <td :rowspan="mergeRowspan(item)" v-if="index === mergeRowspan2(item)">{{index + 1}}</td>
          <td :rowspan="mergeRowspan(item)" v-if="index === mergeRowspan2(item)">{{ item.topicName }}</td>
          <td :rowspan="mergeRowspan3(item)"
              v-if="index === mergeRowspan4(item)"
              style="word-break: break-all; max-width: 300px">
            <span>{{ item.topicContent }}</span>
          </td>
          <td :rowspan="mergeRowspan3(item)" v-if="index === mergeRowspan4(item)">
            {{ item.topicPeriod | timeFormatter }}
          </td>
          <td>{{ selectDictLabel(resultTypeOptions, item.resultType) }}</td>
          <td>{{ item.resultName }}</td>
          <td>
            <el-button
              v-if="!item.acceptFilePaths"
              type="text"
              @click="openUploadFile('1', item)"
              v-hasPermi="['pro:playPlanResult:updateResult']">上传
            </el-button>
            <el-button
              v-if="item.acceptFilePaths"
              type="text"
              @click="openUploadFile('1', item)"
              v-hasPermi="['pro:playPlanResult:updateResult']">重传
            </el-button>
            <el-button
              v-if="item.acceptFilePaths"
              type="text"
              @click="queryUploadFile('1', item)">查看
            </el-button>
          </td>
          <td>
            <el-button
              v-if="!item.formalFilePaths"
              type="text"
              @click="openUploadFile('2', item)"
              v-hasPermi="['pro:playPlanResult:updateResult']">上传
            </el-button>
            <el-button
              v-if="item.formalFilePaths"
              type="text"
              @click="openUploadFile('2', item)"
              v-hasPermi="['pro:playPlanResult:updateResult']">重传
            </el-button>
            <el-button
              v-if="item.formalFilePaths"
              type="text"
              @click="queryUploadFile('2', item)">查看
            </el-button>
          </td>
        </tr>
        <tr v-if="playPlansList.length === 0">
          <td style="text-align: center" colspan="8">暂无数据</td>
        </tr>
      </table>
    </div>
    <el-dialog
      :title="option.title"
      :visible.sync="option.open"
      width="600px"
      append-to-body :close-on-click-modal="false">
      <div class="dialog-center">
        <el-form ref="fileForm" :model="fileForm" :rules="fileRules" label-width="96px">
          <el-form-item label="附件" prop="acceptFilePaths">
            <upload  v-model="fileForm.acceptFilePaths"/>
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
          <el-form-item label="附件" prop="formalFilePaths">
            <upload  v-model="fileForm2.formalFilePaths"/>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 100px" type="primary" @click="submitForm2">确 定</el-button>
        <el-button style="width: 100px"  @click="cancelClose2">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listProPlayPlanResult, updatePlanResult} from "@/api/pro/proImplementPlan";
import {getProApprovalInfo, saveProOptLog} from "@/api/pro/proApprovalInfo";

export default {
  name: "planPlayResult",
  props: {
    infoId: {
      type: Number,
      default: null
    },
    tabActiveName: {
      type: String,
      default: ''
    },
    proDetailFlag: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      playPlansList: [],
      resultTypeOptions: [],
      option: {
        title: '上传受理通知',
        open: false
      },
      fileForm: {
        acceptFilePaths: null
      },
      fileRules: {
        acceptFilePaths: [
          {required: true, message: "上传文件不能为空", trigger: "blur"},
        ]
      },
      option2: {
        title: '上传正式文件',
        open: false
      },
      fileForm2: {
        formalFilePaths: null
      },
      fileRules2: {
        formalFilePaths: [
          {required: true, message: "上传文件不能为空", trigger: "blur"},
        ]
      }
    }
  },
  created() {
    this.getListProPlayPlanResult(this.infoId)
    this.getDicts("pro_result_type").then(response => {
      this.resultTypeOptions = response.data;
    });
  },
  computed: {
    userName() {
      return this.$store.state.user.name
    }
  },
  filters: {
    timeFormatter(value) {
      if (value) {
        let valueArr = JSON.parse(value)
        return valueArr[0] + ' - ' + valueArr[1]
      } else {
        return '--'
      }
    }
  },
  methods: {
    //查询成果文件列表
    getListProPlayPlanResult(id) {
      listProPlayPlanResult(id).then(({data}) => {
        this.playPlansList = data.playPlans
        console.log(this.playPlansList)
        this.$nextTick(() => {
          this.$emit('refreshbs')
        })
      })
    },
    //查看文件
    queryUploadFile(index, item) {
      const planResultId = item.id
      const fileFlag = index
      const path = '/proManagement/proImplement/proImplementation/playResultDetail'
      this.$router.push({
        'path': path,
        'query': {
          id: this.infoId,
          planResultId,
          fileFlag,
          tabActiveName: this.tabActiveName,
          proDetailFlag: this.proDetailFlag
        }
      })
      saveProOptLog({
        infoId: item.infoId,
        operName: `查看了${fileFlag === '1' ? '受理文件' : '正式文件'}`,
        operUserName: this.userName,
        operType: 6
      }).then(() => {})
    },
    //合并列
    mergeRowspan(itemVal) {
      if (this.playPlansList && this.playPlansList.length > 0) {
        let itemValNum = 0
        this.playPlansList.forEach(item => {
          if (itemVal.topicId === item.topicId) {
            itemValNum += 1
          }
        })
        return itemValNum
      }
    },
    mergeRowspan2(itemVal) {
      const length = this.playPlansList.length
      for (let i = 0; i < length; i++) {
        if (this.playPlansList[i].topicId === itemVal.topicId) {
          return i
        }
      }
    },
    mergeRowspan3(itemVal) {
      let itemValNum = 0
      this.playPlansList.forEach(item => {
        if (itemVal.planId === item.planId) {
          itemValNum += 1
        }
      })
      return itemValNum
    },
    mergeRowspan4(itemVal) {
      const length = this.playPlansList.length
      for (let i = 0; i < length; i++) {
        if (this.playPlansList[i].planId === itemVal.planId) {
          return i
        }
      }
    },
    //打开文件
    openUploadFile(index, item) {
      getProApprovalInfo(item.infoId).then(({data}) => {
        if ((data.setupStatus === 0 && data.proStatus == 6) || (data.setupStatus !== 0)) {
          if (index === '1') {
            this.option.open = true
            this.fileForm.id = item.id
          } else {
            this.option2.open = true
            this.fileForm2.id = item.id
          }
        } else {
          this.msgError('当前项目已暂停，不可操作')
        }
      })
    },
    //提交表单
    submitForm() {
      this.$refs["fileForm"].validate(valid => {
        if (valid) {
          updatePlanResult(this.fileForm).then(() => {
            this.msgSuccess('上传成功')
            this.option.open = false
            this.fileForm.acceptFilePaths = null
            this.getListProPlayPlanResult(this.infoId)
            saveProOptLog({
              infoId: this.infoId,
              operName: '上传了受理文件',
              operUserName: this.userName,
              operType: 6
            }).then(() => {
              this.$emit('refreshlog');
            })
          })
        }
      })
    },
    //取消关闭
    cancelClose() {
      this.option.open = false
      this.fileForm.acceptFilePaths = null
    },
    //提交表单
    submitForm2() {
      this.$refs["fileForm2"].validate(valid => {
        if (valid) {
          updatePlanResult(this.fileForm2).then(() => {
            this.msgSuccess('上传成功')
            this.option2.open = false
            this.fileForm2.formalFilePaths = null
            this.getListProPlayPlanResult(this.infoId)
            saveProOptLog({
              infoId: this.infoId,
              operName: '上传了正式文件',
              operUserName: this.userName,
              operType: 6
            }).then(() => {
              this.$emit('refreshlog');
            })
          })
        }
      })
    },
    //取消关闭
    cancelClose2() {
      this.option2.open = false
      this.fileForm2.formalFilePaths = null
    }
  }
}
</script>

<style lang="scss" scoped>
.plan-play-result {
  width: 100%;
  display: flex;
  flex-direction: column;
  .pdf-show-table {
    tr {
      font-size: 18px;
      color: #000000;
    }
    tr:nth-of-type(1) {
      font-size: 18px;
      font-weight: bold;
      color: #666;
      background-color: #f8f8f9;
    }
  }
}
</style>
