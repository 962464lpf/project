<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea" />
  </div>
</template>

<script>
  /**
   * docs:
   * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
   */
  import plugins from './plugins'
  import toolbar from './toolbar'
  import load from './dynamicLoadScript'

  // why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
  // const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'
  // const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce@5.4.2/tinymce.min.js'
  const tinymceCDN = '/plugins/tinymce/tinymce.min.js'

  export default {
    name: 'Tinymce',
    props: {
      id: {
        type: String,
        default: function() {
          return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
        }
      },
      value: {
        type: String,
        default: ''
      },
      toolbar: {
        type: Array,
        required: false,
        default() {
          return []
        }
      },
      menubar: {
        type: String,
        default: 'file edit insert view format table'
      },
      height: {
        type: [Number, String],
        required: false,
        default: 420
      },
      width: {
        type: [Number, String],
        required: false,
        default: 'auto'
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
        hasChange: false,
        hasInit: false,
        tinymceId: this.id,
        fullscreen: false
      }
    },
    computed: {
      containerWidth() {
        const width = this.width
        if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
          return `${width}px`
        }
        return width
      }
    },
    watch: {
      value(val) {
        if (!this.hasChange && this.hasInit) {
          this.$nextTick(() =>
            window.tinymce.get(this.tinymceId).setContent(val || ''))
        }
      }
    },
    mounted() {
      this.init()
    },
    activated() {
      if (window.tinymce) {
        this.initTinymce()
      }
    },
    deactivated() {
      this.destroyTinymce()
    },
    destroyed() {
      this.destroyTinymce()
    },
    methods: {
      init() {
        // dynamic load tinymce from cdn
        load(tinymceCDN, (err) => {
          if (err) {
            this.$message.error(err.message)
            return
          }
          // setTimeout(()=>{
            this.initTinymce()
          // },500)
        })
      },
      initTinymce() {
        const _this = this
        window.tinymce.init({
          selector: `#${_this.tinymceId}`,
          language: 'zh_CN',
          height: _this.height,
          body_class: _this.className,
          object_resizing: true, // 是否禁用表格图片大小调整
          toolbar: _this.toolbar.length > 0 ? _this.toolbar : toolbar,
          // menubar: this.menubar,
          menubar: false,
          plugins: plugins,
          fontsize_formats: '9pt 10.5pt 12pt 14pt 15pt 16pt 18pt 22pt 24pt',
          font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
          placeholder: _this.placeholder,
          end_container_on_empty_block: true, // enter键 分块
          powerpaste_word_import: 'merge', // 是否保留word粘贴样式  clean | merge
          code_dialog_height: 450,
          code_dialog_width: 1000,
          advlist_bullet_styles: 'square',
          advlist_number_styles: 'default',
          // imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
          default_link_target: '_blank',
          paste_data_images: true, // 设置为“true”将允许粘贴图像，而将其设置为“false”将不允许粘贴图像。
          link_title: false,
          nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
          init_instance_callback: editor => {
            if (_this.value) {
              editor.setContent(_this.value)
            }
            _this.hasInit = true
            // this.hasChange = false
            editor.on('NodeChange Change KeyUp SetContent', () => {
              console.log("我进来了！！！！")
              _this.hasChange = true
              _this.$emit('input', editor.getContent());
            })
            editor.on('NodeChange Change Blur SetContent', () => {
              _this.$emit('change', editor.getContent());
            })
          },
          setup(editor) {
            editor.on('FullscreenStateChanged', (e) => {
              _this.fullscreen = e.state
            })
          },
          images_upload_handler(blobInfo, success, failure, progress) {
            const img = 'data:image/jpeg;base64,' + blobInfo.base64();
            success(img)
          }
        })
      },
      destroyTinymce() {
        const tinymce = window.tinymce.get(this.tinymceId)
        if (this.fullscreen) {
          tinymce.execCommand('mceFullScreen')
        }

        if (tinymce) {
          tinymce.destroy()
        }
      },
      setContent(value) {
        window.tinymce.get(this.tinymceId).setContent(value)
      },
      getContent() {
        window.tinymce.get(this.tinymceId).getContent()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tinymce-container {
    position: relative;
    line-height: normal;
  }

  .tinymce-container {
    ::v-deep {
      .mce-fullscreen {
        z-index: 10000;
      }
    }
  }

  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }

  .editor-custom-btn-container {
    position: absolute;
    right: 4px;
    top: 4px;
    /*z-index: 2005;*/
  }

  .fullscreen .editor-custom-btn-container {
    z-index: 10000;
    position: fixed;
  }

  .editor-upload-btn {
    display: inline-block;
  }
  /deep/ .tox-statusbar__branding {
    display: none!important;
  }
  .panel-body {
    background: #e03e2d;
  }
</style>
