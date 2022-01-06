<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="90px">
          <el-form-item label="用户名称" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户名称"
              clearable

              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="部门" prop="departmentId">
            <el-select
              v-model="queryParams.departmentId"
              placeholder="部门"
              clearable

              style="width: 240px"
            >
              <el-option
                v-for="dept in deptList"
                :key="dept.deptId"
                :label="dept.deptName"
                :value="dept.deptId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="岗位" prop="dept">
            <el-select
              v-model="queryParams.postId"
              placeholder="岗位"
              clearable

              style="width: 240px"
            >
              <el-option
                v-for="post in postList"
                :key="post.postId"
                :label="post.postName"
                :value="post.postId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
              clearable

              style="width: 240px"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
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
              v-has-permi="['workgroup:userWorkGroup:addBatch']"
            >添加成员
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"

              :disabled="multiple"
              @click="batchDelete"
              v-hasPermi="['workgroup:userWorkGroup:remove']"
            >删除
            </el-button>
          </el-col>
        </el-row>

        <el-table ref="table" v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
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
          <el-table-column min-width="140" label="用户名称" align="center" prop="userName" />
          <el-table-column min-width="140" label="用户昵称" align="center" prop="nickName" />
          <el-table-column min-width="140" label="单位" align="center" prop="unitName" />
          <el-table-column min-width="140" label="部门" align="center" prop="dept.deptName" />
          <el-table-column min-width="140" label="岗位" align="center" prop="post" />
          <el-table-column min-width="140" label="手机号码" align="center" prop="phonenumber" />
          <el-table-column min-width="140" label="邮箱" align="center" prop="email" />
          <el-table-column min-width="140" label="状态" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" min-width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button

                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
              >修改
              </el-button>
              <el-button
                v-if="scope.row.userId !== 1"

                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['workgroup:userWorkGroup:remove']"
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
        <!-- 添加或修改参数配置对话框 -->
        <!-- 添加或修改参数配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="姓名" prop="nickName">
                  <el-input v-model="form.nickName" placeholder="请输入姓名"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="归属部门" prop="deptId">
                  <treeselect v-model="form.deptId" :options="deptOptions" placeholder="请选择归属部门"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="手机号码" prop="phonenumber">
                  <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="座机" prop="mobile">
                  <el-input v-model="form.mobile" placeholder="请输入座机号码" maxlength="50"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item v-if="form.userId == undefined" label="登录名" prop="userName">
                  <el-input v-model="form.userName" placeholder="请输入登录名"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
                  <el-input v-model="form.password" placeholder="请输入用户密码" type="password"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户性别">
                  <el-select v-model="form.sex" placeholder="请选择">
                    <el-option
                      v-for="dict in sexOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态">
                  <el-radio-group v-model="form.status">
                    <el-radio
                      v-for="dict in statusOptions"
                      :key="dict.dictValue"
                      :label="dict.dictValue"
                    >{{dict.dictLabel}}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="岗位" prop="postIds">
                  <el-select v-model="form.postIds" multiple placeholder="请选择">
                    <el-option
                      v-for="item in postOptions"
                      :key="item.postId"
                      :label="item.postName"
                      :value="item.postId"
                      :disabled="item.status == 1"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="角色" prop="roleIds">
                  <el-select v-model="form.roleIds" multiple placeholder="请选择">
                    <el-option
                      v-for="item in roleOptions"
                      :key="item.roleId"
                      :label="item.roleName"
                      :value="item.roleId"
                      :disabled="item.status == 1"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注">
                  <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"
                            maxlength="100"
                            show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    listUser,
    getUser,
    updateUser,
    changeUserStatus,
  } from "@/api/system/user";
  import {remove} from '@/api/workgroup/workGroup'
  import {listDept} from "@/api/system/dept"
  import {optionSelect} from "@/api/system/post"
  import {getToken} from "@/utils/auth";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import {treeselect} from "@/api/system/dept";
  import Treeselect from "@riophae/vue-treeselect";

  export default {
    name: "User",
    components: {Treeselect},
    data() {
      return {
        // 遮罩层
        loading: false,
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
        // 弹出层标题
        title: "",
        // 部门树选项
        deptOptions: undefined,
        // 是否显示弹出层
        open: false,
        // 部门名称
        deptName: undefined,
        // 默认密码
        initPassword: undefined,
        // 日期范围
        dateRange: [],
        // 状态数据字典
        statusOptions: [],
        // 性别状态字典
        sexOptions: [],
        // 岗位选项
        postOptions: [],
        // 角色选项
        roleOptions: [],
        // 表单参数
        form: {},
        // 部门
        deptList: [],
        // 岗位
        postList: [],
        defaultProps: {
          children: "children",
          label: "label"
        },
        // 用户导入参数
        upload: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: {Authorization: "Bearer " + getToken()},
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/system/user/importData"
        },
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          userName: undefined,
          phonenumber: undefined,
          status: undefined,
          departmentId: undefined
        },
        // 表单校验
        rules: {
          userName: [
            {required: true, message: "用户名称不能为空", trigger: "blur"}
          ],
          nickName: [
            {required: true, message: "用户昵称不能为空", trigger: "blur"}
          ],
          deptId: [
            {required: true, message: "归属部门不能为空", trigger: "blur"}
          ],
          password: [
            {required: true, message: "用户密码不能为空", trigger: "blur"}
          ],
          email: [
            {required: true, message: "邮箱地址不能为空", trigger: "blur"},
            {
              type: "email",
              message: "'请输入正确的邮箱地址",
              trigger: ["blur", "change"]
            }
          ],
          phonenumber: [
            {required: true, message: "手机号码不能为空", trigger: "blur"},
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的手机号码",
              trigger: "blur"
            }
          ]
        }
      };
    },
    created() {
      const workGroupId = this.$route.query.workGroupId;
      this.queryParams.workGroupId = workGroupId;
      this.getDicts("sys_normal_disable").then(response => {
        this.statusOptions = response.data;
      });
      this.getDicts("sys_user_sex").then(response => {
        this.sexOptions = response.data;
      });
      this.getConfigKey("sys.user.initPassword").then(response => {
        this.initPassword = response.msg;
      });
      this.getDeptList();
      this.getPostList();
      this.getList();
    },
    activated() {
      this.getList();
    },
    methods: {
      /** 获取岗位下拉*/
      getPostList() {
        optionSelect().then(response => {
          console.log(response.data)
          this.postList = response.data;
        })
      },
      /**
       * 查询部门下拉
       */
      getDeptList() {
        listDept({pageNum: 1}).then(response => {
          this.deptList = response.data;
        })
      },
      search() {
        this.searchToggle = !this.searchToggle;
      },
      /** 查询用户列表 */
      getList() {
        this.loading = true;
        listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
            this.userList = response.rows;
            this.total = response.total;
            this.loading = false;
          }
        );
      },
      // 用户状态修改
      handleStatusChange(row) {
        let text = row.status === "0" ? "启用" : "停用";
        this.$confirm('确认要"' + text + '""' + row.userName + '"用户吗?', "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return changeUserStatus(row.userId, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function () {
          row.status = row.status === "0" ? "1" : "0";
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
          userId: undefined,
          deptId: undefined,
          userName: undefined,
          nickName: undefined,
          password: undefined,
          phonenumber: undefined,
          email: undefined,
          sex: undefined,
          status: "0",
          remark: undefined,
          postIds: [],
          roleIds: []
        };
        this.resetForm("form");
      },
      /** 查询部门下拉树结构 */
      getTreeselect() {
        treeselect().then(response => {
          this.deptOptions = response.data;
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.page = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.dateRange = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.userId);
        this.single = selection.length != 1;
        this.multiple = !selection.length;
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.$router.push({
          path: "/workgroup/workgroup/detail/addUser/addUser",
          query: {
            "workGroupId": this.queryParams.workGroupId
          }
        })
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.getTreeselect();
        const userId = row.userId;
        getUser(userId).then(response => {
          this.form = response.data;
          this.postOptions = response.posts;
          this.roleOptions = response.roles;
          this.form.postIds = response.postIds;
          this.form.roleIds = response.roleIds;
          this.open = true;
          this.title = "修改用户";
          this.form.password = "";
        });
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            updateUser(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const userIds = []
        userIds.push(row.userId);
        // 删除用户和工作组关系
        this.$confirm("确定要删除工作组内成员？", "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(res => {
          return remove({workGroupId: this.queryParams.workGroupId, userIds: userIds})
        }).then(res => {
          if (res.code == 200) {
            this.msgSuccess("删除成功");
            this.getList();
          }
        })
      },
      /** 删除按钮操作 */
      batchDelete() {
        // 删除用户和工作组关系
        this.$confirm("确定要删除工作组内成员？", "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(res => {
          return remove({workGroupId: this.queryParams.workGroupId, userIds: this.ids})
        }).then(res => {
          if (res.code == 200) {
            this.msgSuccess("删除成功");
            this.getList();
          }
        })
      }
    }
  };
</script>
