<template>
  <div class="app-container">
    <div class="header">
      <el-form :model="queryParams"
               ref="queryForm"
               :inline="true">
        <el-form-item label="部门" prop="dept">
          <el-select v-model="queryParams.deptId"
                     placeholder="请选择部门"
                     clearable >
            <el-option
              v-for="dept in deptList"
              :key="dept.deptId"
              :label="dept.deptName"
              :value="dept.deptId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input
            v-model="queryParams.userName"
            placeholder="请输入姓名"
            clearable

            @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input
            v-model="queryParams.phone"
            placeholder="请输入联系方式"
            clearable

            @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="用户状态"
            clearable
            >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="el-icon-search"

                     @click="handleQuery">查询
          </el-button>
          <el-button icon="el-icon-refresh"

                     @click="resetQuery">重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="main">
      <el-transfer
        style="text-align: left; display: inline-block"
        v-model="selectedValue"
        :titles="['可选用户', '已选用户']"
        :button-texts="['删除用户', '添加用户']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
        :props="{
          key: 'userId',
          label: 'userName'
        }"
        @change="handleChange"
        :data="optionalUser">
      </el-transfer>
    </div>
    <div class="footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
  import {listDept} from "@/api/system/dept"
  import {selectWorkAddUser} from '@/api/system/user'
  import {addBatch} from '@/api/workgroup/workGroup'

  export default {
    name: '',
    data() {
      return {
        queryParams: {},
        statusOptions: [],
        deptList: [],
        optionalUser: [],
        selectedValue: [],
        allUserWorkGroup: {
          workGroupId: undefined,
          userIds: []
        }
      }
    },
    created() {
      this.queryParams.workGroupId = this.$route.query.workGroupId;
      this.allUserWorkGroup.workGroupId = this.$route.query.workGroupId;
      console.log(this.$route.query.workGroupId)
      this.getDeptList();
      this.getList();
      this.getDicts("sys_normal_disable").then(response => {
        this.statusOptions = response.data;
      });
    },
    methods: {
      //处理查询按钮
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      //重置查询
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      //处理穿梭框改变
      handleChange(value, direction, movedKeys) {
        console.log(value);
        this.allUserWorkGroup.userIds = value;
        console.log(this.allUserWorkGroup)
      },

      //添加提交方法
      submitForm() {
        if (this.allUserWorkGroup.userIds.length != 0) {
          addBatch(this.allUserWorkGroup).then(res => {
            if (res.code == 200) {
              this.msgSuccess("添加成员成功")
              this.closeView("/workgroup/workgroup/detail/addUser/addUser", "/workgroup/workgroup/detail/user?workGroupId=" + this.$route.query.workGroupId);
            }
          })
        } else {
          this.msgError("请选择需要添加的用户！")
        }
      },

      //取消返回
      cancel() {
        console.log("取消")
        this.closeView("/workgroup/workgroup/detail/addUser/addUser", "/workgroup/workgroup/detail/user?workGroupId=" + this.$route.query.workGroupId);
      },
      getDeptList() {
        listDept({pageNum: 1}).then(res => {
          console.log(res.data);
          this.deptList = res.data;
        })
      },
      getList() {
        selectWorkAddUser(this.queryParams).then(res => {
          this.optionalUser.splice(0, this.optionalUser.length);
          this.selectedValue.splice(0, this.selectedValue.length);
          res.data.selectUser.some(user => {
            this.optionalUser.push(user);
          });
          res.data.notSelectUser.some(user => {
            this.optionalUser.push(user);
            this.selectedValue.push(user.userId);
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-container {
    width: 100%;
    display: flex;
    flex-direction: column;

    .header {
      width: 100%;
      margin-bottom: 20px;
    }

    .main {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 40px;
    }

    .footer {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

</style>
