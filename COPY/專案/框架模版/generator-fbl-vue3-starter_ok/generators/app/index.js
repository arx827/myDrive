'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
var mkdirp = require('mkdirp');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the outstanding ${chalk.red('generator-fbl-vue3-starter')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'code',
        message: 'Enter your project name',
        default: 'shop'
      },
      {
        type: 'confirm',
        name: 'sdk',
        message: 'Whether to use api client sdk',
      },
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.destinationRoot(this.props.code+'-web');
    this.fs.copyTpl(
      this.templatePath('project/**/*'),
      this.destinationRoot(), {
      code: this.props.code,
      codeUpper: this.props.code.toUpperCase(),
      sdk: this.props.sdk
    });
    this.fs.copyTpl(
      this.templatePath('project/**/.*'),
      this.destinationRoot(), {
      code: this.props.code,
      codeUpper: this.props.code.toUpperCase(),
      sdk: this.props.sdk
    });
    this.fs.move(
      this.destinationPath('_gitignore'),
      this.destinationPath('.gitignore')
    );
    this.fs.move(
      this.destinationPath('_vscode/extensions.json'),
      this.destinationPath('.vscode/extensions.json')
    );
    this.fs.move(
      this.destinationPath('_vscode/settings.json'),
      this.destinationPath('.vscode/settings.json')
    );
  }
};
