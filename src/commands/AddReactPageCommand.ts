import * as path from 'path';
import { stringUtil } from '../utils';
import { bizCommon } from '@/common';
import { ICommand } from './ICommand';

const pageTsxTemplate = require('../templates/react-page-tsx.art');

export class AddReactPageCommand implements ICommand {
  /**
   * 创建文件
   * @param cmdContext
   */
  createFiles(dir: string, inputValue: string) {
    const name = stringUtil.toCamelCase(inputValue, true);
    const varName = `${name[0].toLowerCase()}${name.slice(1)}`;
    const tsxFilepath = path.join(dir, `${name}.tsx`);
    const lessFilepath = path.join(dir, `${name}.less`);
    const modelFilepath = path.join(dir, `model.ts`);
    const data = {
      name,
      varName,
    };
    try {
      // <pageName>.tsx
      bizCommon.writeTemplateFile(tsxFilepath, data, pageTsxTemplate);
      // <pageName>.less
      bizCommon.writeLessFile(lessFilepath, data);
      // model.ts
      bizCommon.writeModelFile(modelFilepath, data);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e && e.message);
    }
  }

  async execute(args: any) {
    const cwd = bizCommon.getCurrentWorkDir(args.fsPath);
    try {
      const inputValue = await bizCommon.showInputBox();
      const dir = path.join(cwd, inputValue);
      await bizCommon.createDir(dir);
      // 创建文件
      await this.createFiles(dir, inputValue);
    } catch (e) {
      return e;
    }
  }
}
