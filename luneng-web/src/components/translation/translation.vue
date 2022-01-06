<template>
    <div>{{name}}</div>
</template>

<script>
  import {getDictData } from "@/api/translation/translation";
export default {
  data() {
    return {
      name: "",
      queryParams :{
        type: undefined,
        value: undefined
      }
    };

  },
  props: {
    value: {
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },

  methods: {
    init() {
      this.queryParams.type= this.type;
      this.queryParams.value = this.value;
      getDictData(this.queryParams).then(({ data }) => {
        this.name = data.dictLabel;
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style>
</style>
