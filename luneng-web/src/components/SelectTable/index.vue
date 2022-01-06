<template>
  <div>
    <el-popover
      v-model="visible"
      placement="bottom-start"
      trigger="manual">
      <div class="table-box" @focus="tableFocus">
        <el-table ref="dataGrid" max-height="500" min-hieght="400" @row-click="rowClick" :data="list"
          highlight-current-row>
          <el-table-column v-for="(column, index) in columns" :key="column.field" :prop="column.field" :label="column.title"
            :width="column.width" align="center" show-overflow-tooltip v-if="!column.hidden">
            <template slot-scope="scope">
              <span>{{scope.row[column.field]}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-input
        class="popover-table"
        slot="reference"
        v-model="controlSource"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="input"
        @click.native="show" />
    </el-popover>
  </div>
</template>

<script>
  export default {
    props: {
      // input的数据源(v-model)
      value: {
        type: String,
        default: ''
      },
      // 下拉表格的数据源(由JObject组成的数组)
      rowSource: {
        type: Array,
        required: true
      },
      // 下拉表格各列的定义,如[{field:"code",title:"编号",width:100}]
      columns: {
        type: Array,
        required: true
      },
      placeholder: {
        type: String,
        default: '请输入'
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        controlSource: "",
        list: [],
        visible: false
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.controlSource = this.value;
        this.list = this.rowSource;
        document.addEventListener('click',(e) => {
          let targetClassName = e.target.className;
          let parentClassName = e.target.parentNode.className;
          if((targetClassName!='table-box' && targetClassName != 'el-input__inner') || parentClassName.indexOf('popover-table') == -1){
            this.hide();
          }
        })
      });
    },
    methods: {
      input(value) {
        this.$emit('input', this.controlSource);
        this.fuzzySearch();
      },
      rowClick(row, column, event) {
        let item = { ...row};
        let field = this.columns[0].field;
        this.controlSource = item[field];
        this.$emit('change', item);
        this.$emit('input', this.controlSource);
        this.hide();
      },
      show() {
        this.visible = true;
      },
      hide() {
        this.visible = false;
      },
      fuzzySearch() {
        let rowSource = [...this.rowSource];
        let field = this.columns[0].field;
        let searchData = [];
        rowSource.map(item => {
          if(item[field].indexOf(this.controlSource) !== -1) {
            searchData.push(item);
          }
        })
        this.list = searchData;
      },
      tableFocus() {
        console.log(11)
      }
    },
    watch: {
      rowSource: function(newVal, oldVal) {
        this.rowSource = newVal;
        this.list = newVal;
      },
      value: function(newVal, oldVal) {
        this.controlSource = newVal;
      }
    }
  }
</script>

<style scoped>
.no-data {
  text-align: center;
  line-height: 40px;
  color: #999;
}
.table-box {
  max-height: 400px;
  overflow: auto;
}
</style>
