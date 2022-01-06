<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel>
        <settings />
      </right-panel>
      <div v-if="message">
        <div class="mask" @click="hideMessage"/>
        <message />
      </div>
      <!--  底部  -->
      <div class="footer-container">
        <img src="../assets/image/police.png"/>
        <span style="margin-left: 0;">京公网安备&nbsp;&nbsp;&nbsp;11010502042691号</span>
        <span>备案号：<a href="https://beian.miit.gov.cn/" target="_blank">京ICP备2020037138号-1</a></span>
<!--        <span>科信部联系人:&nbsp;&nbsp;胡从川&nbsp;&nbsp;010-85727578</span>-->
        <span>运维信息联系人:&nbsp;&nbsp;陈世磊&nbsp;&nbsp;15393175641</span>
      </div>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import Message from '@/components/Message'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
    Message
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader,
      showMessage: state => state.settings.showMessage
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
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
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false });
    },
    hideMessage() {
      this.message = false;
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/mixin.scss";
  @import "~@/assets/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1002;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

  .mask {
    width: 100%;
    height: 100%;
    background:rgba(0, 0, 0, 0.4);
    position: fixed;
    top: 50px;
    left: 0;
    z-index: 2000;
  }

  .footer-container {
    position: fixed;
    width: calc(100% - #{$sideBarWidth});
    left: #{$sideBarWidth};
    right: 0;
    bottom: 0;
    text-align: center;
    background-color: #2b2f3a;
    padding: 10px 0;
    color: #fff;
    font-size: 14px;
    z-index: 2001;
    span {
      margin: 0 15px;
      vertical-align: middle;
    }
    img {
      vertical-align: middle;
    }
  }

  .hideSidebar .footer-container {
    width: calc(100% - 54px);
    left: 54px;
  }

  .mobile .footer-container {
    width: 100%;
    left: 0;
  }
</style>
