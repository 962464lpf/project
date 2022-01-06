<template>
  <div class="login">
    <div class="login-mask"></div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h2 class="company-title">GDTEMS</h2>
      <h3 class="title">用户登录</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号/手机号">
          <svg-icon slot="prefix" icon-class="login-user" class="el-input__icon input-icon" style="width: 15px;height: 16px;"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="login-password" class="el-input__icon input-icon" style="width: 13px;height: 16px;" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="login-code" class="el-input__icon input-icon" style="width: 13px;height: 16px;" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" />
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"

          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <img src="../assets/image/police.png"/>
      <span style="margin-left: 0;">京公网安备&nbsp;&nbsp;&nbsp;11010502042691号</span>
      <span>备案号：<a href="https://beian.miit.gov.cn/" target="_blank">京ICP备2020037138号-1</a></span>
<!--      <span>科信部联系人:&nbsp;&nbsp;胡从川&nbsp;&nbsp;010-85727578</span>-->
      <span>运维信息联系人:&nbsp;&nbsp;陈世磊&nbsp;&nbsp;15393175641</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名/手机号不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
    window.sessionStorage.removeItem('visitedViews');
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.$router.push({ path: "/index" });
            })
            .catch(() => {
              this.loading = false;
              this.getCode();
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  background-image: url("../assets/image/login-background.jpg");
  position: relative;
}

.login-mask {
  position: fixed;
  width: 100%;
  height: 100%;
  background:rgba(0, 0, 0, 0.33);
  top: 0;
  left: 0;
}

.title {
  margin: 40px auto 40px;
  color: #FFFFFF;
  font-weight: 400;
  font-size: 24px;
}

.login-form {
  border-radius: 6px;
  width: 400px;
  padding: 0 25px 5px 25px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  .el-input {
    height: 40px;
    input {
      height: 40px;
    }
  }
  .input-icon {
    height: 40px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
  span {
    margin: 0 15px;
    vertical-align: middle;
  }
  img {
    vertical-align: middle;
  }
}

.el-input__prefix {
  left: 10px;
}

.el-input--prefix .el-input__inner {
  padding-left: 36px;
}

.el-input--prefix .el-input__inner {
  height: 40px;
}
.company-title {
  font-size: 32px;
  color: #fff;
  margin: 0;
  text-align: center;
  padding-bottom: 20px;
}
</style>
