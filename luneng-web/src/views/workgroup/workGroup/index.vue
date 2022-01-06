<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="工作组名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入工作组名称"
          clearable

          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable >
          <el-option label="正常" value="0"/>
          <el-option label="停用" value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker clearable  style="width: 200px"
                        v-model="queryParams.createTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search"  @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh"  @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"

          @click="handleAdd"
          v-hasPermi="['workgroup:workGroup:add']"
        >添加工作组
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"

          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['workgroup:workGroup:remove']"
        >删除工作组
        </el-button>
      </el-col>
    </el-row>

    <el-table ref="table" v-loading="loading" :data="workGroupList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" min-width="40" align="center"/>
      <el-table-column
        min-width="55"
        label="序号"
        align="center"
        type="index">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="160" label="工作组名字" align="center" prop="name" />
      <el-table-column min-width="200" label="工作组成员" align="center" >
        <template slot-scope="scope">
          <el-button type="text" @click="linkToUser(scope.row)" v-has-permi="['workgroup:workGroup:viewUser']">查看成员</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" min-width="160" >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" min-width="160" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="260">
        <template slot-scope="scope">
          <el-button

            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['workgroup:workGroup:edit']"
          >修改
          </el-button>
          <el-button

            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['workgroup:workGroup:remove']"
          >删除
          </el-button>
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

  </div>
</template>

<script>
  import {
    listWorkGroup,
    delWorkGroup,
    updateWorkGroup,
  } from "@/api/workgroup/workGroup";
  import {presenter} from '@/components/Crud/crud';
  import {sysWorkGroupRules} from '@/utils/el_validate'

  export default {
    name: "WorkGroup",
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
        // 工作组表格数据
        workGroupList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: undefined,
          status: undefined,
          createTime: undefined,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules:sysWorkGroupRules
      };
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
      /** 查询工作组列表 */
      getList() {
        this.loading = true;
        console.log(this.queryParams)
        listWorkGroup(this.queryParams).then(response => {
          this.workGroupList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          name: undefined,
          status: "0",
          remark: undefined,
          createBy: undefined,
          createTime: undefined,
          updateBy: undefined,
          updateTime: undefined
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.$router.push({path: "/workgroup/workgroup/detail/detail"})
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.$router.push({
          path: "/workgroup/workgroup/detail/detail",
          query: {"id": row.id}
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除?', "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delWorkGroup(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function () {
        });
      },
      /**
       *查看工作组成员
       */
      linkToUser(row) {
        this.$router.push({
          path: "/workgroup/workgroup/detail/user",
          query: {"workGroupId": row.id}
        })
      },
      /**
       * 修改工作组状态
       */
      handleStatusChange(row) {
        let text = row.status === "0" ? "启用" : "停用";
        this.$confirm('确认要' + text + '' + row.name + '工作组?', "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return updateWorkGroup({"id": row.id, "status": row.status});
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
      }
    }
  };
</script>
