<template>
  <div :id="eid" style="height: 100%">

  </div>
</template>

<script>

import { uuid } from 'vue-uuid'
import G6 from "@antv/g6";

export default {
  computed: {
    canvasHeight() {
      let h = (window.innerHeight - 22 -
        this.$store.state.settings.navbarHeight -
        this.$store.state.settings.tagsViewHeight)
      return h+'px'
    },
  },
  props: ['condition'],
  watch: {
    'condition': {
      handler(nval, oval) {
        if (nval) {
          this.condTree = JSON.parse(JSON.stringify(this.condition))
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      eid: 'e' + uuid.v1(),
      condTree: null,
      container: null,
      width: null,
      height: null,
      graph: null
    }
  },
  mounted() {
    G6.registerNode(
      'tree-node',
      {
        drawShape: function drawShape(cfg, group) {
          const rect = group.addShape('rect', {
            attrs: {
              fill: '#fff',
              stroke: '#666',
              x: 0,
              y: 0,
              width:1,
              height: 1
            },
            name: 'rect-shape',
          });
          const content = cfg.name.replace(/(.{19})/g, '$1\n');
          const text = group.addShape('text', {
            attrs: {
              text: content,
              x: 0,
              y: 0,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: '#666',
            },
            name: 'text-shape',
          });
          const bbox = text.getBBox();
          const hasChildren = cfg.children && cfg.children.length > 0;
          rect.attr({
            x: -bbox.width / 2 - 4,
            y: -bbox.height / 2 - 6,
            width: bbox.width + (hasChildren ? 26 : 12),
            height: bbox.height + 12,
          });
          text.attr({
            x: -bbox.width / 2,
            y: 0
          })
          if (hasChildren) {
            group.addShape('marker', {
              attrs: {
                x: bbox.width / 2 + 12,
                y: 0,
                r: 6,
                symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
                stroke: '#666',
                lineWidth: 2,
              },
              name: 'collapse-icon',
            });
          }
          return rect;
        },
        update: (cfg, item) => {
          const group = item.getContainer();
          const icon = group.find((e) => e.get('name') === 'collapse-icon');
          icon.attr('symbol', cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse);
        },
      },
      'single-node',
    )

    this.container = document.getElementById(this.eid);
    this.width = this.container.scrollWidth;
    this.height = this.container.scrollHeight || 500;

    this.loadData()
  },
  methods: {
    loadData() {
      this.condTree = {
        type: 'and',
        name: 'xxxxx',
        children:[
          {
            field: 'departCode', op:'expression', values:['GetLeafDepart("00")']
          },
          {
            field: 'feeCode', op:'eq', values:['水电费']
          },
          {
            field: 'source', op:'eq', values:['业务系统']
          }
        ]
      }

      this.fixTreeData(this.condTree)
      this.renderTree(this.condTree)
    },

    fixTreeData(node) {
      if (node.children && node.children.length > 0) {
         node.name = node.type == 'or' ? '或者' : '并且xxxxxxxxxx'
         node.children.forEach(item => {
           this.fixTreeData(item)
         })
      }
      else {
        node.name = node.field+ ' '+node.op+' '+node.values
      }
    },

    renderTree(data) {
      const _this = this
      const graph = new G6.TreeGraph({
        container: _this.eid,
        width: _this.width,
        height: _this.height,
        modes: {
          default: [
            {
              type: 'collapse-expand',
              onChange: function onChange(item, collapsed) {
                const data = item.get('model');
                graph.updateItem(item, {
                  collapsed,
                });
                data.collapsed = collapsed;
                return true;
              },
            },
            'drag-canvas',
            'zoom-canvas',
          ],
        },
        defaultNode: {
          type: 'tree-node',
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
        },
        defaultEdge: {
          type: 'cubic-horizontal',
          style: {
            stroke: '#A3B1BF',
          },
        },
        layout: {
          type: 'compactBox',
          direction: 'LR',
          getId: function getId(d) {
            return d.id;
          },
          getHeight: function getHeight() {
            return 16;
          },
          getWidth: function getWidth() {
            return 16;
          },
          getVGap: function getVGap() {
            return 20;
          },
          getHGap: function getHGap() {
            return 80;
          },
        },
      })

      graph.data(data);
      graph.render();
      _this.fitView(graph);

      if (typeof window !== 'undefined')
      window.onresize = () => {
        if (!graph || graph.get('destroyed')) return;
        if (!container || !_this.container.scrollWidth || !_this.container.scrollHeight) return;
        graph.changeSize(_this.container.scrollWidth, _this.container.scrollHeight);
      }
    },
    fitView(graph) {
      const width = graph.get("width");
      const height = graph.get("height");
      const group = graph.get("group");
      group.resetMatrix();
      const bbox = group.getCanvasBBox();

      if (bbox.width === 0 || bbox.height === 0) return;
      const viewCenter = {
        x: width / 8,
        y: height / 2,
      }

      const groupCenter = {
        x: bbox.x + bbox.width / 2,
        y: bbox.y + bbox.height / 2,
      }
      graph.translate(viewCenter.x - groupCenter.x, viewCenter.y - groupCenter.y);
    }

  }
}
</script>
