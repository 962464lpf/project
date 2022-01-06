<template>
  <div>
    <el-input
      v-model="inputValue"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :disabled="disabled"
      @focus="focusChange"
      @blur="blurChange"
      @input="inputChange"
      :type="type"
      :size="sizeType">
      <template v-if="moneyUnitType && showText" slot="append">{{moneyUnitType}}</template>
    </el-input>
  </div>
</template>

<script>
export default {
  props: {
    inputType: {
      type: String,
      default: 'yuan'
    },
    type: {
      type: String,
      default: 'text'
    },
    value: {
      default: ''
    },
    placeholder: {
      default: ''
    },
    maxlength: {
      type: String,
      default: '500'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    sizeType: {
      type: String,
      default: 'mini'
    },
    showText: {
      default: true
    }
  },
  data() {
    return {
      inputValue: ''
    }
  },
  created() {
    this.inputValue = this.value;
  },
  computed: {
    moneyUnitType() {
      if (this.inputType === 'yuan') {
        return '元'
      } else if(this.inputType === 'wanYuan') {
        return '万元'
      } else if (this.inputType === 'percentage' || this.inputType === 'percentage2') {
        return '%'
      } else {
        return ''
      }
    }
  },
  watch:{
    value (newVal, oldVal) {
      this.inputValue = newVal;
    }
  },
  methods: {
    inputChange(e) {
      let val = e.toString()
      switch (this.inputType) {
        case "percentage":
        case "percentage2":
        case "yuan":
        case "wanYuan":
          val = val.replace(/[^\d.]/g, "");
          val = val.replace(/\.{2,}/g, ".");
          val = val.replace(/^0+\./g, '0.');
          val = val.match(/^0+[1-9]+/) ? val = val.replace(/^0+/g, '') : val;
          this.inputValue = val
          break;
        case "email":
          val = val.replace(/[^\w-.@]/g, "");
          val = val.replace(/\.{2,}/g, ".");
          this.inputValue = val
          break;
        case "phone":
          val = val.replace(/[^\d]/g, "");
          this.inputValue = val
          break;
        case "telephone":
          val = val.replace(/[^\d-]/g, "");
          val = val.replace(/-{2,}/g, "-");
          this.inputValue = val
          break;
        case "fax":
          val = val.replace(/[^\d-]/g, "");
          val = val.replace(/-{2,}/g, "-");
          this.inputValue = val
          break;
        case "number":
        case "postcode":
          val = val.replace(/[^\d]/g, "");
          this.inputValue = val
          break;
        case "capitalCN":
          val = val.replace(/[^\u4E00-\u9FA5]/g, "");
          this.inputValue = val
          break;
      }
    },
    blurChange(e) {
      if(!this.inputValue) {
        this.$emit('input', this.inputValue);
        this.$emit('blur', this.inputValue);
        return;
      }
      switch (this.inputType) {
        case 'percentage':
          this.inputValue = this.checkPercentage(this.inputValue)
          break;
        case "percentage2":
          this.inputValue = this.checkPercentage2(this.inputValue)
          break;
        case "yuan":
          this.inputValue = this.checkYuan(this.inputValue)
          break;
        case "wanYuan":
          this.inputValue = this.checkWanYuan(this.inputValue)
          break;
        case "email":
          this.inputValue = this.checkEmail(this.inputValue)
          if (!this.inputValue) {
            this.msgError('邮箱输入错误，请重新输入')
          }
          break;
        case "phone":
          this.inputValue = this.checkPhone(this.inputValue)
          if (!this.inputValue) {
            this.msgError('手机号输入错误，请重新输入')
          }
          break;
        case "telephone":
          this.inputValue = this.checkTelephone(this.inputValue)
          if (!this.inputValue) {
            this.msgError('电话输入错误，请重新输入')
          }
          break;
        case "fax":
          this.inputValue = this.checkFax(this.inputValue)
          if (!this.inputValue) {
            this.msgError('传真号输入错误，请重新输入')
          }
          break;
        case "postcode":
          this.inputValue = this.checkPostcode(this.inputValue)
          if (!this.inputValue) {
            this.msgError('邮编输入错误，请重新输入')
          }
          break;
        // case "number":
        //   let reg = /^(([1-9][0-9]*)|(([0]\.\d+|[1-9][0-9]*\.\d+)))$/;
        //   if (!(reg.test(this.inputValue))) {
        //     this.msgError('请输入正确的数字');
        //   }
        //   break;
      }
      this.$emit('input', this.inputValue);
      this.$emit('blur', this.inputValue);
    },
    focusChange(e) {
      this.$emit('focus', this.inputValue);
    },
    //类型验证
    //款项百分比(万元)
    checkPercentage(val) {
      val = val.toString()
      if(val > 100) {
        this.msgError('输入的占比不能超过100');
        return '';
      }
      if (val.includes(".") && (/[\d]$/).test(val)) {
        val = val.match(/(\d{1,2})(\.\d{1})/g)[0]
      } else {
        val = val.match(/(\d{1,3})/g)[0]
      }
      return val
    },
    //
    checkPercentage2(val) {
      val = val.toString()
      if(val > 100) {
        this.msgError('输入的占比不能超过100');
        return '';
      }
      if (val.includes(".") && (/[\d]$/).test(val)) {
        val = val.match(/(\d{1,2})(\.\d{2})/g)[0]
      } else {
        val = val.match(/(\d{1,3})/g)[0]
      }
      return val
    },
    //金额输入(万元)
    checkWanYuan(val) {
      val = val.toString()
      if(val >= 100000) {
        this.msgError('输入的金额不能超过99999.9999');
        return '';
      }
      if (val.includes(".") && (/[\d]$/).test(val)) {
        val = val.match(/(\d{1,5})(\.\d{1,4})/g)[0]
      } else {
        val = val.match(/(\d{1,5})/g)[0]
      }
      return val
    },
    //金额输入(元)
    checkYuan(val) {
      val = val.toString()
      if(val >= 1000000000) {
        this.msgError('输入的金额不能超过999999999.99');
        return '';
      }
      if (val && val.includes(".") && (/[\d]$/).test(val)) {
        val = val.match(/(\d{1,9})(\.\d{1,2})/g)[0]
      } else {
        val = val.match(/(\d{1,9})/g)[0]
      }
      return val
    },
    //邮箱
    checkEmail(val) {
      val = val.toString()
      if (val && val.includes("@")) {
        val = val.match(/([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,5}){1,4})/g)
        if (val) {
          val = val[0]
        } else {
          val = ''
        }
      } else {
        val = ''
      }
      return val
    },
    //固定电话
    checkTelephone(val) {
      val = val.toString()
      val = val.match(/0\d{2,3}-\d{7,8}/g)
      if (val) {
        val = val[0]
      } else {
        val = ''
      }
      return val
    },
    //手机号
    checkPhone(val) {
      val = val.match(/1[3456789]\d{9}/g)
      if (val) {
        val = val[0]
      } else {
        val = ''
      }
      return val
    },
    //传真号
    checkFax(val) {
      val = val.match(/^(?:\d{3,4}-)?\d{7,8}(?:-\d{1,6})?$/g)
      if (val) {
        val = val[0]
      } else {
        val = ''
      }
      return val
    },
    //邮编
    checkPostcode(val) {
      val = val.match(/\d{6}/g)
      if (val) {
        val = val[0]
      } else {
        val = ''
      }
      return val
    }
  }

};
</script>
