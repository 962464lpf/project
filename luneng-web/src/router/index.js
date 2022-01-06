import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: (resolve) => require(['@/views/index'], resolve),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:dictId(\\d+)',
        component: (resolve) => require(['@/views/system/dict/data'], resolve),
        name: 'Data',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'log',
        component: (resolve) => require(['@/views/monitor/job/log'], resolve),
        name: 'JobLog',
        meta: { title: '调度日志' }
      }
    ]
  },
  {
    path: '/gen',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'edit',
        component: (resolve) => require(['@/views/tool/gen/editTable'], resolve),
        name: 'GenEdit',
        meta: { title: '修改生成配置' }
      }
    ]
  },
  {
    path: '/msg',
    component: Layout,
    meta: { title: '消息通知' },
    hidden: true,
    children: [
      {
        path: '/msg/selNotice/addNotice',
        name: 'msg-selNotice-addNotice',
        meta: { title: '添加' },
        component: (resolve) => require(['@/views/msg/selNotice/noticeAddOrEdit'], resolve)
      },
      {
        path: '/msg/selNotice/editNotice',
        name: 'msg-selNotice-editNotice',
        meta: { title: '修改' },
        component: (resolve) => require(['@/views/msg/selNotice/noticeAddOrEdit'], resolve)
      },
      {
        path: '/msg/selNotice/detailNotice',
        name: 'msg-selNotice-detailNotice',
        meta: { title: '详情' },
        component: (resolve) => require(['@/views/msg/selNotice/noticeDetail'], resolve)
      },
      {
        path: '/msg/selNotice/detailNoticeHis',
        name: 'msg-selNotice-detailNoticeHis',
        meta: { title: '历史详情' },
        component: (resolve) => require(['@/views/msg/selNotice/noticeDetail'], resolve)
      },

      {
        path: '/msg/selNotice/addPro',
        name: 'msg-proReserve-add',
        meta: { title: '添加' },
        component: (resolve) => require(['@/views/msg/selNotice/proAddOrEdit'], resolve)
      },
      {
        path: '/msg/selNotice/editPro',
        name: 'msg-proReserve-edit',
        meta: { title: '修改' },
        component: (resolve) => require(['@/views/msg/selNotice/proAddOrEdit'], resolve)
      },
      {
        path: '/msg/selNotice/detailPro',
        name: 'msg-proReserve-detailPro',
        meta: { title: '详情' },
        component: (resolve) => require(['@/views/msg/selNotice/proDetail'], resolve)
      },
      {
        path: '/msg/selNotice/detailProHis',
        name: 'msg-proReserve-detailProHis',
        meta: { title: '历史详情' },
        component: (resolve) => require(['@/views/msg/selNotice/proDetail'], resolve)
      },

      {
        path: '/msg/selNotice/addReserve',
        name: 'msg-reserveItems-add',
        meta: { title: '添加' },
        component: (resolve) => require(['@/views/msg/selNotice/reserveAddOrEdit'], resolve)
      },
      {
        path: '/msg/selNotice/editReserve',
        name: 'msg-reserveItems-edit',
        meta: { title: '修改' },
        component: (resolve) => require(['@/views/msg/selNotice/reserveAddOrEdit'], resolve)
      },
      {
        path: '/msg/selNotice/detailReserve',
        name: 'msg-reserveItems-detailReserve',
        meta: { title: '详情' },
        component: (resolve) => require(['@/views/msg/selNotice/reserveDetail'], resolve)
      },
      {
        path: '/msg/selNotice/detailReserveHis',
        name: 'msg-reserveItems-detailReserveHis',
        meta: { title: '历史详情' },
        component: (resolve) => require(['@/views/msg/selNotice/reserveDetail'], resolve)
      }

    ]
  },
  {
    path: '/sel',
    component: Layout,
    meta: { title: '奖励评选', icon: 'form' },
    hidden: true,
    children: [
      {
        path: '/sel/selDeclareInfo/science',
        name: 'sel-selDeclareInfo-science',
        meta: { title: '申报-科学进步奖' },
        component: (resolve) => require(['@/views/sel/selDeclareInfo/science'], resolve)
      },
      {
        path: '/sel/selDeclareInfo/patent',
        name: 'sel-selDeclareInfo-patent',
        meta: { title: '申报-专利奖' },
        component: (resolve) => require(['@/views/sel/selDeclareInfo/patent'], resolve)
      },
      {
        path: '/sel/selDeclareInfo/additionalData',
        name: 'sel-selDeclareInfo-additionalData',
        meta: { title: '资料补充' },
        component: (resolve) => require(['@/views/sel/selDeclareInfo/additionalData'], resolve)
      },
      {
        path: '/sel/selDeclareInfo/detail',
        name: 'sel-selDeclareInfo-detail',
        meta: { title: '申报详情' },
        component: (resolve) => require(['@/views/sel/selDeclareInfo/detail'], resolve)
      },
      {
        path: '/sel/awardAudit/audit',
        name: 'sel-awardAudit-audit',
        meta: { title: '奖励审核-审核' },
        component: (resolve) => require(['@/views/sel/declareAudit/audit'], resolve)
      },
      {
        path: '/sel/awardAudit/detail',
        name: 'sel-awardAudit-detail',
        meta: { title: '奖励审核详情' },
        component: (resolve) => require(['@/views/sel/declareAudit/audit'], resolve)
      },
      {
        path: '/sel/expertReview/reviewScore',
        name: 'sel-expertReview-reviewScore',
        meta: { title: '评审项目(打分)' },
        component: (resolve) => require(['@/views/sel/expertReview/reviewScore'], resolve)
      },
      {
        path: '/sel/expertReview/expertSignDetail',
        name: 'sel-expertReview-expertSignDetail',
        meta: { title: '查看签到表' },
        component: (resolve) => require(['@/views/sel/expertReview/expertSignDetail'], resolve)
      },
      {
        path: '/sel/selDeclareReviewResult/detail',
        name: 'sel-selDeclareReviewResult-detail',
        meta: { title: '评审结果详情' },
        component: (resolve) => require(['@/views/sel/selDeclareReviewResult/detail'], resolve)
      },
      {
        path: '/sel/rewardSuggestion/detail',
        name: 'sel-rewardSuggestion-detail',
        meta: { title: '文件详情' },
        component: (resolve) => require(['@/views/sel/rewardSuggestion/detail'], resolve)
      },
      {
        path: '/sel/selRecognition/issue',
        name: 'sel-selRecognition-issue',
        meta: { title: '下发证书' },
        component: (resolve) => require(['@/views/sel/selRecognition/issue'], resolve)
      },
      {
        path: '/sel/selRecognition/detail',
        name: 'sel-selRecognition-detail',
        meta: { title: '查看证书' },
        component: (resolve) => require(['@/views/sel/selRecognition/issue'], resolve)
      }
    ]
  },
  {
    path: '/other',
    component: Layout,
    meta: { title: '其他', icon: 'form' },
    hidden: true,
    children: [
      {
        path: '/other/workAccount/add',
        name: 'other-workAccount-add',
        meta: { title: '新增台账' },
        component: (resolve) => require(['@/views/other/workAccount/add'], resolve)
      },
      {
        path: '/other/workAccount/edit',
        name: 'other-workAccount-edit',
        meta: { title: '修改台账' },
        component: (resolve) => require(['@/views/other/workAccount/add'], resolve)
      },
      {
        path: '/other/workAccount/detail',
        name: 'other-workAccount-detail',
        meta: { title: '台账详情' },
        component: (resolve) => require(['@/views/other/workAccount/detail'], resolve)
      }
    ]
  },

  {
    path: '/expert',
    component: Layout,
    meta: { title: '专家库' },
    hidden: true,
    children: [
      {
        path: '/expert/expert/addExpert',
        name: 'expert-expert-addExpert',
        meta: { title: '添加专家' },
        component: (resolve) => require(['@/views/expert/expert/AddExpert'], resolve)
      },
      {
        path: '/expert/expert/updateExpert',
        name: 'expert-expert-updateExpert',
        meta: { title: '修改专家' },
        component: (resolve) => require(['@/views/expert/expert/AddExpert'], resolve)
      },
      {
        path: '/expert/expert/expertDetail',
        name: 'expert-expert-expertDetail',
        meta: { title: '专家详情' },
        component: (resolve) => require(['@/views/expert/expert/ExpertDetail'], resolve)
      },
      {
        path: '/expert/expertGroup/addExpertGroup',
        name: 'expert-expertGroup-addExpertGroup',
        meta: { title: '添加专家组' },
        component: (resolve) => require(['@/views/expert/expertGroup/AddExpertGroup'], resolve)
      },
      {
        path: '/expert/expertGroup/updateExpertGroup',
        name: 'expert-expertGroup-updateExpertGroup',
        meta: { title: '修改专家组' },
        component: (resolve) => require(['@/views/expert/expertGroup/AddExpertGroup'], resolve)
      },
      {
        path: '/expert/expertGroup/manageMember',
        name: 'expert-expertGroup-manageMember',
        meta: { title: '成员管理' },
        component: (resolve) => require(['@/views/expert/expertGroup/ManageMember'], resolve)
      },
      {
        path: '/expert/expertGroup/manageMember/addMember',
        name: 'expert-expertGroup-manageMember-addMember',
        meta: { title: '添加成员' },
        component: (resolve) => require(['@/views/expert/expertGroup/AddMember'], resolve)
      },
      {
        path: '/expert/selection/reportSelExperts',
        name: 'expert-selection-reportSelExperts',
        meta: { title: '上报专家' },
        component: (resolve) => require(['@/views/expert/selection/reportSelExperts'], resolve)
      },
      {
        path: '/expert/selection/selExpertsDetail',
        name: 'expert-selection-selExpertsDetail',
        meta: { title: '专家详情' },
        component: (resolve) => require(['@/views/expert/components/selExpertsDetail'], resolve)
      },
      {
        path: '/expert/reviewExperts/reportSelExperts',
        name: 'expert-reviewExperts-reportSelExperts',
        meta: { title: '审核专家' },
        component: (resolve) => require(['@/views/expert/components/selExpertsDetail'], resolve)
      }
    ]
  },

  {
    path: '/selReview',
    component: Layout,
    meta: { title: '评审打分' },
    hidden: true,
    children: [
      {
        path: '/selReview/reviewOnline/rewardReview',
        name: 'selReview-reviewOnline-rewardReview',
        meta: { title: '奖励打分' },
        component: (resolve) => require(['@/views/selReview/reviewOnline/rewardReview'], resolve)
      },
      {
        path: '/selReview/reviewOnline/rewardReview/reviewOnlineScore',
        name: 'selReview-reviewOnline-rewardReview-reviewOnlineScore',
        meta: { title: '打分' },
        component: (resolve) => require(['@/views/selReview/reviewOnline/reviewOnlineScore'], resolve)
      },
      {
        path: '/selReview/reviewOnline/rewardDetail',
        name: 'selReview-reviewOnline-rewardDetail',
        meta: { title: '项目详情' },
        component: (resolve) => require(['@/views/selReview/reviewOnline/rewardDetail'], resolve)
      },
      {
        path: '/selReview/storageReviewOnLine1',
        name: 'selReview-storageReviewOnLine',
        meta: { title: '项目储备评审' },
        component: (resolve) => require(['@/views/selReview/index'], resolve),
        children: [
          {
            path: '/selReview/storageReviewOnLine/review',
            name: 'selReview-storageReviewOnLine-review',
            meta: { title: '评审' },
            component: (resolve) => require(['@/views/selReview/storageReviewOnLine/detail'], resolve)
          },
          {
            path: '/selReview/storageReviewOnLine/detail',
            name: 'selReview-storageReviewOnLine-detail',
            meta: { title: '详情' },
            component: (resolve) => require(['@/views/selReview/storageReviewOnLine/detail'], resolve)
          }
        ]
      }

    ]
  },
  {
    path: '/workgroup',
    component: Layout,
    meta: { title: '工作组', icon: 'form' },
    hidden: true,
    children: [
      {
        path: '/workgroup/workgroup/detail/detail',
        name: 'workgroup-workgroup-detail-detail',
        meta: { title: '工作组详情' },
        component: (resolve) => require(['@/views/workgroup/workGroup/detail/detail'], resolve)
      },
      {
        path: '/workgroup/workgroup/detail/user',
        name: 'workgroup-workgroup-detail-user',
        meta: { title: '工作组成员' },
        component: (resolve) => require(['@/views/workgroup/workGroup/detail/user'], resolve)
      },
      {
        path: '/workgroup/workgroup/detail/addUser/addUser',
        name: 'workgroup-workgroup-detail-addUser-addUser',
        meta: { title: '添加成员' },
        component: (resolve) => require(['@/views/workgroup/workGroup/detail/addUser/addUser'], resolve)
      }
    ]
  },

  {
    path: '/proManagement/storage',
    meta: { title: '项目储备' },
    component: Layout,
    redirect: 'noRedirect',
    hidden: true,
    children: [
      {
        path: '/proManagement/storage/projectStorageInfo/report',
        name: 'proManagement-storage-projectStorageInfo-report',
        meta: { title: '申报' },
        component: (resolve) => require(['@/views/proManagement/storage/projectStorageInfo/report'], resolve)
      },
      {
        path: '/proManagement/storage/projectStorageInfo/detail',
        name: 'proManagement-storage-projectStorageInfo-detail',
        meta: { title: '项目申报详情' },
        component: (resolve) => require(['@/views/proManagement/storage/projectStorageInfo/detail'], resolve)
      },
      {
        path: '/proManagement/storage/projectStorageInfo/historyDetail',
        name: 'proManagement-storage-projectStorageInfo-historyDetail',
        meta: { title: '项目申报历史详情' },
        component: (resolve) => require(['@/views/proManagement/storage/projectStorageInfo/historyDetail'], resolve)
      },
      {
        path: '/proManagement/storage/audit/audit',
        name: 'proManagement-storage-audit-audit',
        meta: { title: '审核' },
        component: (resolve) => require(['@/views/proManagement/storage/audit/audit'], resolve)
      },
      {
        path: '/proManagement/storage/audit/detail',
        name: 'proManagement-storage-audit-detail',
        meta: { title: '项目审核详情' },
        component: (resolve) => require(['@/views/proManagement/storage/audit/audit'], resolve)
      },
      {
        path: '/proManagement/storage/audit/report',
        name: 'proManagement-storage-audit-report',
        meta: { title: '可研报告' },
        component: (resolve) => require(['@/views/proManagement/storage/audit/report'], resolve)
      },
      {
        path: '/proManagement/storage/review/infoDetail',
        name: 'proManagement-storage-review-infoDetail',
        meta: { title: '项目详情' },
        component: (resolve) => require(['@/views/proManagement/storage/review/infoDetail'], resolve)
      },
      {
        path: '/proManagement/storage/review/detail',
        name: 'proManagement-storage-review-detail',
        meta: { title: '专家评审详情' },
        component: (resolve) => require(['@/views/proManagement/storage/review/detail'], resolve)
      },
      {
        path: '/proManagement/storage/result/detail',
        name: 'proManagement-storage-result-detail',
        meta: { title: '项目详情' },
        component: (resolve) => require(['@/views/proManagement/storage/result/detail'], resolve)
      },
      {
        path: '/proManagement/storage/result/opinion',
        name: 'proManagement-storage-result-opinion',
        meta: { title: '评审结果意见' },
        component: (resolve) => require(['@/views/proManagement/storage/result/opinion'], resolve)
      },
      {
        path: '/proManagement/storage/library/detail',
        name: 'proManagement-storage-library-detail',
        meta: { title: '项目详情' },
        component: (resolve) => require(['@/views/proManagement/storage/library/detail'], resolve)
      },
      {
        path: '/proManagement/storage/library/add',
        name: 'proManagement-storage-library-add',
        meta: { title: '添加储备项目' },
        component: (resolve) => require(['@/views/proManagement/storage/library/add'], resolve)
      }
    ]
  },

  {
    path: '/proManagement/proImplement',
    meta: { title: '立项实施' },
    component: Layout,
    redirect: 'noRedirect',
    hidden: true,
    children: [
      {
        path: '/proManagement/proImplement/proEstablish/editProInfo',
        name: 'proManagement-proImplement-proEstablish-editProInfo',
        meta: { title: '编辑' },
        component: (resolve) => require(['@/views/proManagement/proImplement/proEstablish/EditProInfo'], resolve)
      },
      {
        path: '/proManagement/proImplement/proEstablish/proMainTask',
        name: 'proManagement-proImplement-proEstablish-proMainTask',
        meta: { title: '项目详情' },
        component: (resolve) => require(['@/views/proManagement/proImplement/proEstablish/ProMainTask'], resolve)
      },
      {
        path: '/proManagement/proImplement/drawUpPlan/editProPlan',
        name: 'proManagement-proImplement-drawUpPlan-editProPlan',
        meta: { title: '编制项目计划' },
        component: (resolve) => require(['@/views/proManagement/proImplement/drawUpPlan/EditProPlan'], resolve)
      },
      {
        path: '/proManagement/proImplement/drawUpPlan/proPlanDetail',
        name: 'proManagement-proImplement-drawUpPlan-proPlanDetail',
        meta: { title: '项目计划详情' },
        component: (resolve) => require(['@/views/proManagement/proImplement/drawUpPlan/proPlanDetail'], resolve)
      },
      {
        path: '/proManagement/proImplement/planReview/reviewProPlan',
        name: 'proManagement-proImplement-planReview-reviewProPlan',
        meta: { title: '审核详情' },
        component: (resolve) => require(['@/views/proManagement/proImplement/planReview/reviewProPlan'], resolve)
      },
      {
        path: '/proManagement/proImplement/proRecruit/addRecruitInfo',
        name: 'proManagement-proImplement-proRecruit-addRecruitInfo',
        meta: { title: '补充合同信息' },
        component: (resolve) => require(['@/views/proManagement/proImplement/proRecruit/addRecruitInfo'], resolve)
      },
      {
        path: '/proManagement/proImplement/proRecruit/recruitContractDetail',
        name: 'proManagement-proImplement-proRecruit-recruitContractDetail',
        meta: { title: '查看合同信息' },
        component: (resolve) => require(['@/views/proManagement/proImplement/proRecruit/recruitContractDetail'], resolve)
      },
      {
        path: '/proManagement/proImplement/proRecruit/recruitFile',
        name: 'proManagement-proImplement-proRecruit-recruitFile',
        meta: { title: '招采资料' },
        component: (resolve) => require(['@/views/proManagement/proImplement/proRecruit/recruitFile'], resolve)
      },
      {
        path: '/proManagement/proImplement/fundManagement/paymentVoucher',
        name: 'proManagement-proImplement-fundManagement-paymentVoucher',
        meta: { title: '付款凭证' },
        component: (resolve) => require(['@/views/proManagement/proImplement/fundManagement/paymentVoucher'], resolve)
      },
      {
        path: '/proManagement/proImplement/proLaunch/proLaunchDetail',
        name: 'proManagement-proImplement-proLaunch-proLaunchDetail',
        meta: { title: '文件详情' },
        component: (resolve) => require(['@/views/proManagement/proImplement/proLaunch/proLaunchDetail'], resolve)
      },
      {
        path: '/proManagement/proImplement/proLaunch/playImplementPlan',
        name: 'proManagement-proImplement-proLaunch-playImplementPlan',
        meta: { title: '编辑计划' },
        component: (resolve) => require(['@/views/proManagement/proImplement/proLaunch/playImplementPlan'], resolve)
      },
      {
        path: '/proManagement/proImplement/proLaunch/playPlanDetailKXB',
        name: 'proManagement-proImplement-proLaunch-playPlanDetailKXB',
        meta: { title: '计划详情' },
        component: (resolve) => require(['@/views/proManagement/proImplement/proLaunch/playPlanDetailKXB'], resolve)
      },
      {
        path: '/proManagement/proImplement/proLaunch/playPlanDetailDeclare',
        name: 'proManagement-proImplement-proLaunch-playPlanDetailDeclare',
        meta: { title: '计划详情' },
        component: (resolve) => require(['@/views/proManagement/proImplement/proLaunch/playPlanDetailDeclare'], resolve)
      },
      {
        path: '/proManagement/proImplement/proImplementation/playResults',
        name: 'proManagement-proImplement-proImplementation-playResults',
        meta: { title: '实施成果' },
        component: (resolve) => require(['@/views/proManagement/proImplement/proImplementation/playResults'], resolve)
      },
      {
        path: '/proManagement/proImplement/proImplementation/playResultDetail',
        name: 'proManagement-proImplement-proImplementation-playResultDetail',
        meta: { title: '成果文件' },
        component: (resolve) => require(['@/views/proManagement/proImplement/proImplementation/playResultDetail'], resolve)
      }
    ]
  },

  {
    path: '/proManagement/conclude',
    meta: { title: '结题验收' },
    component: Layout,
    redirect: 'noRedirect',
    hidden: true,
    children: [
      {
        path: '/proManagement/conclude/conclude/apply',
        name: 'proManagement-conclude-conclude-apply',
        meta: { title: '申请结题' },
        component: (resolve) => require(['@/views/proManagement/conclude/conclude/detail'], resolve)
      },
      {
        path: '/proManagement/conclude/conclude/detail',
        name: 'proManagement-conclude-conclude-detail',
        meta: { title: '结题详情' },
        component: (resolve) => require(['@/views/proManagement/conclude/conclude/detail'], resolve)
      },
      {
        path: '/proManagement/conclude/audit/audit',
        name: 'proManagement-conclude-audit-audit',
        meta: { title: '结题审核' },
        component: (resolve) => require(['@/views/proManagement/conclude/audit/audit'], resolve)
      },
      {
        path: '/proManagement/conclude/audit/detail',
        name: 'proManagement-conclude-audit-detail',
        meta: { title: '结题审核详情' },
        component: (resolve) => require(['@/views/proManagement/conclude/audit/audit'], resolve)
      }
    ]
  },
  {
    path: '/proManagement/monthlyReport',
    meta: { title: '工作月报' },
    component: Layout,
    redirect: 'noRedirect',
    hidden: true,
    children: [
      {
        path: '/proManagement/monthlyReport/monthReportAudit/reportList',
        name: 'proManagement-monthlyReport-monthReportAudit-reportList',
        meta: { title: '月报审核列表' },
        component: (resolve) => require(['@/views/proManagement/monthlyReport/audit/AuditReportList'], resolve)
      },
      {
        path: '/proManagement/monthlyReport/monthReportAudit/reportList/detail',
        name: 'proManagement-monthlyReport-monthReportAudit-reportList-detail',
        meta: { title: '月报详情' },
        component: (resolve) => require(['@/views/proManagement/monthlyReport/Detail'], resolve)
      },
      {
        path: '/proManagement/monthlyReport/workMonthReport/reportList',
        name: 'proManagement-monthlyReport-workMonthReport-reportList',
        meta: { title: '月报列表' },
        component: (resolve) => require(['@/views/proManagement/monthlyReport/report/ReportList'], resolve)
      },
      {
        path: '/proManagement/monthlyReport/workMonthReport/reportList/edit',
        name: 'proManagement-monthlyReport-workMonthReport-reportList-edit',
        meta: { title: '月报编辑' },
        component: (resolve) => require(['@/views/proManagement/monthlyReport/report/Edit'], resolve)
      },
      {
        path: '/proManagement/monthlyReport/workMonthReport/reportList/detail',
        name: 'proManagement-monthlyReport-workMonthReport-reportList-detail',
        meta: { title: '月报详情' },
        component: (resolve) => require(['@/views/proManagement/monthlyReport/Detail'], resolve)
      }
    ]
  },

  {
    path: '/buildEnvironment/build',
    meta: { title: '绿色建筑' },
    component: Layout,
    redirect: 'noRedirect',
    hidden: true,
    children: [
      {
        path: '/buildEnvironment/build/buildProject/editProInfo',
        name: 'buildEnvironment-build-buildProject-editProInfo',
        meta: { title: '录入项目' },
        component: (resolve) => require(['@/views/buildEnvironment/build/buildProject/editProInfo'], resolve)
      },
      {
        path: '/buildEnvironment/build/buildProject/buildProDetail',
        name: 'buildEnvironment-build-buildProject-buildProDetail',
        meta: { title: '项目详情' },
        component: (resolve) => require(['@/views/buildEnvironment/build/buildProject/buildProDetail'], resolve)
      },
      {
        path: '/buildEnvironment/build/buildProject/fileDetail',
        name: 'buildEnvironment-build-buildProject-fileDetail',
        meta: { title: '文件详情' },
        component: (resolve) => require(['@/views/buildEnvironment/build/components/fileDetail'], resolve)
      },
      {
        path: '/buildEnvironment/build/confirmGoal/editTargetBook',
        name: 'buildEnvironment-build-confirmGoal-editTargetBook',
        meta: { title: '编辑建议书' },
        component: (resolve) => require(['@/views/buildEnvironment/build/confirmGoal/editTargetBook'], resolve)
      },
      {
        path: '/buildEnvironment/build/confirmGoal/fileDetail',
        name: 'buildEnvironment-build-confirmGoal-fileDetail',
        meta: { title: '文件详情' },
        component: (resolve) => require(['@/views/buildEnvironment/build/components/fileDetail'], resolve)
      },
      {
        path: '/buildEnvironment/build/reviewGoal/auditFile',
        name: 'buildEnvironment-build-reviewGoal-auditFile',
        meta: { title: '审核目标' },
        component: (resolve) => require(['@/views/buildEnvironment/build/reviewGoal/auditFile'], resolve)
      },
      {
        path: '/buildEnvironment/build/buildProject/targetBookDetail',
        name: 'buildEnvironment-build-buildProject-targetBookDetail',
        meta: { title: '目标书详情' },
        component: (resolve) => require(['@/views/buildEnvironment/build/reviewGoal/auditFile'], resolve)
      },
      {
        path: '/buildEnvironment/build/reviewGoal/fileDetail',
        name: 'buildEnvironment-build-reviewGoal-fileDetail',
        meta: { title: '文件详情' },
        component: (resolve) => require(['@/views/buildEnvironment/build/components/fileDetail'], resolve)
      },
      {
        path: '/buildEnvironment/build/assessApprove/fileDetail',
        name: 'buildEnvironment-build-assessApprove-fileDetail',
        meta: { title: '文件详情' },
        component: (resolve) => require(['@/views/buildEnvironment/build/components/fileDetail'], resolve)
      },
      {
        path: '/buildEnvironment/build/construction/fileDetail',
        name: 'buildEnvironment-build-construction-fileDetail',
        meta: { title: '文件详情' },
        component: (resolve) => require(['@/views/buildEnvironment/build/components/fileDetail'], resolve)
      },
      {
        path: '/buildEnvironment/build/construction/workBriefing',
        name: 'buildEnvironment-build-construction-workBriefing',
        meta: { title: '工作简报' },
        component: (resolve) => require(['@/views/buildEnvironment/build/construction/workBriefing'], resolve)
      },
      {
        path: '/buildEnvironment/build/construction/weekBriefing',
        name: 'buildEnvironment-build-construction-weekBriefing',
        meta: { title: '项目周报' },
        component: (resolve) => require(['@/views/buildEnvironment/build/construction/workBriefing'], resolve)
      },
      {
        path: '/buildEnvironment/build/construction/workEvaluate',
        name: 'buildEnvironment-build-construction-workEvaluate',
        meta: { title: '项目评价' },
        component: (resolve) => require(['@/views/buildEnvironment/build/construction/workEvaluate'], resolve)
      },
      {
        path: '/buildEnvironment/build/construction/editEvaluate',
        name: 'buildEnvironment-build-construction-editEvaluate',
        meta: { title: '编辑评价' },
        component: (resolve) => require(['@/views/buildEnvironment/build/construction/editEvaluate'], resolve)
      },
      {
        path: '/buildEnvironment/build/construction/evaluateDetail',
        name: 'buildEnvironment-build-construction-evaluateDetail',
        meta: { title: '评价详情' },
        component: (resolve) => require(['@/views/buildEnvironment/build/construction/evaluateDetail'], resolve)
      },
      {
        path: '/buildEnvironment/build/completedFile/fileDetail',
        name: 'buildEnvironment-build-completedFile-fileDetail',
        meta: { title: '文件详情' },
        component: (resolve) => require(['@/views/buildEnvironment/build/components/fileDetail'], resolve)
      },
      {
        path: '/buildEnvironment/build/fileRecord/fileDetail',
        name: 'buildEnvironment-build-fileRecord-fileDetail',
        meta: { title: '文件详情' },
        component: (resolve) => require(['@/views/buildEnvironment/build/components/fileDetail'], resolve)
      },
      {
        path: '/buildEnvironment/build/trackManagement/fileDetail',
        name: 'buildEnvironment-build-trackManagement-fileDetail',
        meta: { title: '文件详情' },
        component: (resolve) => require(['@/views/buildEnvironment/build/components/fileDetail'], resolve)
      }
    ]
  },

  {
    path: '/buildEnvironment/environment',
    meta: { title: '环境保护' },
    component: Layout,
    redirect: 'noRedirect',
    hidden: true,
    children: [
      {
        path: "/buildEnvironment/environment/management/record",
        name: "buildEnvironment-environment-management-record",
        meta: {title: "环保问题整改记录"},
        component: (resolve) => require(['@/views/buildEnvironment/environment/record/index'], resolve),
      },
      {
        path: "/buildEnvironment/environment/management/record/add",
        name: "buildEnvironment-environment-record-add",
        meta: {title: "新增记录"},
        component: (resolve) => require(['@/views/buildEnvironment/environment/record/add'], resolve)
      },
      {
        path: "/buildEnvironment/environment/management/record/edit",
        name: "buildEnvironment-environment-record-edit",
        meta: {title: "修改记录"},
        component: (resolve) => require(['@/views/buildEnvironment/environment/record/add'], resolve)
      },
      {
        path: "/buildEnvironment/environment/management/record/detail",
        name: "buildEnvironment-environment-record-detail",
        meta: {title: "查看记录"},
        component: (resolve) => require(['@/views/buildEnvironment/environment/record/detail'], resolve)
      },
      {
        path: "/buildEnvironment/environment/management/zc",
        name: "buildEnvironment-environment-management-zc",
        meta: {title: "自查"},
        component: (resolve) => require(['@/views/buildEnvironment/environment/recordZc/index'], resolve)
      },
      {
        path: "/buildEnvironment/environment/management/zc/add",
        name: "buildEnvironment-environment-zc-add",
        meta: {title: "新增记录"},
        component: (resolve) => require(['@/views/buildEnvironment/environment/recordZc/add'], resolve)
      },
      {
        path: "/buildEnvironment/environment/management/zc/edit",
        name: "buildEnvironment-environment-zc-edit",
        meta: {title: "修改记录"},
        component: (resolve) => require(['@/views/buildEnvironment/environment/recordZc/add'], resolve)
      },
      {
        path: "/buildEnvironment/environment/management/zc/detail",
        name: "buildEnvironment-environment-zc-detail",
        meta: {title: "查看记录"},
        component: (resolve) => require(['@/views/buildEnvironment/environment/recordZc/detail'], resolve)
      },
      {
        path: "/buildEnvironment/environment/management/dc",
        name: "buildEnvironment-environment-management-dc",
        meta: {title: "督查"},
        component: (resolve) => require(['@/views/buildEnvironment/environment/recordDc/index'], resolve)
      },
      {
        path: "/buildEnvironment/environment/management/dc/add",
        name: "buildEnvironment-environment-dc-add",
        meta: {title: "新增记录"},
        component: (resolve) => require(['@/views/buildEnvironment/environment/recordDc/add'], resolve)
      },
      {
        path: "/buildEnvironment/environment/management/dc/edit",
        name: "buildEnvironment-environment-dc-edit",
        meta: {title: "修改记录"},
        component: (resolve) => require(['@/views/buildEnvironment/environment/recordDc/add'], resolve)
      },
      {
        path: "/buildEnvironment/environment/management/dc/detail",
        name: "buildEnvironment-environment-dc-detail",
        meta: {title: "查看记录"},
        component: (resolve) => require(['@/views/buildEnvironment/environment/recordDc/detail'], resolve)
      },
      {
        path: "/buildEnvironment/environment/management/report/year",
        name: "buildEnvironment-environment-management-report-year",
        meta: {title: "年度计划"},
        component: (resolve) => require(['@/views/buildEnvironment/environment/report/index'], resolve),
      },
      {
        path: "/buildEnvironment/environment/management/report/month",
        name: "buildEnvironment-environment-management-report-month",
        meta: {title: "工作简报"},
        component: (resolve) => require(['@/views/buildEnvironment/environment/report/index'], resolve),
      },
      {
        path: "/buildEnvironment/environment/management/report/week",
        name: "buildEnvironment-environment-management-report-week",
        meta: {title: "项目周报"},
        component: (resolve) => require(['@/views/buildEnvironment/environment/report/index'], resolve),
      },
      {
        path: '/buildEnvironment/environment/project/add',
        name: 'buildEnvironment-environment-project-add',
        meta: { title: '录入项目' },
        component: (resolve) => require(['@/views/buildEnvironment/environment/project/add'], resolve)
      },
      {
        path: '/buildEnvironment/environment/project/edit',
        name: 'buildEnvironment-environment-project-edit',
        meta: { title: '项目修改' },
        component: (resolve) => require(['@/views/buildEnvironment/environment/project/add'], resolve)
      },
      {
        path: '/buildEnvironment/environment/project/detail',
        name: 'buildEnvironment-environment-project-detail',
        meta: { title: '项目详情' },
        component: (resolve) => require(['@/views/buildEnvironment/environment/project/detail'], resolve)
      },
      {
        path: '/buildEnvironment/environment/project/view',
        name: 'buildEnvironment-environment-project-view',
        meta: { title: '详情' },
        component: (resolve) => require(['@/views/buildEnvironment/environment/project/view'], resolve)
      },
      {
        path: '/buildEnvironment/environment/confirm/fileDetail',
        name: 'buildEnvironment-environment-confirm-fileDetail',
        meta: { title: '文件详情' },
        component: (resolve) => require(['@/views/buildEnvironment/environment/components/fileDetail'], resolve)
      },
      {
        path: '/buildEnvironment/environment/start/fileDetail',
        name: 'buildEnvironment-environment-start-fileDetail',
        meta: { title: '文件详情' },
        component: (resolve) => require(['@/views/buildEnvironment/environment/components/fileDetail'], resolve)
      },
      {
        path: '/buildEnvironment/environment/finish/fileDetail',
        name: 'buildEnvironment-environment-finish-fileDetail',
        meta: { title: '文件详情' },
        component: (resolve) => require(['@/views/buildEnvironment/environment/components/fileDetail'], resolve)
      },
      {
        path: '/buildEnvironment/environment/emergency/fileDetail',
        name: 'buildEnvironment-environment-emergency-fileDetail',
        meta: { title: '文件详情' },
        component: (resolve) => require(['@/views/buildEnvironment/environment/components/fileDetail'], resolve)
      },
      {
        path: '/buildEnvironment/environment/check/fileDetail',
        name: 'buildEnvironment-environment-check-fileDetail',
        meta: { title: '文件详情' },
        component: (resolve) => require(['@/views/buildEnvironment/environment/components/fileDetail'], resolve)
      },
      {
        path: '/buildEnvironment/environment/review/fileDetail',
        name: 'buildEnvironment-environment-review-fileDetail',
        meta: { title: '文件详情' },
        component: (resolve) => require(['@/views/buildEnvironment/environment/components/fileDetail'], resolve)
      },
      {
        path: '/buildEnvironment/environment/management/fileDetail',
        name: 'buildEnvironment-environment-management-fileDetail',
        meta: { title: '文件详情' },
        component: (resolve) => require(['@/views/buildEnvironment/environment/components/fileDetail'], resolve)
      },
      {
        path: '/buildEnvironment/environment/acceptanceCheck/fileDetail',
        name: 'buildEnvironment-environment-acceptanceCheck-fileDetail',
        alwaysShow: true,
        meta: { title: '文件详情' },
        component: (resolve) => require(['@/views/buildEnvironment/environment/components/fileDetail'], resolve)
      }
    ]
  },

  {
    path: '/meeting',
    component: Layout,
    meta: { title: '会议管理' },
    redirect: 'noRedirect',
    hidden: true,
    children: [
      {
        path: '/meeting/management/add',
        name: 'meeting-management-add',
        meta: { title: '新增会议' },
        component: (resolve) => require(['@/views/meeting/management/add'], resolve)
      },
      {
        path: '/meeting/management/queryAgenda',
        name: 'meeting-management-queryAgenda',
        meta: { title: '会议议程' },
        component: (resolve) => require(['@/views/meeting/management/add'], resolve)
      },
      {
        path: '/meeting/management/noticeReceipt',
        name: 'meeting-management-noticeReceipt',
        meta: { title: '回执' },
        component: (resolve) => require(['@/views/meeting/management/NoticeReceipt'], resolve)
      },
      {
        path: '/meeting/management/manageSignIn',
        name: 'meeting-management-manageSignIn',
        meta: { title: '会议签到' },
        component: (resolve) => require(['@/views/meeting/management/ManageSignIn'], resolve)
      },
      {
        path: '/meeting/management/editMeetingRecord',
        name: 'meeting-management-editMeetingRecord',
        meta: { title: '会议记录' },
        component: (resolve) => require(['@/views/meeting/management/EditMeetingRecord'], resolve)
      },
      {
        path: '/meeting/management/editMeetingSummary',
        name: 'meeting-management-editMeetingSummary',
        meta: { title: '会议纪要' },
        component: (resolve) => require(['@/views/meeting/management/EditMeetingSummary'], resolve)
      }
    ]
  },
  {
    path: '/achievementHidden',
    component: Layout,
    meta: { title: '成果展示' },
    hidden: true,
    children: [
      {
        path: '/achievement/cooperation/audit',
        name: 'achievement-cooperation-audit',
        meta: { title: '处理申请' },
        component: (resolve) => require(['@/views/achievement/cooperation/audit'], resolve)
      },
      {
        path: '/achievement/cooperation/detail',
        name: 'achievement-cooperation-detail',
        meta: { title: '处理申请' },
        component: (resolve) => require(['@/views/achievement/cooperation/audit'], resolve)
      }
    ]
  }
]

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
