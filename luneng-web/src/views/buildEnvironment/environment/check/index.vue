<template>
  <div class="app-container">
    <table-search v-model="queryParams" @query="handleQuery" @reset="resetQuery" />
    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          :disabled="multiple"
          @click="handleGeonhole"
          v-hasPermi="['pro:hbProjectInfo:add']"
        >归档</el-button>
      </el-col>
      <crud-operation @refresh="getList" @search="search" />
    </el-row>-->
    <el-table ref="table" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" min-width="55" align="center" />
      <el-table-column label="序号" align="center" type="index">
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
      <el-table-column label="编制单位委托书" align="center" prop="fiveFirstFilePaths" min-width="140">
        <template slot-scope="scope">
          <upload-btns :filePaths="scope.row.fiveFirstFilePaths" :edit="!scope.row.fileStatus" @click="uploadBtnsClick('fiveFirst', scope.row.id, $event, '编制单位委托书')" />
        </template>
      </el-table-column>
      <el-table-column label="竣工环境保护验收报告" align="center" prop="fiveSecondFilePaths" min-width="160">
        <template slot-scope="scope">
          <upload-btns :filePaths="scope.row.fiveSecondFilePaths" :edit="!scope.row.fileStatus" @click="uploadBtnsClick('fiveSecond', scope.row.id, $event, '竣工环境保护验收报告')" />
        </template>
      </el-table-column>
      <el-table-column label="竣工环境保护验收报告计划书" align="center" prop="fiveThirdFilePaths" min-width="165">
        <template slot-scope="scope">
          <upload-btns :filePaths="scope.row.fiveThirdFilePaths" :edit="!scope.row.fileStatus" @click="uploadBtnsClick('fiveThird', scope.row.id, $event, '竣工环境保护验收报告计划书')" />
        </template>
      </el-table-column>
      <el-table-column label="竣工环境保护验收监测报告表" align="center" prop="fiveForthFilePaths" width="190" fixed="right">
        <template slot-scope="scope">
          <upload-btns :filePaths="scope.row.fiveForthFilePaths" :edit="!scope.row.fileStatus" @click="uploadBtnsClick('fiveForth', scope.row.id, $event, '竣工环境保护验收监测报告表')" />
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
  import { presenter } from '@/components/Crud/crud';

  export default {
    name: "Project",
    components: {
      tableSearch, uploadBtns, uploadDialog
    },
    mixins: [presenter()],
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
          status: 5,
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
      search() {
        this.searchToggle = !this.searchToggle;
      },
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
            pageType: 'check',
            active: '5'
          }
        })
      },
      uploadBtnsClick(type, id, event, title) {
        if (event == 'view') {
          const pageType = 'check';
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
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      //归档
      handleGeonhole() {
        console.log(this.ids, this.single, this.multiple)
      }
    }
  }
</script>
