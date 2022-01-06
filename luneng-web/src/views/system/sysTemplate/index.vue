<template>
  <div class="app-container">


    <el-table ref="table" v-loading="loading" :data="sysTemplateList" >
      <el-table-column
        label="序号"
        align="center"
        type="index">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司名称" align="center" prop="unitName" show-overflow-tooltip />
      <el-table-column label="证书编号前缀" align="center" prop="codePrefix" show-overflow-tooltip />
      <el-table-column label="公司logo" align="center" prop="logoFilePaths" show-overflow-tooltip />
      <el-table-column label="公司公章" align="center" prop="sealFilePaths" show-overflow-tooltip />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="300">
        <template slot-scope="scope">
          <el-button

            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:sysTemplate:edit']"
          >修改</el-button>
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

    <!-- 添加或修改模板设置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="公司名称" prop="unitName">
          <el-input v-model="form.unitName" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="证书编号前缀" prop="codePrefix">
          <el-input v-model="form.codePrefix" placeholder="请输入证书编号前缀" />
        </el-form-item>
        <el-form-item label="公司logo" prop="logoFilePaths">
          <upload v-model="form.logoFilePaths"></upload>
        </el-form-item>
        <el-form-item label="公司公章" prop="sealFilePaths">
          <upload v-model="form.sealFilePaths"></upload>
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
import { listSysTemplate, getSysTemplate, updateSysTemplate } from "@/api/system/sysTemplate";
import { presenter} from '@/components/Crud/crud';

export default {
  name: "SysTemplate",
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
      // 查询参数
      queryParams: {
          pageNum: 1,
          pageSize: 10,
          unitName: undefined,
          codePrefix: undefined
      },
      // 模板设置表格数据
      sysTemplateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        unitName: [
          { required: true, message: "公司名称不能为空", trigger: "blur" },
          {
            pattern:  /[0-9a-zA-Z\u4E00-\u9FA5\\s]+/,
            message: "'请输入正确格式的公司名称",
            trigger: ["blur", "change"]
          }
        ],
        codePrefix: [
          { required: true, message: "证书编号前缀不能为空", trigger: "blur" },
          {
            pattern:  /[0-9a-zA-Z\u4E00-\u9FA5\\s]+/,
            message: "'请输入正确格式的证书编号前缀",
            trigger: ["blur", "change"]
          }
        ],
        logoFilePaths: [
          { required: true, message: "公司logo不能为空", trigger: "blur" }
        ],
        sealFilePaths: [
          { required: true, message: "公司公章不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    search() {
      this.searchToggle = !this.searchToggle;
    },
    /** 查询模板设置列表 */
    getList() {
      this.loading = true;
      listSysTemplate(this.queryParams).then(response => {
        this.sysTemplateList = response.rows;
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
        unitName: undefined,
        codePrefix: undefined,
        logoFilePaths: undefined,
        sealFilePaths: undefined
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSysTemplate(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改模板设置";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
            updateSysTemplate(this.form).then(response => {
                if (response.code === 200) {
                    this.msgSuccess("修改成功");
                    this.open = false;
                    this.getList();
                }
            });
        }
      });
    }
  }
};
</script>
