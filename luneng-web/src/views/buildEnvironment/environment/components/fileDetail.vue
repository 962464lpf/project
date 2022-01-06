<template>
  <div class="app-container">
<!--    <query-file-his-->
<!--      :file-info="fileInfo"-->
<!--      :file-info-his="fileInfoHis"-->
<!--      :page-obj="queryParams"-->
<!--      @back-page="backPage"-->
<!--    />-->
    <div class="query-file-his">
      <div class="header">
        <div class="option-btn">
          <el-button
            type="primary"
            icon="el-icon-back"
            @click="backPage">返回
          </el-button>
        </div>
        <div class="pro-name">
          <span v-if="fileInfo.projectName">{{fileInfo.projectName}}</span>
          <div class="pro-name-subtitle">
            <span v-if="fileInfo.createBy">{{ fileInfo.nickName + ' 上传于 ' }}</span>
            <span v-if="uploadDate">{{ uploadDate }}</span>
          </div>
        </div>
      </div>
      <div class="main">
        <upload
          :edit="false"
          v-model="filePaths"
        />
      </div>
      <div class="footer">
        <el-tabs v-model="activeName">
          <el-tab-pane label="历史版本" name="0">
            <div class="table-data">
              <el-table
                ref="table"
                :data="fileInfoHis">
                <el-table-column
                  label="序号"
                  align="center"
                  type="index">
                  <template slot-scope="scope">
                    <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="文件名"
                  align="center"
                  prop="filePath">
                  <template slot-scope="scope">
                    <upload
                      :edit="false"
                      v-model="scope.row.filePaths"/>
                  </template>
                </el-table-column>
                <el-table-column
                  width="300px"
                  label="上传人"
                  align="center"
                  prop="nickName" />
                <el-table-column
                  label="上传时间"
                  align="center"
                  prop="uploadDate">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="init"/>
  </div>
</template>

<script>
import QueryFileHis from '../../components/QueryFileHis'
import { viewFile } from "@/api/hb/hbProjectInfo";
import { getHbProjectInfo } from "@/api/hb/hbProjectInfo";

export default {
  name: "fileDetail",
  components: {
    QueryFileHis
  },
  data() {
    return {
      form: {},
      fileInfo: {},
      fileInfoHis: [],
      filePaths: '',
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        history: 0,
        infoId: null,
        fileType: null
      },
      queryParams2: {
        pageNum: 1,
        pageSize: 10,
        history: 1,
        infoId: null,
        fileType: null
      },
      total: 0,
      activeName: '0',
      uploadDate: null
    }
  },
  computed: {
    pageType() {
      return this.$route.query.pageType;
    },
    fileType() {
      return this.$route.query.fileType;
    },
    id() {
      return this.$route.query.id;
    },
    detail() {
      return this.$route.query.detail;
    },
  },
  created() {
    this.init();
    this.getList();
  },
  methods: {
    //获取当前文件的最新版本查看
    init() {
      getHbProjectInfo(this.id).then(res => {
        this.fileInfo = res.data;
        this.filePaths = res.data[this.fileType+'FilePaths'];
      })
    },
    getList() {
      viewFile({
        id: this.id,
        fileType: this.fileType
      }).then(res => {
        this.fileInfoHis = res.data.hisFileList;
        this.uploadDate = res.data.uploadDate;
      })
    },
    backPage() {
      if (this.pageType) {
        if(this.detail) {
          this.closeView(this.$route.path, `/buildEnvironment/environment/project/detail?id=${this.id}&pageType=${this.pageType}`, 0);
        } else {
          this.closeView(this.$route.path, '/buildEnvironment/environment/' + this.pageType, 0);
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
}
.query-file-his {
  width: 100%;
  display: flex;
  flex-direction: column;
  .header {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    .option-btn {
      width: 100%;
      display: flex;
      margin-bottom: 20px;
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
}
</style>
