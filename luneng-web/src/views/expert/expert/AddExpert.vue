<template>
  <div class="app-container">
    <div class="main">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <div class="basic-info">
          <div class="title-text">基本信息</div>
          <div class="content">
            <div class="form-item">
              <el-form-item label="登录帐号" prop="userName">
                <el-select
                  @change="changeUserName"
                  filterable
                  style="position: relative;width: 80%;"
                  v-model="form.userName"
                  placeholder="请选择登录帐号">
                  <el-option
                    v-for="item in expertUserNameList"
                    :key="item.userName"
                    :label="item.userName"
                    :value="item.userName">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>

            <div class="form-item">
              <el-form-item label="专家姓名" prop="name">
                <el-input
                  v-model="form.name"
                  placeholder="请输入专家姓名"
                  style="width: 80%;"/>
              </el-form-item>
            </div>
            <div class="form-item">
              <el-form-item label="性别" prop="gender">
                <el-select
                  v-model="form.gender"
                  placeholder="请选择性别"
                  style="width: 80%;">
                  <el-option
                    v-for="dict in genderOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-item">
              <el-form-item label="出生日期" prop="birthday">
                <el-date-picker
                  clearable
                  style="width: 80%;"
                  v-model="form.birthday"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择出生日期">
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="form-item">
              <el-form-item label="民族" prop="nationality">
                <el-select
                  v-model="form.nationality"
                  placeholder="请选择民族"
                  style="width: 80%;">
                  <el-option
                    v-for="dict in nationalityOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-item">
              <el-form-item label="手机号码" prop="phone">
                <el-input
                  v-model="form.phone"
                  placeholder="请输入手机号码"
                  style="width: 80%;"/>
              </el-form-item>
            </div>
            <div class="form-item">
              <el-form-item label="固定电话" prop="cell">
                <el-input
                  v-model="form.cell"
                  placeholder="请输入固定电话"
                  style="width: 80%;"/>
              </el-form-item>
            </div>
            <div class="form-item">
              <el-form-item label="电子邮箱" prop="email">
                <el-input
                  v-model="form.email"
                  placeholder="请输入电子邮箱"
                  style="width: 80%;"/>
              </el-form-item>
            </div>
            <div class="form-item">
              <el-form-item label="专家属性" prop="attribute">
                <el-select
                  v-model="form.attribute"
                  placeholder="请选择专家属性"
                  style="width: 80%;">
                  <el-option
                    v-for="dict in exertGroupTypes"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-item">
              <el-form-item label="状态" prop="status">
                <el-radio-group
                  v-model="form.status"
                  style="width: 80%;">
                  <el-radio
                    v-for="dict in statusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictValue">{{dict.dictLabel}}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
        </div>

        <div class="job-title-info">
          <div class="title-text">职称信息</div>
          <div class="content">
            <div class="form-item">
              <el-form-item label="工作单位" prop="workUnit">
                <el-input
                  v-model="form.workUnit"
                  placeholder="请输入工作单位"
                  style="width: 80%;"/>
              </el-form-item>
            </div>
            <div class="form-item">
              <el-form-item label="现任职务" prop="job">
                <el-input
                  v-model="form.job"
                  placeholder="请输入现任职务"
                  style="width: 80%;"/>
              </el-form-item>
            </div>
            <div class="form-item">
              <el-form-item label="技术职称" prop="jobLevel">
                <el-input
                  v-model="form.jobLevel"
                  placeholder="请输入技术职称"
                  style="width: 80%;"/>
              </el-form-item>
            </div>
            <div class="form-item">
              <el-form-item label="专业领域" prop="exportArea">
                <el-select
                  v-model="form.exportArea"
                  placeholder="请选择专业领域"
                  multiple
                  style="width: 80%;">
                  <el-option
                    v-for="dict in exportAreaOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-item addWidth">
              <el-form-item label="主要成就及其他" prop="remark">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="请填写主要学术成就，字数不超过500"
                  maxlength="500"
                  show-word-limit
                  v-model="form.remark"
                  style="width: 100%;">
                </el-input>
              </el-form-item>
            </div>
          </div>
        </div>

        <div class="image-info">
          <div class="title-text">照片</div>
          <div class="content">
            <div class="form-item">
              <el-form-item label="照片" prop="fileUrl">
                <div class="uploadImg">
                  <expert-avatar
                    :title="expertId ? '修改照片': '上传照片'"
                    :imgFileUrl="form.fileUrl"
                    @uploadImgSucc="getAvatarUrl"/>
                </div>
              </el-form-item>
            </div>
          </div>
        </div>

        <div class="footer">
          <el-form-item>
            <div class="btns">
              <el-button type="primary"  @click="submitForm">确 定</el-button>
              <el-button  @click="cancel">取 消</el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {getExpert, queryExpertUserName, addExpert, updateExpert} from "@/api/expert/expert";
  import ExpertAvatar from "./components/expertAvatar";
  import {expertRules} from "@/utils/el_validate"

  export default {
    name: "",
    data() {
      return {
        // 性别字典
        genderOptions: [],
        // 民族字典
        nationalityOptions: [],
        // 专业领域字典
        exportAreaOptions: [],
        //专家状态字典
        statusOptions: [],
        //专家在专家库中组别
        exertGroupTypes: [],
        //可选择的专家用户名列表
        expertUserNameList: [],
        // 表单参数
        form: {
          id: undefined,
          name: undefined,
          gender: undefined,
          birthday: undefined,
          nationality: undefined,
          phone: undefined,
          cell: undefined,
          email: undefined,
          userName: undefined,
          attribute: '0',
          status: "0",
          workUnit: undefined,
          job: undefined,
          jobLevel: undefined,
          exportArea: undefined,
          remark: undefined,
          fileUrl: undefined,
          createBy: undefined,
          createTime: undefined,
          updateBy: undefined,
          updateTime: undefined
        },
        //表单验证
        rules: expertRules,

        //路由传入
        //专家ID
        expertId: undefined,
        expertGroupId: undefined,
        user: undefined,
        fromFullPath: ''
      };
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.fromFullPath = from.fullPath
      })
    },
    created() {
      //修改按钮进入先获取专家个人信息回填
      if (this.$route.query.id !== undefined) {
        this.expertId = this.$route.query.id
        this.init(this.expertId)
      }

      if (this.$route.query.expertGroupId !== undefined) {
        this.expertGroupId = this.$route.query.expertGroupId
      }

      //查询所有的专家登录账号
      this._queryExpertUserName()

      //获取字典信息
      //性别
      this.getDicts("sys_user_sex").then(response => {
        this.genderOptions = response.data;
      })
      //专家的民族
      this.getDicts("sys_nationality").then(response => {
        this.nationalityOptions = response.data;
      })
      //专家的专业领域
      this.getDicts("sys_expert_area").then(response => {
        this.exportAreaOptions = response.data;
      })
      //专家的个人状态
      this.getDicts("expert_status").then(response => {
        this.statusOptions = response.data
      });
      //专家在专家库里的组别
      this.getDicts("expert_group").then(response => {
        this.exertGroupTypes = response.data
      });
    },
    components: {
      ExpertAvatar
    },
    methods: {
      /* ************************ 数据获取及处理 *************************/
      //修改按钮进入查询专家个人信息
      init(id) {
        getExpert(id).then(response => {
          const newData = this.valueOfObjNum2Str(response.data)
          this.form = newData
          this.form.exportArea = this.form.exportArea.split(',')
          console.log(this.form);
        })
      },
      //查询所有的专家登录账号
      _queryExpertUserName() {
        queryExpertUserName().then(res => {
          this.expertUserNameList = res.data
        })
      },
      //上传头像后回填上传头像地址
      getAvatarUrl(imgUrl) {
        this.form.fileUrl = imgUrl
      },
      //将对象的数字型属性值转换成字符串
      valueOfObjNum2Str(obj) {
        Object.keys(obj).map(key => {
          if ((typeof obj[key]) == 'number') {
            obj[key] = String(obj[key])
          }
        })
        return obj
      },

      /* ************************ 交互操作 *************************/
      //选中可选的专家登录账号后回填信息
      changeUserName(value) {
        this.expertUserNameList.some(user => {
            if (user.userName==value){
              if (user.nickName) {
                this.form.name = user.nickName;
              }
              if (user.sex) {
                this.form.gender = user.sex;
              }
              if (user.phonenumber) {
                this.form.phone = user.phonenumber;
              }
              if (user.email) {
                this.form.email = user.email;
              }
            }
        })
      },

      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.expertId !== undefined) {  //修改专家
              if (this.form.exportArea) {
                this.form.exportArea = this.form.exportArea.join()
              }
              updateExpert(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功")
                  this.cancel()
                }
              }).catch(() => {
                this.form.exportArea = this.form.exportArea.split(',')
              })
            } else {
              if (this.form.exportArea) {
                this.form.exportArea = this.form.exportArea.join()
              }
              addExpert(this.form).then(response => { //新增专家
                if (response.code === 200) {
                  this.msgSuccess("新增成功")
                  this.cancel()
                }
              }).catch(() => {
                this.form.exportArea = this.form.exportArea.split(',')
              })
            }
          }
        })
      },

      //返回页面
      cancel() {
        this.closeView(this.$route.path, this.fromFullPath, 0)
      }
    }
  }

</script>
<style lang="scss" scoped>
  .app-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px 30px 50px 30px;

    .main {
      width: 100%;
      display: flex;
      flex-direction: column;

      .basic-info, .job-title-info {
        width: 100%;
      }

      .footer {
        width: 100%;

        .btns {
          width: 20%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }

      .title-text {
        border-bottom: 1px solid #bdc2c9;
        padding-bottom: 10px;
        padding-left: 10px;
      }

      .content {
        width: 100%;
        padding: 20px 50px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .form-item {
          width: 45%;

          .avatar {
            width: 80px;
            border-radius: 50%;
          }
        }

        .addWidth {
          width: 92.35%;
        }
      }
    }
  }
</style>
