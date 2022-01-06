<template>
  <div class="app-container" style="padding-top: 30px;">
    <el-form ref="form" :model="form" :rules="rules" label-width="170px" style="padding-right: 120px;">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="form.projectName" type="text" placeholder="请输入项目名称" maxlength="30" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="项目地点" prop="projectAddr">
            <Address v-model="form.projectAddr" placeholder="请选择项目地点"></Address>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="录入单位" prop="inputUnit">
            <el-input v-model="form.inputUnit" type="text" placeholder="请输入录入单位" maxlength="30" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="录入人" prop="inputMan">
            <el-input v-model="form.inputMan" placeholder="请输入录入人" maxlength="10" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="tel">
            <el-input v-model="form.tel" placeholder="请输入联系电话" maxlength="16" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="环境影响报告编制单位" prop="prepareUnit">
            <el-input v-model="form.prepareUnit" type="text" placeholder="请输入环境影响报告编制单位" maxlength="30" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="计划开工日期" prop="planBeginDate">
            <el-date-picker
              clearable
              style="width: 240px"
              v-model="form.planBeginDate"
              type="date"
              :picker-options="planBeginDatePickerOptions"
              @change="planBeginDatePickerChange"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择计划开工日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划竣工日期" prop="planEndDate">
            <el-date-picker
              clearable
              style="width: 240px"
              v-model="form.planEndDate"
              type="date"
              :picker-options="planEndDatePickerOptions"
              @change="planEndDatePickerChange"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择计划竣工日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="实际开工日期" prop="actualBeginDate">
            <el-date-picker
              clearable
              style="width: 240px"
              v-model="form.actualBeginDate"
              type="date"
              :picker-options="actualBeginDatePickerOptions"
              @change="actualBeginDatePickerChange"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择实际开工日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际竣工日期" prop="actualEndDate">
            <el-date-picker
              clearable
              style="width: 240px"
              v-model="form.actualEndDate"
              type="date"
              :picker-options="actualEndDatePickerOptions"
              @change="actualEndDatePickerChange"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择实际竣工日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="text-align: center;padding: 20px 0;">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { listHbProjectInfo, getHbProjectInfo, delHbProjectInfo, addHbProjectInfo, updateHbProjectInfo, exportHbProjectInfo } from "@/api/hb/hbProjectInfo";
import { presenter} from '@/components/Crud/crud';
import Address from '@/components/Address';
export default {
  mixins: [presenter()],
  components: {
    Address
  },
  data() {
    return {
      // 表单参数
      form: {
        inputUnit: undefined,
        inputMan: undefined,
        tel: undefined,
        email: undefined,
        fileStatus: 0,
        uploadSwitch: 0
      },
      // 表单校验
      rules: {
        projectName: [
          {required: true, message: "项目名称不能为空", trigger: "blur", pattern: '[^ \x22]+'}
        ],
        projectAddr: [
          {required: true, message: "项目地点不能为空", trigger: "blur", pattern: '[^ \x22]+'}
        ],
        inputUnit: [
          {required: true, message: "录入单位不能为空", trigger: "blur", pattern: '[^ \x22]+'}
        ],
        inputMan: [
          {required: true, message: "录入人不能为空", trigger: "blur", pattern: '[^ \x22]+'}
        ],
        tel: [
          {required: true, message: "联系电话不能为空", trigger: "blur"},
          {pattern: /(^0\d{2,3}-?\d{7,8}$)|(^1[3|4|5|6|7|8|9][0-9]\d{8}$)/, message: "请输入正确的联系电话", trigger: "blur"}
        ],
        email: [
          {required: true, message: "邮箱不能为空", trigger: "blur"},
          {
            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])/,
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          }
        ],
        prepareUnit: [
          {required: true, message: "环境影响报告编制单不能为空", trigger: "blur", pattern: '[^ \x22]+'}
        ],
        planBeginDate: [
          {required: true, message: "计划开工时间不能为空", trigger: "blur"}
        ],
        planEndDate: [
          {required: true, message: "计划竣工时间不能为空", trigger: "blur"}
        ],
      },
      planBeginDatePickerOptions: {},
      planEndDatePickerOptions: {},
      actualBeginDatePickerOptions: {},
      actualEndDatePickerOptions: {},
      fromFullPath: ''
    };
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
    from() {
      return this.$route.query.from;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fromFullPath = from.fullPath
    })
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if(!this.id) {
        const userInfo = this.$store.state.user.userInfo;
        this.form.inputUnit = userInfo.dept.deptName;
        this.form.inputMan = userInfo.nickName;
        this.form.tel = userInfo.phonenumber;
        this.form.email = userInfo.email;
        return
      }
      getHbProjectInfo(this.id).then(res => {
        this.form = res.data;

      })
    },
    // 取消按钮
    cancel(time = 0) {
      let path = '/buildEnvironment/environment/project';
      if(this.from == 'detail') {
        path = '/buildEnvironment/environment/project/detail?id=' + this.id;
      }
      this.closeView(this.$route.path, path, time);
    },
    planBeginDatePickerChange() {
      this.planEndDatePickerOptions.disabledDate = (time) => {
        if(this.form.planBeginDate) {
          return time.getTime() < new Date(this.form.planBeginDate).getTime() + 8.64e7;
        }
      }
    },
    planEndDatePickerChange() {
      this.planBeginDatePickerOptions.disabledDate = (time) => {
        if(this.form.planEndDate) {
          return time.getTime() > new Date(this.form.planEndDate).getTime() - 8.64e7;
        }
      }
    },
    actualBeginDatePickerChange() {
      this.actualEndDatePickerOptions.disabledDate = (time) => {
        if(this.form.actualBeginDate) {
          return time.getTime() < new Date(this.form.actualBeginDate).getTime() + 8.64e7;
        }
      }
    },
    actualEndDatePickerChange() {
      this.actualBeginDatePickerOptions.disabledDate = (time) => {
        if(this.form.actualEndDate) {
          return time.getTime() > new Date(this.form.actualEndDate).getTime() - 8.64e7;
        }
      }
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.planBeginDate && this.form.planEndDate) {
            const planDay = this.getDiffDay(this.form.planBeginDate, this.form.planEndDate);
            if(planDay <= 0) {
              this.msgError('计划开工日期不能大于计划竣工日期！');
              return
            }
          }
          if (this.form.actualBeginDate && this.form.actualEndDate) {
            const actualDay = this.getDiffDay(this.form.actualBeginDate, this.form.actualEndDate);
            if (actualDay <= 0) {
              this.msgError('实际开工日期不能大于实际竣工日期！');
              return
            }
          }
          if (this.form.id != undefined) {
            updateHbProjectInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.cancel(1000);
              }
            });
          } else {
            addHbProjectInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("录入成功");
                this.cancel(1000);
              }
            });
          }
        }
      });
    }
  }
};
</script>
