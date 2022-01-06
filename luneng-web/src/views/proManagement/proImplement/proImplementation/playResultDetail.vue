<template>
  <div class="play-result-detail">
    <div class="header">
      <el-button
        type="primary"
        icon="el-icon-back"

        style="width: 80px"
        @click="handleBack">返回
      </el-button>
      <div class="pro-name">
        <span v-if="projectName">{{projectName}}</span>
        <span v-if="playResultFileDetail.resultName">-</span>
        <span v-if="playResultFileDetail.resultName">{{playResultFileDetail.resultName}}</span>
      </div>
    </div>
    <div class="main">
      <div v-if="fileFlag === '1'">
        <upload
          :edit="false"
          v-model="playResultFileDetail.acceptFilePaths"
        />
      </div>
      <div v-if="fileFlag !== '1'">
        <upload
          :edit="false"
          v-model="playResultFileDetail.formalFilePaths"
        />
      </div>
    </div>
    <div class="footer">
      <el-tabs v-model="activeName">
        <el-tab-pane label="历史版本" name="1">
          <el-table
            ref="table"
            :data="planPlayResUltHis">
            <el-table-column
              width="300"
              label="上传人"
              align="center"
              prop="topicName"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.createBy}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="上传时间"
              align="center"
              prop="createTime"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              label="历史文件"
              align="center"
              prop="acceptFilePaths">
              <template slot-scope="scope">
                <div>
                  <upload v-model="scope.row.hisFilePaths" :edit="false"></upload>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import {getPlanFileResult, listCurResultFileHis} from "@/api/pro/proImplementPlan";
  import {listBiddingFilesHis} from "@/api/pro/proRecruit"

  export default {
    name: "playResultDetail",
    data() {
      return {
        tabActiveName: null,
        id: null,
        planResultId: null,
        playResultFileDetail: {},
        planPlayResUltHis: [],
        projectName: '',
        fileFlag: '1',
        proDetailFlag: null,
        activeName: '1',
      }
    },
    created() {
      if (this.$route.query.id) {
        this.id = this.$route.query.id
      }
      if (this.$route.query.tabActiveName) {
        this.tabActiveName = this.$route.query.tabActiveName
      }
      if (this.$route.query.fileFlag) {
        this.fileFlag = this.$route.query.fileFlag
      }
      if (this.$route.query.proDetailFlag) {
        this.proDetailFlag = this.$route.query.proDetailFlag
      }
      if (this.$route.query.planResultId) {
        this.planResultId = this.$route.query.planResultId
        this.getPlanFileResultDetail(this.planResultId)
      }
    },
    methods: {
      //获取成果文件详情
      getPlanFileResultDetail(id) {
        getPlanFileResult(id).then(({data}) => {
          this.playResultFileDetail = data.planResult;
          this.projectName = data.projectName;
          if (this.$route.query.fileFlag == '1') {
            this.planPlayResUltHis = data.planResult.acceptFilePathsList
          } else {
            this.planPlayResUltHis = data.planResult.formalFilePathsList
          }
        })
      },
      //返回
      handleBack() {
        if (this.proDetailFlag) {
          this.closeView("/proManagement/proImplement/proImplementation/playResultDetail", "/proManagement/proImplement/proEstablish/proMainTask?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 0)
        } else {
          this.closeView("/proManagement/proImplement/proImplementation/playResultDetail", "/proManagement/proImplement/proImplementation/playResults?id=" + this.id, 0)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .play-result-detail {
    width: 100%;
    height: 100%;
    position: relative;
    padding: 20px 30px 50px 30px;
    display: flex;
    flex-direction: column;

    .header {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;

      .pro-name {
        width: 100%;
        margin-top: 20px;
        margin-bottom: 20px;

        span {
          font-size: 24px;
          font-weight: bold;
        }
      }
    }

    .main {
      width: 100%;
    }

    .footer {
      width: 100%;
    }
  }
</style>
