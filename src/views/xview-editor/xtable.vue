<template>
  <el-table
    v-bind="view.props"
    :row-key="record => record.id"
    :data="data"
    :pagination="pagination"
    @change="handleTableChange"
  />
</template>

<script>

export default {
  name: 'XTable',
  components: {
  },
  props: {
    view: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      data: [],
      pagination: {},
      loading: false,
      columns
    }
  },
  mounted() {
    this.loadMetaData()
    this.loadData()
  },
  methods: {
    loadMetaData() {
      this.columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          sorter: true,
          width: '20%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: 'Gender',
          dataIndex: 'gender',
          filters: [
            { text: 'Male', value: 'male' },
            { text: 'Female', value: 'female' }
          ],
          width: '20%'
        },
        {
          title: 'Email',
          dataIndex: 'email'
        }
      ]

      this.pagination = {}
    },
    loadData() {
      this.data = [{
        id: '1',
        name: 'John Brown',
        money: '￥300,000.00',
        address: 'New York No. 1 Lake Park'
      },
      {
        id: '2',
        name: 'Jim Green',
        money: '￥1,256,000.00',
        address: 'London No. 1 Lake Park'
      },
      {
        id: '3',
        name: 'Joe Black',
        money: '￥120,000.00',
        address: 'Sidney No. 1 Lake Park'
      }]
    },
    handleTableChange() {
      //
    }
  }
}
</script>
