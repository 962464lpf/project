<template>
  <div>
    <vue-ueditor-wrap
      v-model="editorContent"
      @ready="ready"
      :config="ueConfig"
      :destroy="true"
      @before-init="beforeInit"
    />
  </div>
</template>

<script>
  import VueUeditorWrap from 'vue-ueditor-wrap';

  export default {
    components: {
      VueUeditorWrap
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      height: {
        type: [Number, String],
        required: false,
        default: 420
      },
      placeholder: {
        type: String,
        default: ''
      },
      className: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        ueConfig:{
          toolbars: [
            [
              'fullscreen', 'source', '|', 'undo', 'redo', '|',
              'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
              'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
              'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
              'directionalityltr', 'directionalityrtl', 'indent', '|',
              'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
              'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
              'simpleupload', 'pagebreak', 'template', 'background', '|',
              'horizontal', 'date', 'time', 'spechars', '|',
              'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
              'print', 'preview', 'searchreplace'
            ]

            // [
            //   'undo', //撤销
            //   'bold', //加粗
            //   'indent', //首行缩进
            //   'italic', //斜体
            //   'underline', //下划线
            //   'strikethrough', //删除线
            //   'subscript', //下标
            //   'fontborder', //字符边框
            //   'superscript', //上标
            //   'formatmatch', //格式刷
            //   'fontfamily', //字体
            //   'fontsize', //字号
            //   'justifyleft', //居左对齐
            //   'justifycenter', //居中对齐
            //   'justifyright', //居右对齐
            //   'justifyjustify', //两端对齐
            //   'insertorderedlist', //有序列表
            //   'insertunorderedlist', //无序列表
            //   'lineheight',//行间距
            // attachment
            // ]
          ],
          'fontfamily':[
            { label:'',name:'songti',val:'宋体,SimSun'},
            { label:'仿宋',name:'fangsong',val:'仿宋,FangSong'},
            { label:'仿宋_GB2312',name:'fangsong',val:'仿宋_GB2312,FangSong'},
            { label:'',name:'kaiti',val:'楷体,楷体_GB2312, SimKai'},
            { label:'',name:'yahei',val:'微软雅黑,Microsoft YaHei'},
            { label:'',name:'heiti',val:'黑体, SimHei'},
            { label:'',name:'lishu',val:'隶书, SimLi'},
            { label:'',name:'andaleMono',val:'andale mono'},
            { label:'',name:'arial',val:'arial, helvetica,sans-serif'},
            { label:'',name:'arialBlack',val:'arial black,avant garde'},
            { label:'',name:'comicSansMs',val:'comic sans ms'},
            { label:'',name:'impact',val:'impact,chicago'},
            { label:'',name:'timesNewRoman',val:'times new roman'}
          ],
          contextMenu: [],
          // 初始容器高度
          initialFrameHeight: this.height,
          // 初始容器宽度
          initialFrameWidth: '100%',
          autoFloatEnabled: false, //是否保持toolbar位置不懂，默认为true
          enableAutoSave: false,  //是否启用本地保存
          // 上传文件接口
          UEDITOR_HOME_URL: '/plugins/UEditor/',
          serverUrl: process.env.VUE_APP_BASE_API + '/ueditor/config',
        },
        editorContent: '',
        editor: ''
      }
    },
    created() {
      if(this.value !== null) this.editorContent = this.value;
    },
    methods: {
      ready (editorInstance) {
        this.editor = editorInstance;
        let placeholder = `<p class="ueditor-placeholder ${this.className}">${this.placeholder}</p>`;
        if(this.placeholder && !this.editorContent) {
          editorInstance.setContent(placeholder);
        }
        editorInstance.addListener('blur', () => {
          if(this.placeholder && !this.editorContent) {
            editorInstance.setContent(placeholder);
          }
          if(this.editorContent) {
            this.editorContent = this.editorContent.replace(/<td /g, "<td class='td'");
            this.editorContent = this.editorContent.replace(/windowtext/g, `#000000`);
          }
          this.$emit('input', this.editorContent);
          this.$emit('change', this.editorContent);
        })
        editorInstance.addListener('focus', () => {
          if(this.placeholder && this.editorContent == placeholder) {
            editorInstance.setContent('');
          }
        })
      },
      beforeInit(id, config) {
        this.$emit('before-init', id, config);
      }
    },
    watch: {
      value(val) {
        if(val !== null) this.editorContent = val;
      }
    },
    deactivated() {
      // if(this.editor && this.editor.key) this.editor.destroy();
    }
  }
</script>

<style>
  .edui-editor-toolbarboxouter {
    line-height: 20px;
  }
</style>

