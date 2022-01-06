<template>
  <div class="app-container">
    <query-file-his
      :file-info="fileInfo"
      :file-info-his="fileInfoHis"
      :page-obj="pageObj"
      @back-page="backPage"
    />
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams2.pageNum"
      :limit.sync="queryParams2.pageSize"
      @pagination="getHistoryV"/>
  </div>
</template>

<script>
import QueryFileHis from '../../components/QueryFileHis'
import {listBuildFile} from "@/api/build/buildFile";
export default {
  name: "fileDetail",
  data() {
    return {
      fileInfo: {},
      fileInfoHis: [],
      id: null,
      infoId: null,
      fileType: null,
      fileDetailPath: '',
      proDetailFlag: null,
      tabActiveName: null,
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
      pageObj: {}
    }
  },
  created() {
    if (this.$route.query.id && this.$route.query.fileType) {
      this.id = this.$route.query.id
      this.fileType = this.$route.query.fileType * 1
      this.getLatestV()
      this.getHistoryV()
    }
    if (this.$route.query.infoId) {
      this.infoId = this.$route.query.infoId
    }
    if (this.$route.query.fileDetailPath) {
      this.fileDetailPath = this.$route.query.fileDetailPath
    }
    if (this.$route.query.proDetailFlag) {
      this.proDetailFlag = this.$route.query.proDetailFlag
    }
    if (this.$route.query.tabActiveName) {
      this.tabActiveName = this.$route.query.tabActiveName
    }
  },
  components: {
    QueryFileHis
  },
  methods: {
    //获取当前文件的最新版本查看
    getLatestV() {
      this.queryParams.infoId = this.id
      this.queryParams.fileType = this.fileType
      listBuildFile(this.queryParams).then(({rows}) => {
        this.fileInfo = rows[0]
      })
    },
    //获取当前文件的历史版本查看
    getHistoryV() {
      this.queryParams2.infoId = this.id
      this.queryParams2.fileType = this.fileType
      listBuildFile(this.queryParams2).then(({rows, total}) => {
        this.fileInfoHis = rows
        this.total = total
        this.pageObj = this.queryParams2
      })
    },
    backPage() {
      if (this.fileDetailPath === '1') {
        this.closeView('/buildEnvironment/build/confirmGoal/fileDetail', '/buildEnvironment/build/confirmGoal', 0)
      } else if (this.fileDetailPath === '2'){
        this.closeView('/buildEnvironment/build/reviewGoal/fileDetail', '/buildEnvironment/build/reviewGoal', 0)
      } else if (this.fileDetailPath === '3'){
        this.closeView('/buildEnvironment/build/assessApprove/fileDetail', '/buildEnvironment/build/assessApprove', 0)
      } else if (this.fileDetailPath === '4'){
        this.closeView('/buildEnvironment/build/construction/fileDetail', '/buildEnvironment/build/construction', 0)
      } else if (this.fileDetailPath === '5'){
        this.closeView('/buildEnvironment/build/completedFile/fileDetail', '/buildEnvironment/build/completedFile', 0)
      } else if (this.fileDetailPath === '6'){
        this.closeView('/buildEnvironment/build/fileRecord/fileDetail', '/buildEnvironment/build/fileRecord', 0)
      } else if (this.fileDetailPath === '7'){
        this.closeView('/buildEnvironment/build/trackManagement/fileDetail', '/buildEnvironment/build/trackManagement', 0)
      } else {
        if (this.infoId) {
          this.closeView("/buildEnvironment/build/buildProject/fileDetail", "/buildEnvironment/build/buildProject/buildProDetail?id=" + this.infoId + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 0)
        } else {
          this.closeView("/buildEnvironment/build/buildProject/fileDetail", "/buildEnvironment/build/buildProject/buildProDetail?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 0)
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
</style>
