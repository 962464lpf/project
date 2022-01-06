<template >
  <div class="app-container">
    <table-search v-model="queryParams" @query="handleQuery" @reset="resetQuery" />
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          :disabled="multiple"
          @click="handleGeonhole"
          v-hasPermi="['hb:hbProjectInfo:gd']"
        >归档</el-button>
      </el-col>
    </el-row>
    <el-table ref="table" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" min-width="40" align="center" />
      <el-table-column label="序号" min-width="55" align="center" type="index">
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
      <el-table-column label="竣工环境保护验收申请表" align="center" prop="eightFirstFilePaths" min-width="170">
        <template slot-scope="scope">
          <upload-btns :filePaths="scope.row.eightFirstFilePaths" :edit="!scope.row.fileStatus" @click="uploadBtnsClick('eightFirst', scope.row.id, $event, '竣工环境保护验收申请表')" />
        </template>
      </el-table-column>
      <el-table-column label="三同时验收登记表" align="center" prop="eightSecondFilePaths" min-width="160">
        <template slot-scope="scope">
          <upload-btns :filePaths="scope.row.eightSecondFilePaths" :edit="!scope.row.fileStatus" @click="uploadBtnsClick('eightSecond', scope.row.id, $event, '三同时验收登记表')" />
        </template>
      </el-table-column>
      <el-table-column label="项目竣工环境保护验收监测表" align="center" prop="eightThirdFilePaths" min-width="190">
        <template slot-scope="scope">
          <upload-btns :filePaths="scope.row.eightThirdFilePaths" :edit="!scope.row.fileStatus" @click="uploadBtnsClick('eightThird', scope.row.id, $event, '项目竣工环境保护验收监测表')" />
        </template>
      </el-table-column>
      <el-table-column label="水保验收" align="center" prop="eightForthFilePaths" min-width="120">
        <template slot-scope="scope">
          <upload-btns :filePaths="scope.row.eightForthFilePaths" :edit="!scope.row.fileStatus" @click="uploadBtnsClick('eightForth', scope.row.id, $event, '水保验收')" />
        </template>
      </el-table-column>
      <el-table-column v-if="projectGd" label="归档" align="center" prop="fileStatus" width="100" fixed="right">
        <template slot-scope="scope">
          <el-switch v-hasPermi="['hb:hbProjectInfo:gd']" v-model="scope.row.fileStatus" :active-value="1" :inactive-value="0" @change="handleGeonhole(scope.row, $event)" />
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

    <!-- 权限 -->
    <div v-hasPermi="['hb:hbProjectInfo:gd']" id="projectGd"></div>
  </div>
</template>

<script>
  import { listHbProjectInfo, updateHbProjectInfo, doFile } from "@/api/hb/hbProjectInfo";
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
        selection: [],
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
          status: 7,
          projectName: undefined,
          prepareUnit: undefined
        },
        edit: true,
        fileType: undefined,
        projectInfoId: undefined,
        projectGd: false
      }
    },
    created() {
      this.getList();
    },
    activated() {
      this.getList();
    },
    mounted() {
      let projectGd = document.getElementById('projectGd');
      if(projectGd) this.projectGd = true;
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
            pageType: 'acceptanceCheck',
            active: '8'
          }
        })
      },
      uploadBtnsClick(type, id, event, title) {
        if (event == 'view') {
          const pageType = 'acceptanceCheck';
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
        if (selection.length == 0) return;
        this.selection = selection;
        let openLength = 0;
        let closeLength = 0;
        selection.map(item => {
          if(item.fileStatus == 1) {
            openLength++;
          } else {
            closeLength++;
          }
        })
        if (openLength === 0 || closeLength === 0) {
          this.multiple = false;
        } else {
          this.multiple = true;
        }
      },
      //归档
      handleGeonhole(row, event) {
        let type = '开启';
        let status = null;
        if(row.id) {
          row.fileStatus ? type = '开启' : type = '关闭';
          event ? row.fileStatus = 0 : row.fileStatus = 1;
        } else {
          this.selection.map(item => {
            item.fileStatus ? type = '关闭' : type = '开启';
            if (item.fileStatus) {
              type = '关闭';
              status = 0;
            } else {
              type = '开启'
              status = 1;
            }
          })
        }
        this.$confirm(`是否确认设置归档为${type}?`, "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          if (row.id) {
            row.fileStatus ? row.fileStatus = 0 : row.fileStatus = 1;
            return doFile({
              ids: [row.id],
              status: row.fileStatus
            });
          } else {
            return doFile({
              ids: this.ids,
              status: status
            });
          }
        }).then(() => {
          this.getList();
          this.msgSuccess("设置成功");
        }).catch(function() {});
      },
    }
  }
</script>
