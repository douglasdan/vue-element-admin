const routesMap =
  {
    '/company/companyMgr': () => import('@/views/company-admin/company-mgr.vue'),
    '/org/orgMgr': () => import('@/views/company-admin/org-mgr'),
    '/org/userMgr': () => import('@/views/company-admin/user-mgr'),
    '/profile': () => import('@/views/user-profile.vue')
  }

export { routesMap }
