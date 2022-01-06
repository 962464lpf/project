<template>
  <div class="app-container">
    <div class="header">
      <div class="pro-name">
        <span v-if="proApprovalInfo.projectName">{{ proApprovalInfo.projectName }}</span>
        <el-button
          v-if="false"
          type="primary"
          @click="handleProblem">问题记录
        </el-button>
      </div>
      <div class="pro-steps">
        <el-steps :active="activeValue" align-center>
          <el-step v-for="item in proStatusOptions" :title="item.dictLabel"></el-step>
        </el-steps>
      </div>
    </div>
    <div class="main">
      <div class="main-center">
        <plan-play-result @refreshlog="refreshLog" :info-id="id"/>
      </div>
      <div class="main-footer">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="操作日志" name="1">
            <el-table ref="table" :data="optLogDataList">
              <el-table-column prop="operUserName" label="操作人"/>
              <el-table-column prop="operName" label="操作事件">
                <template slot-scope="scope">
                  <span>{{ scope.row.operName }}</span>
                  <span v-if="scope.row.remark">({{ scope.row.remark }})</span>
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
              @pagination="getList"
            />
          </el-tab-pane>
          <el-tab-pane label="历史版本" name="2">
            <el-table
              ref="table"
              :data="planPlayResUltHis">
              <el-table-column
                width="230"
                label="课题名称"
                align="center"
                prop="topicName"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                width="200"
                label="研究内容"
                align="center"
                prop="topicContent"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                width="150"
                label="成果类型"
                align="center"
                prop="resultType"
                :formatter="resultTypeFormat"
                show-overflow-tooltip />
              <el-table-column
                width="120"
                label="上传时间"
                align="center"
                prop="createTime"
                show-overflow-tooltip>
<!--                <template slot-scope="scope">-->
<!--                  <span v-if="scope.row.acceptFileUploadTime">{{parseTime(scope.row.acceptFileUploadTime, '{y}-{m}-{d}')}}</span>-->
<!--                  <span v-if="scope.row.formalFileUploadTime">{{parseTime(scope.row.formalFileUploadTime, '{y}-{m}-{d}')}}</span>-->
<!--                </template>-->
              </el-table-column>
              <el-table-column
                label="受理文件"
                align="center"
                prop="acceptFilePaths">
                <template slot-scope="scope">
                  <div style="display: flex; justify-content: center; align-items: center">
                    <upload v-if="scope.row.fileType==9" v-model="scope.row.hisFilePaths" :edit="false"></upload>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="正式文件"
                align="center"
                prop="formalFilePaths">
                <template slot-scope="scope">
                  <div style="display: flex; justify-content: center; align-items: center">
                    <upload v-if="scope.row.fileType==10" v-model="scope.row.hisFilePaths" :edit="false"></upload>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="total2 > 0"
              :total="total2"
              :page.sync="queryParams2.pageNum"
              :limit.sync="queryParams2.pageSize"
              @pagination="getProPlayPlanResultHis"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import planPlayResult from './childCom/planPlayResult'
import {getProApprovalInfo} from "@/api/pro/proApprovalInfo";
import {listProOperLog} from "@/api/pro/proPlanReview";
import {listProPlayPlanResultHis} from "@/api/pro/proImplementPlan";

export default {
  name: "playResults",
  data() {
    return {
      proStatusOptions: [],
      proApprovalInfo: {},
      id: null,
      activeName: '1',
      planPlayResUltHis: [],
      optLogDataList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        operType: 6
      },
      total: 0,
      queryParams2: {
        pageNum: 1,
        pageSize: 10
      },
      total2: 0,
      resultTypeOptions: []
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id * 1
      this.getProInfo(this.id)
      this.getProPlayPlanResultHis()
      this.getList()
    }
    this.getDicts("pro_establish_status").then(response => {
      this.proStatusOptions = response.data;
    });
    this.getDicts("pro_result_type").then(response => {
      this.resultTypeOptions = response.data;
    });
  },
  computed: {
    activeValue() {
      return this.proApprovalInfo.proStatus * 1 - 1
    }
  },
  components: {
    planPlayResult
  },
  methods: {
    //获取项目信息
    getProInfo(id) {
      getProApprovalInfo(id).then(({data}) => {
        this.proApprovalInfo = data;
      })
    },
    //获取日志操作
    getList() {
      this.queryParams.infoId = this.id
      listProOperLog(this.queryParams).then(({rows, total}) => {
        this.optLogDataList = rows
        this.total = total
      })
    },
    //获取历史成果文件
    getProPlayPlanResultHis() {
      this.queryParams2.infoId = this.id
      listProPlayPlanResultHis(this.queryParams2).then(({data}) => {
        this.planPlayResUltHis = data.records
        this.total2 = data.total
      })
    },
    //刷新日志和历史成果
    refreshLog() {
      this.getList()
      this.getProPlayPlanResultHis()
    },
    //成果类型格式化
    resultTypeFormat({resultType}) {
      return this.selectDictLabel(this.resultTypeOptions, resultType)
    },
    //处理问题记录
    handleProblem() {

    },
    //处理tab切换
    handleClick(value) {
      this.activeName = value.name
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 25px 30px 50px 30px;
  .header {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    .pro-name {
      width: 100%;
      display: flex;
      font-size: 24px;
      font-weight: bold;
      justify-content: space-between;
      margin-bottom: 25px;
    }
    .pro-steps {
      width: 100%;
    }
  }
  .main {
    width: 100%;
    display: flex;
    flex-direction: column;
    .main-center {
      width: 100%;
      margin-bottom: 20px;
    }
    .main-footer {
      width: 100%;
    }
  }
}
</style>
