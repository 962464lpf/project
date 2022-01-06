<template>
  <div class="app-container" style="padding-top: 30px;padding-right: 80px;">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="台账标题" prop="accountTitle">
        <el-input v-model="form.accountTitle" placeholder="请输入台账标题" maxlength="30" />
      </el-form-item>
      <el-row>
        <el-col :span="24">
          <el-form-item label="工作类型" prop="workType">
            <el-input v-model="form.workType" placeholder="请输入工作类型" maxlength="10" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="相关项目">
            <el-select
              v-model="form.projectType"
              clearable
              placeholder="请选择项目类型"
              @change="getRelevantProjects"
              @clear="clearProject"
              style="width: 250px;"
            >
              <el-option
                v-for="item in projectList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
            <el-select
              v-model="form.projectId"
              clearable
              placeholder="请选择项目"
              style="min-width: 360px;width: calc(100% - 250px);"
              @change="changeProject"
            >
              <el-option
                v-for="item in relevantProjects"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
            <!--<el-cascader
              ref="cascader"
              v-model="form.project"
              style="width: 100%;"
              placeholder="请选择项目"
              :options="projectList"
              :props="props"
              :checkStrictly="true"
              :emitPath="false"
              filterable /> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开始时间" prop="workBeginDate">
            <el-date-picker
              clearable
              style="width: 200px"
              v-model="form.workBeginDate"
              type="date"
              value-format="yyyy-MM-dd"
              :picker-options="workBeginDatePickerOptions"
              @change="workBeginDatePickerChange"
              placeholder="选择开始时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="workEndDate">
            <el-date-picker
              clearable
              style="width: 200px"
              v-model="form.workEndDate"
              type="date"
              value-format="yyyy-MM-dd"
              :picker-options="workEndDatePickerOptions"
              @change="workEndDatePickerChange"
              placeholder="选择结束时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="相关地点" prop="workAddress">
        <el-input v-model="form.workAddress" placeholder="请输入相关地点" maxlength="25" />
      </el-form-item>
      <el-form-item label="工作内容" prop="workContent">
        <ueditor v-model="form.workContent" placeholder="请输入工作内容"></ueditor>
      </el-form-item>
      <el-form-item label="附件" prop="filePaths">
        <upload v-model="form.filePaths" :size="10" :limit="5"></upload>
      </el-form-item>
    </el-form>
    <div style="text-align: center;padding: 20px 0;">
      <el-button type="primary" @click="submitForm(1)">发 布</el-button>
      <el-button type="primary" @click="submitForm(0)">保 存</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
  import { getSysWorkAccount, addSysWorkAccount, updateSysWorkAccount, getRelevantProjects } from "@/api/sys/sysWorkAccount";
  import ueditor from '@/components/Ueditor';
  let Base64 = require('js-base64').Base64;
  export default {
    name: 'workAccount-add',
    components: {
      ueditor
    },
    data() {
      return {
        // 表单参数
        form: {
          projectId: ''
        },
        // 表单校验
        rules: {
          accountTitle: [
            { required: true, message: "台账标题不能为空", trigger: "blur" }
          ],
          workType: [
            { required: true, message: "工作类型不能为空", trigger: "blur" }
          ],
          workContent: [
            { required: true, message: "工作内容不能为空", trigger: "blur" }
          ]
        },
        projectList: [
          { label: '奖励评选', value: 1 },
          { label: '项目储备', value: 2 },
          { label: '立项实施', value: 3 },
          { label: '绿色建筑', value: 4 },
          { label: '环境保护', value: 5 }
        ],
        relevantProjects: [],
        props: {
          lazy: true,
          lazyLoad (node, resolve) {
            const { level } = node;
            if (level == 1) {
              getRelevantProjects(node.value).then(res => {
                res.data = null;
                resolve(['暂无数据']);
                return res.data.map(item => {
                  item.value = item.id;
                  item.label = item.name;
                  item.leaf = true;
                })
                if (node.children && node.children.length === 0) {
                  resolve(res.data);
                } else {
                  resolve([]);
                }
              })
            }
          }
        },
        workBeginDatePickerOptions: {},
        workEndDatePickerOptions: {},
        fromFullPath: ''
      };
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.fromFullPath = from.fullPath
      })
    },
    computed: {
      id: function () {
        return this.$route.query.id
      }
    },
    created() {
      this.init();
    },
    activated() {
      this.init();
    },
    methods: {
      init() {
        if(!this.id) return;
        getSysWorkAccount(this.id).then(response => {
          this.form = response.data;
          this.getRelevantProjects(this.form.projectType, 'init');
          // if (this.form.projectType && this.form.projectId) {
          //   this.form.project = [this.form.projectType, this.form.projectId];
          //   let projectList = [...this.projectList];
          //   projectList.map((item, index) => {
          //     if (item.value == this.form.projectType) {
          //       getRelevantProjects(this.form.projectType).then(res => {
          //         if (!res.data && res.data.length === 0) return;
          //         res.data.map(item => {
          //           item.value = item.id;
          //           item.label = item.name;
          //           item.leaf = true;
          //         })
          //         projectList[index].children = res.data;
          //         this.projectList = projectList;
          //       })
          //     }
          //   })
          // }
        });
      },
      getRelevantProjects(e, type) {
        if(!e) return;
        if(!type) {
            this.form.projectId = null;
            this.form.projectName = null;
        }
        getRelevantProjects(e).then(res => {
          if (!res.data && res.data.length === 0) return;
          this.relevantProjects = res.data;
        })
      },
      clearProject() {
        this.form.projectId = null;
        this.relevantProjects = [];
      },
      changeProject(value){
        if(value==''){
            this.form.projectId = null;
            this.form.projectName = null;
        }else {
            var obj = {}
            obj = this.relevantProjects.find((item) => {
                return item.id === value
            });
            this.form.projectName = obj.name;
        }
      },
      workBeginDatePickerChange() {
        this.workEndDatePickerOptions.disabledDate = (time) => {
          if(this.form.workBeginDate) {
            return time.getTime() < new Date(this.form.workBeginDate).getTime();
          }
        }
      },
      workEndDatePickerChange() {
        this.workBeginDatePickerOptions.disabledDate = (time) => {
          if(this.form.workEndDate) {
            return time.getTime() > new Date(this.form.workEndDate).getTime();
          }
        }
      },
      /** 提交按钮 */
      submitForm: function(publishStatus) {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.publishStatus = publishStatus;
            // if (this.form.project && this.form.project.length > 0) {
            //   this.form.projectType = this.form.project[0];
            //   this.form.projectId = this.form.project[1];
            //   const checkedNodes = this.$refs['cascader'].getCheckedNodes(true);
            //   if(checkedNodes[0]) this.form.projectName = checkedNodes[0].label;
            // }
            this.form.base64WorkContent = Base64.encode(this.form.workContent);
            this.form.workContent = null;
            if (this.form.workBeginDate && this.form.workEndDate) {
              const actualDay = this.getDiffDay(this.form.workBeginDate, this.form.workEndDate);
              if (actualDay <= 0) {
                this.msgError('开始时间不能大于结束时间！');
                return
              }
            }
            if (this.form.id != undefined) {
              updateSysWorkAccount(this.form).then(response => {
                if (response.code === 200) {
                  if (publishStatus == 1) {
                    this.msgSuccess("发布成功");
                  } else {
                    this.msgSuccess("保存成功");
                  }
                  this.cancel();
                }
              });
            } else {
              addSysWorkAccount(this.form).then(response => {
                if (response.code === 200) {
                  if (publishStatus == 1) {
                    this.msgSuccess("发布成功");
                  } else {
                    this.msgSuccess("保存成功");
                  }
                  this.cancel();
                }
              });
            }
          }
        });
      },
      // 取消按钮
      cancel(time = 0) {
        const path = this.$route.path;
        let toPath = this.fromFullPath;
        this.closeView(path, toPath, time);
      },
    }
  }
</script>

<style scoped>

</style>
