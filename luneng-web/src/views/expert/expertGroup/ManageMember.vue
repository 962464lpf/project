<template>
  <div class="app-container">
    <div class="header">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true">
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入姓名"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="技术职称" prop="jobLevel">
          <el-input
            v-model="queryParams.jobLevel"
            placeholder="请输入技术职称"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleQuery">搜索
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
              v-hasPermi="['expert:expertExpertGroup:addBatch']">添加成员
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['expert:expertExpertGroup:remove']">删除成员
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          :data="expertList"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            min-width="40"
            align="center" />
          <el-table-column
            label="序号"
            align="center"
            min-width="55"
            type="index">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="姓名"
            align="center"
            min-width="100"
            prop="name">
            <template slot-scope="scope">
              <div class="project-name-all-hover" @click="handleDetail(scope.row)">
                <span>{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="用户名"
            align="center"
            min-width="100"
            prop="userName">
            <template slot-scope="scope">
              <div class="project-name-all-hover" @click="handleDetail(scope.row)">
                <span>{{ scope.row.userName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="200"
            label="工作单位"
            align="center"
            prop="workUnit"/>
          <el-table-column
            label="现任职务"
            align="center"
            min-width="120"
            prop="job"/>
          <el-table-column
            label="技术职称"
            align="center"
            min-width="120"
            prop="jobLevel"/>
          <el-table-column
            label="专业领域"
            align="center"
            min-width="120"
            prop="exportArea"
            :formatter="exportAreaFormat"/>
          <el-table-column
            label="联系方式"
            align="center"
            prop="phone"
            min-width="150"/>
          <el-table-column
            label="邮箱"
            align="center"
            prop="email"
            min-width="150"/>
          <el-table-column
            min-width="200"
            label="入库时间"
            align="center"
            prop="createTime">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            width="120"
            class-name="small-padding fixed-width"
            fixed="right"
            align="center"
            prop="status">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
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
  listExpert,
  changeExpertStatus
} from "@/api/expert/expert";
import {
  delExpertExpertGroup
} from "@/api/expert/expertExpertGroup";

export default {
  name: "Expert",
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
      // 专家表格数据
      expertList: [],
      // 专家状态字典
      statusOptions: [],
      // 专业领域字典
      exportAreaOptions: [],
      // 查询参数
      queryParams: {
        expertGroupId: undefined,
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        jobLevel: undefined
      }
    }
  },
  created() {
    this.queryParams.expertGroupId = this.$route.query.expertGroupId
    //获取专家列表
    this.getList();
    //获取专家领域字典
    this.getDicts("sys_expert_area").then(response => {
      this.exportAreaOptions = response.data;
    });
    //获取专家的个人状态字典
    this.getDicts("expert_status").then(response => {
      this.statusOptions = response.data
    });
  },
  activated() {
    this.getList()
  },
  methods: {
    /*********************** 数据获取及处理 ***********************/
    /** 查询专家列表 */
    getList() {
      this.loading = true;
      listExpert(this.queryParams).then(response => {
        this.expertList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 专业领域字典翻译
    exportAreaFormat(row) {
      if (row.exportArea) {
        const exportAreaArr = row.exportArea.split(',').map(item => {
          return this.selectDictLabel(this.exportAreaOptions, item)
        })
        return exportAreaArr.join()
      }
    },

    /*********************** 交互操作 ***********************/
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
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    //处理专家状态
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.name + '"用户吗?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return changeExpertStatus(row.id, row.status);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      const path = "/expert/expertGroup/manageMember/addMember"
      const expertGroupId = this.queryParams.expertGroupId
      this.$router.push({
        "path": path,
        "query": {
          "expertGroupId": expertGroupId
        }
      })
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      const path = "/expert/expert/expertDetail"
      const id = row.id
      this.$router.push({
        "path": path,
        "query": {
          "id": id,
          "expertGroupId": this.queryParams.expertGroupId
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let idsTem = []
      if(row.id) {
        idsTem.push(row.id)
      }else {
        idsTem = this.ids
      }
      const queryData = {
        expertGroupId: this.queryParams.expertGroupId,
        expertIds: idsTem
      }
      this.$confirm('是否确认删除该专家组下的该成员?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delExpertExpertGroup(queryData);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function() {});
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
  .header {
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
