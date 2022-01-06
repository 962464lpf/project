<template>
  <div class="research-results">
    <el-table
      ref="table"
      :data="resultList"
      v-loading="loading">
      <el-table-column
        label="报告（已上传/全部）"
        align="center"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.uploadReport}}/{{scope.row.report}}
        </template>
      </el-table-column>
      <el-table-column
        label="软件著作权（已上传/全部）"
        align="center"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.uploadSoftware}}/{{scope.row.software}}
        </template>
      </el-table-column>
      <el-table-column
        label="专利（已上传/全部）"
        align="center"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.uploadPatent}}/{{scope.row.patent}}
        </template>
      </el-table-column>
      <el-table-column
        label="论文（已上传/全部）"
        align="center"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.uploadPaper}}/{{scope.row.paper}}
        </template>
      </el-table-column>
      <el-table-column
        label="标准规范（已上传/全部）"
        align="center"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.uploadStandard}}/{{scope.row.standard}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {listResult} from "@/api/conclude/result";

  export default {
    name: "ResearchResults",
    data() {
      return {
        loading: false,
        resultList: [],
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          infoId: undefined
        },
      }
    },
    props: {
      infoId: {
        type: Number,
        default: undefined,
      }
    },
    created() {
      console.log(this.infoId);
      this.getList();
    },
    methods: {
      /** 查询项目储备申报列表 */
      getList() {
        this.loading = true;
        this.queryParams.infoId = this.infoId;
        listResult(this.queryParams).then(response => {
          this.resultList = response.rows;
          this.loading = false;
        });
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
