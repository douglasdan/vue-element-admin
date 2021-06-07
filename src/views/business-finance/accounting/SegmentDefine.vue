<template>
  <section>
    <div style="width: 100%; padding-left: 10px; padding-right: 10px; margin-top: 10px; margin-bottom: 10px; font-size: 14px;">
      账套：<book-set-select v-model="queryForm.bookSetId" @change="handleBookSetChange()" />

      <div style="display: inline-block; float: right;">
        <el-button type="primary" @click="saveDefine">保存</el-button>
      </div>
    </div>
    <el-row style="border-top: 1px solid #eee;"></el-row>

    <el-row v-for="(seg, idx) in rows">
      <div style="display: inline-flex; line-height: 30px; font-size: 14px; margin-top: 10px; margin-bottom: 10px;">
        <div style="width: 100px; text-align: right;">段名-{{ idx+1 }}：</div>
        <div><el-input v-model="seg.name" placeholder="" size="small"></el-input></div>
        <div style="width: 20px;"></div>
        <div>
          <i class="el-icon-minus" style="font-weight: 600; margin: 8px;" size="mini" @click="handleDeleteSeg(idx)" />
          <i class="el-icon-plus" style="font-weight: 600; margin: 8px;" size="mini" @click="handleAddSeg(idx)" />

          <el-link type="primary" @click="showEditValues(seg)" style="margin-left: 10px;">数据项</el-link>
          <el-link type="primary" @click="showEditGroup(seg)" style="margin-left: 10px;">数据组</el-link>
        </div>
      </div>
    </el-row>

    <el-drawer
      title="编辑数据项"
      :visible.sync="drawer"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :direction="direction">

      <template scope="scope">
        <value-set-editor v-model="valueSet.values" @submit="handleSubmit1"></value-set-editor>
      </template>
    </el-drawer>

    <el-drawer
      title="编辑数据组"
      :visible.sync="drawer2"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :direction="direction">

      <template scope="scope">
        <value-group-editor v-model="valueSet.groups" @submit="handleSubmit2"></value-group-editor>
      </template>
    </el-drawer>

  </section>
</template>

<script>

import { selectFiBookSetPage, selectFiSegmentDefinePage, saveFiSegmentDefine } from '@/api/finance'
import BookSetSelect from './BookSetSelect'
import BookSetList from './BookSetList'

import ValueSetEditor from './ValueSetEditor'
import ValueGroupEditor from './ValueGroupEditor'

export default {
  name: 'FiSegmentDefine',
  components: {
    BookSetSelect,
    BookSetList,
    ValueSetEditor,
    ValueGroupEditor
  },
  data() {
    let THIS = this
    return {
      queryForm: {
        bookSetId: null,
      },
      rows: [],
      drawer: false,
      drawer2: false,
      direction: 'rtl',

      selected: null,
      valueSet: {
        values:[],
        groups:{}
      }
    }
  },
  methods: {
    loadData() {
      const queryObj = {
        pageNo: 1,
        pageSize: 100,
        conditions: []
      }

      if (this.queryForm.appId) {
        queryObj.conditions = [{ field: 'set_id', op: 'eq', values: [this.queryForm.bookSetId]}]
      }

      selectFiSegmentDefinePage(queryObj).then(ret => {
        if (ret.success) {
          this.rows = [].concat(ret.data.rows)
          if (this.rows.length == 0) {
            this.rows.push({
              setId: this.queryForm.bookSetId,
              name: '段1',
              valueSet: '{}'
            })
          }
        }
      })
    },
    handleBookSetChange() {
      this.loadData()
    },

    showEditValues(seg) {
      this.selected = seg
      Object.assign(this.valueSet, JSON.parse(seg.valueSet))
      this.drawer = true
    },
    showEditGroup(seg) {
      this.selected = seg
      Object.assign(this.valueSet, JSON.parse(seg.valueSet))
      this.drawer2 = true
    },

    handleSubmit1() {
      this.selected.valueSet = JSON.stringify(this.valueSet)
      this.drawer = false;
    },
    handleSubmit2() {
      this.selected.valueSet = JSON.stringify(this.valueSet)
      this.drawer2 = false;
    },

    handleDeleteSeg(i) {
      this.rows.splice(i, 1)
    },
    handleAddSeg(i) {
      this.rows.splice(i+1, 0, {
        setId: this.queryForm.bookSetId,
        name: '段1',
        valueSet: '{}'
      })
    },
    saveDefine() {
      this.rows.forEach(async (item) => {
        await saveFiSegmentDefine(item).then(ret => {
          if (ret.success) {
            this.loadData()
          }
        })
      })
    },
  }
}

</script>
