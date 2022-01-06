/* ***************表单验证规则****************/
//添加部门
export const sysCompanyRules = {
  name: [
    { required: true, message: "公司名称不能为空", trigger: "blur" },
    {
      pattern: /^(\S)(.|\n){0,20}(\S)$/,
      message: "公司名称格式不正确",
      trigger: "blur"
    }
  ],
  email: [
    {
      pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])/,
      message: "请输入正确的邮箱地址",
      trigger: "blur"
    }
  ],
  phone: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号",
      trigger: "blur"
    }
  ]
}

//系统菜单
//添加角色
export const sysRoleRules = {
  roleName: [
    {required: true, message: "角色名称不能为空", trigger: "blur"},
    {
      pattern: /^(\S)[\w\u4E00-\u9FA5\s]{0,8}(\S)$/,
      message: "请输入正确格式的角色名称",
      trigger: "blur"
    }
  ],
  roleKey: [
    {required: true, message: "权限字符不能为空", trigger: "blur"},
    {
      pattern: /^(\S)(.|\n)*(\S)$/,
      message: "请输入正确格式的权限字符",
      trigger: "blur"
    }
  ],
  roleSort: [
    {required: true, message: "角色顺序不能为空", trigger: "blur"}
  ]
}
//添加部门
export const sysDeptRules = {
  parentId: [
    {required: true, message: "上级部门不能为空", trigger: "blur"}
  ],
  deptName: [
    {required: true, message: "部门名称不能为空", trigger: "blur"},
    {
      pattern: /^(\S)(.|\n){0,30}(\S)$/,
      message: "请输入正确格式的部门名称",
      trigger: "blur"
    }
  ],
  orderNum: [
    {required: true, message: "菜单顺序不能为空", trigger: "change"}
  ],
  email: [
    {
      pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])/,
      message: "请输入正确的邮箱地址",
      trigger: "blur"
    }
  ],
  phone: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur"
    }
  ]
}
//添加岗位
export const sysPostRules = {
  postName: [
    {required: true, message: "岗位名称不能为空", trigger: "blur"},
    {
      pattern: /^(\S)[\w\u4E00-\u9FA5\s]{0,8}(\S)$/,
      message: "请输入正确格式的岗位名称",
      trigger: "blur"
    }
  ],
  postCode: [
    {required: true, message: "岗位编码不能为空", trigger: "blur"},
    {
      pattern: /^(\S)(.|\n)*(\S)$/,
      message: "请输入正确格式的岗位编码",
      trigger: "blur"
    }
  ],
  postSort: [
    {required: true, message: "岗位顺序不能为空", trigger: "blur"}
  ]
}
//添加用户
export const sysUserRules = {
  userName: [
    {required: true, message: "用户名称不能为空", trigger: "blur"},
    {
      pattern: /^\w+$/,
      message: "请输入正确格式的用户名称",
      trigger: "blur"
    }
  ],
  nickName: [
    // {required: true, message: "用户昵称不能为空", trigger: "blur"},
    {
      pattern: /^(\S)[\w\u4E00-\u9FA5\s]{0,8}(\S)$/,
      message: "请输入正确格式的用户昵称",
      trigger: "blur"
    }
  ],
  deptId: [
    {required: true, message: "归属部门不能为空", trigger: "blur"}
  ],
  password: [
    {required: true, message: "用户密码不能为空", trigger: "blur"}
  ],
  email: [
    // {required: true, message: "邮箱地址不能为空", trigger: "blur"},
    {
      pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])/,
      message: "请输入正确的邮箱地址",
      trigger: "blur"
    }
  ],
  phonenumber: [
    // {required: true, message: "手机号码不能为空", trigger: "blur"},
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur"
    }
    // { required: true, validator: checkphonenumber, trigger: 'blur' }
  ],
  postIds: [
    {required: true, message: "岗位不可为空", trigger: "blur"}
  ],
  roleIds: [
    {required: true, message: "角色不可为空", trigger: "blur"}
  ],
  mobile: [
    // {required: true, message: "座机号码不能为空", trigger: "blur"},
    // {pattern: /^0\d{2,3}-\d{7,8}$/, message: "请输入正确的座机号码", trigger: "blur"}
  ]
}
//添加工作组
export const sysWorkGroupRules = {
  name: [
    {required: true, message: "工作组名字不能为空", trigger: "blur"},
    {
      pattern: /^(\S)[\w\u4E00-\u9FA5\s]{0,8}(\S)$/,
      message: "请输入正确格式的工作组名字",
      trigger: "blur"
    }
  ],
  status: [
    {required: true, message: "0:正常；1:停用不能为空", trigger: "blur"}
  ]
}
//添加菜单
export const sysMenuRules = {
  menuName: [
    {required: true, message: "菜单名称不能为空", trigger: "blur"},
    {
      pattern: /^(\S)[\w\u4E00-\u9FA5\s]{0,8}(\S)$/,
      message: "请输入正确格式的菜单名称",
      trigger: "blur"
    }
  ],
  orderNum: [
    {required: true, message: "菜单顺序不能为空", trigger: "blur"}
  ],
  path: [
    {required: true, message: "路由地址不能为空", trigger: "blur"},
    {
      pattern: /^(\S)(.|\n)*(\S)$/,
      message: "请输入正确格式的路由地址",
      trigger: "blur"
    }
  ]
}
//添加字典
export const sysDictRules = {
  dictName: [
    {required: true, message: "字典名称不能为空", trigger: "blur"},
    {
      pattern: /^(\S)[\w\u4E00-\u9FA5\s]{0,8}(\S)$/,
      message: "请输入正确格式的字典名称",
      trigger: "blur"
    }
  ],
  dictType: [
    {required: true, message: "字典类型不能为空", trigger: "blur"},
    {
      pattern: /^(\S)(.|\n)*(\S)$/,
      message: "请输入正确格式的字典类型",
      trigger: "blur"
    }
  ]
}
//添加参数
export const sysConfigRules = {
  configName: [
    {required: true, message: "参数名称不能为空", trigger: "blur"},
    {
      pattern: /^(\S)[\w\u4E00-\u9FA5\s]{0,8}(\S)$/,
      message: "请输入正确格式的参数名称",
      trigger: "blur"
    }
  ],
  configKey: [
    {required: true, message: "参数键名不能为空", trigger: "blur"},
    {
      pattern: /^(\S)(.|\n)*(\S)$/,
      message: "请输入正确格式的参数键名",
      trigger: "blur"
    }
  ],
  configValue: [
    {required: true, message: "参数键值不能为空", trigger: "blur"},
    {
      pattern: /^(\S)(.|\n)*(\S)$/,
      message: "请输入正确格式的参数键值",
      trigger: "blur"
    }
  ]
}

//系统监控
//添加任务
export const monitorJobRules = {
  jobName: [
    {required: true, message: "任务名称不能为空", trigger: "blur"}
  ],
  invokeTarget: [
    {required: true, message: "调用目标字符串不能为空", trigger: "blur"}
  ],
  cronExpression: [
    {required: true, message: "cron执行表达式不能为空", trigger: "blur"}
  ]
}

//项目管理
//项目立项编辑
export const proEstablishEdit = {
  projectName: [
    {required: true, message: "项目名称不能为空", trigger: "blur"},
    {max: 30, message: "最多30字", trigger: "blur"}
  ],
  projectCode: [
    {required: true, message: "项目编码不能为空", trigger: "blur"},
    {
      pattern: /^52[\dA-Za-z]{10}$/,
      message: "编码格式为52开头后跟10位数字或字母",
      trigger: "blur"
    }
  ],
  declareUnit: [
    {required: true, message: "申报单位不能为空", trigger: "blur"},
    {max: 30, message: "最多30字", trigger: "blur"}
  ],
  projectType: [
    {required: true, message: "项目类别不能为空", trigger: "blur"},
    {max: 30, message: "最多30字", trigger: "blur"}
  ],
  projectAttr: [
    {required: true, message: "项目属性不能为空", trigger: "blur"}
  ],
  researchField: [
    {required: true, message: "研究领域不能为空", trigger: "blur"}
  ],
  mainContent: [
    {required: true, message: "主要研究内容不能为空", trigger: "blur"},
    {max: 500, message: "最多500字", trigger: "blur"}
  ],
  expectedTarget: [
    {required: true, message: "预期目标不能为空", trigger: "blur"},
    {max: 200, message: "最多200字", trigger: "blur"}
  ],
  undertakeUnit: [
    {required: true, message: "承担单位不能为空", trigger: "blur"},
    {max: 30, message: "最多30字", trigger: "blur"}
  ],
  implementationUnit: [
    {required: true, message: "实施单位不能为空", trigger: "blur"},
    {max: 30, message: "最多30字", trigger: "blur"}
  ],
  proBeginDate: [
    {required: true, message: "起止时间不能为空", trigger: "blur"}
  ],
  headName: [
    {required: true, message: "项目负责人不能为空", trigger: "blur"},
    {max: 10, message: "最多10字", trigger: "blur"}
  ],
  headDuty: [
    {required: true, message: "项目负责人职务不能为空", trigger: "blur"},
    {max: 10, message: "最多10字", trigger: "blur"}
  ],
  linkMan: [
    {required: true, message: "联系人姓名不能为空", trigger: "blur"},
    {max: 10, message: "最多10字", trigger: "blur"}
  ],
  linkDuty: [
    {required: true, message: "联系人职务不能为空", trigger: "blur"},
    {max: 10, message: "最多10字", trigger: "blur"}
  ],
  linkPhone: [
    {required: true, message: "联系人电话不能为空", trigger: "blur"},
    {pattern: /(^0\d{2,3}-?\d{7,8}$)|(^1[3|4|5|6|7|8|9][0-9]\d{8}$)/, message: "请输入正确的联系电话", trigger: "blur"}
  ],
  totalInvestment: [
    {required: true, message: "项目总投入(成本性)不能为空", trigger: "blur"}
  ],
  planInvestment: [
    {required: true, message: "下年投入计划(成本性)不能为空", trigger: "blur"}
  ],
  remark: [
    {max: 200, message: "最多200字", trigger: "blur"}
  ],
  feasibleFilePaths: [
    {required: true, message: "可研报告不能为空", trigger: "blur"}
  ]
}
//奖励评选
//补充资料
export const selExtraDataRules = {
  projectName2: [
    {required: true, message: "项目名称不能为空", trigger: "blur"},
    {
      pattern: /^(\S)(.|\n){0,30}(\S)$/,
      message: "请输入正确格式的完成单位",
      trigger: "blur"
    }
  ],
  mainUnits2: [
    {required: true, message: "完成单位不能为空", trigger: "blur"}
  ],
  mainPersons2: [
    {required: true, message: "主要完成人不能为空", trigger: "blur"}
  ],
  projectText1: [
    {required: true, message: "项目简介及创新点不能为空", trigger: "blur"}
  ],
  projectText2: [
    {required: true, message: "已获奖励及知识产权不能为空", trigger: "blur"}
  ],
  projectText3: [
    {required: true, message: "应用情况及经济效益不能为空", trigger: "blur"}
  ]
}
//专家库
//添加专家
export const expertRules = {
  name: [
    {required: true, message: "专家名字不能为空", trigger: "blur"},
    {
      pattern: /^(\S)[\w\u4E00-\u9FA5\s]{0,8}(\S)$/,
      message: "请输入正确格式的专家名字",
      trigger: "blur"
    }
  ],
  // gender: [
  //   {required: true, message: "性别不能为空", trigger: "blur"}
  // ],
  // birthday: [
  //   {required: true, message: "出生日期不能为空", trigger: "blur"}
  // ],
  // nationality: [
  //   {required: true, message: "民族（字典表）不能为空", trigger: "blur"}
  // ],
  phone: [
    {required: true, message: "手机号码不能为空", trigger: "blur"},
    {pattern: /^1[3456789]\d{9}$/, message: "请输入正确的手机号", trigger: "blur"}
  ],
  cell: [
    {pattern: /^0\d{2,3}-?\d{7,8}$/, message: "请输入正确的电话", trigger: "blur"}
  ],
  email: [
    // {required: true, message: "电子邮箱不能为空", trigger: "blur"},
    {
      pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])/,
      message: "请输入正确的邮箱地址",
      trigger: "blur"
    }
  ],
  // attribute: [
  //   {required: true, message: "专家属性（字典表）不能为空", trigger: "blur"}
  // ],
  // status: [
  //   {required: true, message: "状态（0：正常；1：停用）不能为空", trigger: "blur"}
  // ],
  workUnit: [
    {required: true, message: "工作单位不能为空", trigger: "blur"},
    {
      pattern: /^(\S)(.|\n)*(\S)$/,
      message: "请输入正确格式的工作单位",
      trigger: "blur"
    },
    {max: 30, message: "最多30字", trigger: "blur"}
  ],
  job: [
    {required: true, message: "现任职务不能为空", trigger: "blur"},
    {
      pattern: /^(\S)(.|\n)*(\S)$/,
      message: "请输入正确格式的现任职务",
      trigger: "blur"
    },
    {max: 30, message: "最多30字", trigger: "blur"}
  ],
  // jobLevel: [
  //   {required: true, message: "技术职称不能为空", trigger: "blur"},
  //   {
  //     pattern: /^(\S)(.|\n)*(\S)$/,
  //     message: "请输入正确格式的技术职称",
  //     trigger: "blur"
  //   }
  // ],
  // exportArea: [
  //   {required: true, message: "专业领域不能为空", trigger: "blur"}
  // ],
  // remark: [
  //   {required: true, message: "主要成就及其他不能为空", trigger: "blur"},
  //   {
  //     pattern: /^(\S)(.|\n)*(\S)$/,
  //     message: "请输入正确格式的主要成就及其他",
  //     trigger: "blur"
  //   }
  // ]
}

//添加专家组
export const expertGroupRules = {
  name: [
    {required: true, message: "专家组名字不能为空", trigger: "blur"},
    {
      pattern: /^(\S)[\w\u4E00-\u9FA5\s]{0,18}(\S)$/,
      message: "请输入正确格式的专家组名字",
      trigger: "blur"
    }
  ],
  status: [
    {required: true, message: "状态（0：正常；1：停用）不能为空", trigger: "blur"}
  ],
  remark: []
}

//专家选拔
export const reExpertRules = {
  name: [
    {required: true, message: "专家名字不能为空", trigger: "blur"},
    {
      pattern: /^(\S)[\w\u4E00-\u9FA5\s]{0,8}(\S)$/,
      message: "请输入正确格式的专家名字",
      trigger: "blur"
    }
  ],
  gender: [
    {required: true, message: "性别不能为空", trigger: "blur"}
  ],
  birthday: [
    {required: true, message: "出生日期不能为空", trigger: "blur"}
  ],
  nationality: [
    {required: true, message: "民族（字典表）不能为空", trigger: "blur"}
  ],
  education: [
    {required: true, message: "最高学位不能为空", trigger: "blur"},
    {
      pattern: /^(\S)(.|\n)*(\S)$/,
      message: "请输入正确格式的最高学位",
      trigger: "blur"
    },
    {max: 30, message: "最多30字", trigger: "blur"}
  ],
  major: [
    {required: true, message: "所学单位不能为空", trigger: "blur"},
    {
      pattern: /^(\S)(.|\n)*(\S)$/,
      message: "请输入正确格式的所学单位",
      trigger: "blur"
    },
    {max: 30, message: "最多30字", trigger: "blur"}
  ],
  workUnit: [
    {required: true, message: "工作单位不能为空", trigger: "blur"},
    {
      pattern: /^(\S)(.|\n)*(\S)$/,
      message: "请输入正确格式的工作单位",
      trigger: "blur"
    },
    {max: 30, message: "最多30字", trigger: "blur"}
  ],
  job: [
    {required: true, message: "现任职务不能为空", trigger: "blur"},
    {
      pattern: /^(\S)(.|\n)*(\S)$/,
      message: "请输入正确格式的现任职务",
      trigger: "blur"
    },
    {max: 30, message: "最多30字", trigger: "blur"}
  ],
  jobLevel: [
    {required: true, message: "技术职称不能为空", trigger: "blur"},
    {
      pattern: /^(\S)(.|\n)*(\S)$/,
      message: "请输入正确格式的技术职称",
      trigger: "blur"
    },
    {max: 30, message: "最多30字", trigger: "blur"}
  ],
  exportArea: [
    {required: true, message: "专业领域不能为空", trigger: "blur"}
  ],
  unitIdea: [
    {required: true, message: "推荐单位意见不能为空", trigger: "blur"},
    {
      pattern: /^(\S)(.|\n)*(\S)$/,
      message: "请输入正确格式的推荐单位意见",
      trigger: "blur"
    }
  ]
}

//绿建
export const greenBuildProEdit = {
  projectName: [
    {required: true, message: "项目名字不能为空", trigger: "blur"},
    {max: 30, message: "最多30字", trigger: "blur"}
  ],
  projectAddr: [
    {required: true, message: "项目地点不能为空", trigger: "blur"},
    {max: 50, message: "最多50字", trigger: "blur"}
  ],
  designUnit: [
    {required: true, message: "设计单位不能为空", trigger: "blur"},
    {max: 30, message: "最多30字", trigger: "blur"}
  ],
  advisoryUnit: [
    {required: true, message: "绿建咨询单位不能为空", trigger: "blur"},
    {max: 30, message: "最多30字", trigger: "blur"}
  ],
  criterion: [
    {required: true, message: "绿建标准不能为空", trigger: "blur"}
  ],
  level: [
    {required: true, message: "绿建星级不能为空", trigger: "blur"}
  ],
  attestationTime: [
    {required: true, message: "计划取得认证时间不能为空", trigger: "blur"}
  ],
  enterUnit: [
    {required: true, message: "录入单位不能为空", trigger: "blur"},
    {max: 30, message: "最多30字", trigger: "blur"}
  ],
  personName: [
    {required: true, message: "录入人不能为空", trigger: "blur"},
    {max: 10, message: "最多10字", trigger: "blur"}
  ],
  personPhone: [
    {required: true, message: "联系电话不能为空", trigger: "blur"},
    {pattern: /(^0\d{2,3}-?\d{7,8}$)|(^1[3|4|5|6|7|8|9][0-9]\d{8}$)/, message: "请输入正确的联系电话", trigger: "blur"}
  ],
  personEmail: [
    {required: true, message: "邮箱不能为空", trigger: "blur"},
    {pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,5}){1,4})/, message: "请输入正确的邮箱", trigger: "blur"}
  ],
  planStartDate: [
    {required: true, message: "计划开始时间不能为空", trigger: "blur"}
  ],
  planEndDate: [
    {required: true, message: "计划竣工时间不能为空", trigger: "blur"}
  ],
}

//绿建评价
export const buildProEditEvaluate = {
  time: [
    {required: true, message: "评价时间不能为空", trigger: "blur"},
  ],
  address: [
    {required: true, message: "地点不能为空", trigger: "blur"},
    {max: 50, message: "最多50字", trigger: "blur"}
  ],
  operator: [
    {required: true, message: "经办人不能为空", trigger: "blur"},
    {max: 10, message: "最多10字", trigger: "blur"}
  ],
  title: [
    {required: true, message: "评价标题不能为空", trigger: "blur"},
    {max: 50, message: "最多50字", trigger: "blur"}
  ],
  remark: [
    {required: true, message: "评价内容", trigger: "blur"},
  ]
}

//成果展示
export const releaseRules = {
  addType: [
    {required: true, message: "添加方式不能为空", trigger: "blur"}
  ],
  certificateCode: [
    {required: true, message: "奖励证书编号不能为空", trigger: "blur"}
  ],
  industryType: [
    {required: true, message: "成果产业类型不能为空", trigger: "blur"}
  ],
  awardsType: [
    {required: true, message: "成果评选类型不能为空", trigger: "blur"}
  ],
  projectNameCn:  [
    {required: true, message: "成果名称不能为空", trigger: "blur"},
    { pattern: /^(\S)(.|\n)*(\S)$/, message: "请输入正确格式的成果名称", trigger: "blur" },
    { max: 30, message: "最多30字", trigger: "blur"}
  ],
  patentName: [
    {required: true, message: "成果名称不能为空", trigger: "blur"},
    { pattern: /^(\S)(.|\n)*(\S)$/, message: "请输入正确格式的成果名称", trigger: "blur" },
    { max: 30, message: "最多30字", trigger: "blur"}
  ],
  businessLinkman: [
    {required: true, message: "联系人不能为空", trigger: "blur"},
    {max: 10, message: "最多10字", trigger: "blur"}
  ],
  businessTel: [
    {required: true, message: "联系电话不能为空", trigger: "blur"},
    {pattern: /(^0\d{2,3}-?\d{7,8}$)|(^1[3|4|5|6|7|8|9][0-9]\d{8}$)/, message: "请输入正确的联系电话", trigger: "blur"}
  ],
  businessEmail: [
    {required: true, message: "联系邮箱不能为空", trigger: "blur"},
    {pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,5}){1,4})/, message: "请输入正确的邮箱", trigger: "blur"}
  ]
}
