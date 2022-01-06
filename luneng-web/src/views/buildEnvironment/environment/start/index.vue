<template >
  <div class="app-container">
    <table-search v-model="queryParams" @query="handleQuery" @reset="resetQuery" />

    <el-table ref="table" v-loading="loading" :data="list">
      <el-table-column min-width="55" label="序号" align="center" type="index">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="230" label="项目名称" align="center" prop="projectName">
        <template slot-scope="scope">
          <div class="project-name-all" @click="handleDetail(scope.row)">
            <span>{{ scope.row.projectName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="环境影响报告编制单位" align="center" prop="prepareUnit" min-width="160" />
      <el-table-column label="环境影响评价委托书" align="center" prop="twoFirstFilePaths" min-width="160" >
        <template slot-scope="scope">
          <upload-btns :filePaths="scope.row.twoFirstFilePaths" :edit="!scope.row.fileStatus" @click="uploadBtnsClick('twoFirst', scope.row.id, $event, '环境影响评价委托书')" />
        </template>
      </el-table-column>
      <el-table-column label="环境影响报告计划书" align="center" prop="twoSecondFilePaths" min-width="160">
        <template slot-scope="scope">
          <upload-btns :filePaths="scope.row.twoSecondFilePaths" :edit="!scope.row.fileStatus" @click="uploadBtnsClick('twoSecond', scope.row.id, $event, '环境影响报告计划书')" />
        </template>
      </el-table-column>
      <el-table-column label="环境影响报告" align="center" prop="twoThirdFilePaths" width="140" fixed="right">
        <template slot-scope="scope">
          <upload-btns :filePaths="scope.row.twoThirdFilePaths" :edit="!scope.row.fileStatus" @click="uploadBtnsClick('twoThird', scope.row.id, $event, '环境影响报告')" />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <upload-dialog :type="fileType" :id="projectInfoId" :open.sync="open" :edit="edit" :title="title" @success="getList" />
  </div>
</template>

<script>
  import { listHbProjectInfo } from "@/api/hb/hbProjectInfo";
  import tableSearch from '../components/tableSearch';
  import uploadBtns from '../components/uploadBtns';
  import uploadDialog from '../components/uploadDialog';

  export default {
    name: "Project",
    components: {
      tableSearch, uploadBtns, uploadDialog
    },
    data() {
      return {
        //控制搜索栏显示隐藏
        searchToggle: true,
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 表格数据
        list: [],
        // 弹出层标题
        title: "附件",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          status: 2,
          projectName: undefined,
          prepareUnit: undefined
        },
        edit: true,
        fileType: undefined,
        projectInfoId: undefined
      }
    },
    created() {
      this.getList();
    },
    activated() {
      this.getList();
    },
    methods: {
      /** 查询环保项目信息列表 */
      getList() {
        this.loading = true;
        listHbProjectInfo(this.queryParams).then(response => {
          this.list = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.handleQuery();
      },
      /** 详情按钮操作 */
      handleDetail(row) {
        this.$router.push({
          path: "/buildEnvironment/environment/project/detail",
          query: {
            id: row.id,
            pageType: 'start',
            active: '2'
          }
        })
      },
      uploadBtnsClick(type, id, event, title) {
        if (event == 'view') {
          const pageType = 'start';
          const path = `/buildEnvironment/environment/${pageType}/fileDetail`;
          this.$router.push({
            'path': path,
            'query': {
              id,
              fileType: type,
              pageType
            }
          })
        } else {
          this.fileType = type;
          this.projectInfoId = id;
          if(title) this.title = title;
          this.open = true;
        }
      }
    }
  }
</script>
