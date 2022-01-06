<template>
  <div class="app-container">
    <div class="header">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true">
        <el-form-item
          label="专家组名称"
          prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入专家组名称"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            clearable
            style="width: 200px">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="创建时间"
          prop="createTime">
          <el-date-picker
            clearable
            style="width: 200px"
            v-model="queryParams.createTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleQuery">查询
          </el-button>
          <el-button
            icon="el-icon-refresh"
            @click="resetQuery">重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main">
      <div class="main-top">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="handleAdd"
              v-hasPermi="['expert:expertGroup:add']">添加专家组
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['expert:expertGroup:remove']">删除
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          :data="expertGroupList"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            min-width="40"
            align="center"/>
          <el-table-column
            min-width="55"
            label="序号"
            align="center"
            type="index">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="160"
            label="专家组名称"
            align="center"
            prop="name">
            <template slot-scope="scope">
              <div class="project-name-all-hover" @click="handleUpdate(scope.row)">
                <span>{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="120"
            label="专家组成员"
            align="center"
            prop="memberGroup">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="navGroupMember(scope.row)"
                v-has-permi="['expert:expertExpertGroup:view']">查看成员
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            min-width="115"
            label="创建时间"
            align="center"
            prop="createTime">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            label="状态"
            class-name="small-padding fixed-width"
            fixed="right"
            align="center"
            prop="status">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="200">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleCopy(scope.row)"
                v-hasPermi="['expert:expertGroup:copy']">复制专家组
              </el-button>
              <el-button
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['expert:expertGroup:remove']">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="main-footer">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"/>
      </div>
    </div>
  </div>
</template>

<script>
import {
  listExpertGroup,
  changeExpertGroupStatus,
  copyExpertGroup,
  delExpertGroup} from "@/api/expert/expertGroup";

export default {
  name: "",
  data() {
    return {
      // 加载等待线
      loading: true,
      // 表格选中数组id串
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 专家组表格数据
      expertGroupList: [],
      //专家组状态
      statusOptions: [],
      // 搜索框查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        status: undefined,
        createTime: undefined
      }

    }
  },
  created() {
    //获取专家组列表
    this.getList();
    //获取专家组的状态
    this.getDicts("expert_status").then(response => {
      this.statusOptions = response.data
    });
  },
  activated() {
    this.getList()
  },
  methods: {
    /********************* 获取及处理数据 **********************/
    /** 查询专家组列表 */
    getList() {
      this.loading = true;
      listExpertGroup(this.queryParams).then(response => {
        this.expertGroupList = response.rows;
        this.total = response.total;
        this.loading = false;
      })
    },

    /********************* 交互操作 **********************/
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
    /** 跳转新增专家组 */
    handleAdd() {
      const path = "/expert/expertGroup/addExpertGroup"
      this.$router.push({
        "path": path
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除?', "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delExpertGroup(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    //查看专家组成员
    navGroupMember(row) {
      const path = "/expert/expertGroup/manageMember"
      const expertGroupId = row.id
      this.$router.push({
          "path": path,
          "query": {
            "expertGroupId": expertGroupId
          }
      })
    },
    //处理专家状态
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.name + '"用户吗?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return changeExpertGroupStatus(row.id, row.status);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    //复制专家组
    handleCopy(row) {
      const id = row.id
      const name = row.name
      this.$confirm('是否确认复制"' + name + '"专家组的数据项?', "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        }).then(function() {
          return copyExpertGroup(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("复制成功");
        }).catch(function() {});
    },
    /** 跳转专家组修改 */
    handleUpdate(row) {
      const id = row.id
      const path = "/expert/expertGroup/updateExpertGroup"
      this.$router.push({
        "path": path,
        "query": {"id":id}
      })
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
    .header{
      width: 100%;
      margin-bottom: 20px;
    }
    .main {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .main-top, .main-center{
        width: 100%;
      }
      .main-footer{
        width: 420px;
        margin-top: 20px;
      }
    }
  }
</style>
