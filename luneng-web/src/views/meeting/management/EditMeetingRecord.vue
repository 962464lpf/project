<template>
  <div class="app-container">
    <div class="header">
      <span class="report-name">{{ form.meetingName }}</span>
      <div>
        <el-button
          v-hasPermi="['meeting:meetingInfo:option']"
          type="primary"
          :disabled="form.status === '2'"
          @click="finishMeeting">{{ form.status === '2' ? '已结束' : '结束会议' }}
        </el-button>
        <el-button
          v-hasPermi="['meeting:meetingInfo:option']"
          type="primary"
          @click="isShowUpdate">{{ showUpdateFlag ? '编辑' : '保存' }}
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-back"
          @click="back">返回
        </el-button>
      </div>
    </div>
    <div class="main-top">
      <el-row :gutter="30" style="margin-bottom: 10px">
        <el-col :span="1.5">
          <span>会议时间：{{form.meetingTime}}</span>
        </el-col>
        <el-col :span="1.5">
          <span>会议地点：{{form.meetingAddress}}</span>
        </el-col>
      </el-row>
      <el-row v-if="form.projectName">
        <el-col>
          <span>相关项目：{{form.projectName}}</span>
        </el-col>
      </el-row>
    </div>
    <div class="main-center">
      <el-row>
        <el-col :span="1.5">
          <span>会议记录：</span>
        </el-col>
        <el-col v-if="showUpdateFlag" :span="18">
          <div class="rich-text" v-html="form.meetingRecord"></div>
        </el-col>
        <el-col v-if="!showUpdateFlag" :span="18">
          <ueditor
            v-model="form.meetingRecord"
            placeholder="请填写会议记录" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import PdfView from "@/components/PdfView";
import {finishMeeting, getMeetingInfo, saveMeetingRecord} from "@/api/meeting/meetingInfo";
import Ueditor from '@/components/Ueditor';

export default {
  name: 'EditMeetingRecord',
  data() {
    return {
      // 表单参数
      showUpdateFlag: true,
      form: {},
      fromFullPath: ''
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  components: {
    PdfView,
    Ueditor
  },
  created() {
    if (this.id) this.getDetail()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fromFullPath = from.fullPath
    })
  },
  methods: {
    getDetail() {
      getMeetingInfo(this.id).then(({data}) => {
        this.form = data
      })
    },

    finishMeeting() {
      this.$confirm('是否确认结束会议?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return finishMeeting({
          id: this.id
        });
      }).then(() => {
        this.msgSuccess("已结束会议");
        this.closeView(this.$route.path, '/meeting/management/editMeetingSummary?id='+this.id, 100);
      }).catch(() => {});
    },

    isShowUpdate() {
      if (this.showUpdateFlag) {
        this.showUpdateFlag = false
      } else {
        if (this.form.meetingRecord && this.form.meetingRecord !== '') {
          saveMeetingRecord({
            id: this.form.id,
            meetingRecord: this.form.meetingRecord
          }).then(() => {
            this.showUpdateFlag = true
            this.getDetail()
          })
        } else {
          this.msgError('请先填写会议记录')
        }
      }
    },
    // 取消按钮
    back(time = 0) {
      this.closeView(this.$route.path, this.fromFullPath, time);
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    .report-name {
      font-size: 20px;
      line-height: 20px;
      color: #333;
      font-weight: bold;
    }
  }
  .main-top {
    width: 100%;
    span {
      color: #333;
      font-size: 15px;
    }
  }
  .main-center {
    width: 100%;
    margin-top: 20px;
    span {
      color: #333;
      font-size: 15px;
    }
  }
  .main-footer {
    width: 100%;
  }
  .rich-text {
    ::v-deep img {
      max-width: 100% !important;
      height: auto !important;
    }
    ::v-deep video {
      max-width: 100% !important;
      height: auto !important;
    }
    ::v-deep p {
      max-width: 100% !important;
      word-break: break-all;
    }
    ::v-deep span {
      max-width: 100% !important;
      word-break: break-all;
    }
    ::v-deep table {
      max-width: 100% !important;
    }
  }
}
</style>
