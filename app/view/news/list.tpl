<!DOCTYPE html>
<html>
<head>
	<title>hacker news</title>
	<link rel="stylesheet" href="/public/css/base.css" />
</head>
<body>
	<h2>test2</h2>
	
	<ul>
		{% for item in list %}
		<li>
			<a href="{{item.url}}">{{item.title}}-{{helper.relativeTime(item.time)}}</a>
		</li>
		{% endfor %}
	</ul>

</body>
</html>