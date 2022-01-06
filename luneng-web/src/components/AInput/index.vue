<template>
  <div>
    <el-input v-if="type !== 'landline'" v-model="inputValue" type="text" :placeholder="placeholder" @blur="blur" @input="input" :maxlength="maxlength" />
    <div v-if="type == 'landline'" style="display: flex;">
      <el-input v-model="areaCode" type="text" placeholder="区号" @blur="landlineBlur" maxlength="4" style="display: inline-block;width: 106px;" />
      <span style="padding: 0 10px;">-</span>
      <el-input v-model="landlineNumber" type="text" placeholder="座机号码" @blur="landlineBlur" maxlength="8" style="display: inline-block;min-width: 100px;" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputValue: '',
      rules: {
        amount: { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,4})))$/, message: "请输入正确的金额" },
        number: { pattern: /^(([1-9][0-9]*)|(([0]\.\d+|[1-9][0-9]*\.\d+)))$/, message: "请输入正确的数字" },
        IDNO: {
          pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
          message: "请输入正确的身份证号"
        },
        email: { pattern: /^\w+@[a-z0-9]+\.[a-z]{2,4}$/, message: '请输入正确的邮箱' },
        phone: { pattern: /(^0\d{2,3}-?\d{7,8}$)|(^1[3|4|5|6|7|8|9][0-9]\d{8}$)/, message: "请输入正确的电话号码" },
        mobile: { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码" },
        mail: { pattern: /^[1-9][0-9]{5}$/, message: "请输入正确的邮政编码" },
        fax: { pattern: /^(?:\d{3,4}-)?\d{7,8}(?:-\d{1,6})?$/, message: "请输入正确的传真号码" },
        age: { pattern: /^[0]$|^([1-9][0-9]*)$/, message: "请输入正确的年龄" },
      },
      areaCode: '',
      landlineNumber: ''
    }
  },
  props: {
    value: {
      default: ''
    },
    placeholder: {
      default: ''
    },
    type: {
      default: 'amount'
    },
    maxlength: {
      default: 20
    },
    message: {
      default: null
    }
  },
  created() {
    this.inputValue = this.value;
    if (this.message) {
      this.rules[this.type].message = this.message;
    }
    this.init();
  },
  methods: {
    init() {
      if(this.inputValue) {
        if(this.inputValue.toString().indexOf('-') !== -1) {
          let arr = this.inputValue.split('-');
          if(arr.length > 1) {
            this.areaCode = arr[0];
            this.landlineNumber = arr[1];
          }
        }
      } else {
        this.areaCode = '';
        this.landlineNumber = '';
      }
    },
    blur(e) {
      if(!this.inputValue) return
      let rule = this.rules[this.type];
      let reg = rule.pattern;
      if (!(reg.test(this.inputValue))) {
        this.msgError(rule.message);
        // this.inputValue = '';
        return
      }
      if (this.type == 'amount' && this.inputValue >= 100000) {
        this.msgError('输入的金额不能超过99999.9999');
        return
      }
      this.$emit('input', this.inputValue);
      this.$emit('blur', this.inputValue);
    },
    input(e) {
      if(this.type == 'amount' || this.type == 'number') {
        if (isNaN(parseFloat(e))) {
          this.inputValue = '';
        }
      }
    },
    landlineBlur() {
      let value = '';
      if(this.areaCode) value += this.areaCode;
      if(this.landlineNumber) value += this.landlineNumber;
      if(this.areaCode && this.landlineNumber) {
        value = this.areaCode + '-' + this.landlineNumber;
      }
      this.$emit('input', value);
      this.$emit('blur', value);
    }
  },
  watch:{
    value (newVal, oldVal) {
      this.inputValue = newVal;
      this.init();
    }
  }
};
</script>
