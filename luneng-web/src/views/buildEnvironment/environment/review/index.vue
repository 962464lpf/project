<template >
  <div class="app-container">
    <table-search v-model="queryParams" @query="handleQuery" @reset="resetQuery" />

    <el-table ref="table" v-loading="loading" :data="list">
      <el-table-column min-width="55" label="序号" align="center" type="index">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center" prop="projectName" min-width="230">
        <template slot-scope="scope">
          <div class="project-name-all" @click="handleDetail(scope.row)">
            <span>{{ scope.row.projectName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="环境影响报告编制单位" align="center" prop="prepareUnit" min-width="200" />
      <el-table-column label="验收组意见及专家会签单" align="center" prop="sixFirstFilePaths" min-width="170">
        <template slot-scope="scope">
          <upload-btns :filePaths="scope.row.sixFirstFilePaths" :edit="!scope.row.fileStatus" @click="uploadBtnsClick('sixFirst', scope.row.id, $event, '验收组意见及专家会签单')" />
        </template>
      </el-table-column>
      <el-table-column label="竣工环保验收公示备案" align="center" prop="sixSecondFilePaths" min-width="160">
        <template slot-scope="scope">
          <upload-btns :filePaths="scope.row.sixSecondFilePaths" :edit="!scope.row.fileStatus" @click="uploadBtnsClick('sixSecond', scope.row.id, $event, '竣工环保验收公示备案')" />
        </template>
      </el-table-column>
      <el-table-column label="竣工环境保护验收报告批复" align="center" prop="sixThirdFilePaths" width="180" fixed="right">
        <template slot-scope="scope">
          <upload-btns :filePaths="scope.row.sixThirdFilePaths" :edit="!scope.row.fileStatus" @click="uploadBtnsClick('sixThird', scope.row.id, $event, '竣工环境保护验收报告批复')" />
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
          status: 6,
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
            pageType: 'review',
            active: '6'
          }
        })
      },
      uploadBtnsClick(type, id, event, title) {
        if (event == 'view') {
          const pageType = 'review';
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
