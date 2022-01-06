<template>
  <div class="navbar" :style="themeStyle()">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
<!--        <search id="header-search" class="right-menu-item" />-->

<!--        <screenfull id="screenfull" class="right-menu-item hover-effect" />-->

<!--        <el-tooltip content="布局大小" effect="dark" placement="bottom">-->
<!--          <size-select id="size-select" class="right-menu-item hover-effect" />-->
<!--        </el-tooltip>-->

        <div class="header-message-icon right-menu-item hover-effect" @click="showMessage">
          <el-badge v-if="msgNoRead > 0" :value="msgNoRead" :max="99" class="item">
            <svg-icon icon-class="header-message" style="width: 18px;height: 20px;" />
          </el-badge>
          <svg-icon v-else icon-class="header-message" style="width: 18px;height: 20px;" />
        </div>
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <span>{{dept.deptName}}/{{name}}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import Message from '@/components/Message'

export default {
  data() {
    return {

    }
  },
  created() {

  },
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    Message
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    msgNoRead: {
      set (val) { this.$store.commit('SET_MSGNOREAD', val) },
      get () { return this.$store.state.user.msgNoRead }
    },
    message: {
      get() {
        return this.$store.state.settings.showMessage
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showMessage',
          value: val
        })
      }
    },
    name() {
      return this.$store.state.user.name
    },
    dept() {
      return this.$store.state.user.dept
    },
    theme() {
      return this.$store.state.settings.theme;
    },
    webSocketMessage() {
      return this.$store.state.user.webSocketMessage
    },
  },
  watch: {
    webSocketMessage(newValue, oldValue) {
      if(newValue && newValue.data != null) {
        const dataTem = JSON.parse(newValue.data)
        if(dataTem.key && (dataTem.key === 'declare_end' || dataTem.key === 'ping')) {
          return null
        }else {
          this.$notify({
            title: dataTem.noticeTitle,
          });
          this.msgNoRead = this.msgNoRead+1;
        }
      }
    }
  },

  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.state.user.webSocket.close()
        this.$store.dispatch('LogOut').then(() => {
          location.reload()
        })
      })
    },
    showMessage() {
      this.message = true
    },

    themeStyle() {
      return {
        "background-color": this.theme,
        "border-color": this.theme
      };
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: rgba(28,114,228,1);
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        span {
          color: #FFFFFF;
          margin-bottom: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 16px;
        }
      }
    }
  }
  /deep/ .el-breadcrumb__separator {
    color: #FFFFFF;
  }
}
.header-message-icon {
  color: #fff!important;
  cursor: pointer;
  position: relative;
  margin-right: 6px;
  span {
    font-size: 16px;
    margin-left: 8px;
    vertical-align: middle;
  }
  .message-num {
    position: absolute;
    top: 10px;
    right: 0;
    height: 16px;
    padding: 0 4px;
    text-align: center;
    line-height: 14px;
    font-size: 12px;
    color: #FFFFFF;
    background-color: red;
    border: 1px solid #FFFFFF;
    border-radius: 8px;
  }
  .el-icon-bell::before {
    vertical-align: middle;
  }
  /deep/ .el-badge__content {
    top: 14px;
  }
}

</style>
