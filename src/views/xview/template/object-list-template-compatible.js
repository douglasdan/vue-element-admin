
export function repairObjectListViewJson(viewJson) {

  if (!viewJson.hasOwnProperty('width')) {
    viewJson.width = 0
  }
  if (!viewJson.hasOwnProperty('height')) {
    viewJson.height = 0
  }

  if (!viewJson.hasOwnProperty('minHeight')) {
    viewJson.minHeight = 0
  }
  if (!viewJson.hasOwnProperty('minWidth')) {
    viewJson.minWidth = 0
  }

  if (!viewJson.hasOwnProperty('maxHeight')) {
    viewJson.maxHeight = 0
  }
  if (!viewJson.hasOwnProperty('maxWidth')) {
    viewJson.maxWidth = 0
  }

  if (viewJson.hasOwnProperty('viewButtons')) {
    viewJson.viewButtons.forEach((btn) => {

      if (!btn.hasOwnProperty('props')) {
        btn.props = {
          "size": "small",
          "type": "primary",
          "disabled": false
        }
      }

      if (!btn.props.hasOwnProperty('type')) {
        btn.props.type = ''
      }
    })
  }

  if (viewJson.hasOwnProperty('rowButtons')) {
    viewJson.rowButtons.forEach((btn) => {
      if (!btn.hasOwnProperty('props')) {
        btn.props = {
          "size": "mini",
          "type": "",
          "disabled": false
        }
      }

      if (!btn.props.hasOwnProperty('type')) {
        btn.props.type = ''
      }
    })
  }

  if (!viewJson.operate) {
    viewJson.operate = {
      "visible": true,
      "width": 120
    }
  }

  if (!viewJson.queryDefine) {
    viewJson.queryDefine = {
      "labelWidth": 100,
      "conditions":[
      ]
    }
  }
}
