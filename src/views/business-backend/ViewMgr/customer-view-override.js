
const CustomViewDefines =
{
  'CS_TASK': {
    'object-view': require(`@/views/business-finance/fico/cstask/cs-task-view`).default,
    'object-list': require(`@/views/business-finance/fico/cstask/cs-task-list-view`).default,
    'object-edit': require(`@/views/business-finance/fico/cstask/cs-task-create-view`).default
  },
  'CS_STRATEGY': {
    'object-view': require(`@/views/business-finance/fico/csstrategy/cs-strategy-view`).default
  },
  // 'CS_STRATEGY_PLAN': {
  //   'object-view': require(`@/views/business-finance/fico/csstrategyplan/cs-strategy-plan-view`).default
  // }
}

export { CustomViewDefines }
