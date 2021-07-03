
export function repairObjectViewJson(viewJson) {

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
}

