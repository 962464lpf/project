<template>
  <el-dialog
    :title="title"
    :visible.sync="showDialog"
    :before-close="close"
    width="600px"
    append-to-body
    :show-close="false"
    :close-on-click-modal="false">
    <!--  所有可选快捷入口-->
    <el-row>
      <el-divider content-position="left">可选快捷入口</el-divider>
      <span class="tips" v-show="!unselect.length">您已没有可选的快捷入口，可拖动标签选择</span>
      <draggable
        v-model="unselect"
        :options="dragOptions"
        :disabled="!isEditable"
        :forceFallback="true"
        :move="move"
        @start="isDragging = true"
        @end="isDragging = false">
        <transition-group
          type="transition"
          tag="div"
          name="flip-list">
          <el-tag
            class="field-tag"
            v-for="item in unselect"
            :key="item.name">
            <span>{{ item.name }}</span>
          </el-tag>
        </transition-group>
      </draggable>
    </el-row>
    <!--  已选快捷入口-->
    <el-row>
      <el-divider content-position="left">已选快捷入口(首页最多展示9个)</el-divider>
      <span class="tips" v-show="!selected.length">您没有已选的快捷入口，可拖动标签选择</span>
      <draggable
        v-model="selected"
        :options="dragOptions"
        :disabled="!isEditable"
        :forceFallback="true"
        :move="move"
        @start="isDragging = true"
        @end="isDragging = false">
        <transition-group
          type="transition"
          tag="div"
          name="no">
          <el-tag
            class="field-tag"
            v-for="(item, index) in selected"
            :key="item.name"
            closable
            @close="removeTag(item, index)">
            <span>{{ item.name }}</span>
          </el-tag>
        </transition-group>
      </draggable>
    </el-row>
    <el-row type="flex" slot="footer" justify="end">
      <el-col :span="4">
        <el-button
          type="primary"
          @click="update">确定
        </el-button>
      </el-col>
      <el-col :span="4">
        <el-button
          @click="close">取消
        </el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import draggable from 'vuedraggable'
import {getQuickAccess, updateQuickAccess} from "@/api/system/menu";

export default {
  name: "dragFastEntrance",
  props: {
    title: {
      type: String,
      default: '设置快捷入口'
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      unselect: [],
      selected: [],
      isEditable: true,
      isDragging: false,
      showDialog: false
    }
  },
  created() {
    this.getSelectedData('refresh')
  },
  watch: {
    open(newVal) {
      this.showDialog = newVal
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 300,
        group: "description",
        ghostClass: "ghost",
        chosenClass: "chosen"
      }
    }
  },
  components: {
    draggable
  },
  methods: {
    //获取数据
    getSelectedData(refresh) {
      getQuickAccess(refresh).then(({data}) => {
        this.selected = data.filter((item) => {
          return item.isView === true
        })
        this.unselect = data.filter((item) => {
          return item.isView === false
        })
        if (refresh === 'refresh') {
          this.$emit('update', this.selected);
        }
      })
    },
    // 移动标签
    move({ draggedContext }) {
      const draggedElement = draggedContext.element;
      return draggedElement.id
    },
    //确定更新
    update() {
      const ids = this.selected.map((item) => {
        return item.id
      })
      if(ids.length === 0){
          ids.push(-1);
      }
      updateQuickAccess(ids).then(() => {
        this.getSelectedData('refresh')
        this.close()
      })
    },
    close() {
      this.getSelectedData()
      this.$emit('close');
    },
    removeTag(item, index) {
      this.unselect.push(item);
      this.selected.splice(index, 1);
    }
  }
}
</script>

<style lang="scss" scoped>
  .ghost {
    opacity: 0.5;
    border-color: red !important;
    background: red;
    color: #fff;
  }
  .chosen {
    border-color: red !important;
    background: red;
    color: #fff;
  }
  .field-tag {
    cursor: move;
    margin: 0 8px 8px 0;
  }

  .tips {
    font-size: 14px;
    color: #FF0000;
  }

  .flip-list-move {
    transition: transform 1s;
  }

  .no-move {
    transition: transform 1s;
  }
</style>
