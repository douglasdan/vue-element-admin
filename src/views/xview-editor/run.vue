<template>
  <el-row>
    <el-col :span="8">
      <vue-json-editor
        v-model="viewDefine.viewContent"
        :show-btns="false"
        :mode="'code'"
        lang="zh"
        style="height: 820px"
        @json-change="onJsonChange"
        @json-save="onJsonSave"
        @has-error="onError"
      />
    </el-col>
    <el-col :span="16">

      <div v-if="viewDefine.objectId">
        <x-object-list v-if="view.viewType == 'object-list'" :viewId="view.id"></x-object-list>
      </div>

      <div style="border: 1px rgb(0, 255, 242) solid; width: 800px; min-height: 600px;">
        <x-element :view="viewJson" />
      </div>

    </el-col>
  </el-row>
</template>

<script>

import vueJsonEditor from 'vue-json-editor'

const defaultJson =
  {
    component: 'el-col',
    props: {
      'span': 24
    },
    children: [
      {
        component: 'el-row',
        props: {
          style: 'height: 40px;'
        },
        children: [
          {
            component: 'el-col',
            props: {
              'span': 12
            },
            children: [
              {
                component: 'p',
                content: 'AAA'
              }
            ]
          },
          {
            component: 'el-col',
            props: {
              'span': 12
            },
            children: [
              {
                component: 'p',
                content: 'BBB',
                style: {
                  color: 'red'
                }
              }
            ]
          }
        ]
      },
      {
        component: 'el-card',
        props: {
          style: 'width: 100%;',
          size: 'small',
          title: '输入表单',
          extra: '更多'
        },
        children: [
          {
            component: 'el-form',
            props: {
              'label-col': { span: 8 },
              'wrapper-col': { span: 16 }
            },
            children: [
              {
                component: 'el-form-item',
                props: {
                  label: 'name'
                },
                children: [
                  {
                    component: 'el-input'
                  }
                ]
              },
              {
                component: 'el-form-item',
                props: {
                  label: 'password'
                },
                children: [
                  {
                    component: 'el-input'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        component: 'x-card',
        name: '卡片zzz',
        props: {
        },
        header: {
          buttons: [
            {
              component: 'x-button',
              name: '测试',
              props: {
                type: 'text',
                style: 'float: right; padding: 3px 0'
              },
              action: 'alert(123)'
            }
          ]
        },
        children: [
          {
            component: 'p',
            content: 'content is here'
          }
        ]
      }

    ]
  }

export default {
  name: 'XRun',
  components: {
    vueJsonEditor
  },
  props: {
    viewDefine: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      viewJson: null
    }
  },
  watch: {
    'viewDefine': {
      handler(nval, oval) {
        this.viewJson = JSON.parse(nval.viewContent)
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    onJsonChange(value) {
      // console.log('value:', value)
      // this.$props.viewDefine.viewContent = JSON.parse(JSON.stringify(this.viewJson))
      this.viewJson = JSON.parse(this.$props.viewDefine.viewContent)
    },
    onJsonSave(value) {
      console.log('value:', value)
      this.viewJson = JSON.parse(this.$props.viewDefine.viewContent)
      this.$emmit('input', JSON.stringify(this.viewData))
    },
    onError(value) {
      console.log('value:', value)
    },
    // getJsonContent() {
    //   return JSON.stringify(this.viewJson)
    // }
  }

}
</script>

<style>
  .jsoneditor-poweredBy{
    display: none;
  }
  .jsoneditor-vue{
	    height: 100%;
	}

</style>
