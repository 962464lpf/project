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
      <el-table-column label="环保工作组会签表" align="center" prop="sevenFirstFilePaths" min-width="150">
        <template slot-scope="scope">
          <upload-btns :filePaths="scope.row.sevenFirstFilePaths" :edit="!scope.row.fileStatus" @click="uploadBtnsClick('sevenFirst', scope.row.id, $event, '环保工作组会签表')" />
        </template>
      </el-table-column>
      <el-table-column label="年度计划" align="center" min-width="120">
        <template slot-scope="scope">
          <el-button  type="text" @click="routerToWork(scope.row, 1)">年度计划</el-button>
        </template>
      </el-table-column>
      <el-table-column label="工作简报" align="center" min-width="120">
        <template slot-scope="scope">
          <el-button  type="text" @click="routerToWork(scope.row, 2)">工作简报</el-button>
        </template>
      </el-table-column>
      <el-table-column label="项目周报" align="center" min-width="120">
        <template slot-scope="scope">
          <el-switch v-hasPermi="['hb:hbProjectInfo:zbkg']" v-model="scope.row.uploadSwitch" :active-value="1" :inactive-value="0" @change="handleWeekily(scope.row, $event)" />
          <el-button  type="text" @click="routerToWork(scope.row, 3)">项目周报</el-button>
        </template>
      </el-table-column>
      <el-table-column label="环保问题整改记录" align="center" prop="oneForthFilePaths" min-width="150">
        <template slot-scope="scope">
          <el-button v-hasPermi="['hb:hbRectRecord:wt:add']" v-if="!scope.row.fileStatus"  type="text" @click="routerTo(scope.row, 'add', 1)">新增</el-button>
          <el-button  type="text" @click="routerTo(scope.row, 'list', 1)">记录</el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'zc' || type == 'zcdc'" label="自查" align="center" prop="oneForthFilePaths" min-width="120">
        <template slot-scope="scope">
          <el-button v-hasPermi="['hb:hbRectRecord:zc:add']" v-if="!scope.row.fileStatus"  type="text" @click="routerTo(scope.row, 'add', 2)">新增</el-button>
          <el-button  type="text" @click="routerTo(scope.row, 'list', 2)">记录</el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'dc' || type == 'zcdc'" label="督查" align="center" prop="oneForthFilePaths" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button v-hasPermi="['hb:hbRectRecord:dc:add']" v-if="!scope.row.fileStatus"  type="text" @click="routerTo(scope.row, 'add', 3, 'dc')">新增</el-button>
          <el-button  type="text" @click="routerTo(scope.row, 'list', 3, 'dc')">记录</el-button>
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
    <div v-hasPermi="['hb:hbRectRecord:dc']" id="managementDc"></div>
    <div v-hasPermi="['hb:hbRectRecord:zc']" id="managementZc"></div>
  </div>
</template>

<script>
  import { listHbProjectInfo, getHbProjectInfo, changeSwitch } from "@/api/hb/hbProjectInfo";
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
          status: 1,
          projectName: undefined,
          prepareUnit: undefined
        },
        edit: true,
        fileType: undefined,
        projectInfoId: undefined,
        type: null
      }
    },
    created() {
      this.getList();
    },
    activated() {
      this.getList();
    },
    mounted() {
      let managementZc = document.getElementById('managementZc');
      let managementDc = document.getElementById('managementDc');
      if(managementZc) this.type = 'zc';
      if(managementDc) this.type = 'dc';
      if(managementDc && managementZc) this.type = 'zcdc';
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
      handleWeekily(row, event) {
        let type = '开启';
        row.uploadSwitch ? type = '开启' : type = '关闭';
        event ? row.uploadSwitch = 0 : row.uploadSwitch = 1;
        this.$confirm(`是否确认设置填写项目周报为${type}?`, "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          row.uploadSwitch ? row.uploadSwitch = 0 : row.uploadSwitch = 1;
          return changeSwitch({id:row.id,uploadSwitch:row.uploadSwitch});
        }).then(() => {
          this.getList();
          this.msgSuccess("设置成功");
        }).catch(function() {});
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
            pageType: 'management',
            active: '7'
          }
        })
      },
      uploadBtnsClick(type, id, event, title) {
        if (event == 'view') {
          const pageType = 'management';
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
      routerToWork(row, reportType) {
        let path = '';
        if(reportType == 1) path = '/buildEnvironment/environment/management/report/year';
        if(reportType == 2) path = '/buildEnvironment/environment/management/report/month';
        if(reportType == 3) path = '/buildEnvironment/environment/management/report/week';
        let query = {
          infoId: row.id,
          reportType: reportType
        }
        this.$router.push({
          path: path,
          query: query
        })
      },
      routerTo(row, pushType, recordType, pageType) {
        let path = '';

        if (pushType == 'add') {
          getHbProjectInfo(row.id).then(response => {
            if (response.data.fileStatus == 1) {
              this.msgInfo('该项目已归档，暂时无法操作');
              this.getList();
            } else {
              if (recordType == 1) path = '/buildEnvironment/environment/management/record/add';
              if (recordType == 2) path = '/buildEnvironment/environment/management/zc/add';
              if (recordType == 3) path = '/buildEnvironment/environment/management/dc/add';
              let query = {
                infoId: row.id,
                recordType: recordType,
                from: 'management'
              }
              if (pageType) query.pageType = pageType;
              this.$router.push({
                path: path,
                query: query
              })
            }
          })
        } else {
          if (recordType == 1) path = '/buildEnvironment/environment/management/record';
          if (recordType == 2) path = '/buildEnvironment/environment/management/zc';
          if (recordType == 3) path = '/buildEnvironment/environment/management/dc';
          let query = {
            infoId: row.id,
            recordType: recordType
          }
          if (pageType) query.pageType = pageType;
          this.$router.push({
            path: path,
            query: query
          })
        }
      }
    }
  }
</script>
