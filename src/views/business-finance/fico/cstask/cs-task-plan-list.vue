<script>

import xObjectListView from '@/views/xview/components/x-object-list-view'

import { callObjectAction } from '@/api/object-data'

export default {
  name: 'cs-task-plan-list',
  extends: xObjectListView,
  methods: {
    execute(row) {
      callObjectAction(this.objectId, row.id, 'execute', {}).then(ret => {
        if (ret.success) {
          this.loadData()
        }
      })
    },
    rollback(row) {
      callObjectAction(this.objectId, row.id, 'rollback', {}).then(ret => {
        if (ret.success) {
          this.loadData()
        }
      })
    }
  }
}


</script>
