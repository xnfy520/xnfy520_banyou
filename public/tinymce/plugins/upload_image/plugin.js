/**
 * QR code - a TinyMCE 4 QR code wizzard
 * qrcode/plugin.js
 *
 *
 * Plugin info: http://www.cfconsultancy.nl/
 * Author: Ceasar Feijen
 *
 * Version: 1.0 released 15/09/2013
 */

tinymce.PluginManager.add('upload_image', function(editor) {

	editor.addButton('upload_image', {
		icon: true,
		image: tinyMCE.baseURL + '/plugins/upload_image/icon.png',
		tooltip: '图片上传',
		shortcut: 'Ctrl+QR',
		onclick: openmanager
	});

    function openmanager() {
    }

	editor.addShortcut('Ctrl+UI', '', openmanager);

	// editor.addMenuItem('upload_image', {
	//	icon:'media',
	//	text: 'Create QRcode',
	//	shortcut: 'Ctrl+QR',
	//	onclick: openmanager,
	//	context: 'insert'
	// });
});
