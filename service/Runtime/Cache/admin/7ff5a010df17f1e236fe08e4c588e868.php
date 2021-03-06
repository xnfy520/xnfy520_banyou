<?php if (!defined('THINK_PATH')) exit();?><!doctype html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>乐点创意 后台管理系统</title>
    <link rel="stylesheet" href="./public/FontAwesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="public/extjs/resources/ext-theme-neptune/ext-theme-neptune-all.css">
    <style>
		.x-btn-icon-el{
			font-size:15px;
            color:#666;
			text-indent:2px;
		}
        .icon-signout{
            color:red;
            font-size:14px;
            /*font-size:px;*/
        },
        .icon-home{
            font-size:20px;
        }
       /* #instructions ul li {
            list-style-type:disc;
            list-style-position:outside;
            font-size:12px;
            /*margin:0px 0px 0px 20px;*/
        }*/
        .phone-hover{
            background-color: #eee;
            border:5px solid red;
        }
        .x-item-selected {
            background-color: #D3E1F1 !important;
        }
       /* .swfupload{
            position: relative;
            top:-20px;
            background: red;
        }*/
.x-view-selector {
    position:absolute;
    left:0;
    top:0;
    width:0;
    border:1px dotted;
    opacity: .5;
    -moz-opacity: .5;
    filter:alpha(opacity=50);
    zoom:1;
    background-color:#c3daf9;
    border-color:#3399bb;
}.ext-strict .ext-ie .x-tree .x-panel-bwrap{
    position:relative;
    overflow:hidden;
}
        /* Icons */
        .ux-notification-icon-information {
            /*background-image: url('./public/images/icon16_info.png');*/
        }

        .ux-notification-icon-error {
            /*background-image: url('./public/images/icon16_error.png');*/
        }


        /* Using standard theme */
        .ux-notification-window .x-window-body {
            text-align: center;
            padding: 10px 5px 10px 5px;
            /*width: 200px;*/
            /*min-width:200px;*/
        }


        /* Custom styling */
        .ux-notification-light .x-window-header {
            /*background-color: transparent;*/
        }

        body .ux-notification-light {
            /*background-image: url('./public/images/fader.png');*/
        }

        .ux-notification-light .x-window-body {
            text-align: center;
            padding: 10px 5px 10px 5px;
           /* width: 200px;
            min-width:200px;*/
            /*background-color: transparent;*/
            /*border: 0px solid white;*/
        }
	</style>
</head>
<body>
    <script src="public/jquery/jquery.min.js"></script>
    <script src="public/underscore/underscore-min.js"></script>
    <script src="public/extjs/ext-all-debug.js"></script>
    <script src="public/extjs/locale/ext-lang-zh_CN.js"></script>
    <script src="public/extjs/ext-theme-neptune.js"></script>
    <script type="text/javascript" src="app/app.js"></script>
    <script type="text/javascript" src="public/swfupload/swfupload.js"></script>
    <script type="text/javascript" src="public/tinymce/tinymce.min.js"></script>
</body>
</html>