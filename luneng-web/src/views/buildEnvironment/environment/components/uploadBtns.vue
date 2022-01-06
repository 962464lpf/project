<template>
  <div>
    <el-button v-hasPermi="['hb:hbProjectInfo:edit']" v-if="!filePaths" type="text" @click="operation('upload')" :disabled="disabled">上传</el-button>
    <template v-if="filePaths">
      <el-button v-hasPermi="['hb:hbProjectInfo:edit']" v-if="edit" type="text" @click="operation('update')">更新</el-button>
      <el-button type="text" @click="operation('view')">查看</el-button>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'uploadBtns',
    props: {
      filePaths: {
        type: String,
        default: ''
      },
      edit: {
        default: true
      }
    },
    data() {
      return {
        disabled: false
      }
    },
    created() {
      this.edit ? this.disabled = false : this.disabled = true;
    },
    methods: {
      operation(type) {
        this.$emit('click', type);
      }
    },
    watch: {
      edit(newVal) {
        newVal ? this.disabled = false : this.disabled = true;
      }
    }
  }
</script>

<style scoped>

</style>
