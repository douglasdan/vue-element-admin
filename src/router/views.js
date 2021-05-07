const routesMap =
  {
    '/company/companyMgr': () => import('@/views/company-admin/company-mgr.vue'),
    '/org/orgMgr': () => import('@/views/company-admin/org-mgr.vue'),
    '/org/userMgr': () => import('@/views/company-admin/user-mgr.vue')
  }

export { routesMap }
