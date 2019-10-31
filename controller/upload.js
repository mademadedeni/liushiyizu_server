const fs = require("fs");
const path = require("path");
const config = require("../config.js");

/**
 * 上传文件
 * @param  {file} file      上传的文件
 * @param  {string} writePath 写入路径
 * @param  {array} fileType  文件类型
 * @param  {string} fileName  文件名称
 * @param  {number} maxSize   文件大小最大值 单位：kb
 * @return {}
 */
exports.upload = async (file, option) => {
	var _config = {
		writePath: config.upload.url,
		fileType: ["image/jpeg", "image/png"],
		fileName: Date.now() + ".jpg",
		maxSize: 500
	}
	var message = "success";
	// 合并配置
	Object.assign(_config, option);

	if (!file) {
		message = "file is null!"
	}

	if (typeof _config.fileType === "string") {
		_config.fileType = [_config.fileType];
	}
	if (_config.fileType.indexOf(file.type) < 0) {
		message = "The file type error";
	} else if (file.size > 1024 * _config.maxSize) {
		message = "The file size error";
	}

	return new Promise((resolve, reject) => {
		if (message !== "success") {
			resolve(message);
			return;
		}
		fs.access(_config.writePath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
			if (!err) {
				const reader = fs.createReadStream(file.path);
				const writer = fs.createWriteStream(path.join(_config.writePath, _config.fileName));
				var writeStream = reader.pipe(writer);
				writeStream.on('finish', (chunk) => {
					resolve(message);
				});
				writeStream.on('error', (err) => {
					message = "error";
					console.log(err)
					reject(err);
					writeStream.end();
				});

			} else {
				console.log(path.join(_config.writePath, _config.fileName))
				reject("diratory inexistence or no access!");
			}
		});
	});
}

