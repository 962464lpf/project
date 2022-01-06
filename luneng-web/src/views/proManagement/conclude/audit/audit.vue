<template>
  <div class="app-container">
    <el-row class="mb10">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-back"

          @click="handleBack"
        >返回
        </el-button>
      </el-col>
      <div class="fr" v-if="!detail">
        <el-button
          type="primary"

          @click="handleAuditOpinion(1)"
        >同意
        </el-button>
        <el-button
          type="warning"

          @click="handleAuditOpinion(2)"
        >退回
        </el-button>
      </div>
    </el-row>
    <div class="detail-title" style="padding-bottom: 20px;">{{form.projectName}}</div>
    <el-radio-group v-model="tabIndex" style="margin-bottom: 20px;">
      <el-radio-button label="1">验收申请表</el-radio-button>
      <el-radio-button label="2">成果文件</el-radio-button>
    </el-radio-group>
    <PdfView v-if="tabIndex==1" :src="form.pdfUrl"/>
    <div v-if="tabIndex==2">
      <table class="pdf-show-table">
        <template v-for="item in auditOpinions">
          <tr>
            <td style="width: 200px;">{{item.resultTypeName}}</td>
            <td align="left">
              <template v-for="acceptFilePaths in item.acceptFilePaths">
                <upload :value="acceptFilePaths" :edit="false" hint="" style="display: inline-block;"/>
              </template>
              <template v-for="formalFilePaths in item.formalFilePaths">
                <upload :value="formalFilePaths" :edit="false" hint="" style="display: inline-block;"/>
              </template>
            </td>
            <td>
              <el-button
                type="primary"
                @click="getHistoryFile(item)"
              >历史版本
              </el-button>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <el-input v-if="!detail" type="textarea" placeholder="审核意见" v-model="item.auditOpinion" rows="4"/>
              <span v-if="detail">{{item.auditOpinion}}</span>
            </td>
          </tr>
        </template>
      </table>
    </div>
    <el-tabs v-model="activeName" style="margin-top: 20px;">
      <el-tab-pane label="操作日志" name="1">
        <el-table ref="table" :data="logList">
          <el-table-column prop="operUserName" label="操作人"/>
          <el-table-column prop="operName" label="操作事件">
            <template slot-scope="scope">
              <span>{{ scope.row.operName }}</span>
              <div v-if="scope.row.filePaths">
                <upload v-model="scope.row.filePaths" :edit="false"></upload>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="时间"/>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getLogList"
        />
      </el-tab-pane>
<!--      <el-tab-pane label="审批历史" name="1">-->
<!--        <el-table ref="table" :data="approvalHis">-->
<!--          <el-table-column prop="operUserName" label="操作人"/>-->
<!--          <el-table-column prop="operName" label="审批意见">-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{ scope.row.operName }}</span>-->
<!--              <div v-if="scope.row.filePaths">-->
<!--                <upload v-model="scope.row.filePaths" :edit="false"></upload>-->
<!--              </div>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column prop="createTime" label="时间"/>-->
<!--        </el-table>-->
<!--        <pagination-->
<!--          v-show="total > 0"-->
<!--          :total="total"-->
<!--          :page.sync="queryParams.pageNum"-->
<!--          :limit.sync="queryParams.pageSize"-->
<!--          @pagination="getLogList"-->
<!--        />-->
<!--      </el-tab-pane>-->
    </el-tabs>

    <!-- 历史版本对话框 -->
    <el-dialog :visible.sync="historyOpen" width="700px" append-to-body :close-on-click-modal="false">
      <div>
        <el-table ref="table" :data="historyList">
          <el-table-column prop="acceptFilePaths" label="文件">
            <template slot-scope="scope">
              <div style="display: inline-block;">
                <upload :value="scope.row.hisFilePaths" :edit="false" hint=""/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="时间" width="150px"/>
        </el-table>
        <pagination
          v-show="historyTotal > 0"
          :total="historyTotal"
          :page.sync="historyQueryParams.pageNum"
          :limit.sync="historyQueryParams.pageSize"
          @pagination="getHistoryFile"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="historyOpen=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getHistoryFile, getAuditOpinions, operation, getLogList, getConcludeInfoByInfoId} from "@/api/conclude/result"
  import PdfView from "@/components/PdfView";

  export default {
    name: "proManagement-storage-audit-detail",
    components: {
      PdfView
    },
    data() {
      return {
        activeName: "1",
        detail: true,
        form: {},
        tabIndex: "1",
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          infoId: undefined
        },
        total: 0,
        logList: [],
        fileList: [],
        auditOpinions: [],
        infoId: undefined,
        //历史版本相应字段
        historyOpen: false,
        historyList: [],
        historyQueryParams: {
          pageNum: 1,
          pageSize: 10,
          infoId: undefined
        },
        historyTotal: 0,
        approvalHis: []
      };
    },
    activated() {
      this.init();
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        this.infoId = this.$route.query.infoId;
        this.detail = this.$route.query.type == 1 ? false : true
        this.getAuditOpinions();
        this.getLogList();
        this.getAuditInfo();
      },
      getAuditInfo() {
        getConcludeInfoByInfoId(this.infoId).then(res => {
          this.form = res.data;
        })
      },
      getLogList() {
        this.queryParams.infoId = this.infoId;
        getLogList(this.queryParams).then(res => {
          this.logList = res.rows;
          this.total = res.total;
        })
      },
      getHistoryFile(row) {
        this.historyOpen = true;
        this.historyQueryParams.infoId = row.infoId;
        this.historyQueryParams.resultType = row.resultType;
        getHistoryFile(this.historyQueryParams).then(res => {
          this.historyList = res.rows;
          this.historyTotal = res.total;
        })
      },
      getAuditOpinions() {
        getAuditOpinions(this.infoId).then(res => {
          this.auditOpinions = res.data;
        })
      },
      handleAuditOpinion(type) {
        let operationType = type == 1 ? "4" : "5";
        operation({
          "infoId": this.infoId,
          "operation": operationType,
          "data": JSON.stringify(this.auditOpinions)
        }).then(res => {
          if (res.code == 200) {
            this.msgSuccess("操作成功！")
            this.closeView("/proManagement/conclude/audit/audit", "/proManagement/conclude/audit");
          }
        })
      },
      // 返回
      handleBack() {
        if (this.$route.query.type == 1) {
          this.closeView("/proManagement/conclude/audit/audit", "/proManagement/conclude/audit", 0);
        } else {
          this.closeView("/proManagement/conclude/audit/detail", "/proManagement/conclude/audit", 0);
        }
      }
    }
  };
</script>

<style scoped>
  iframe {
    width: 100%;
    height: 100%;
  }
</style>
