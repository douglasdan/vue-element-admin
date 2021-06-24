<template>
  <div>
    <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
      <el-step title="选择分摊对象" ></el-step>
      <el-step title="选择分摊因子" ></el-step>
      <el-step title="试算运行" ></el-step>
    </el-steps>

    <div v-if="active === 0">
      <div style="width: 100%; padding-left: 10px; padding-right: 10px; margin-top: 10px; margin-bottom: 10px; font-size: 14px;">
        账套：<book-set-select v-model="setId" @change="handleBookSetChange()"/>
      </div>

      <!-- <el-row>
        <div style="display: inline-flex; line-height: 30px; font-size: 14px; margin-top: 10px; margin-bottom: 10px;">
          <el-switch
            v-model="enableBatch"
            active-text="分摊动因"
            inactive-text="按年付费">
          </el-switch>
        </div>
      </el-row> -->

      <el-row v-for="(seg, idx) in defines">
        <div style="display: inline-flex; line-height: 30px; font-size: 14px; margin-top: 10px; margin-bottom: 10px;">
          <div style="width: 100px; text-align: right;">{{ seg.name }}：</div>
          <div>
            <el-select v-model="send.types[idx]" placeholder="">
              <el-option label="循环" :value="'L'"></el-option>
              <el-option label="等于" :value="'C'"></el-option>
              <el-option label="求和" :value="'S'"></el-option>
            </el-select>
          </div>
          <div style="width: 10px;">
          </div>
          <div>
            <segment-value-select v-model="send.values[idx]" :valueSet="seg.valueSet" ></segment-value-select>
          </div>
        </div>
      </el-row>
    </div>
    <div v-if="active === 1" type="flex" >
      <div style="display: inline-flex;">
        选择对象：
      </div>
      <div style="display: inline-flex;">
        <el-select v-model="distribute.object" placeholder="选择对象">
          <el-option label="机构" :value="''"></el-option>
          <el-option label="部门" :value="''"></el-option>
          <el-option label="客户" :value="''"></el-option>
          <el-option label="客户经理" :value="''"></el-option>
          <el-option label="产品" :value="''"></el-option>
        </el-select>
      </div>
      <div style="display: inline-flex;">
        选择字段：
      </div>
      <div style="display: inline-flex;">
        <el-select v-model="distribute.field" placeholder="选择属性">
          <el-option label="办公地面积" :value="'SQRT'"></el-option>
          <el-option label="产品" :value="'RROD'"></el-option>
        </el-select>
      </div>
    </div>
    <div v-if="active === 2">
    </div>

    <el-row justify="center" type="flex" style="margin-top: 20px;">
      <el-button type="primary" @click="prev()">上一步</el-button>
      <el-button type="primary" @click="next()">下一步</el-button>
    </el-row>
  </div>
</template>

<script>

import { selectFiSegmentDefinePage } from '@/api/finance'
import BookSetSelect from '../accounting/BookSetSelect'
import SegmentValueSelect from '../accounting/SegmentValueSelect'

export default {
  name: 'fi-cost-distribute',
  components: {
    BookSetSelect, SegmentValueSelect
  },
  data() {
    return {
      active: 0,
      setId: null,
      defines: [],

      enableBatch: false,
      batchs:[100],
      send:{
        values:[],
        types: []
      },

      distribute: {
        object: '',
        field: ''
      }
    }
  },
  mounted() {

  },
  methods: {
    prev() {
      if (this.active-- < 0) this.active = 0;
    },
    next() {
      if (this.active++ > 2) this.active = 2;
    },
    handleBookSetChange() {
      this.loadData()
    },
    loadData() {
      const queryObj = {
        pageNo: 1,
        pageSize: 100,
        conditions: []
      }

      if (this.setId) {
        queryObj.conditions = [{ field: 'set_id', op: 'eq', values: [this.setId]}]
      }

      selectFiSegmentDefinePage(queryObj).then(ret => {
        if (ret.success) {
          ret.data.rows.forEach(item => {
            item.valueSet = JSON.parse(item.valueSet)
          })
          this.defines = [].concat(ret.data.rows)
        }
      })
    },

  }
}

</script>
