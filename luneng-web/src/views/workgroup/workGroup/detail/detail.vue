<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="工作组名字" prop="name">
        <el-input v-model="form.name" style="width:200px" placeholder="请输入工作组名字"/>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          style="width: 350px"
          v-model="form.remark"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          maxlength="100"
          resize="none"
          placeholder="请填写备注，字数不超过100"
        />
      </el-form-item>
    </el-form>
    <div class="foot">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>
<script>
  import {
    getWorkGroup,
    addWorkGroup,
    updateWorkGroup,
  } from "@/api/workgroup/workGroup";

  export default {
    data() {
      return {
        form: {
          status: "0"
        },
        flag: true,
        rules: {
          name: [
            {required: true, message: "工作组名字不能为空", trigger: "blur"},
            {
              pattern: /[0-9a-zA-Z\u4E00-\u9FA5\\s]+/,
              message: "'请输入正确格式的工作组名字",
              trigger: ["blur", "change"]
            },
            {max: 30, message: "工作组名字最多30字", trigger: "blur"}
          ],
          status: [
            {required: true, message: "0:正常；1:停用不能为空", trigger: "blur"}
          ]
        }
      }
    },
    created() {
      const id = this.$route.query.id;
      console.log(id);
      if (id) {
        getWorkGroup(id).then(response => {
          this.form = response.data;
        });
      }
    },
    methods: {
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateWorkGroup(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  // this.$router.push({path: "/workgroup/workGroup"})
                  this.closeView("/workgroup/workgroup/detail/detail", "/system/workGroup")
                }
              });
            } else {
              addWorkGroup(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  // this.$router.push({path: "/workgroup/workGroup"})
                  this.closeView("/workgroup/workgroup/detail/detail", "/system/workGroup")
                }
              });
            }
          }
        });
      },
      cancel() {
        this.closeView("/workgroup/workgroup/detail/detail", "/system/workGroup")
      },
    }
  }
</script>
<style>
</style>
