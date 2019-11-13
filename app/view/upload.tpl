<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="renderer" content="webkit"/>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width,initial-scale=1.0">
	<title>upload file</title>
	<link rel="stylesheet" href="public/css/base.css" media="all" />
</head>
<body>
	<h2>upload files</h2>
	<form id="form1" name="form1" method="POST" action="/{{projectRunName}}/upload?" enctype="multipart/form-data"> <!--如果csrf安全打开了post需要在地址上拼接查询参数 _csrf={{ ctx.csrf | safe }} -->
		title: <input name="title1" id="title1" type="text" /><br/>
		file1: <input name="file1" id="file1" type="file" /><br/>
		file2: <input name="file2" id="file2" type="file" /><br/>
		<button type="submit" id="submit" name="submit">Upload</button>
	</form>

	{% if list.length>0 %}
	<div>共上传了{{list.length}}个文件</div>
	<ul>
		{% for item in list %}
		<li>
			{{item.filename}}-{{item.encoding}}-{{item.mime}}-{{item.toPathName}}
		</li>
		{% endfor %}
	</ul>
	{% endif %}


</body>
</html>