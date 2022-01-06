<template>
  <div class="pro-launch-detail">
    <div class="header">
      <div class="option-btn">
        <el-button
          type="primary"
          @click="backPage">返回
        </el-button>
      </div>
      <div class="pro-name">
        <span v-if="proApprovalInfo.projectName">{{proApprovalInfo.projectName}}</span>
        <div class="pro-name-subtitle">
          <span v-if="uploadFilePerson">{{ uploadFilePerson + '上传于' }}</span>
          <span v-if="uploadFileTime">{{ uploadFileTime | proCreateTime }}</span>
        </div>
      </div>
    </div>
    <div class="main">
      <upload
        :edit="false"
        v-model="uploadFilePaths"
      />
    </div>
    <div class="footer">
      <el-tabs v-model="activeName">
        <el-tab-pane label="历史版本" name="0">
          <div class="table-data">
            <el-table
              ref="table"
              :data="fileHistoryList">
              <el-table-column
                label="序号"
                align="center"
                type="index">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="文件名"
                align="center"
                prop="hisFilePaths"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <upload
                    :edit="false"
                    v-model="scope.row.hisFilePaths"/>
                </template>
              </el-table-column>
              <el-table-column
                label="上传人"
                align="center"
                prop="createBy"
                show-overflow-tooltip />
              <el-table-column
                label="上传时间"
                align="center"
                prop="createTime"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {getProApprovalInfo} from "@/api/pro/proApprovalInfo";

export default {
  name: "proLaunchDetail",
  data() {
    return {
      fileFlag: null,
      id: null,
      proDetailFlag: null,
      proApprovalInfo: {},
      activeName: '0',
      tabActiveName: null,
      fileHistoryList:[]
    }
  },
  created() {
    if (this.$route.query.fileFlag) {
      this.fileFlag = this.$route.query.fileFlag
    }
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getProApprovalInfoDetail(this.id)
    }
    if (this.$route.query.proDetailFlag) {
      this.proDetailFlag = this.$route.query.proDetailFlag
    }
    if (this.$route.query.tabActiveName) {
      this.tabActiveName = this.$route.query.tabActiveName
    }
  },
  computed: {
    uploadFilePerson() {
      if (this.fileFlag === '1') {
        return this.proApprovalInfo.pptFileCreateBy
      } else {
        return this.proApprovalInfo.meetingFileCreateBy
      }
    },
    uploadFileTime() {
      if (this.fileFlag === '1') {
        return this.proApprovalInfo.pptFileCreateTime
      } else {
        return this.proApprovalInfo.meetingFileCreateTime
      }
    },
    uploadFilePaths() {
      if (this.fileFlag === '1') {
        if (this.proApprovalInfo.pptFilePaths) {
          return this.proApprovalInfo.pptFilePaths
        }
      } else {
        return this.proApprovalInfo.meetingFilePaths
      }
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
    getProApprovalInfoDetail(id) {
      getProApprovalInfo(id).then(({data}) => {
        this.proApprovalInfo = data
          if (this.fileFlag === '1') {
              this.fileHistoryList = this.proApprovalInfo.pptFileHisList
          } else {
              this.fileHistoryList = this.proApprovalInfo.meetingFileHisList
          }
      })
    },
    backPage() {
      if (this.proDetailFlag) {
        this.closeView("/proManagement/proImplement/proLaunch/proLaunchDetail", "/proManagement/proImplement/proEstablish/proMainTask?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 0)
      } else {
        this.closeView("/proManagement/proImplement/proLaunch/proLaunchDetail", "/proManagement/proImplement/proLaunch", 0)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pro-launch-detail {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 30px 50px 30px;
  .header {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    .option-btn {
      width: 100%;
      display: flex;
      margin-bottom: 10px;
      .option-btn-item {
        margin-left: 20px;
      }
    }
    .pro-name {
      width: 100%;
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
