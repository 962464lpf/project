<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="9" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user"/>
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user"/>
                <span>用户名称</span>
                <div class="pull-right">{{ user.nickName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone"/>
                <span>手机号码</span>
                <div class="pull-right">{{ user.phonenumber }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email"/>
                <span>用户邮箱</span>
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree"/>
                <span>所属部门</span>
                <div class="pull-right" v-if="user.dept">{{ user.dept.deptName }} / {{ postGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples"/>
                <span>所属角色</span>
                <div class="pull-right">{{ roleGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date"/>
                <span>创建日期</span>
                <div class="pull-right">{{ user.createTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="15" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user"/>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user"/>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin: 20px 0;">
      <el-col :span="1.5">
        <el-button
          :disabled="endFlag"
          type="primary"
          icon="el-icon-plus"

          @click="handleAdd"
        >新增企业信息</el-button>
      </el-col>
      <el-col :span="15">
        <div class="el-upload__tip" style="color: red;margin-top: 15px;">
          企业初始化数据后，不可以新增！
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-table ref="table" v-loading="loading" :data="sysCompanyList" @selection-change="handleSelectionChange">
          <!--      <el-table-column type="selection" width="55" align="center" />-->
          <!--      <el-table-column label="编号" align="center" prop="id" />-->
          <el-table-column min-width="260" label="公司名称" align="center" prop="name" show-overflow-tooltip />
          <el-table-column min-width="100" label="公司编码" align="center" prop="code" show-overflow-tooltip />
          <el-table-column min-width="180" label="统一社会信用代码" align="center" prop="socialCreditCode" show-overflow-tooltip />
          <el-table-column min-width="160" label="开户银行" align="center" prop="bank" show-overflow-tooltip />
          <el-table-column min-width="200" label="银行账号" align="center" prop="bankCode" show-overflow-tooltip />
          <el-table-column min-width="100" label="负责人" align="center" prop="leader" show-overflow-tooltip />
          <el-table-column min-width="110" label="联系电话" align="center" prop="phone" show-overflow-tooltip />
          <el-table-column min-width="130" label="邮箱" align="center" prop="email" show-overflow-tooltip />
          <el-table-column width="90" label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
            <template slot-scope="scope">
              <el-button

                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <!--          <el-button-->
              <!--            -->
              <!--            type="text"-->
              <!--            icon="el-icon-delete"-->
              <!--            @click="handleDelete(scope.row)"-->
              <!--            v-hasPermi="['system:sysCompany:remove']"-->
              <!--          >删除</el-button>-->
              <!--          <el-button-->
              <!--              -->
              <!--              type="text"-->
              <!--              @click="handleDetail(scope.row)"-->
              <!--              v-hasPermi="['system:sysCompany:remove']"-->
              <!--          >详情</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    <!-- 添加或修改企业信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入公司名称" maxlength="20"/>
        </el-form-item>
        <el-form-item label="公司编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入公司编码" maxlength="25"/>
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="socialCreditCode">
          <el-input v-model="form.socialCreditCode" placeholder="请输入统一社会信用代码" maxlength="18"/>
        </el-form-item>
        <el-form-item label="开户银行" prop="bank">
          <el-input v-model="form.bank" placeholder="请输入开户银行" maxlength="30"/>
        </el-form-item>
        <el-form-item label="银行账号" prop="bankCode">
          <el-input v-model="form.bankCode" placeholder="请输入银行账号" maxlength="20" onkeyup="value=value.replace(/[^\d]/g,'')" type="text"/>
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="10"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import userAvatar from "./userAvatar";
  import userInfo from "./userInfo";
  import resetPwd from "./resetPwd";
  import {getUserProfile} from "@/api/system/user";
  import {sysCompanyRules} from "@/utils/el_validate";
  import {
    addSysCompany,
    delSysCompany,
    exportSysCompany,
    getSysCompany,
    listSysCompany,
    updateSysCompany
  } from "@/api/system/company";

  export default {
    name: "Profile",
    components: {userAvatar, userInfo, resetPwd},
    data() {
      return {
        user: {},
        roleGroup: {},
        postGroup: {},
        activeTab: "userinfo",
        flag: undefined,
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
        // 企业信息表格数据
        sysCompanyList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        endFlag:false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: sysCompanyRules
      };
    },
    created() {
      this.getUser();
      this.getList();
      // this.flag = this.$store.query.flag
    },
    methods: {
      getUser() {
        getUserProfile().then(response => {
          this.user = response.data;
          this.roleGroup = response.roleGroup;
          this.postGroup = response.postGroup;
          if (!response.data.nickName || !response.data.phonenumber || !response.data.email || !response.data.mobile) {
            this.$confirm('请先补充个人资料！！！', "系统提示", {
              confirmButtonText: "确定",
              type: "warning"
            })
          }
        });
      },
      /** 查询企业信息列表 */
      getList() {
        this.loading = true;
        listSysCompany(this.queryParams).then(response => {
          this.sysCompanyList = response.rows;
          this.total = response.total;
          this.loading = false;
          this.endFlag=(this.total>0)
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
          deptId: undefined,
          name: undefined,
          code: undefined,
          socialCreditCode: undefined,
          bank: undefined,
          bankCode: undefined,
          leader: undefined,
          phone: undefined,
          email: undefined,
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
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加企业信息";
      },
      /** 详情按钮操作 */
      handleDetail(row) {
        let  path="/system/sysCompany/detail"
        let id=row.id;
        this.$router.push({
          "path": path,
          "query": {"id":id}
        })
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getSysCompany(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改企业信息";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateSysCompany(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addSysCompany(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                }
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除企业信息编号为"' + ids + '"的数据项?', "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSysCompany(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有企业信息数据项?', "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSysCompany(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      }
    }
  };
</script>
<style lang="scss" scoped>
.app-container {
  width: 100%;
  padding: 20px 30px 50px 30px;
}
</style>
