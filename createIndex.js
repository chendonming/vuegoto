const vscode = require('vscode')

module.exports = {
  list: new Map(),
  traverseFolder(data, path) {
    data.forEach(async (v) => {
      const arr = v[0].split(".")
      if (
        v[1] === vscode.FileType.File &&
        arr.length > 1 &&
        arr[1] === "vue" &&
        typeof arr[0] === "string"
      ) {
        this.list.set(arr[0], path)
      } else if (["node_modules", ".vscode"].indexOf(v[0]) !== -1) {
      } else if (v[1] === vscode.FileType.Directory && arr.length === 1) {
        const paths = path + "/" + v[0]
        const data = await vscode.workspace.fs.readDirectory(vscode.Uri.parse(paths))
        this.traverseFolder(data, paths)
      }
    })
  },
  async scanning(context) {
    if (!vscode.workspace.workspaceFolders) return
    const map = context.workspaceState.get('indexs')
    if (map && map.size > 0) {
      this.list = map
    } else {
      let path = vscode.workspace.workspaceFolders[0].uri.path
      let data = await vscode.workspace.fs.readDirectory(vscode.workspace.workspaceFolders[0].uri)
      this.traverseFolder(data, path)
    }
  }
}
