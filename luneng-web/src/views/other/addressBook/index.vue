<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="5" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container favorite" @click="getMyFavorites">
          <span :style="showFavorites ? 'color: #FFA500' : ''">我的收藏</span>
        </div>
        <div class="head-container tree-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            accordion
            node-key="id"
            :default-expanded-keys="[101]"
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="19" :xs="24">
        <el-form v-if="!showFavorites" :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="部门名称" prop="deptName">
            <el-input
              v-model="queryParams.deptName"
              placeholder="请输入部门名称"
              clearable
              style="width: 200px;"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="岗位名称" prop="postName">
            <el-input
              v-model="queryParams.postName"
              placeholder="请输入岗位名称"
              clearable
              style="width: 200px;"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户姓名" prop="nickName">
            <el-input
              v-model="queryParams.nickName"
              placeholder="请输入用户姓名"
              clearable
              style="width: 200px;"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-if="!showFavorites"
              type="primary"
              icon="el-icon-plus"
              :disabled="multiple"
              @click="addFavorites"
            >添加收藏
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              :disabled="multiple"
              @click="cancelFavorites"
            >取消收藏
            </el-button>
          </el-col>
        </el-row>

        <el-table ref="table" v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" min-width="45" align="center"/>
          <el-table-column
            label="序号"
            align="center"
            min-width="55">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="230" label="单位" align="center" prop="unitName" />
          <el-table-column min-width="140" label="部门" align="center" prop="dept.deptName" />
          <el-table-column min-width="100" label="岗位" align="center" prop="post" />
          <el-table-column min-width="100" label="姓名" align="center" prop="nickName" />
          <el-table-column min-width="120" label="手机号码" align="center" prop="phonenumber" />
          <el-table-column min-width="130" label="座机" align="center" prop="mobile" />
          <el-table-column min-width="170" label="邮箱" align="center" prop="email" />
          <el-table-column
            label="收藏"
            align="center"
            width="100"
            class-name="small-padding fixed-width"
            fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                style="font-size: 22px; color: #FFA500"
                :icon="scope.row.ifMail ? 'el-icon-star-on' : 'el-icon-star-off'"
                @click="handleFavorites(scope.row)"
                >
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-if="!showFavorites"
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
        <pagination
          v-if="showFavorites"
          v-show="total>0"
          :total="total"
          :page.sync="queryParams2.pageNum"
          :limit.sync="queryParams2.pageSize"
          @pagination="getFavorites"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {treeselect} from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {addMail, delMail, listMail,allList, getUser} from "@/api/system/mail";

export default {
  name: "index",
  components: {Treeselect},
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
      // 用户表格数据
      userList: null,
      // 部门树选项
      deptOptions: undefined,
      // 部门名称
      deptName: undefined,
      // 岗位选项
      postOptions: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: undefined,
        deptName: undefined,
        postName: undefined,
        nickName: undefined
      },
      queryParams2: {
        pageNum: 1,
        pageSize: 10
      },
      showFavorites: false
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getTreeselect()
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
        allList(this.queryParams).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    //获取收藏列表
    getFavorites() {
      this.showFavorites = true
      this.loading = true;
      listMail(this.queryParams2).then(({rows, total}) => {
        this.userList = rows;
        this.total = total;
        this.loading = false;
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.showFavorites = false
      this.getList();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.deptId = undefined
      this.queryParams.deptName = undefined
      this.queryParams.postName = undefined
      this.queryParams.nickName = undefined
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    //获取我的收藏
    getMyFavorites() {
      this.queryParams2.pageNum = 1;
      this.getFavorites()
    },
    /** 添加收藏 */
    addFavorites() {
      const ids = this.ids
      addMail(ids).then(() => {
        this.msgSuccess('收藏成功')
        this.getList()
        this.getTreeselect()
      }).catch(() => {
        this.msgSuccess('批量收藏失败，请重新刷新下列表')
      })
    },
    /** 取消收藏 */
    cancelFavorites() {
      const ids = this.ids
      delMail(ids).then(() => {
        this.msgSuccess('已取消收藏')
        if (!this.showFavorites) {
          this.getList()
          this.getTreeselect()
        } else {
          this.getFavorites()
        }
      })
    },
    /** 处理单个添加收藏或取消收藏 */
    handleFavorites(row) {
      getUser(row.userId).then(({data}) => {
        if (data.ifMail) { //取消收藏
          delMail(row.userId).then(() => {
            this.msgSuccess('已取消收藏')
            if (!this.showFavorites) {
              this.getList()
              this.getTreeselect()
            } else {
              this.getFavorites()
            }
          })
        } else { //添加收藏
          addMail(row.userId).then(() => {
            this.msgSuccess('收藏成功')
            if (!this.showFavorites) {
              this.getList()
              this.getTreeselect()
            } else {
              this.getFavorites()
            }
          })
        }
      })
    }
  }
};
</script>


<style lang="scss">
.tree-container {
  padding: 10px 0;
  box-sizing: border-box;
  /*设置纵向滚动条、横向滚动条要配合下面的.el-tree-node的样式才能实现*/
  overflow-x: auto;

  >.el-tree {
    >.el-tree-node {
      /*设置横向滚动条*/
      min-width: 100%;
      display: inline-block;
      /*设置根节点隐藏*/
      >.el-tree-node__content {
        //display: none;
      }
    }
  }
}
.favorite {
  padding-bottom: 5px;
  font-size: 18px;
  color: #666;
  cursor: pointer;
}

.treeselect-container {
  .vue-treeselect__menu {
    max-width: 100%;
  }
}

</style>
