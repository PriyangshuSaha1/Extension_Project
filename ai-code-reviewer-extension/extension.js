const vscode = require('vscode');
const { runAgent } = require('./agent');

function activate(context) {

  let command = vscode.commands.registerCommand(
    'aiCodeReviewer.review',
    async () => {

      const folders = vscode.workspace.workspaceFolders;

      if (!folders) {
        vscode.window.showErrorMessage("Please open a project folder first");
        return;
      }

      const projectPath = folders[0].uri.fsPath;

      vscode.window.showInformationMessage(
        "AI Code Review Started..."
      );

      try {
        await runAgent(projectPath);
        vscode.window.showInformationMessage(
          "AI Code Review Completed!"
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          "Error: " + error.message
        );
      }
    }
  );

  context.subscriptions.push(command);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
