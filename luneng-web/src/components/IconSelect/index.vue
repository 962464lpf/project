<!-- @author zhengjie -->
<template>
  <div class="icon-body">
    <el-input v-model="name" style="position: relative;" clearable placeholder="请输入图标名称" @clear="filterIcons" @input.native="filterIcons">
      <i slot="suffix" class="el-icon-search el-input__icon" />
    </el-input>
    <div class="icon-list">
      <div v-for="(item, index) in iconList" :key="index" @click="selectedIcon(item)" class="icon-item">
        <svg-icon :icon-class="item" style="height: 30px;width: 16px;" class="icon-item-icon" />
        <span class="icon-item-text">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import icons from './requireIcons'
export default {
  name: 'IconSelect',
  data() {
    return {
      name: '',
      iconList: icons
    }
  },
  methods: {
    filterIcons() {
      if (this.name) {
        this.iconList = this.iconList.filter(item => item.includes(this.name))
      } else {
        this.iconList = icons
      }
    },
    selectedIcon(name) {
      this.$emit('selected', name)
      document.body.click()
    },
    reset() {
      this.name = ''
      this.iconList = icons
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .icon-body {
    width: 100%;
    padding: 10px;
    .icon-list {
      margin-top: 10px;
      height: 200px;
      overflow-y: scroll;
      .icon-item {
        height: 30px;
        line-height: 30px;
        cursor: pointer;
        width: 33%;
        float: left;
      }
      .icon-item-text {
        display: inline-block;
        fill: currentColor;
        overflow: hidden;
        vertical-align: middle;
      }
    }
  }
</style>
