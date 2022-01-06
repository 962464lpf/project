<template>
  <div class="app-container">
    <div class="option-btn">
      <el-button
        v-hasPermi="['meeting:meetingInfo:add']"
        type="primary"
        @click="releaseNotice">{{ form.agendaPublishStatus === 0 ? '通知发布' : '重新发布' }}
      </el-button>
      <el-button
        v-hasPermi="['meeting:meetingInfo:add']"
        type="primary"
        @click="isShowUpdate">{{ showUpdateFlag ? '修改' : '保存' }}
      </el-button>
      <el-button
        type="primary"
        @click="cancel">返回
      </el-button>
    </div>
    <div class="app-section">
      <template v-if="showUpdateFlag">
        <pdf-view :src="form.meetingAgendaFilePaths" />
      </template>
      <template v-if="!showUpdateFlag">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
              <el-form-item label="会议名称：" prop="meetingName">
                <el-input
                  v-model="form.meetingName"
                  placeholder="请填写会议名称"
                  maxLength="30"
                />
              </el-form-item>
              <el-form-item label="会议时间：" prop="meetingTime">
                <el-date-picker
                  clearable
                  style="width: 300px"
                  v-model="form.meetingTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择会议时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="会议地点：" prop="meetingAddress">
                <el-input
                  v-model="form.meetingAddress"
                  placeholder="请填写会议地点"
                  maxLength="30"
                />
              </el-form-item>
              <el-form-item label="相关项目：" prop="projectId">
                <el-select
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
                <draggable
                  v-if="selMeetingPerson.length > 0"
                  class="tag-list"
                  v-model="selMeetingPerson"
                  :forceFallback="true"
                  dragClass="dragClass"
                  @start="isDragging1 = true"
                  @end="isDragging1 = false">
                  <transition-group>
                    <el-tag
                      style="margin: 5px; width: 90px; text-align: center; cursor: move"
                      type="success"
                      effect="plain"
                      closable
                      v-for="(item, index) in selMeetingPerson"
                      :key="item.userId"
                      @close="deleteMeetingUser(index)">
                      <span>{{ item.nickName }}</span>
                    </el-tag>
                  </transition-group>
                </draggable>
                <span v-if="selMeetingPerson.length === 0"
                      style="color: #999999; font-size: 14px;">
                  请在右边操作添加参会人员
                </span>
              </el-form-item>
              <el-form-item label="会议议程：" prop="meetingAgendaDraft">
                <ueditor
                  v-model="form.meetingAgendaDraft"
                  placeholder="请填写会议议程" />
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8">
            <select-user-list @add="addNewUser" @select="selectOldUser" />
          </el-col>
        </el-row>
      </template>
    </div>

    <el-dialog
      :visible.sync="open"
      :close-on-click-modal="false"
      title="发布会议"
      width="600px"
      append-to-body
      center>
      <div class="dialog-center">
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px">
          <span style="font-size: 15px;">发送通知至以下人员：</span>
          <el-button
            type="danger"
            @click="allCancelNotice">
            全部取消
          </el-button>
        </div>
        <div style="border-bottom: 1px solid #eaeaea; padding-bottom: 5px; min-height: 100px;">
          <draggable
            v-model="newSelMeetingPerson"
            :forceFallback="true"
            dragClass="dragClass"
            @start="isDragging = true"
            @end="isDragging = false">
            <transition-group>
              <el-tag
                type="success"
                effect="plain"
                closable
                style="width: 90px; margin: 5px; text-align: center; user-select: none;"
                v-for="(item, index) in newSelMeetingPerson"
                :key="item.userId"
                @close="deleteNoticeMeetingUser(index)">
                <span>{{ item.nickName }}</span>
              </el-tag>
            </transition-group>
          </draggable>
        </div>
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin: 10px 0;">
          <span style="font-size: 15px;">点击添加：</span>
          <el-button
            type="primary"
            @click="allSelectNotice">
            全部选择
          </el-button>
        </div>
        <div style="min-height: 100px;">
          <el-tag
            type="success"
            effect="plain"
            style="width: 90px; margin: 5px; text-align: center; user-select: none;"
            v-for="(item, index) in newUnMeetingPerson"
            :key="item.userId">
            <div style="width: 100%; display: flex; justify-content: center;">
              <span>{{ item.nickName }}</span>
              <i class="el-icon-plus"
                 @click="addNoticeMeetingUser(index)"
                 style="display: flex; justify-content: center; align-items: center; margin-left: 5px; font-size: 12px; cursor: pointer;"></i>
            </div>
          </el-tag>
        </div>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 100px" type="primary" @click="submitForm">通知发布</el-button>
        <el-button style="width: 100px"  @click="cancelClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addMeetingInfo,
  getMeetingInfo,
  getProjectOptions,
  updateMeetingInfo
} from "@/api/meeting/meetingInfo";

import PdfView from "@/components/PdfView";
import Ueditor from '@/components/Ueditor';
import SelectUserList from './SelectUserList';
import draggable from 'vuedraggable'

export default {
  name: 'add',
  data() {
    return {
      // 表单参数
      showUpdateFlag: false,

      form: {
        id: undefined,
        meetingName: '',
        meetingTime: '',
        meetingAddress: '',
        projectId: '',
        userIds: [],
        noticeUserIds: [],
        meetingAgendaDraft: '',
        agendaPublishStatus: 0,
        meetingStatus: 0,
        minutesPublishStatus: 0,
        archivingStatus: 0
      },

      // 表单校验
      rules: {
        meetingName: [
          { required: true, message: "会议名称不能为空", trigger: "blur" }
        ],
        meetingTime: [
          { required: true, message: "会议时间不能为空", trigger: "blur" }
        ],
        meetingAddress: [
          { required: true, message: "会议地点不能为空", trigger: "blur" }
        ],
        userIds: [
          { required: true, message: "参会人员不能为空", trigger: "blur" },
        ],
        meetingAgendaDraft: [
          { required: true, message: "会议议程不能为空", trigger: "blur" },
        ]
      },

      fromFullPath: '/meeting/management',
      projectNameList: [],
      isDragging1: null,
      selMeetingPerson: [],

      open: false,
      newSelMeetingPerson: [],
      newUnMeetingPerson: [],
      isDragging: null
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  components: {
    PdfView,
    draggable,
    Ueditor,
    SelectUserList
  },
  created() {
    this.getProjectList()
    this.showUpdateFlag = !!this.id
    if (this.$route.query.updateFlag && this.$route.query.updateFlag === '2') this.showUpdateFlag = false
    if (this.id && !this.$route.query.updateFlag) this.getDetail()
  },
  methods: {
    getProjectList() {
      getProjectOptions().then(({data}) => {
        this.projectNameList = data
      })
    },

    getDetail() {
      getMeetingInfo(this.id).then(({data}) => {
        this.form = data
        this.selMeetingPerson = data.userNames
      })
    },

    addNewUser(value) {
      const user = {
        userId: value,
        nickName: value
      }
      const index = this.selMeetingPerson.findIndex(item => item.userId === value)
      if (index === -1) this.selMeetingPerson.push(user)
      if (index > -1) this.msgError('当前人员已被添加')
    },

    selectOldUser(user) {
      const index = this.selMeetingPerson.findIndex(item => item.userId === user.userId)
      if (index === -1) this.selMeetingPerson.push(user)
      if (index > -1) this.msgError('当前人员已被添加')
    },

    deleteMeetingUser(index) {
      this.selMeetingPerson.splice(index, 1)
    },

    //发布通知
    releaseNotice() {
      if (!this.showUpdateFlag) {
        this.form.userIds = this.selMeetingPerson.map(item => {
          return item.userId.toString()
        })
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.open = true
            this.newUnMeetingPerson = [...this.selMeetingPerson]
          }
        })
      } else {
        this.open = true
        this.newUnMeetingPerson = [...this.selMeetingPerson]
      }
    },

    //确认发布通知按钮
    submitForm() {
      if (this.id) {
        this.updateMeeting(1)
      } else {
        this.addMeeting(1)
      }
    },

    //保存按钮
    isShowUpdate() {
      if (this.id && this.showUpdateFlag) { //查看，点击修改
        this.showUpdateFlag = false
      } else if (this.id && !this.showUpdateFlag) { //查看修改后保存
        this.updateMeeting(2)
      } else if (!this.id && !this.showUpdateFlag) { //新增
        this.addMeeting(2)
      }
    },

    //增加发布通知的参会人
    addNoticeMeetingUser(index) {
      this.newSelMeetingPerson.unshift(this.newUnMeetingPerson.splice(index, 1)[0])
    },

    //删除发布通知的参会人
    deleteNoticeMeetingUser(index) {
      this.newUnMeetingPerson.unshift(this.newSelMeetingPerson.splice(index, 1)[0])
    },

    //全部选择发布通知
    allSelectNotice() {
      this.newSelMeetingPerson.unshift(...this.newUnMeetingPerson)
      this.newUnMeetingPerson = []
    },

    //全部取消发布通知
    allCancelNotice() {
      this.newUnMeetingPerson.unshift(...this.newSelMeetingPerson)
      this.newSelMeetingPerson = []
    },

    //新增会议
    addMeeting(flag) {
      this.form.userIds = this.selMeetingPerson.map(item => {
        return item.userId.toString()
      })
      if (flag === 2) { //新增保存
        this.form.noticeUserIds = []
        this.form.agendaPublishStatus = 0
      } else if (flag === 1) { //新增发布
        this.form.noticeUserIds = this.newSelMeetingPerson.map(item => {
          return item.userId.toString()
        })
        this.form.agendaPublishStatus = 1
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          addMeetingInfo(this.form).then(() => {
            this.msgSuccess(`${flag === 1 ? '发布成功' : '保存成功'}`)
            this.cancel()
          })
        }
      })
    },

    //修改会议
    updateMeeting(flag) {
      this.form.userIds = this.selMeetingPerson.map(item => {
        return item.userId.toString()
      })
      if (flag === 2) { //修改保存
        this.form.noticeUserIds = []
      } else if (flag === 1) { //修改发布
        this.form.noticeUserIds = this.newSelMeetingPerson.map(item => {
          return item.userId.toString()
        })
        this.form.agendaPublishStatus = 1
      }
      if (!this.showUpdateFlag) {
        this.$refs["form"].validate(valid => {
          if (valid) {
            updateMeetingInfo(this.form).then(() => {
              this.msgSuccess(`${flag === 1 ? '发布成功' : '保存成功'}`)
              this.showUpdateFlag = true
              this.open = false
              this.getDetail()
            })
          }
        })
      } else {
        updateMeetingInfo(this.form).then(() => {
          this.msgSuccess(`${flag === 1 ? '发布成功' : '保存成功'}`)
          this.showUpdateFlag = true
          this.open = false
          this.getDetail()
        })
      }
    },

    //取消发布
    cancelClose() {
      this.open = false
      this.newSelMeetingPerson = []
      this.newUnMeetingPerson = []
    },

    // 取消按钮
    cancel(time = 0) {
      this.closeView(this.$route.path, this.fromFullPath, time);
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px 20px 50px 20px;
  .option-btn {
    width: 100%;
    padding-right: 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }
  .app-section {
    width: 100%;
  }
  .tag-list {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .dialog-center {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .dialog-center-section {
      width: 100%;
    }
    .dialog-center-footer {
      width: 100%;
    }
  }
  .dragClass {
    border-color: red !important;
    background: red !important;
    color: #fff !important;
  }
}
</style>
