<template>
  <div :id="eid" style="height: 600px;">

  </div>
</template>

<script>

import * as echarts from 'echarts';

import { uuid } from 'vue-uuid'
import { getViewDefineById } from '@/api/view-define'
import { getObjectDataById } from '@/api/object-data'

export default {
  name: 'fc-share-trace-view',
  data() {
    return {
      eid: 'e' + uuid.v1(),
      chartDom: null,
      myChart: null,

      objectId: null,
      viewId: null,
      objectDataId: null,

      traceData: [],
      legends: [],

      option: {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        legend: {
          top: '2%',
          left: '3%',
          orient: 'vertical',
          data: [],
          borderColor: '#c23531'
        },
        series:[
          {
            type: 'tree',
            name: '追踪',
            data: [],
            top: '5%',
            left: '7%',
            bottom: '2%',
            right: '60%',
            symbolSize: 7,
            label: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right'
            },
            leaves: {
                label: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left'
                }
            },
            emphasis: {
                focus: 'descendant'
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      }
    }
  },
  mounted() {
      this.chartDom = document.getElementById(this.eid);
      this.myChart = echarts.init(this.chartDom);
      this.myChart.showLoading();

      this.objectDataId = this.$route.params.dataId
      this.viewId = this.$route.params.viewId

      this.loadData()
  },
  methods: {
    loadData() {

      getViewDefineById(this.viewId).then(ret => {
        if (ret.success) {
          if (ret.data.viewType == 'object-view' && !this.$route.params.dataId) {
            this.$message.error('参数错误：必须指定数据ID');
            return
          }
          this.objectId = ret.data.objectId

          this.loadTrace()
        }
      })
    },
    loadTrace() {

      this.legends = []
      this.traceData = []

      getObjectDataById(this.objectId, this.objectDataId).then(ret => {

        if (ret.success) {

          this.traceData = [{
            "name": '方案:'+ret.data.strategyCode,
            "children": [{

            }]
          }]

          this.option.legend.data = this.legends
          this.option.series[0].data = this.traceData

          this.myChart.hideLoading();
          this.myChart.setOption(this.option)
        }
      })
    },
    renderTrace() {


    }

  }
}

</script>
