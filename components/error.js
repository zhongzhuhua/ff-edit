module.exports = {
  AddFileError: {
    code: '100000',
    msg: '创建文件失败，请确认文件名称有效性'
  },
  AddFileExists: {
    code: '100001',
    msg: '文件或文件夹已经存在'
  },
  SaveFileError: {
    code: '110000',
    msg: '保存文件失败'
  },
  BuildError: {
    code: '900000',
    msg: '构建失败'
  },
  RenameError: {
    code: '120000',
    msg: '修改文件内容失败'
  },
  RemoveFileError: {
    code: '130000',
    msg: '删除文件或删除文件夹失败'
  },
  FindProjectError: {
    code: '140000',
    msg: '读取项目文件异常'
  },
  Error: {
    code: '-1',
    msg: '系统异常'
  }
};
