<template>
  <div class="fast-entrance">
    <div class="fast-entrance-box">
      <div class="fast-entrance-item"
           v-for="item in selected"
           :key="item.id"
           @click="navSelected(item)">
        <img :src="item.quickIcon" alt="icon">
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="right-part">
      <div>
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          @click="setFastEntrance"
          circle>
        </el-button>
      </div>
      <div class="span-text">设置快捷入口</div>
    </div>
    <dragFastEntrance
      :open="showDialog"
      @update="getSelectedEntrance"
      @close="closeDialog"
    />
  </div>
</template>

<script>
import dragFastEntrance from '../components/dragFastEntrance'

export default {
  name: "FastEntrance",
  data() {
    return {
      showDialog: false,
      selected: []
    }
  },
  components: {
    dragFastEntrance
  },
  methods: {
    getSelectedEntrance(value) {
      if (value && value.length <= 9) {
        value.forEach(item => {
          item.quickIcon = require('@/assets/menu_icon/' + item.quickIcon)
        })
        this.selected = value
      } else {
        this.selected = value.filter((item, index) => {
          if (index < 9) {
            item.quickIcon = require('@/assets/menu_icon/' + item.quickIcon)
            return item
          }
        })
      }
    },
    navSelected(item) {
      this.$router.push({
        path: item.path
      })
    },
    setFastEntrance() {
      this.showDialog = true
    },
    closeDialog() {
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.fast-entrance {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .fast-entrance-box {
    width: calc(100% - 130px);
    min-height: 80px;
    padding: 15px 40px;
    display: flex;
    box-shadow: 5px 5px 5px 0 #eaeaea;
    background-color: #fff;
    .fast-entrance-item:last-of-type {
      margin-right: 0;
    }
    .fast-entrance-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      margin-right: 53.9px;
      & > img {
        width: 60px;
        margin-bottom: 10px;
      }
      & > span {
        font-size: 16px;
        color: #000;
      }
    }
  }
  .right-part {
    width: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #666;
    box-shadow: 5px 5px 5px 0 #eaeaea;
    background-color: #fff;
    .span-text {
      margin-top: 10px;
    }
  }
}
</style>
