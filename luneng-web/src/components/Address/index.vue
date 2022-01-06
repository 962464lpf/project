<template>
  <div>
    <el-cascader
      v-model="address"
      filterable
      :options="options"
      :props="propsObject"
      @change="handleChange"
    >
    </el-cascader>
  </div>
</template>

<script>
import addressJson from './city.json';
export default {
  data() {
    return {
      address: '',
      options: addressJson,
      propsObject: {
        label: 'name',
        value: 'name',
        children: 'city'
      }
    };
  },
  props: {
    value: {
      default: ''
    }
  },
  created() {
    if (!this.value) {
      this.address = []
    } else {
      this.address = this.value.split('-');
    }
  },
  methods: {
    handleChange(e) {
      let address = this.address.join('-')
      this.$emit('input', address);
    }
  },
  watch:{
    value (newVal, oldVal) {
      if (!newVal) {
        this.address = [];
      } else {
        this.address = this.value.split('-');
      }
    }
  }
};
</script>
