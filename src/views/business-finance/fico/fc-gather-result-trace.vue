<template>
  <div :id="eid" :style="'height: '+canvasHeight+';'">
  </div>
</template>

<script>

import { uuid } from 'vue-uuid'
import { getViewDefineById } from '@/api/view-define'
import { getObjectDataById } from '@/api/object-data'
import { getShareLine, getShareChildren } from '@/api/fico'

import G6 from "@antv/g6";
import { isObject } from '@antv/util';

export default {
  name: 'fc-gather-result-trace',
  data() {
    return {
      eid: 'e' + uuid.v1(),
      objectId: null,
      viewId: null,
      objectDataId: null,

      nodes: [],
      nodeMap: {},
      edges: [],
    }
  },
  mounted() {
      this.objectDataId = this.$route.params.dataId
      this.viewId = this.$route.params.viewId
      this.loadData()
  },
  computed: {
    canvasHeight() {
      let h = (window.innerHeight - 22 -
        this.$store.state.settings.navbarHeight -
        this.$store.state.settings.tagsViewHeight)
      return h+'px'
    },
  },
  methods: {
    loadData() {
      getShareLine(this.objectDataId).then(ret => {
        if (ret.success) {
          if (ret.data.length > 0) {
            this.nodes = ret.data

            this.nodes.forEach(item => {
              item.id = ''+item.result.id
              item.label = '部门：'+item.result['PK_DEPTDOC']+'\r\n费用：'+item.result['DEF2']+'\r\n金额：'+item.result['CALMNY']
              this.nodeMap[item.id] = item
            })

            for(let i=0;i<this.nodes.length-1;i++) {
              this.edges.push(
                {
                  source: this.nodes[i].id,
                  target: this.nodes[i+1].id,
                  data: {
                    type: 'A',
                    amount: this.nodes[i+1].task ? this.nodes[i+1].task.taskName : this.nodes[i+1].shareMethod.SHARE_M_NAME,
                    date: this.nodes[i].task.beginTime,
                  },
                },
              )
            }
            this.showChart2()
          }
        }
      })
    },

    showChart2() {
      let _this = this
      const colorMap = {
        A: '#72CC4A',
        B: '#1A91FF',
        C: '#FFAA15',
      };
      const data = {
        nodes: JSON.parse(JSON.stringify(this.nodes)),
        edges: JSON.parse(JSON.stringify(this.edges))
      }

      G6.registerNode(
        'round-rect',
        {
          drawShape: function drawShape(cfg, group) {
            const width = cfg.style.width;
            const stroke = cfg.style.stroke;
            const rect = group.addShape('rect', {
              attrs: {
                x: -width / 2,
                y: -20,
                width,
                height: 40,
                radius: 15,
                stroke,
                lineWidth: 1.6,
                fillOpacity: 1,
              },
              name: 'rect-shape',
            });
            group.addShape('circle', {
              attrs: {
                x: -width / 2,
                y: 0,
                r: 3,
                fill: stroke,
              },
              name: 'circle-shape',
            });
            group.addShape('circle', {
              attrs: {
                x: width / 2,
                y: 0,
                r: 3,
                fill: stroke,
              },
              name: 'circle-shape2',
            });
            return rect;
          },
          getAnchorPoints: function getAnchorPoints() {
            return [
              [0, 0.5],
              [1, 0.5],
            ];
          },
          update: function update(cfg, item) {
            const group = item.getContainer();
            const children = group.get('children');
            const node = children[0];
            const circleLeft = children[1];
            const circleRight = children[2];

            const stroke = cfg.style.stroke;

            if (stroke) {
              node.attr('stroke', stroke);
              circleLeft.attr('fill', stroke);
              circleRight.attr('fill', stroke);
            }
          },
        },
        'single-node',
      );

      G6.registerEdge('fund-polyline', {
        itemType: 'edge',
        draw: function draw(cfg, group) {
          const startPoint = cfg.startPoint;
          const endPoint = cfg.endPoint;

          const Ydiff = endPoint.y - startPoint.y;

          const slope = Ydiff !== 0 ? Math.min(500 / Math.abs(Ydiff), 20) : 0;

          const cpOffset = slope > 15 ? 0 : 16;
          const offset = Ydiff < 0 ? cpOffset : -cpOffset;

          const line1EndPoint = {
            x: startPoint.x + slope,
            y: endPoint.y + offset,
          };
          const line2StartPoint = {
            x: line1EndPoint.x + cpOffset,
            y: endPoint.y,
          };

          // 控制点坐标
          const controlPoint = {
            x:
              ((line1EndPoint.x - startPoint.x) * (endPoint.y - startPoint.y)) /
                (line1EndPoint.y - startPoint.y) +
              startPoint.x,
            y: endPoint.y,
          };

          let path = [
            ['M', startPoint.x, startPoint.y],
            ['L', line1EndPoint.x, line1EndPoint.y],
            ['Q', controlPoint.x, controlPoint.y, line2StartPoint.x, line2StartPoint.y],
            ['L', endPoint.x, endPoint.y],
          ];

          if (Math.abs(Ydiff) <= 5) {
            path = [
              ['M', startPoint.x, startPoint.y],
              ['L', endPoint.x, endPoint.y],
            ];
          }

          const endArrow = cfg?.style && cfg.style.endArrow ? cfg.style.endArrow : false;
          if (isObject(endArrow)) endArrow.fill = stroke;
          const line = group.addShape('path', {
            attrs: {
              path,
              stroke: colorMap[cfg.data && cfg.data.type],
              lineWidth: 1.2,
              endArrow,
            },
            name: 'path-shape',
          });

          const labelLeftOffset = 0;
          const labelTopOffset = 8;
          // amount
          const amount = group.addShape('text', {
            attrs: {
              text: cfg.data && cfg.data.amount,
              x: line2StartPoint.x + labelLeftOffset,
              y: endPoint.y - labelTopOffset - 2,
              fontSize: 14,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: '#000000D9',
            },
            name: 'text-shape-amount',
          });
          // // type
          // group.addShape('text', {
          //   attrs: {
          //     text: cfg.data && cfg.data.type,
          //     x: line2StartPoint.x + labelLeftOffset,
          //     y: endPoint.y - labelTopOffset - amount.getBBox().height - 2,
          //     fontSize: 10,
          //     textAlign: 'left',
          //     textBaseline: 'middle',
          //     fill: '#000000D9',
          //   },
          //   name: 'text-shape-type',
          // });
          // date
          group.addShape('text', {
            attrs: {
              text: cfg.data && cfg.data.date,
              x: line2StartPoint.x + labelLeftOffset,
              y: endPoint.y + labelTopOffset + 4,
              fontSize: 14,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: '#000000D9',
            },
            name: 'text-shape-date',
          });
          return line;
        },
      });

      const width = document.getElementById(this.eid).scrollWidth;
      const height = document.getElementById(this.eid).scrollHeight || 500;
      const graph = new G6.Graph({
        container: this.eid,
        width,
        height,
        layout: {
          type: 'dagre',
          rankdir: 'LR',
          nodesep: 10,
          ranksep: 100,
        },
        modes: {
          default: ['drag-canvas'],
        },
        defaultNode: {
          type: 'round-rect',
          labelCfg: {
            style: {
              fill: '#000000A6',
              fontSize: 10,
            },
          },
          style: {
            stroke: '#72CC4A',
            width: 150,
          },
        },
        defaultEdge: {
          type: 'fund-polyline',
        },
      });

      graph.data(data);

      graph.on('node:dblclick', evt => {
        console.log(evt.item._cfg.id)

        getShareChildren(evt.item._cfg.id).then(ret => {

          ret.data.forEach(item => {

            item.id = ''+item.result.id
            item.label = '部门：'+item.result['PK_DEPTDOC']+'\r\n费用：'+item.result['DEF2']+'\r\n金额：'+item.result['CALMNY']

            if (!_this.nodeMap[item.id]) {

              _this.nodes.push(item)
              _this.nodeMap[item.id] = item

              //add edge
              let parent = _this.nodeMap[evt.item._cfg.id]

              _this.edges.push(
                {
                  source: parent.id,
                  target: item.id,
                  data: {
                    type: 'A',
                    amount: item.task ? item.task.taskName : item.shareMethod.SHARE_M_NAME,
                    date: parent.task.beginTime,
                  },
                },
              )


            }
          })

          graph.clear()
          graph.destroy()
          _this.showChart2()
        })
      })

      graph.render();

      const edges = graph.getEdges();
      edges.forEach(function (edge) {
        const line = edge.getKeyShape();
        const stroke = line.attr('stroke');
        const targetNode = edge.getTarget();
        targetNode.update({
          style: {
            stroke,
          },
        });
      });

      graph.paint();

      this.fitView(graph)

      if (typeof window !== 'undefined')
        window.onresize = () => {
          let container = document.getElementById(_this.eid)
          if (!graph || graph.get('destroyed')) return;
          if (!container || !container.scrollWidth || !container.scrollHeight)
            return;
          graph.changeSize(container.scrollWidth, container.scrollHeight);
        };
    },

    fitView(graph) {
      const width = graph.get("width");
      const height = graph.get("height");
      const group = graph.get("group");
      group.resetMatrix();
      const bbox = group.getCanvasBBox();

      if (bbox.width === 0 || bbox.height === 0) return;
      const viewCenter = {
        x: width / 20,
        y: height / 4,
      };

      const groupCenter = {
        x: bbox.x + bbox.width / 2,
        y: bbox.y + bbox.height / 2,
      };
      graph.translate(viewCenter.x - groupCenter.x, viewCenter.y - groupCenter.y);
    }


  }
}

</script>
