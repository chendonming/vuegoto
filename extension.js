const vscode = require('vscode')
const createIndex = require('./createIndex')

function provideCompletionItems() {
  const list = []
  const arr = createIndex.list.keys()
  let val
  while (val = arr.next().value) {
    list.push(
      new vscode.CompletionItem(val, vscode.CompletionItemKind.Snippet)
    )
  }
  return list
}

function resolveCompletionItem(item) {
  item.insertText = "hahah2"
  return item
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  createIndex.scanning(context)
  const i = setInterval(() => {
    if (createIndex.list.size > 0) {
      clearInterval(i)
      context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
          "vue",
          {
            provideCompletionItems,
            resolveCompletionItem,
          },
          "<"
        )
      )
      setTimeout(() => {
        context.workspaceState.update('indexs', createIndex.list)
      }, 10000)
    }
  }, 500)
}
exports.activate = activate

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
  activate,
  deactivate
}
