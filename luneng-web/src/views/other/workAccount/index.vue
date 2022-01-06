<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="90px">
      <el-form-item label="台账标题" prop="accountTitle">
        <el-input
          v-model="queryParams.accountTitle"
          placeholder="请输入台账标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工作类型" prop="workType">
        <el-input
          v-model="queryParams.workType"
          placeholder="请输入工作类型"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item v-if="activeName == '2'" label="发布部门" prop="deptId">
        <div style="display: inline-block;width: 340px;">
          <treeselect style="font-size: 18px;" v-model="queryParams.deptId" :options="deptList" :multiple="false" placeholder="请选择发布部门"/>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
          v-hasPermi="['system:sysWorkAccount:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:sysWorkAccount:remove']"
        >删除
        </el-button>
      </el-col>
    </el-row>

    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="我的工作" name="1">
        <el-table
          ref="table"
          v-loading="loading"
          :data="list"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" min-width="40" align="center"/>
          <el-table-column min-width="55" label="序号" align="center" type="index">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="230" label="台账标题" align="center" prop="accountTitle">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)" @click="handleDetail(scope.row)">
                <span>{{ scope.row.accountTitle }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="180" label="工作类型" align="center" prop="workType" />
          <el-table-column min-width="230" label="相关项目" align="center" prop="projectName" />
          <el-table-column width="180" label="发布状态" align="center" prop="publishStatus" class-name="small-padding fixed-width" fixed="right">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row) + ' no-cursor-point'">
                <span>{{ scope.row.publishStatus === 1 ? '已发布' : '草稿' }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="全部" name="2" v-if="allWorkAccount">
        <el-table
          ref="table"
          v-loading="loading"
          :data="list"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" min-width="40" align="center"/>
          <el-table-column min-width="55" label="序号" align="center" type="index">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="230" label="台账标题" align="center" prop="accountTitle" >
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)" @click="handleDetail(scope.row)">
                <span>{{ scope.row.accountTitle }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="160" label="工作类型" align="center" prop="workType" />
          <el-table-column min-width="230" label="相关项目" align="center" prop="projectName" />
          <el-table-column min-width="160" label="发布部门" align="center" prop="deptName" />
          <el-table-column min-width="140" label="发布人" align="center" prop="nickName" />
          <el-table-column min-width="120" label="发布状态" align="center" prop="publishStatus" class-name="small-padding fixed-width" fixed="right">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row) + ' no-cursor-point'">
                <span>{{ scope.row.publishStatus === 1 ? '已发布' : '草稿' }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <div v-hasPermi="['system:sysWorkAccount:operation']" id="sysWorkAccountOperation"></div>
    <div v-hasPermi="['system:sysWorkAccount:allWorkAccount']" id="allWorkAccount"></div>
  </div>
</template>

<script>
import {listSysWorkAccount, delSysWorkAccount, exportSysWorkAccount} from "@/api/sys/sysWorkAccount";
import {listDept} from '@/api/system/dept';
import {hasPermi} from '@/utils/sailing';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "WorkAccount",
  components: {
    Treeselect
  },
  data() {
    return {
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
      // 工作台账表格数据
      list: [],
      // 全部表格数据
      allList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        accountTitle: undefined,
        workType: undefined,
        deptId: undefined,
        type: '1'
      },
      // 表单参数
      form: {},
      departmentOptions: [],
      activeName: '1',
      deptList: [],  //部门数据
      cascaderProps: {
        label: 'deptName',
        value: 'deptId',
        checkStrictly: true,
        children: "children"
      },
      deptId: undefined,
      sysWorkAccountOperation: false,
      allWorkAccount: false,
      userName: this.$store.state.user.name
    };
  },
  computed: {
    projectNameStyle() {
      return (row) => {
        if (row.publishStatus === 0) {
          return 'project-name-all-hover'
        } else if (row.publishStatus === 1) {
          return 'project-name-all'
        }
      }
    }
  },
  created() {
    this.getList();
    this.getDeptList();
  },
  activated() {
    this.getList();
  },
  mounted() {
    this.sysWorkAccountOperation = hasPermi('sysWorkAccountOperation');
    this.allWorkAccount = hasPermi('allWorkAccount');
  },
  methods: {
    search() {
      this.searchToggle = !this.searchToggle;
    },
    handleTabClick(tab) {
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.queryParams.type = tab.name;
      this.queryParams.deptId = null;
      this.getList();
    },
    getDeptList() {
      listDept().then(response => {
        response.data.map(item => {
          item.id = item.deptId;
          item.label = item.deptName;
        })
        this.deptList = this.handleTree(response.data, "deptId");
        if (this.deptList.length == 1) {
          this.deptList = this.deptList[0].children;
        }
      })
    },
    /** 查询环保问题整改记录列表 */
    getList() {
      this.loading = true;
      listSysWorkAccount(this.queryParams).then(response => {
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
      this.deptId = undefined;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
      selection.map(item => {
        if (item.publishStatus == 1) {
          this.multiple = true;
        }
      })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/other/workAccount/add'
      })
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.$router.push({
        path: '/other/workAccount/detail',
        query: {
          id: row.id
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$router.push({
        path: '/other/workAccount/edit',
        query: {
          id: row.id
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delSysWorkAccount(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有环保问题整改记录数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportSysWorkAccount(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () {
      });
    }
  }
};
</script>
