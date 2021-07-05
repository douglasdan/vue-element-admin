<template>
  <section>
    <el-row style="margin: 10px; font-size: 14px; height: 32px;" type="flex">
      <div style="display: flex-inline;" >
        <el-link type="primary" style="line-height: 32px;" @click="toggleQueryPanel">筛选</el-link>
      </div>
      <div style="right: 10px; float: right; position: absolute;">
        <el-button type="primary" size="small" @click="createNew">新建</el-button>
        <el-button type="primary" size="small" @click="resetQueryCond">重置</el-button>
        <el-button size="small" @click="loadData">查询</el-button>
      </div>
    </el-row>

    <el-row style="border-top: 1px solid #eee" v-show="queryPanelVisible">
      <div class="cond-parent">
        <div class="cond-child">
          <div :style="labelStyle">
            分摊方法：
          </div>
          <div style="display: flex-inline; width: 180px;">
            <div>
              <el-input size="small" v-model="query.name"></el-input>
            </div>
          </div>
        </div>
        <div class="cond-child">
          <div :style="labelStyle">
            成本对象：
          </div>
          <div style="display: flex-inline; width: 180px;">
            <div>
              <el-select v-model="query.sharingObjectCode" filterable class="hanzi7" @change="handleObjectChange">
                <el-option
                  v-for="item in csObjectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
        </div>
        <div class="cond-child">
          <div :style="labelStyle">
            分摊对象：
          </div>
          <div style="display: flex-inline; width: 180px;">
            <div>
              <el-select v-model="query.sharingFieldCode" filterable class="hanzi7">
                <el-option
                  v-for="item in csObjectFieldOptions"
                  :key="item.fieldCode"
                  :label="item.fieldName"
                  :value="item.fieldCode"
                />
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </el-row>

    <el-table :data="rows" border style="width: 100%;"
      highlight-current-row
      @selection-change="handleSelectionChange"
      :height="tableHeight">

      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" />

      <el-table-column prop="name" label="分摊方法名称">
      </el-table-column>
      <el-table-column prop="sharingObjectName" label="成本对象名称">
      </el-table-column>
      <el-table-column prop="sharingObjectCode" label="成本对象编码">
      </el-table-column>
      <el-table-column prop="sharingFieldName" label="分摊对象名称">
      </el-table-column>
      <el-table-column prop="sharingFieldCode" label="分摊对象编码">
      </el-table-column>
      <el-table-column prop="factor" label="分摊公式" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column width="45" prop="operate">
        <template slot="header">
          <span>操作</span>
        </template>
        <template scope="scope">
          <el-button type="primary" size="small" @click="beginEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row>
      <div class="block" style="margin: 5px; float: right;">
        <el-pagination
          :current-page.sync="pageNo"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-row>

    <el-row v-if="mode == 'select'" style="margin: 10px; font-size: 14px; height: 32px; text-align: right;">
      <el-button type="primary" size="small" @click="submitSelection">确定</el-button>
    </el-row>

    <el-dialog ref="showViewDialog" :visible.sync="editDialogVisible" width="60%" append-to-body>

      <el-form :inline="true" label-width="160px">

        <el-form-item label="分摊方法名称：">
          <el-input size="small" v-model="editForm.name"></el-input>
        </el-form-item>

        <el-form-item label="成本对象：">
          <el-select v-model="editForm.sharingObjectName" filterable class="hanzi7" @change="handleObjectChange">
            <el-option
              v-for="item in csObjectOptions"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分摊对象：">
          <el-select v-model="editForm.sharingFieldName" filterable class="hanzi7" @change="handleEditChange">
            <el-option
              v-for="item in csObjectFieldOptions"
              :key="item.fieldName"
              :label="item.fieldName"
              :value="item.fieldName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分摊公式：">
          <el-input v-model="editForm.factor" type="textarea"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="submitEdit()">确定</el-button>
      </div>

    </el-dialog>

  </section>
</template>

<script>

import { mapState } from 'vuex'
import { selectCsSharingMethodPage, saveCsSharingMethod } from '@/api/fico'
import CsObject from './cs-object.json'

export default {
  name: 'cs-method-list-view',
  components: {
  },
  props: {
    mode: String
  },
  data() {
    return {
      self: this,
      queryPanelVisible: false,
      query: {
        name: '',
        sharingObjectName: '',
        sharingObjectCode: '',
        sharingFieldName: '',
        sharingFieldCode: '',
        factor: ''
      },

      csObjectOptions: CsObject,
      csObjectFieldOptions: [],

      rows: [],
      total: 0,
      pageSize: 20,
      pageNo: 1,
      pageSizes: [10, 20, 40],

      sels: [],

      editDialogVisible: false,
      editForm: {
        sharingObjectName: '',
        sharingObjectCode: '',
        sharingFieldName: '',
        sharingFieldCode: '',
        factor: ''
      }
    }
  },
  computed: {
    ...mapState({
      mdm: function(state) {
        return state.mdm.data
      },
    }),
    tableHeight() {
      const h = (window.innerHeight - 22 -
        this.$store.state.settings.navbarHeight -
        this.$store.state.settings.tagsViewHeight -
        this.$store.state.settings.tableFuncBarHeight -
        this.$store.state.settings.tablePaginationHeight) + 'px'
      return h
    }
  },
  computed: {
    labelStyle: {
      get() {
        let str = 'display: flex-inline; text-align: right; line-height: 30px;'
        str += 'width: 120px;'
        return str
      }
    },
    tableHeight() {
      const h = (window.innerHeight - 22 -
        this.$store.state.settings.navbarHeight -
        this.$store.state.settings.tagsViewHeight -
        this.$store.state.settings.tableFuncBarHeight -
        this.$store.state.settings.tablePaginationHeight) + 'px'
      return h
    }
  },
  async created() {
    await this.$store.dispatch('mdm/getMdmData', '')
    this.mdmReady = true
  },
  mounted() {
    this.loadData()
  },
  methods: {
    toggleQueryPanel() {
      this.queryPanelVisible = !this.queryPanelVisible
      console.log('toggle query panel')
    },
    handleSizeChange(val) {
      this.loadData()
    },
    handleCurrentChange() {
      this.loadData()
    },
    resetQueryCond() {
      this.query = {
        name: '',
        sharingObjectName: '',
        sharingObjectCode: '',
        sharingFieldName: '',
        sharingFieldCode: '',
        factor: ''
      }
      this.loadData()
    },
    loadData() {

      let queryObj = {
        conditions: []
      }
      if (this.query.name) {
        queryObj.conditions.push({
          field: 'name', op:'like', values: [this.query.name]
        })
      }
      if (this.query.sharingObjectName) {
        queryObj.conditions.push({
          field: 'sharing_object_name', op:'like', values: [this.query.sharingObjectName]
        })
      }

      selectCsSharingMethodPage(queryObj).then(ret => {
        if (ret.success) {
          this.total = ret.data.total
          this.rows = [].concat(ret.data.rows)
        }
      })
    },
    closeDialog() {
      this.showView.visible = false
    },
    handleSelectionChange(sels){
      this.sels = sels
    },

    handleObjectChange() {

      this.csObjectFieldOptions = []

      let objectId = null

      if (this.editDialogVisible) {
        this.handleEditChange()
        if (this.editForm.sharingObjectCode) {
          objectId = this.csObjectOptions.find(a => a.value == this.editForm.sharingObjectCode).objectId
        }
      }
      else {
        if (this.query.sharingObjectCode) {
          objectId = this.csObjectOptions.find(a => a.value == this.query.sharingObjectCode).objectId
        }
      }

      if (objectId) {
        this.$store.dispatch('lowCode/getObjectDefine', objectId).then(ret => {
          if (ret) {
            //应该再继续定义分摊因素？？？
            this.csObjectFieldOptions = [].concat(
              ret.fields.filter(a => a.valueRefType == "2" || a.valueRefType == "3" || a.valueRefType == "4"))
          }
        })
      }

    },
    handleChange() {

    },
    createNew() {
      this.editForm = {
        sharingObjectName: '',
        sharingObjectCode: '',
        sharingFieldName: '',
        sharingFieldCode: '',
        factor: ''
      }
      this.editDialogVisible = true
    },
    beginEdit(i, row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editDialogVisible = true
    },
    cancelEdit() {
      this.editDialogVisible = false
    },
    handleEditChange() {
      this.editForm.sharingObjectCode = ''
      this.editForm.sharingFieldCode = ''
      if (this.editForm.sharingObjectName) {
        this.editForm.sharingObjectCode = this.csObjectOptions.find(a => a.label == this.editForm.sharingObjectName).value
      }
      if (this.editForm.sharingFieldName) {
        this.editForm.sharingFieldCode = this.csObjectFieldOptions.find(a => a.fieldName == this.editForm.sharingFieldName).fieldCode
      }
    },
    submitEdit() {
      saveCsSharingMethod(this.editForm).then(ret => {
        if (ret.success) {
          this.editDialogVisible = false
          this.loadData()
        }
      })
    },

    submitSelection() {
      this.$emit('object-relation', {
        objectId: this.objectId,
        row: this.sels[0]
      })
    },
    deleteDataRow(row) {
      //

    }
  }

}

</script>
