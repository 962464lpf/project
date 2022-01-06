<template>
  <div v-if="src">
    <iframe :src="pdfFile" frameborder="0" class="iframe" :style="'min-height: '+minHeight+'px'"></iframe>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pdfFile: null
      };
    },
    props: {
      src: {
        default: ''
      },
      minHeight: {
        default: '500'
      }
    },
    created() {
      this.pdfFile = this.src;
      this.initSrc();
    },
    methods: {
      initSrc() {
        console.log(this.pdfFile)
        if (!this.pdfFile) return;
        let file = this.pdfFile;
        if (file.indexOf('[{') !== -1) {
          file = JSON.parse(file);
          this.pdfFile = file[0].url + '#zoom=100';
        } else {
          this.pdfFile += '#zoom=100'
        }
      }
    },
    watch: {
      src(val) {
        this.pdfFile = val;
        this.initSrc();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .iframe {
    width: 100%;
    height: calc(100vh - 170px);
  }
</style>
