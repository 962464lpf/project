<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="姓名" prop="nickName">
      <el-input v-model="user.nickName"/>
    </el-form-item>
    <el-form-item label="手机号码" prop="phonenumber">
      <el-input v-model="user.phonenumber" maxlength="11"/>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50"/>
    </el-form-item>
    <el-form-item label="座机" prop="mobile" class="is-required">
      <div style="display: flex;">
        <el-input
          ref="areaCode"
          v-model="user.areaCode"
          @focus="areaCodeIsFocus = true"
          @blur="areaCodeIsFocus = false"
          @input="inputOnInput"
          type="text"
          placeholder="区号"
          maxlength="4"
          style="width: 106px;"/>
        <span style="padding: 0 10px;">-</span>
        <el-input
          ref="landlineNumber"
          v-model="user.landlineNumber"
          @focus="landlineNumberIsFocus = true"
          @input="inputOnInput"
          @blur="landlineNumberIsFocus = false"
          type="text"
          placeholder="座机号码"
          maxlength="8"
          style="min-width: 100px;"/>
      </div>
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio label="0">男</el-radio>
        <el-radio label="1">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"  @click="submit">保存</el-button>
      <el-button type="danger"  @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {updateUserProfile} from "@/api/system/user";
  import {sendMessage} from "@/api/sel/selMessage"
  import store from '../../../../store'
  import router from '../../../../router'
  import {Message} from 'element-ui'

  export default {
    props: {
      user: {
        type: Object
      },
      flag: {
        type: Number
      }
    },
    data() {
      return {
        // 表单校验
        rules: {
          nickName: [
            {required: true, message: "用户昵称不能为空", trigger: "blur"}
          ],
          email: [
            {required: true, message: "邮箱地址不能为空", trigger: "blur"},
            {
              type: "email",
              message: "'请输入正确的邮箱地址",
              trigger: ["blur"]
            }
          ],
          phonenumber: [
            {required: true, message: "手机号码不能为空", trigger: "blur"},
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的手机号码",
              trigger: "blur"
            }
          ],
          mobile: [
            {
              validator: (rules, value, callback) => {
                let {areaCode, landlineNumber} = this.user;
                if (!areaCode) areaCode = '';
                if (!landlineNumber) landlineNumber = '';
                let mobile = null;
                mobile = areaCode + '-' + landlineNumber;
                setTimeout(() => {
                  if (!this.areaCodeIsFocus && !this.landlineNumberIsFocus) {
                    if (!areaCode) {
                      return callback(new Error('区号不能为空'));
                    }
                    if (!landlineNumber) {
                      return callback(new Error('座机号码不能为空'));
                    }
                    let reg = /^0\d{2,3}-\d{7,8}$/;
                    if (!(reg.test(mobile))) {
                      return callback(new Error('请输入正确的座机号码'));
                    }
                  }
                  this.user.mobile = mobile;
                  return callback();
                }, 30)
              },
              trigger: 'blur'
            }
          ]
        },
        areaCodeIsFocus: false,
        landlineNumberIsFocus: false,
      };
    },
    methods: {
      submit() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            updateUserProfile(this.user).then(response => {
              if (response.code === 200) {
                // 获取消息
                sendMessage(this.user.userName).then();
                this.msgSuccess("修改成功");
                // 判断当前用户是否已拉取完user_info信息
                this.$store.dispatch('GetInfo').then(res => {
                  // 拉取user_info
                  const roles = res.roles
                  this.$store.dispatch('GenerateRoutes', {roles}).then(accessRoutes => {
                    // 测试 默认静态页面
                    // store.dispatch('permission/generateRoutes', { roles }).then(accessRoutes => {
                    // 根据roles权限生成可访问的路由表
                    router.addRoutes(accessRoutes) // 动态添加可访问路由表
                    this.closeView('/user/profile', '/index');
                  })
                }).catch(err => {
                  store.dispatch('FedLogOut').then(() => {
                    Message.error(err)
                    next({path: '/'})
                  })
                })
              }
            });
          }
        });
      },
      inputOnInput() {
        this.$forceUpdate();
      },
      close() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.push({path: "/index"});
      }
    },
    watch: {
      user(newValue) {
        if (newValue.mobile) {
          if (newValue.mobile.toString().indexOf('-') !== -1) {
            let arr = newValue.mobile.split('-');
            if (arr.length > 1) {
              this.user.areaCode = arr[0];
              this.user.landlineNumber = arr[1];
            }
          }
        } else {
          this.user.areaCode = '';
          this.user.landlineNumber = '';
        }
      }
    }
  };
</script>
