<script>
import xObjectCondition from '@/views/xview/components/x-object-condition'

export default {
  name: 'cs-receiver-field-edit',
  extends: xObjectCondition,
  methods: {
    setDefaultOptions() {
      this.options = []

      if (this.cond.field == 'subjectCode') {
        this.options.push({label: '赋值为发送方',   value: 'same'})
      }
      else {
        if (!this.isAssistCond) {
          this.options.push({label: '空',           value: ''})
          this.options.push({label: '与发送方一致',   value: 'same'})
          this.options.push({label: '全部',         value: 'all'})
        }
        this.options.push({label: '等于',         value: 'eq'})
        // this.options.push({label: '不等于',       value: 'ne'})
      }
    },
  }
}
</script>
