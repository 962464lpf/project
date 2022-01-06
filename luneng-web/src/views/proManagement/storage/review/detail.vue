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
      <div class="fr">
        <el-button
          v-if="status == 6 || status == 8"
          type="primary"

          @click="handleReviewEnd"
          v-hasPermi="['project:projectStorageReview:reviewEnd']"
        >评审结束
        </el-button>
        <el-button
          type="warning"
          icon="el-icon-download"

          @click="handleExport"
          v-hasPermi="['project:projectStorageReview:export']"
        >导出专家意见
        </el-button>
      </div>
    </el-row>
    <div class="detail-title">{{form.projectName}}</div>
    <div class="detail-hint">{{form.createBy ? form.createBy : ''}}申报于{{parseTime(form.declareTime,
      '{y}-{m}-{d}')}}
    </div>
    <review-table :id="id"/>

    <el-tabs v-model="activeName">
      <el-tab-pane label="操作日志" name="1">
        <el-table ref="table" :data="logList">
          <el-table-column prop="operUserName" label="操作人"></el-table-column>
          <el-table-column prop="operName" label="操作事件">
            <template slot-scope="scope">
              <span>{{ scope.row.operName }}</span>
              <div v-if="scope.row.filePaths"><upload v-model="scope.row.filePaths" :edit="false"></upload></div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="时间"></el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {getProjectStorageInfo} from "@/api/storage/projectStorageInfo";
  import {operation, exportExcel} from "@/api/storage/review";
  import {listOperLog} from "@/api/storage/operLog";
  import reviewTable from './reviewTable';

  export default {
    name: "proManagement-storage-review-detail",
    components: {
      reviewTable
    },
    data() {
      return {
        form: {},
        activeName: '1',
        // 总条数
        total: 0,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          infoId: this.$route.query.id
        },
        logList: []
      };
    },
    computed: {
      id: function () {
        return this.$route.query.id
      },
      status: function () {
        return this.$route.query.status || ''
      },
    },
    created() {
      this.init();
    },
    activated() {
      this.init();
    },
    methods: {
      init() {
        getProjectStorageInfo(this.id).then(res => {
          this.form = res.data;
        })
        this.getList();
      },
      getList() {
        listOperLog(this.queryParams).then(res => {
          this.logList = res.rows;
          this.total = res.total;
        })
      },
      // 评审结束
      handleReviewEnd() {
        this.$confirm("评审结束，未评审专家将不可继续评审！", "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          operation({"ids": [this.id], "operation": "1"}).then(res => {
            this.msgSuccess("操作成功！");
            this.closeView('/proManagement/storage/review/detail', '/proManagement/storage/review');
          })
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        this.$confirm('是否确认导出所有专家意见?', "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return exportExcel({"infoId": this.id});
        }).then(response => {
          this.download(response.msg);
        }).catch(function () {
        });
      },
      /** 返回 */
      handleBack() {
        let path = "/proManagement/storage/review"
        this.$router.push({"path": path})
      }
    }
  };
</script>
