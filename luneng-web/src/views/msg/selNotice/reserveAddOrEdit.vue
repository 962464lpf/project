<template>
  <div class="app-container">
    <!-- 添加或修改评选通知对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="通知标题" prop="noticeTitle">
        <el-input v-model="form.noticeTitle" placeholder="请输入通知标题" maxlength="50" show-word-limit/>
      </el-form-item>
      <el-form-item label="通知简述" prop="noticeObjective">
        <ueditor v-if="isLoad" v-model="form.noticeObjective"/>
      </el-form-item>
      <el-form-item label="附件" prop="filePaths">
        <upload accept=".pdf, .doc, .docx, .xls, .xlsx" v-model="form.filePaths" :limit="100" :size="50"></upload>
        <div class="el-upload__tip red-hint">仅支持PDF, Excel, Word格式的文件，最大50MB</div>
      </el-form-item>
      <el-form-item label="接收单位" prop="depts">
        <el-select
          v-model="form.depts"
          multiple
          filterable
          allow-create
          style="width: 250px"
          default-first-option
          placeholder="请选择接收单位（可多选）">
          <el-option
            v-for="item in deptOptions"
            :key="item.id"
            :label="item.value"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item style="padding-top: 20px;">
        <el-button type="primary" @click="submitForm(1)">发 布</el-button>
        <el-button v-if="form.publishStatus == 0" type="primary" @click="submitForm(0)">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {getSelNotice, addSelNotice, updateSelNotice} from "@/api/sel/selNotice";
  import ueditor from "@/components/Ueditor";

  export default {
    name: "reserveItems",
    components: {ueditor},
    data() {
      return {
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          noticeTitle: [
            {required: true, message: "通知标题不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ],
          noticeObjective: [
            {required: true, message: "通知简述不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ],
          filePaths: [
            {required: true, message: "附件不能为空", trigger: "blur"}
          ],
          depts: [
            {required: true, message: "接受单位不能为空", trigger: "blur"}
          ]
        },
        isLoad: false,
        deptOptions: [
            {id: "101", value: "集团总部"},
            {id: "102", value: "外部合作单位"},
            {id: "129", value: "房地产单位"},
            {id: "178", value: "新能源单位"}
        ],
        fromPath: '',
        fromFullPath: '',
        fromId: ''
      };
    },
    activated() {
      this.init();
    },
    created() {
      this.init();
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.fromFullPath = from.fullPath
        vm.fromPath = from.path
        vm.fromId = parseInt(from.query.id) + 1
      })
    },
    methods: {
      init() {
        const id = this.$route.query.id;
        if (id) {
          getSelNotice(id).then(response => {
            const newData = this.valueOfObjNum2Str(response.data.notice);
            this.form = newData;
            if (this.form.depts) {
              this.form.depts = this.form.depts.split(',');
            }
            this.isLoad = true
          });
        } else {
          this.reset();
          this.isLoad = true
        }
      },
      //将对象的数字型属性值转换成字符串
      valueOfObjNum2Str(obj) {
        Object.keys(obj).map(key => {
          if ((typeof obj[key]) == 'number') {
            obj[key] = String(obj[key])
          }
        })
        return obj
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          noticeTitle: undefined,
          noticeObjective: undefined,
          declareEndDate: undefined,
          uploadEndDate: undefined,
          filePaths: undefined,
          parentId: undefined,
          publishStatus: "0",
          publishTime: undefined,
          createBy: undefined,
          createTime: undefined,
          updateBy: undefined,
          updateTime: undefined,
          remark: undefined
        };
        this.resetForm("form");
      },
      // 取消按钮
      cancel() {
        this.closeView(this.$route.path, this.fromPath, 0)
      },
      /** 提交按钮  0未发布,1已发布*/
      submitForm: function (action) {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.kind = 3;
            if (action == 1) {
              this.form.publishTime = this.parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:00");
            }
            this.form.depts = this.form.depts.join()
            if (this.form.id != undefined) {
              this.form.publishStatus = action;
              updateSelNotice(this.form).then(response => {
                if (response.code === 200) {
                  if (action == 0) {
                    this.msgSuccess("保存成功");
                  } else {
                    this.msgSuccess("发布成功");
                  }
                  this.closeView(this.$route.path, `${this.fromPath}?id=${this.fromId}`, 0)
                }
              });
            } else {
              this.form.publishStatus = action;
              addSelNotice(this.form).then(response => {
                if (response.code === 200) {
                  if (action == 0) {
                    this.msgSuccess("保存成功");
                  } else {
                    this.msgSuccess("发布成功");
                  }
                  this.cancel()
                }
              });
            }
          }
        });
      }
    }
  };
</script>
