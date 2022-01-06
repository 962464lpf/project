<template>
  <div class="recruit-file-history">
    <el-dialog
      :title="dialogObj.title"
      :visible.sync="dialogObj.open"
      width="60%"
      append-to-body
      :close-on-click-modal="false">
      <div class="dialog-center">
        <div class="table-data">
          <el-table
            ref="table"
            v-loading="loading"
            :data="recruitFileHistoryList">
            <el-table-column
              width="55"
              label="序号"
              align="center"
              type="index">
              <template slot-scope="scope">
                <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="名称"
              align="center"
              prop="projectName">
              <template slot-scope="scope">
                <upload
                  :edit="false"
                  v-model="scope.row.hisFilePaths"/>
              </template>
            </el-table-column>
            <el-table-column
              width="160"
              label="用户名"
              align="center"
              prop="createBy"/>
            <el-table-column
              width="160"
              label="时间"
              align="center"
              prop="createTime">
            </el-table-column>
          </el-table>
        </div>
        <div class="table-pagination">
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"/>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listBiddingFilesHis} from "@/api/pro/proRecruit";

export default {
  name: "recruitFileHistory",
  props: {
    dialogOption: {
      type: Object,
      default() {
        return {
          title: '历史版本',
          open: false
        }
      }
    },
    curIndex: {
      type: Number,
      default: 1
    },
    infoId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        infoId: null,
        fileType: null
      },
      loading: false,
      total: 0,
      recruitFileHistoryList: []
    }
  },
  watch: {
    'dialogObj.open': {
      handler(newValue) {
        if (newValue === true) {
          this.getList()
        }
      }
    }
  },
  computed: {
    //对话框属性
    dialogObj() {
      return this.dialogOption
    }
  },
  methods: {
    getList() {
      this.loading = true
      this.queryParams.infoId = this.infoId
      this.queryParams.fileType = this.curIndex
      listBiddingFilesHis(this.queryParams).then(({rows, total}) => {
        this.recruitFileHistoryList = rows
        this.total = total
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.recruit-file-history {
  width: 100%;
  .dialog-center {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .table-data, .table-pagination {
      width: 100%;
    }
  }
}
</style>
