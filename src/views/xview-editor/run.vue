<template>
  <a-row :gutter="[16,16]">
    <a-col :span="12">
      <vue-json-editor
        v-model="viewJson"
        :show-btns="true"
        :mode="'code'"
        lang="zh"
        style="height: 820px"
        @json-change="onJsonChange"
        @json-save="onJsonSave"
        @has-error="onError"
      />
    </a-col>
    <a-col :span="12">
      <div style="border: 1px rgb(0, 255, 242) solid; width: 800px; min-height: 600px;">
        <x-element :view="viewData" />
      </div>
    </a-col>
  </a-row>
</template>

<script>

import vueJsonEditor from 'vue-json-editor'

const defaultJson =
  {
    component: 'a-col',
    props: {
      'span': 24
    },
    children: [
      {
        component: 'a-row',
        props: {
          style: 'height: 40px;'
        },
        children: [
          {
            component: 'a-col',
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
            component: 'a-col',
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
        component: 'a-card',
        props: {
          style: 'width: 100%;',
          size: 'small',
          title: '输入表单',
          extra: '更多'
        },
        children: [
          {
            component: 'a-form',
            props: {
              'label-col': { span: 8 },
              'wrapper-col': { span: 16 }
            },
            children: [
              {
                component: 'a-form-item',
                props: {
                  label: 'name'
                },
                children: [
                  {
                    component: 'a-input'
                  }
                ]
              },
              {
                component: 'a-form-item',
                props: {
                  label: 'password'
                },
                children: [
                  {
                    component: 'a-input'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        component: 'x-table',
        props: {
          objectId: 'J123',
          viewId: 'V1233'
        }
      },
      {
        component: 'x-card',
        props: {
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
  data() {
    return {
      viewJson: defaultJson,
      viewData: defaultJson
    }
  },
  methods: {
    onJsonChange(value) {
      console.log('value:', value)
      this.viewData = JSON.parse(JOSN.stringify(this.viewJson))
    },
    onJsonSave(value) {
      console.log('value:', value)
      this.viewData = JSON.parse(JOSN.stringify(this.viewJson))
    },
    onError(value) {
      console.log('value:', value)
    }
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
