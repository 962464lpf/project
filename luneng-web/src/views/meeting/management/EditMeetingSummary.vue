<template>
  <div class="app-container">
    <div class="header">
      <el-button
        v-hasPermi="['meeting:meetingInfo:option']"
        type="primary"
        :disabled="!form.meetingMinutesDraft"
        @click="releaseNotice">{{ form.minutesPublishStatus === 1 ? '重新发布' : '纪要发布' }}
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
    <div v-if="showUpdateFlag" class="main-center">
      <template v-if="!form.meetingMinutesFilePaths">
        <span style="color: #333; font-size: 20px; padding-left: 50px;">暂无会议纪要</span>
      </template>
      <template v-if="form.meetingMinutesFilePaths">
        <pdf-view :src="form.meetingMinutesFilePaths" />
      </template>
    </div>
    <div v-if="!showUpdateFlag" class="main-center">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="会议名称：" prop="meetingName">
          <el-input
            :disabled="true"
            v-model="form.meetingName"
            placeholder="请填写会议名称"
            maxLength="30"
          />
        </el-form-item>
        <el-form-item label="会议时间：" prop="meetingTime">
          <el-date-picker
            clearable
            :disabled="true"
            style="width: 300px"
            v-model="form.meetingTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择记录时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="会议地点：" prop="meetingAddress">
          <el-input
            :disabled="true"
            v-model="form.meetingAddress"
            placeholder="请填写会议地点"
            maxLength="30"
          />
        </el-form-item>
        <el-form-item label="相关项目：" prop="projectId">
          <el-select
            :disabled="true"
            v-model="form.projectId"
            placeholder="请选择相关项目"
            style="width: 300px"
            filterable
            clearable>
            <el-option
              v-for="dict in projectNameList"
              :key="dict.infoId"
              :label="dict.projectName"
              :value="dict.infoId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="参会人员：" prop="userIds">
          <div class="tag-list">
            <el-tag
              style="margin: 5px; width: 90px; text-align: center"
              type="info"
              v-for="item in form.userNames"
              :key="item.userId">
              {{ item.nickName }}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item label="会议纪要：" prop="meetingMinutesDraft">
          <ueditor
            v-model="form.meetingMinutesDraft"
            placeholder="请填写会议纪要" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import PdfView from "@/components/PdfView";
import {getMeetingInfo, getProjectOptions, saveMeetingMinutes} from "@/api/meeting/meetingInfo";
import Ueditor from '@/components/Ueditor';

export default {
  name: 'EditMeetingSummary',
  data() {
    return {
      // 表单参数
      showUpdateFlag: true,
      form: {},
      fromFullPath: '',
      projectNameList: [],
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

    getProjectList() {
      getProjectOptions().then(({data}) => {
        this.projectNameList = data
      })
    },

    releaseNotice() {
      this.$confirm('是否确认发布通知?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return saveMeetingMinutes({
          id: this.id,
          meetingMinutesDraft: this.form.meetingMinutesDraft,
          minutesPublishStatus: 1
        });
      }).then(() => {
        this.msgSuccess("发布成功")
        this.showUpdateFlag = true
        this.getDetail()
      }).catch(() => {});
    },

    isShowUpdate() {
      if (this.showUpdateFlag) {
        this.showUpdateFlag = false
      } else {
        if (this.form.meetingMinutesDraft) {
          saveMeetingMinutes({
            id: this.form.id,
            meetingMinutesDraft: this.form.meetingMinutesDraft
          }).then(() => {
            this.msgSuccess("保存成功")
            this.showUpdateFlag = true
            this.getDetail()
          })
        } else {
          this.msgError('请先填写会议纪要')
        }
      }
    },
    // 取消按钮
    back(time = 0) {
      this.closeView(this.$route.path, '/meeting/management', time);
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
    justify-content: flex-end;
    margin-bottom: 20px;
  }
  .main-center {
    width: 100%;
    margin-top: 20px;
    padding-right: 300px;
  }
}
</style>
