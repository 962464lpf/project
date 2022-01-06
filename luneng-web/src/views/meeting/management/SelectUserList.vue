<template>
  <div class="user-list">
    <el-row>
      <el-col :span="24">
        <el-select
          v-model="userName"
          style="width: 100%; margin-bottom: 20px;"
          placeholder="请输入参会人员姓名进行搜索"
          clearable
          filterable
          allow-create
          remote
          :remote-method="remoteMethod"
          :loading="loading"
          @visible-change="onSelectVisible"
          @change="addUser">
          <el-option
            v-for="item in options"
            :key="item.userId"
            :label="`${item.nickName} / ${item.deptName}`"
            :value="item">
            <span style="float: left">{{ item.nickName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.deptName }}</span>
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="18" style="border-right: 1px solid #6d6b6b;">
        <el-tree
          :data="deptOptions"
          :props="defaultProps"
          :expand-on-click-node="false"
          ref="tree"
          default-expand-all
          node-key="id"
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :span="6">
        <div class="users">
            <div class="user-item"
                 v-for="(item, index) in userList"
                 :key="index"
                 @click="selectUser(item)">
                <span>{{item.nickName}}</span>
            </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {treeselect} from "@/api/system/dept";
import {getUserInfoByName, listAllMeetingUser} from "@/api/meeting/meetingUser";

export default {
  name: "SelectUserList",
  data() {
    return {
      loading: true,
      options: [],
      userName: '',
      // 用户表格数据
      userList: null,
      // 部门树选项
      deptOptions: undefined,
      // 部门名称
      deptName: undefined,
      defaultProps: {
        children: "children",
        label: "label"
      }
    }
  },
  created() {
    this.getTreeselect()
  },
  methods: {
    // 节点单击事件
    handleNodeClick(data) {
      this.getList(data.id);
    },
    /** 查询用户列表 */
    getList(deptId) {
      listAllMeetingUser({deptId}).then(response => {
          this.userList = response.data;
        }
      )
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },

    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        getUserInfoByName({
          userName: query
        }).then(({data}) => {
          this.loading = false;
          this.options = data
        })
      } else {
        this.options = [];
      }
    },
    //树型结构选择
    selectUser(user) {
      this.$emit('select', user)
    },

    //监听下拉框关闭
    onSelectVisible(visible) {
      if (!visible) {
        this.userName = ''
      }
    },
    //增加用户
    addUser(user) {
      if (user && user.userId) {
        this.$emit('select', user)
      } else {
        this.$emit('add', user)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-list {
  width: 100%;
  height: 600px;
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border: 1px solid #999;
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  .users {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    ::-webkit-scrollbar {
      display: none;
    }
    .user-item {
      width: 100%;
      padding: 10px 2px 5px;
      font-size: 15px;
      line-height: 15px;
      text-align: center;
      cursor: pointer;
      color: #333;
      border-bottom: 1px solid #eaeaea;
      &:hover {
        background-color: rgba(#2b2b2b, .1);
      }
    }
    & > :last-child {
      border-bottom: none;
    }
  }
  //::v-deep .el-tree {
  //  .el-tree-node {
  //    /*设置横向滚动条*/
  //    min-width: 100%;
  //    display: inline-block;
  //    /*设置根节点隐藏*/
  //    .el-tree-node__content {
  //      display: none;
  //    }
  //  }
  //}
}
</style>
