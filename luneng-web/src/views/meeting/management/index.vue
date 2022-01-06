<template>
  <div class="app-container">
    <div class="header">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true">
        <el-form-item label="会议名称" prop="meetingName">
          <el-input
            v-model="queryParams.meetingName"
            placeholder="请输入会议名称"
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
              v-hasPermi="['meeting:meetingInfo:add']"
              @click="addMeeting">新增会议
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          :data="meetingList">
          <el-table-column
            label="序号"
            width="55"
            align="center"
            type="index">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="会议名称"
            align="center"
            prop="meetingName">
          </el-table-column>
          <el-table-column
            label="会议地点"
            align="center"
            width="130"
            prop="meetingAddress">
          </el-table-column>
          <el-table-column
            label="会议时间"
            align="center"
            width="160"
            :formatter="meetingTimeFormat"
            prop="meetingTime">
          </el-table-column>
          <el-table-column
            label="文件"
            align="center"
            class-name="small-padding fixed-width"
            fixed="right"
            width="240">
            <template slot-scope="scope">
              <el-button
                @click="queryAgenda(scope.row)"
                type="text">
                会议议程
              </el-button>
              <el-button
                @click="queryReceipt(scope.row)"
                v-if="scope.row.agendaPublishStatus==1"
                type="text">
                回执
              </el-button>
              <el-button
                @click="manageSignIn(scope.row)"
                v-hasPermi="['meeting:meetingInfo:option']"
                :disabled="parseInt(scope.row.status) < 1"
                type="text">
                签到表
              </el-button>
              <el-button
                :disabled="parseInt(scope.row.status) < 1"
                @click="queryRecord(scope.row)"
                type="text">
                会议记录
              </el-button>
              <el-button
                :disabled="parseInt(scope.row.status) < 2"
                @click="querySummary(scope.row)"
                type="text">
                会议纪要
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            align="center"
            width="140"
            class-name="small-padding fixed-width"
            fixed="right"
            prop="status">
            <template slot-scope="scope">
              <div v-if="meetingOption">
                <el-select
                  v-model="scope.row.status"
                  :disabled="scope.row.archivingStatus === 1"
                  @change="changeStatus(scope.row)"
                  style="width: 100px">
                  <el-option
                    v-for="dict in meetingStatusList"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </div>
              <div v-else>
                <span>{{ selectDictLabel(meetingStatusList, scope.row.status) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="meetingOption"
            label="是否作废"
            align="center"
            class-name="small-padding fixed-width"
            fixed="right"
            width="120">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.archivingStatus"
                @change="changeArchive(scope.row)"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
              {{scope.row.archivingStatus === 0 ? '作废' : '已作废'}}
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
    <!-- 权限 -->
    <div v-hasPermi="['meeting:meetingInfo:option']" id="meeting-option"></div>
  </div>
</template>

<script>
import {archiveMeeting, changeMeetingStatus, listMeetingInfo} from "@/api/meeting/meetingInfo";

export default {
  name: "index",
  data() {
    return {
      // 加载等待线
      loading: false,
      // 总条数
      total: 0,
      // 搜索框查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        meetingName: ''
      },
      meetingList: [],
      meetingStatusList: [
        {
          label: '未开始',
          value: '0'
        },
        {
          label: '进行中',
          value: '1'
        },
        {
          label: '已结束',
          value: '2'
        },
        {
            label: '已作废',
            value: '3'
        }
      ],
      meetingOption: false
    }
  },

  created() {
    //获取接口数据
    this.getList()
  },

  mounted() {
    this.meetingOption = !!document.getElementById('meeting-option')
  },

  computed: {
    userId() {
      return this.$store.state.user.userId
    },
    userName() {
      return this.$store.state.user.name
    },
    meetingTimeFormat() {
      return ({meetingTime}) => {
        return meetingTime.substr(0, 16)
      }
    }
  },

  methods: {
    /*********************** 数据获取及处理 ***********************/
    /** 获取申报待评审列表 */
    getList() {
      this.loading = true;
      listMeetingInfo(this.queryParams).then(({rows, total}) => {
        this.meetingList = rows;
        this.total = total;
        this.loading = false;
      });
    },
    /*********************** 交互操作 ***********************/
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    //新增会议
    addMeeting() {
      this.$router.push({
        path: '/meeting/management/add'
      })
    },

    //查看议程
    queryAgenda(row) {
      this.$router.push({
        path: '/meeting/management/queryAgenda',
        query: {
          id: row.id
        }
      })
    },

    //查看回执列表
    queryReceipt(row) {
      this.$router.push({
        path: '/meeting/management/noticeReceipt',
        query: {
          id: row.id
        }
      })
    },

    //查看签到表
    manageSignIn(row) {
      this.$router.push({
        path: '/meeting/management/manageSignIn',
        query: {
          id: row.id
        }
      })
    },

    //查看会议记录
    queryRecord(row) {
      this.$router.push({
        path: '/meeting/management/editMeetingRecord',
        query: {
          id: row.id
        }
      })
    },

    //查看会议纪要
    querySummary(row) {
      this.$router.push({
        path: '/meeting/management/editMeetingSummary',
        query: {
          id: row.id
        }
      })
    },

    changeStatus(row) {
      changeMeetingStatus({
        id: row.id,
        status: row.status
      }).then(() => {
        this.msgSuccess('设置成功！')
        this.getList()
      })
    },

    changeArchive(row) {
      this.$confirm(`是否确认${row.archivingStatus === 1 ? '作废' : '取消作废'}该会议?`, "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return archiveMeeting({id: row.id, archiveStatus: row.archivingStatus})
      }).then(() => {
        this.msgSuccess(`${row.archivingStatus === 1 ? '作废' : '取消作废'}成功`)
        this.getList()
      }).catch(() => {
        row.archivingStatus = row.archivingStatus === 0 ? 1 : 0;
      });
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
    }
    .main-footer {
      width: 420px;
      margin-top: 20px;
    }
    .project-name {
      font-size: 14px;
      cursor: pointer;
    }
  }
  .dialog-center {
    display: flex;
    flex-direction: column;
  }
  .report-list {
    cursor: pointer;
  }
}
</style>
