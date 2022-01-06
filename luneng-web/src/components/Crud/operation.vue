<template>
  <div class="crud-opts">
    <el-button-group class="crud-opts-right">
      <el-button

        plain
        type="info"
        icon="el-icon-search"
        @click="toggleSearch()"
      />
      <el-button

        icon="el-icon-refresh"
        @click="refresh()"
      />
      <el-popover
        placement="bottom-end"
        width="150"
        trigger="click"
      >
        <el-button
          slot="reference"

          icon="el-icon-s-grid"
        >
          <i
            class="fa fa-caret-down"
            aria-hidden="true"
          />
        </el-button>
        <el-checkbox
          v-model="allColumnsSelected"
          :indeterminate="allColumnsSelectedIndeterminate"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox>
        <el-checkbox
          v-for="item in tableColumns"
          v-model="item.visible"
          @change="handleCheckedTableColumnsChange(item)"
        >
          {{ item.label }}
        </el-checkbox>
      </el-popover>
    </el-button-group>
  </div>
</template>
<script>

export default {
  props: {
    value: {
      type: Array,
      default: () => { return [] }
    }
  },
  data() {
    return {
      list: [],
      search: true,
      tableColumns: [],
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false
    }
  },
  created() {
    this.value.forEach(item => {
      item.visible = true;
    })
    this.tableColumns = JSON.parse(JSON.stringify(this.value));
  },
  methods: {
    toggleSearch() {
      this.$emit('search');
    },
    refresh() {
      this.$emit('refresh');
    },
    handleCheckAllChange(val) {
      if (val === false) {
        this.allColumnsSelected = true;
        return
      }
      this.tableColumns.forEach(column => {
        if (!column.visible) {
          column.visible = true;
        }
      })
      this.allColumnsSelected = val;
      this.allColumnsSelectedIndeterminate = false;
    },
    handleCheckedTableColumnsChange(item) {
      console.log(item.visible, item.label)
      let totalCount = 0;
      let selectedCount = 0;
      let tableColumns = [];
      this.tableColumns.forEach(column => {
        ++totalCount;
        selectedCount += column.visible ? 1 : 0;
        if(column.visible) {
          tableColumns.push(column);
        }
      })
      if (selectedCount === 0) {
        this.msgError('请至少选择一列');
        this.$nextTick(function() {
          item.visible = true;
        })
        return
      }
      this.allColumnsSelected = selectedCount === totalCount;
      this.allColumnsSelectedIndeterminate = selectedCount !== totalCount && selectedCount !== 0;
      this.$emit('input', tableColumns);
    }
  }
}
</script>

<style scoped>
  .crud-opts {
    padding: 4px 0;
    display: -webkit-flex;
    display: flex;
    align-items: center;
  }
  .crud-opts .crud-opts-right {
    margin-left: auto;
  }
</style>
