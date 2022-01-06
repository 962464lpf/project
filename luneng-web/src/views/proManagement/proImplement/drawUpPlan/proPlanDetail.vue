<template>
  <div class="pro-plan-detail">
    <div class="header">
      <el-row>
        <el-col>
          <el-button
            type="primary"
            @click="handleBack">返回
          </el-button>
        </el-col>
      </el-row>
      <div class="pro-name">
        <span>{{proApprovalInfo.projectName}}</span>
      </div>
      <div class="pro-steps">
        <el-steps :active="activeValue" align-center>
          <el-step v-for="item in proStatusOptions" :title="item.dictLabel"></el-step>
        </el-steps>
      </div>
    </div>
    <div class="main">
      <iframe
        v-if="proApprovalInfo.planInfoUrl"
        :src="proApprovalInfo.planInfoUrl"
        frameborder="0"
        style="width: 100%;height: calc(100vh - 170px);">
      </iframe>
    </div>
    <div class="footer">
      <el-tabs v-model="activeName">
        <el-tab-pane label="操作日志" name="0">
          <el-table ref="table" :data="optLogDataList">
            <el-table-column width="300" prop="operUserName" label="操作人" align="center"/>
            <el-table-column prop="operName" label="操作事件" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.operName }}</span>
                <!--                <span v-if="scope.row.remark">({{ scope.row.remark }})</span>-->
                <!--                <div v-if="scope.row.filePaths">-->
                <!--                  <upload v-model="scope.row.filePaths" :edit="false"></upload>-->
                <!--                </div>-->
              </template>
            </el-table-column>
            <el-table-column width="300" prop="createTime" label="操作时间" align="center"/>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </el-tab-pane>
        <el-tab-pane label="审核意见" name="1">
          <el-table ref="table2" :data="optLogDataList2">
            <el-table-column width="200" prop="operUserName" label="审核人" align="center"/>
            <el-table-column prop="remark" label="审核意见" align="center" show-overflow-tooltip/>
            <el-table-column width="300" prop="filePaths" label="附件" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.filePaths" style="display: flex; justify-content: center">
                  <upload v-model="scope.row.filePaths" :edit="false"></upload>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="300" prop="createTime" label="审核时间" align="center"/>
          </el-table>
          <pagination
            v-show="total1 > 0"
            :total="total1"
            :page.sync="queryParams1.pageNum"
            :limit.sync="queryParams1.pageSize"
            @pagination="getList1"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {getProApprovalInfo} from "@/api/pro/proApprovalInfo";
import {listProOperLog} from "@/api/pro/proPlanReview";

export default {
  name: "proPlanDetail",
  data() {
    return {
      id: null,
      proStatusOptions: [],
      proApprovalInfo: {},
      proDetailFlag: null,
      navPageFlag: null,
      tabActiveName: null,
      activeName: '0',
      optLogDataList: [],
      optLogDataList2: [],
      total: 0,
      total1: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        infoId: null,
        operType: 2
      },
      queryParams1: {
          pageNum: 1,
          pageSize: 10,
          infoId: null,
          operType: 2,
          type: 1
      },
    }
  },
  created() {
    this.id = this.$route.query.id * 1
    if (this.id) {
      this.init(this.id)
      this.getList()
      this.getList1()
    }
    if (this.$route.query.proDetailFlag) {
      this.proDetailFlag = this.$route.query.proDetailFlag
    }
    if (this.$route.query.navPageFlag) {
      this.navPageFlag = this.$route.query.navPageFlag
    }
    if (this.$route.query.tabActiveName) {
      this.tabActiveName = this.$route.query.tabActiveName
    }
    this.getDicts("pro_establish_status").then(response => {
      this.proStatusOptions = response.data;
    });
  },
  computed: {
    activeValue() {
      return this.proApprovalInfo.proStatus * 1 - 1
    }
  },
  methods: {
    init(id) {
      getProApprovalInfo(id).then(({data}) => {
        this.proApprovalInfo = data;
      })
    },
    //获取日志操作
    getList() {
      this.queryParams.infoId = this.id
      listProOperLog(this.queryParams).then(({rows, total}) => {
        this.optLogDataList = rows
      })
    },
    getList1() {
        this.queryParams1.infoId = this.id
        listProOperLog(this.queryParams1).then(({rows, total}) => {
            this.optLogDataList2 = rows
        })
    },
    handleBack() {
      if (this.proDetailFlag) {
        this.closeView("/proManagement/proImplement/drawUpPlan/proPlanDetail", "/proManagement/proImplement/proEstablish/proMainTask?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 0)
      } else {
        if (this.navPageFlag === '1') {
          this.closeView("/proManagement/proImplement/drawUpPlan/proPlanDetail", "/proManagement/proImplement/proLaunch", 0)
        } else {
          this.closeView("/proManagement/proImplement/drawUpPlan/proPlanDetail", "/proManagement/proImplement/drawUpPlan", 0)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pro-plan-detail {
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
      margin-bottom: 30px;
      margin-top: 20px;
      span {
        font-size: 24px;
        font-weight: bold;
      }
    }
    .pro-steps {
      width: 90%;
      margin-bottom: 10px;
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
