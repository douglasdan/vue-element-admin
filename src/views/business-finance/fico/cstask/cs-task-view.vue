<template>
  <section>
    <div :style="pageStyle" v-if="objectData">
      <x-form-item label="任务类型：">
        <x-object-field-control v-if="mdmReady" :editing="true" @object-relation="handleObjectRelation"
          v-model="objectData['taskType']"
          :field-define="objectFieldDefineMap['taskType']"
        />
      </x-form-item>
      <x-form-item label="任务名称：">
        <x-object-field-control v-if="mdmReady" :editing="true" @object-relation="handleObjectRelation"
          v-model="objectData['taskName']"
          :field-define="objectFieldDefineMap['taskName']"
        />
      </x-form-item>
      <x-form-item label="任务编码：">
        <x-object-field-control v-if="mdmReady" :editing="true" @object-relation="handleObjectRelation"
          v-model="objectData['taskCode']"
          :field-define="objectFieldDefineMap['taskCode']"
        />
      </x-form-item>
      <x-form-item label="优先级：">
        <x-object-field-control v-if="mdmReady" :editing="true" @object-relation="handleObjectRelation"
          v-model="objectData['priority']"
          :field-define="objectFieldDefineMap['priority']"
        />
      </x-form-item>

      <x-form-item label="接受方：" v-if="objectData['taskType'] == '1'">
        <x-object-field-control v-if="mdmReady" :editing="true" @object-relation="handleObjectRelation"
          v-model="objectData['receiveName']"
          :field-define="objectFieldDefineMap['receiveName']"
        />
      </x-form-item>
      <x-form-item label="分摊方法：" v-if="objectData['taskType'] == '1'">
        <x-object-field-control v-if="mdmReady" :editing="true" @object-relation="handleObjectRelation"
          v-model="objectData['shareMethodName']"
          :field-define="objectFieldDefineMap['shareMethodName']"
        />
      </x-form-item>
      <x-form-item label="继承上级：" v-if="objectData['parentTaskCode'] && objectData['taskType'] == '1'">
        <x-object-field-control v-if="mdmReady" :editing="true" @object-relation="handleObjectRelation"
          v-model="objectData['extendsParent']"
          :field-define="objectFieldDefineMap['extendsParent']"
        />
      </x-form-item>
    </div>

    <x-form-item label="发送条件：">
      <CsTaskInputFilter ref="objectInputFilter" :object-data="objectData" :editing="true" />
    </x-form-item>

    <x-form-item label="合并模板：">

    </x-form-item>

  </section>

</template>

<script>

import { saveObjectData, getObjectDataById } from '@/api/object-data'

import xObjectViewView from '@/views/xview/components/x-object-view-view'
import CsTaskInputFilter from './cs-task-input-filter'


export default {
  name: 'CsTaskViewVue',
  components: {
    CsTaskInputFilter
  },
  extends: xObjectViewView,
  methods: {
    saveData() {

      this.objectData['filterJson'] = JSON.stringify(this.$refs.objectInputFilter.getConditions())

      saveObjectData(this.objectId, this.objectData).then(ret => {
        if (ret.success) {
          this.editing = false
          this.$message.info('操作成功')
        }
      })
    }
  }
}

</script>
