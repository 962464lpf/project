<template>
  <div class="app-container">
    <div class="header">
      <span class="report-name">{{ form.meetingName }}</span>
      <div>
        <el-button
          type="primary"
          v-if="!showReceiptContent"
          v-hasPermi="['meeting:meetingInfo:sendReceipt']"
          @click="confirm">确认回执
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-back"
          @click="back">返回
        </el-button>
      </div>
    </div>
    <div class="main-top" style="margin-bottom: 10px">
      <el-row :gutter="30" style="margin-bottom: 10px">
        <el-col :span="1.5">
          <span>会议时间：{{form.meetingTime}}</span>
        </el-col>
        <el-col :span="1.5">
          <span>会议地点：{{form.meetingAddress}}</span>
        </el-col>
      </el-row>
      <el-row v-if="form.projectName" style="margin-bottom: 10px">
        <el-col>
          <span>相关项目：{{form.projectName}}</span>
        </el-col>
      </el-row>
<!--      <el-row style="margin-bottom: 10px">-->
<!--        <el-col :span="1.5">-->
<!--          <span>会议议程：</span>-->
<!--        </el-col>-->
<!--        <el-col :span="18">-->
<!--          <div class="rich-text" v-html="form.meetingAgenda"></div>-->
<!--        </el-col>-->
<!--      </el-row>-->
    </div>
    <div v-hasPermi="['meeting:meetingInfo:option']" class="main-center">
      <el-table
        ref="table"
        max-height="600"
        v-loading="loading"
        :data="meetingPersonList">
        <el-table-column
          label="序号"
          min-width="60"
          align="center"
          fixed="left"
          type="index">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="回执人"
          align="center"
          prop="userName"
          fixed="left"
          min-width="130">
        </el-table-column>
        <el-table-column
          label="所属单位"
          align="center"
          fixed="left"
          prop="userAndDeptName"
          min-width="260">
        </el-table-column>
        <el-table-column
          label="回执时间"
          align="center"
          min-width="115"
          fixed="left"
          :formatter="receiptTimeFormat"
          prop="receiptTime">
        </el-table-column>
        <el-table-column
          label="回执内容(参会人员)"
          align="left"
          min-width="800"
          prop="participants">
          <template slot-scope="scope">
            <el-row :gutter="15" v-for="(item, index) in scope.row.participants" :key="item.phonenumber" style="margin-bottom: 5px;">
              <el-col :span="5"><span>姓名：{{item.nickName}}</span></el-col>
              <el-col :span="10"><span>所属单位：{{item.deptName}}</span></el-col>
              <el-col :span="9"><span>联系方式：{{item.phonenumber}}</span></el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-hasPermi="['meeting:meetingInfo:sendReceipt']" class="main-center">
      <div v-if="!showReceiptContent">
        <el-row style="margin-bottom: 10px">
          <el-col :span="1.5">
            <span>回执内容：</span>
          </el-col>
          <el-col :span="1.5">
            <el-select v-model="joinMeetingIds" multiple placeholder="请选择本部门参会人员">
              <el-option
                v-for="item in joinMeetingList"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
                style="width: 100%;"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>

      <div v-if="showReceiptContent">
        <el-row style="margin-bottom: 10px">
          <el-col :span="1.5">
            <span>回执内容：</span>
          </el-col>
          <el-col :span="20">
            <el-row :gutter="15" v-for="(item, index) in joinMeetingList2" :key="item.phonenumber" style="margin-bottom: 10px;">
              <el-col :span="4"><span>姓名：{{item.nickName}}</span></el-col>
              <el-col :span="9"><span>所属单位：{{item.deptName}}</span></el-col>
              <el-col :span="7"><span>联系方式：{{item.phonenumber}}</span></el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import {getMeetingInfo, getNoticeReceipt, getNoticeReceiptList, saveNoticeReceipt} from "@/api/meeting/meetingInfo";
import {listAllMeetingUser} from "@/api/meeting/meetingUser";

export default {
  name: "NoticeReceipt",
  data() {
    return {
      fromFullPath: '',
      form: {},
      showReceiptContent: false,
      joinMeetingIds: [],
      joinMeetingList: [],
      joinMeetingList2: [],
      meetingPersonList: [],
      loading: false
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    userId() {
      return this.$store.state.user.userId
    },
    userInfo() {
      return this.$store.state.user.userInfo
    },
    receiptStatusFormat() {
      return ({receiptStatus}) => {
        return receiptStatus === 0 ? '未确认' : '已确认'
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fromFullPath = from.fullPath
    })
  },
  created() {
    this.getDetail()
    this.getNoticeReceiptList()
    this.getNoticeReceipt()
    this.getCanMeetList()
  },
  methods: {
    getDetail() {
      getMeetingInfo(this.id).then(({data}) => {
        this.form = data
      })
    },

    receiptTimeFormat(row) {
      return row.receiptTime ? row.receiptTime : '未读'
    },

    //获取当前用户的所在部门可参会列表
    getCanMeetList() {
      listAllMeetingUser({deptId: this.userInfo.deptId}).then((response) => {
        this.joinMeetingList = response.data
      })
    },

    //获取回执详情
    getNoticeReceipt() {
      getNoticeReceipt({
        meetingId: this.id,
      }).then(({data}) => {
        if (data && data.participants && data.participants.length > 0) {
          this.joinMeetingList2 = data.participants
          this.showReceiptContent = true
        }
      })
    },

    getNoticeReceiptList() {
      getNoticeReceiptList({
        meetingId: this.id
      }).then(({data}) => {
        this.meetingPersonList = data
      })
    },

    confirm() {
      if (this.joinMeetingIds && this.joinMeetingIds.length > 0) {
        saveNoticeReceipt({
          meetingId: this.id,
          userId: this.userId,
          userIds: this.joinMeetingIds
        }).then(() => {
          this.msgSuccess('回执成功')
          this.back()
        })
      } else {
        this.msgError('请先填写回执内容')
      }
    },

    back() {
      this.closeView(this.$route.path, this.fromFullPath, 100);
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
      font-size: 18px;
    }
  }
  .main-center {
    width: 100%;
    margin-top: 20px;
    span {
      color: #333;
      font-size: 18px;
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
