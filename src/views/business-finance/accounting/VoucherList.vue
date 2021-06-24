<template>
  <section>
    <el-row style="margin: 10px; font-size: 14px;" type="flex">
      <div style="display: flex-inline;">
        账套：<book-set-select v-model="queryForm.setId" @change="handleBookSetChange()"/>
      </div>
      <div style="right: 10px; float: right; position: absolute;">
        <el-button type="primary" @click="handleAdd">新增凭证</el-button>
      </div>
    </el-row>
    <el-table :data="rows" border style="width: 100%;" :height="tableHeight">
      <el-table-column type="index" label="序号" />
      <el-table-column width="240">
        <template slot="header">
          <span>操作</span>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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

    <x-object-define-editor :object-id="4" :show-fields="['invoiceCode', 'invoiceNo', 'billingDate', 'amountWithoutTax']"
      :visible.sync="editDialogVisible2"></x-object-define-editor>


    <el-dialog title="编辑" :visible.sync="editDialogVisible" :close-on-click-modal="false">
      <el-col :span=12>
        <x-form-item label="会计年度" :label-width="120">
          <mdm-select v-model="editForm.acYear" :code="'year'"/>
        </x-form-item>
        <x-form-item label="账期" :label-width="120">
          <mdm-select v-model="editForm.acMonth" :code="'month'"/>
        </x-form-item>
        <x-form-item label="借贷方向" :label-width="120">
          <mdm-select v-model="editForm.lending" :code="'lending'"/>
        </x-form-item>
        <x-form-item label="币种" :label-width="120">
          <mdm-select v-model="editForm.currency" :code="'currency'"/>
        </x-form-item>
        <x-form-item label="数值" :label-width="120">
          <el-input v-model="editForm.amount" placeholder=""></el-input>
        </x-form-item>
      </el-col>

      <el-col :span=12>

      </el-col>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="submitEdit()">确定</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>

import store from '@/store'
import { mapState } from 'vuex'
import { selectFiVoucherPage, saveFiVoucher, deleteFiVoucher } from '@/api/finance'
import BookSetSelect from './BookSetSelect'

export default {
  name: 'VoucherList',
  components: {
    BookSetSelect
  },
  data() {
    return {
      queryForm: {
        setId: null
      },
      rows: [],
      total: 0,
      pageSize: 20,
      pageNo: 1,
      pageSizes: [10, 20, 40],

      editDialogVisible: false,
      editDialogVisible2: false,
      editForm: {
        setId: null,
        acYear: 2021,
        acMonth: 6,
        chartCode: '',
        lending: 'DR',
        amount: null,
        currency: null,

        segment1: '',
        segment2: '',
        segment3: '',
        segment4: '',
        segment5: '',
        segment6: '',
        segment7: '',
        segment8: '',
        segment9: '',
        segment10: '',
      },
    }
  },
  computed: {
    tableHeight() {
      const h = (window.innerHeight - 22 -
          this.$store.state.settings.navbarHeight -
          this.$store.state.settings.tagsViewHeight -
          this.$store.state.settings.tableFuncBarHeight -
          this.$store.state.settings.tablePaginationHeight) + 'px'
      return h
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    formatter(row, column, cellValue, index) {
      return cellValue
    },
    handleSizeChange(val) {
      this.loadData()
    },
    handleCurrentChange() {
      this.loadData()
    },
    loadData() {

      const queryObj = {
        pageNo: 1,
        pageSize: 100,
        conditions: []
      }

      if (this.queryForm.setId) {
        queryObj.conditions = [{ field: 'set_id', op: 'eq', values: [this.queryForm.setId]}]
      }

      selectFiVoucherPage(queryObj).then(ret => {
        this.total = ret.data.total
        this.roles = [].concat(ret.data.rows)
      })
    },
    handleBookSetChange() {
      this.loadData()
    },
    handleClose() {
      this.editDialogVisible = false
    },
    cancelEdit() {
      this.editForm = {}
      this.editDialogVisible = false
    },
    handleEdit(i, row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editDialogVisible = true
    },
    handleAdd() {
      this.editForm = {}
      // this.editDialogVisible = true
      this.editDialogVisible2 = true
    },
    handleDelete(i, row) {
      deleteFiVoucher(row.roleId).then(ret => {
        if (ret.success) {
          this.loadData()
          this.editDialogVisible = false
        }
      })
    },
    submitEdit() {

      console.log(this.editObjectFields)

      // saveFiVoucher(this.editForm).then(ret => {
      //   if (ret.success) {
      //     this.loadData()
      //     this.editDialogVisible = false
      //   }
      // })
    },
    editPerm(row) {
      //

    },
    handleDataPermChange() {

    }
  }
}

</script>
