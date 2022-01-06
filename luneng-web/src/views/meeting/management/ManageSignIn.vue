<template>
  <div class="app-container">
    <div class="header">
      <el-row>
        <el-col>
          <el-button
            type="primary"
            icon="el-icon-back"
            @click="back">返回
          </el-button>
        </el-col>
      </el-row>
      <span class="report-name">{{ form.meetingName }}</span>
    </div>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-row :gutter="30" class="container">
          <el-col :span="8">
            <span>会议时间：{{form.meetingTime}}</span>
          </el-col>
          <el-col :span="16">
            <span>会议地点：{{form.meetingAddress}}</span>
          </el-col>
        </el-row>
        <el-row v-if="form.projectName" class="container">
          <el-col>
            <span>相关项目：{{form.projectName}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px; margin-top: 20px;">
          <el-col :span="24">
            <el-button
              @click="handleAddPerson"
              type="primary">
              {{ showSelectUser ? '取消' : '添加临时人员' }}
            </el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table
              ref="table"
              max-height="500"
              v-loading="loading"
              :data="meetingPersonList">
              <el-table-column
                label="序号"
                min-width="60"
                align="center"
                type="index">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="参会人员"
                align="center"
                prop="userName">
              </el-table-column>
              <el-table-column
                label="所属部门"
                align="center"
                prop="deptName">
              </el-table-column>
              <el-table-column
                label="操作"
                align="center">
                <template slot-scope="scope">
                  <el-button
                    @click="handleSignIn(scope.row)"
                    type="text">
                    {{scope.row.signinStatus === 0 ? '签到' : '已签到'}}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" v-show="showSelectUser">
        <select-user-list @add="addNewUser" @select="selectOldUser" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getMeetingInfo,
  getSignUserList
} from "@/api/meeting/meetingInfo";
import {addTemporaryUsers, updateMeetingUser} from "@/api/meeting/meetingUser";
import SelectUserList from './SelectUserList';

export default {
  name: "ManageSignIn",
  data() {
    return {
      fromFullPath: '/meeting/management',
      form: {},
      meetingPersonList: [],
      loading: false,
      showSelectUser: false
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    userId() {
      return this.$store.state.user.userId
    }
  },
  created() {
    this.getDetail()
    this.getSignUserList()
  },
  components: {
    SelectUserList
  },
  methods: {
    getDetail() {
      getMeetingInfo(this.id).then(({data}) => {
        this.form = data
      })
    },

    //获取参会人员列表
    getSignUserList() {
      getSignUserList({
        meetingId: this.id,
      }).then(({data}) => {
        this.meetingPersonList = data
      })
    },

    //处理签到
    handleSignIn(row) {
      updateMeetingUser({
        id: row.id,
        signinStatus: row.signinStatus === 0 ? 1 : 0
      }).then(() => {
        row.signinStatus = row.signinStatus === 0 ? 1 : 0
      })
    },

    //添加临时人员
    handleAddPerson() {
      this.showSelectUser = !this.showSelectUser
    },

    //系统不存在用户添加
    addNewUser(value) {
      let userId = value.toString()
      const userIds = [userId]
      const index = this.meetingPersonList.findIndex(item => item.userId === value)
      if (index === -1) this.addTemporaryUsers(userIds)
      if (index > -1) this.msgError('当前人员已被添加')
    },

    //系统存在用户添加
    selectOldUser(user) {
      let userId = user.userId.toString()
      const userIds = [userId]
      const index = this.meetingPersonList.findIndex(item => item.userId === user.userId)
      if (index === -1) this.addTemporaryUsers(userIds)
      if (index > -1) this.msgError('当前人员已被添加')
    },

    //提交临时参会人员
    addTemporaryUsers(userIds) {
      addTemporaryUsers({
        meetingId: this.id,
        userIds: userIds
      }).then(() => {
        this.msgSuccess('添加成功')
        this.getSignUserList()
      })
    },

    back() {
      this.closeView(this.$route.path, this.fromFullPath, 0);
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px 30px 50px 30px;
  .header {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    .report-name {
      font-size: 20px;
      line-height: 20px;
      color: #333;
      font-weight: bold;
      margin-top: 20px;
    }
  }
  .container {
    width: 100%;
    margin-bottom: 10px;
    span {
      color: #333;
      font-size: 15px;
    }
  }
}
</style>
