const routesMap =
{
  '/company/companyMgr': () => import('@/views/company-admin/company-mgr.vue'),
  '/org/orgMgr': () => import('@/views/company-admin/org-mgr'),
  '/org/userMgr': () => import('@/views/company-admin/user-mgr'),
  '/profile': () => import('@/views/user-profile.vue'),

  '/base/privilege/roleMgr': () => import('@/views/business-backend/RoleMgr'),
  // '/base/privilege/dataPerm': () => import('@/views/business-backend/DataPermMgr'),
  '/base/frontMenu': () => import('@/views/business-backend/FrontMenu'),
  '/base/mdmMgr': () => import('@/views/business-backend/MdmDataMgr'),

  '/app/mgr': () => import('@/views/business-backend/AppMgr'),
  '/app/objectMgr': () => import('@/views/business-backend/ObjectMgr'),
  '/view/mgr': () => import('@/views/business-backend/ViewMgr'),

  '/finance/bookSetMgr': () => import('@/views/business-finance/accounting/BookSetMgr'),
  '/finance/segmentDefine': () => import('@/views/business-finance/accounting/SegmentDefine'),
  '/finance/voucher': () => import('@/views/business-finance/accounting/VoucherList'),
  '/finance/cost/distribute': () => import('@/views/business-finance/fico/CostDistribution'),

  '/fico/costsharing/method': () => import('@/views/business-finance/fico/csmethod/CsMethodListView'),

  '/fico/sharing/strategy': () => import('@/views/business-finance/fico/csmethod/CsMethodListView'),
}

export { routesMap }
