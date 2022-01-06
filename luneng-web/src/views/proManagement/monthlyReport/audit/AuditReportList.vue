<template>
  <div class="app-container">
    <div class="header">
      <el-row>
        <el-col :span="18">
          <el-button
            type="primary"
            @click="backPage">返回
          </el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :span="18">
          <span class="project-name">{{ projectName }}</span>
        </el-col>
      </el-row>
    </div>

    <div class="main">
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          :data="reportList">
          <el-table-column
            label="序号"
            min-width="55"
            align="center"
            type="index">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="140"
            label="月报时间"
            align="center"
            :formatter="reportTimeFormat"
            prop="reportTime">
          </el-table-column>
          <el-table-column
            min-width="130"
            label="工作月报"
            align="center"
            prop="reportName">
          </el-table-column>
          <el-table-column
            min-width="160"
            label="提交时间"
            align="center"
            prop="submitTime">
          </el-table-column>
          <el-table-column
            label="状态"
            align="center"
            width="160"
            prop="reportStatus"
            :formatter="reportStatusFormat">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="200">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.reportStatus === 3"
                type="text"
                :disabled="scope.row.reportStatus === 3">
                已退回
              </el-button>
              <el-button
                v-if="scope.row.reportStatus === 1 || scope.row.reportStatus === 2"
                @click="onWithdraw(scope.row)"
                type="text">
                退回
              </el-button>
              <el-button
                v-if="scope.row.reportStatus === 1 || scope.row.reportStatus === 2"
                @click="onQuery(scope.row)"
                type="text">
                查看
              </el-button>
              <el-button
                v-if="scope.row.reportStatus === 1 || scope.row.reportStatus === 2"
                @click="onDownload(scope.row)"
                type="text">
                下载
              </el-button>
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
    <el-dialog
      :visible.sync="open"
      width="600px"
      append-to-body
      :close-on-click-modal="false">
      <div class="dialog-center">
        <el-form ref="opinionForm" :model="opinionForm" :rules="opinionRules" label-width="96px">
          <el-form-item label="退回缘由：" prop="backReason">
            <el-input
              type="textarea"
              placeholder="请输入退回缘由"
              maxlength="200"
              show-word-limit
              v-model="opinionForm.backReason"
              :rows="3"
              style="width: 100%; margin-bottom: 10px">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 100px" type="primary" @click="submitForm">确 定</el-button>
        <el-button style="width: 100px"  @click="cancelClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  changeStatusReportRecord,
  listProMonthReportRecord
} from "@/api/pro/proMonthReportRecord";

export default {
  name: "AuditReportList",
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
        reportId: null,
        auditFlag: 1
      },
      //审核项目列表
      reportList: [],
      open: false,
      opinionForm: {
        id: null,
        reportStatus: null,
        backReason: ''
      },
      opinionRules: {
        backReason: [
          {required: true, message: "退回缘由不能为空", trigger: "blur", pattern: '[^ \x22]+'}
        ]
      }
    }
  },

  created() {
    //获取接口数据
    this.getList()
  },
  computed: {
    userId() {
      return this.$store.state.user.userId
    },
    userName() {
      return this.$store.state.user.name
    },
    id() {
      return this.$route.query.id || null
    },
    projectName() {
      return this.$route.query.projectName || '无'
    },
    reportTimeFormat() {
      return ({reportTime}) => {
        let str = reportTime.replace(/-/g, '.')
        str = str.replace(/,/g, ' - ')
        return str
      }
    },
    reportStatusFormat() {
      return ({reportStatus}) => {
        switch (reportStatus) {
          case -1:
            return '未添加';
          case 0:
            return '已保存';
          case 1:
            return '已提交';
          case 2:
            return '已阅';
          case 3:
            return '待修改';
        }
      }
    }
  },
  methods: {
    /*********************** 数据获取及处理 ***********************/
    /** 获取申报待评审列表 */
    getList() {
      this.loading = true;
      this.queryParams.reportId = this.id;
      listProMonthReportRecord(this.queryParams).then(({rows, total}) => {
        this.reportList = rows;
        this.total = total;
        this.loading = false;
      });
    },
    /*********************** 交互操作 ***********************/
    backPage() {
      this.closeView(this.$route.path, '/proManagement/monthlyReport/monthReportAudit', 0)
    },
    //退回
    onWithdraw(row) {
      this.opinionForm.id = row.id
      this.opinionForm.reportStatus = 3
      this.open = true
    },
    submitForm() {
      changeStatusReportRecord(this.opinionForm).then(() => {
        this.msgSuccess('退回成功')
        this.open = false
        this.getList()
      })
    },
    cancelClose() {
      this.open = false
    },
    //查看
    onQuery(row) {
      this.opinionForm.id = row.id
      this.opinionForm.reportStatus = 2
      if (row.reportStatus === 2) {
        this.$router.push({
          path: '/proManagement/monthlyReport/monthReportAudit/reportList/detail',
          query: {
            id: row.id,
            detailFlag: '1'
          }
        })
      } else if (row.reportStatus === 1) {
        changeStatusReportRecord(this.opinionForm).then(() => {
          this.$router.push({
            path: '/proManagement/monthlyReport/monthReportAudit/reportList/detail',
            query: {
              id: row.id,
              detailFlag: '1'
            }
          })
        })
      }
    },
    //下载
    onDownload(row) {
      const path = JSON.parse(row.reportFilePaths)
      if (path && path.length > 0) {
        if (path[0].name && path[0].fileName) {
          const name = path[0].name;
          const fileName = path[0].fileName.replace('/dev-api/', '/')
          const downloadUrl = process.env.VUE_APP_BASE_API + '/common/download/resource?name=' + name + '&&fileName=' + fileName
          const iframe = document.createElement("iframe")
          iframe.style.display = "none"
          iframe.style.height = "0"
          iframe.src = downloadUrl
          document.body.appendChild(iframe)
          const timeOut = setTimeout(() => {
            iframe.remove()
            clearTimeout(timeOut)
          }, 60000)
        }
      }
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
    .project-name {
      font-size: 24px;
      font-weight: bold;
    }
  }
  .main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .main-center {
      width: 100%;
    }
    .main-footer {
      width: 420px;
      margin-top: 20px;
    }
  }
  .dialog-center {
    display: flex;
    flex-direction: column;
  }
}
</style>
